import * as path from "path";
import * as fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import lunr from "lunr";
import matter from "gray-matter";
import { remark } from "remark";
import mdx from "remark-mdx";
import strip from "remark-mdx-to-plain-text";

import { glob } from "src/utils/glob";

const contentPath = path.resolve(process.cwd(), "./content");
const globPath = path.resolve(process.cwd(), "./content/**/*.mdx");

function parseMdx(content: string): Promise<string> {
  return new Promise((yay, nay) => {
    remark()
      .use(mdx)
      .use(strip)
      .process(content, function (err, file) {
        if (err) {
          return nay(err);
        }
        yay(String(file));
      });
  });
}

function prepTerms(terms: string[]): string {
  return terms
    .map((t) => {
      const exceptions = ["*", "~", "+"];
      let finalTerm = t;
      if (!exceptions.includes(finalTerm[0])) {
        finalTerm = `*${finalTerm}`;
      }
      if (!exceptions.includes(finalTerm[finalTerm.length - 1])) {
        finalTerm = `${finalTerm}*`;
      }
      return finalTerm;
    })
    .join(" ");
}

let searchIndex: any;
const searchData: any[] = [];

async function search(terms: string[]) {
  // If search index has already been created, use the existing index
  // to just do the search
  if (searchIndex && searchIndex.hash === process.env.RELEASE_HASH) {
    return searchIndex.search(prepTerms(terms));
  }

  // Creating the search index based on all markdown files
  const files = await glob(globPath);

  for (const filePath of files) {
    const relPath = filePath.replace(contentPath, "");

    const fileContent = fs.readFileSync(filePath);
    const { data, content } = matter(fileContent);

    const type = relPath.split("/").filter(Boolean)[0];

    const headings = content
      .split("\n")
      .reduce<string[]>((all, line) => {
        const lineMatch = line.match(/^([#]+) ([^\n]*)/);
        if (lineMatch?.[2]) {
          all.push(lineMatch[2]);
        }
        return all;
      }, [])
      .join(" -- ");

    const text = await parseMdx(content);

    // Add content itself to search
    searchData.push({
      type: `content:${type}`,
      slug: relPath.replace(/\.mdx$/, ""),
      title: data.title,
      subtitle: data.subtitle,
      tags: data.draft ? undefined : data.tags,
      headings: data.draft ? undefined : headings,
      text: data.draft ? undefined : text,
    });

    if (!data.draft) {
      // Add each tag to search
      data.tags?.split?.(",")?.forEach?.((str: string) => {
        const tag = str.trim();
        searchData.push({
          type: `tag`,
          slug: `/search?tags=${tag}`,
          title: tag,
        });
      });
    }
  }

  searchIndex = lunr(function () {
    this.ref("slug");

    this.field("title", { boost: 15 });
    this.field("subtitle", { boost: 10 });
    this.field("tags", { boost: 30 });
    this.field("headings", { boost: 10 });
    this.field("text");

    searchData.forEach((data) => {
      this.add(data);
    });
  });

  searchIndex.hash = process.env.RELEASE_HASH;
  return searchIndex.search(prepTerms(terms));
}

type Response = {
  searchTerms: string[];
  results: any[];
};

type ErrorResponse = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response | ErrorResponse>
) {
  const searchTerm = (req.query.term || "") as string;
  const searchTerms = searchTerm?.trim?.()?.split?.(" ")?.filter(Boolean) || [];

  if (!searchTerms.length) {
    return res.status(400).json({
      message: "Search term is required.",
    });
  }

  try {
    const results = await search(searchTerms);

    res.status(200).json({
      searchTerms,
      results: results.map((result: any) => {
        const { type, slug, title, subtitle } =
          searchData.find((d) => d.slug === result.ref) || {};
        return {
          ...result,
          originalData: {
            type,
            slug,
            title,
            subtitle,
          },
          linkUrl: `${slug}#:~:text=${encodeURIComponent(searchTerm)}`,
        };
      }),
    });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
}
