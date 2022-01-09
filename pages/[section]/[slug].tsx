import * as path from "path";
import * as fs from "fs";
import matter from "gray-matter";
import twemoji from "twemoji";
import styled from "styled-components";

import { remark } from "remark";
import parse from "remark-parse";
import smartypants from "remark-smartypants";
import rehype from "remark-rehype";
import externalLinks from "rehype-external-links";
import html from "rehype-stringify";

import { Navigation } from "src/components/navigation";

const WrapContent = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin-left: 3.2rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

type Data = {
  part?: number;
  title: string;
  tags?: string;
};

type NavItem = { url: string } & Data;

type Params = {
  section: string;
  slug: string;
};

type Path = {
  params: Params;
};

type ContentProps = {
  params: Params;
  data: Data;
  content: string;
  htmlContent: string;
  navItems?: NavItem[];
};

export default function Page({
  params,
  data,
  htmlContent,
  navItems,
}: ContentProps) {
  return (
    <main id="main-content">
      <WrapContent>
        <Navigation items={navItems} currentPart={data.part} />
        <Content>
          <h1>{data?.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </Content>
      </WrapContent>
    </main>
  );
}

export async function getStaticProps({
  params,
}: {
  params: Params;
}): Promise<{ props: ContentProps }> {
  const fileContent = fs.readFileSync(
    path.resolve(
      process.cwd(),
      `./content/${params.section}/${params.slug}.mdx`
    ),
    "utf-8"
  );

  const { data, content } = matter(fileContent);
  const result = await remark()
    .use(smartypants)
    .use(parse)
    .use(rehype)
    .use(externalLinks, {
      target: "_blank",
      rel: ["nofollow", "noreferrer"],
    })
    .use(html)
    .process(content);

  const htmlContent = twemoji.parse(result.toString(), {
    ext: ".svg",
    size: "svg",
  });

  const slugs = fs.readdirSync(
    path.resolve(process.cwd(), `./content/${params.section}`)
  );
  const navItems = slugs.map((slug) => {
    const fileContent = fs.readFileSync(
      path.resolve(process.cwd(), `./content/${params.section}/${slug}`),
      "utf-8"
    );

    const { data } = matter(fileContent);
    return {
      url: `/${params.section}/${slug.replace(/\.mdx$/, "")}`,
      ...(data as Data),
    };
  });

  return {
    props: {
      params,
      data: data as Data,
      content,
      htmlContent,
      navItems,
    },
  };
}

export async function getStaticPaths() {
  const sections = fs.readdirSync(path.resolve(process.cwd(), "./content"));
  const paths = sections.reduce<Path[]>((all, section) => {
    const slugs = fs.readdirSync(
      path.resolve(process.cwd(), `./content/${section}`)
    );

    slugs.forEach((slug) => {
      all.push({
        params: {
          section,
          slug: slug.replace(/\.mdx$/, ""),
        },
      });
    });

    return all;
  }, []);

  return { paths, fallback: false };
}
