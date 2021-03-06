import matter from "gray-matter";
import styled from "styled-components";
import { ReadTimeResults } from "reading-time";
import * as path from "path";
import * as fs from "fs";

import { BREAKPOINTS } from "src/theme";
import { parseMdx } from "src/utils/mdx";
import { PageNavigation } from "src/components/page-navigation";
import { PageMeta } from "src/components/page-meta";
import { NewsletterForm } from "src/components/newsletter-form";
import { Hr } from "src/components/mdx/hr";
import { Markdown } from "src/components/markdown";
import { SkeletonText } from "src/components/skeleton/text";
import { ContentLayout } from "src/components/layouts/content";

const Subtitle = styled.p`
  margin-top: 0.8rem;
  font-size: 2rem;
  color: #888;
  font-family: Staatliches;
`;

type MetaData = {
  readingTime?: ReadTimeResults;
  part?: number;
  title: string;
  subtitle?: string;
  tags?: string;
  draft?: boolean;
};

type NavItem = { url: string } & MetaData;

type Params = {
  section: string;
  slug: string;
};

type Path = {
  params: Params;
};

type ContentProps = {
  params: Params;
  navItems?: NavItem[];
  meta: MetaData;
  source: any;
};

export default function Page({ navItems, meta, source }: ContentProps) {
  if (meta.draft) {
    return (
      <ContentLayout
        left={
          <>
            <h1>{meta.title}</h1>
            {meta.subtitle && (
              <Subtitle role="doc-subtitle">{meta.subtitle}</Subtitle>
            )}
            <SkeletonText />

            <Hr />
            <NewsletterForm
              align="center"
              title={
                `This article has not been finished yet. ` +
                `Do you want to get notified when it is?`
              }
            />
          </>
        }
        right={
          <>
            <PageNavigation items={navItems} currentPart={meta.part} />
          </>
        }
      />
    );
  }

  return (
    <ContentLayout
      left={
        <>
          <h1>{meta.title}</h1>
          {meta.subtitle && (
            <Subtitle role="doc-subtitle">{meta.subtitle}</Subtitle>
          )}
          <PageMeta
            title={meta.title}
            tags={meta.tags?.split(",")?.map?.((str) => str.trim())}
            readingTime={meta.readingTime}
          />

          <Markdown {...source} />

          <Hr />
          <NewsletterForm align="center" />
        </>
      }
      right={
        <>
          <PageNavigation items={navItems} currentPart={meta.part} />
        </>
      }
    />
  );
}

export async function getStaticProps({
  params,
}: {
  params: Params;
}): Promise<{ props: ContentProps }> {
  const filePath = `./content/${params.section}/${params.slug}.mdx`;
  const fileContent = fs.readFileSync(
    path.resolve(process.cwd(), filePath),
    "utf-8"
  );

  const { meta, source } = await parseMdx(fileContent);

  const sectionPath = `./content/${params.section}`;
  const slugs = fs.readdirSync(path.resolve(process.cwd(), sectionPath));

  const navItems = slugs.map((slug) => {
    const slugPath = `./content/${params.section}/${slug}`;
    const fileContent = fs.readFileSync(
      path.resolve(process.cwd(), slugPath),
      "utf-8"
    );

    const { data } = matter(fileContent);
    return {
      url: `/${params.section}/${slug.replace(/\.mdx$/, "")}`,
      ...(data as MetaData),
    };
  });

  return {
    props: {
      params,
      navItems,
      meta: meta as MetaData,
      source,
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
