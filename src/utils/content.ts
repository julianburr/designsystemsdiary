import * as path from "path";
import * as fs from "fs";
import matter from "gray-matter";
import getReadingTime, { ReadTimeResults } from "reading-time";

import { glob } from "./glob";

export type ContentType = "diary" | "tutorials" | "resources" | "glossary";

type GetContentSlugReturn = {
  type: ContentType;
  slug: string;
};

export function getContentSlug(filePath: string): GetContentSlugReturn {
  const contentPath = path.resolve(process.cwd(), "./content");
  const relPath = filePath.replace(contentPath, "");

  const [type, fileName] = relPath.split("/").filter(Boolean);
  return {
    type: type as ContentType,
    slug: `/${type}/${fileName.replace(/\.mdx$/, "")}`,
  };
}

export function getTagSlug(tagName: string): string {
  return `/search?tags=${encodeURIComponent(tagName)}`;
}

export function getCategorySlug(categoryName: string): string {
  return `/resources?category=${encodeURIComponent(categoryName)}`;
}

export type BaseContentMeta = {
  slug: string;
  title: string;
  tags: string[];
  subtitle?: string;
  draft?: boolean;
  audience?: "designers" | "developers";
  readingTime?: ReadTimeResults;
};

export type DiaryContentMeta = BaseContentMeta & {
  part?: number;
};

export type TutorialContentMeta = BaseContentMeta & {
  published: string;
  level?: "beginner" | "advanced" | "expert";
  paywall?: boolean;
};

export type ResourceContentMeta = BaseContentMeta & {
  published: string;
  category?: string;
};

export type GlossaryContentMeta = BaseContentMeta & {
  summary?: string;
};

export type ContentMeta =
  | DiaryContentMeta
  | TutorialContentMeta
  | ResourceContentMeta
  | GlossaryContentMeta;

export type Countable = {
  slug: string;
  name: string;
  count: number;
  sources: ContentType[];
};

export type AllContentMeta = {
  diary: DiaryContentMeta[];
  tutorials: TutorialContentMeta[];
  resources: ResourceContentMeta[];
  glossary: GlossaryContentMeta[];
  tags: Countable[];
  categories: Countable[];
};

export async function getContentMeta(): Promise<AllContentMeta> {
  const globPath = path.resolve(process.cwd(), "./content/**/*.mdx");
  const files = await glob(globPath);

  const content = files.reduce<AllContentMeta>(
    (all, filePath) => {
      const { type, slug } = getContentSlug(filePath);

      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);
      const readingTime = getReadingTime(fileContent);

      if (!all[type]) {
        return all;
      }

      const tags = data.tags?.split?.(",").filter(Boolean) || [];

      // Main content entry
      all[type].push({
        ...(data as any),
        tags,
        slug,
        readingTime,
      });

      // Tags
      tags.forEach((tagName: string) => {
        const tagIndex = all.tags.findIndex((item) => item.name === tagName);
        if (tagIndex >= 0) {
          all.tags[tagIndex].count++;
          if (!all.tags[tagIndex].sources.includes(type)) {
            all.tags[tagIndex].sources.push(type);
          }
        } else {
          all.tags.push({
            slug: getTagSlug(tagName),
            name: tagName,
            count: 1,
            sources: [type],
          });
        }
      });

      // Categories for resource content
      if (data.category) {
        const categoryIndex = all.categories.findIndex(
          (item) => item.name === data.category
        );
        if (categoryIndex >= 0) {
          all.categories[categoryIndex].count++;
          if (!all.categories[categoryIndex].sources.includes(type)) {
            all.categories[categoryIndex].sources.push(type);
          }
        } else {
          all.categories.push({
            slug: getCategorySlug(data.category),
            name: data.category,
            count: 1,
            sources: [type],
          });
        }
      }

      return all;
    },
    {
      diary: [],
      tutorials: [],
      resources: [],
      glossary: [],
      categories: [],
      tags: [],
    }
  );

  // Sort countables, since those likely always should be sorted by popularity
  function sortCountable(a: Countable, b: Countable): number {
    return a.count > b.count ? -1 : 1;
  }

  content.tags = content.tags.sort(sortCountable);
  content.categories = content.categories.sort(sortCountable);

  return content;
}
