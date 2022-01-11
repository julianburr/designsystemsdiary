import { useLayoutEffect, useRef } from "react";
import matter from "gray-matter";
import twemoji from "twemoji";
import styled from "styled-components";
import { ReadTimeResults } from "reading-time";
import * as path from "path";
import * as fs from "fs";

import { parseMdx } from "src/utils/mdx";
import { PageNavigation } from "src/components/page-navigation";
import { PageMeta } from "src/components/page-meta";
import { NewsletterForm } from "src/components/newsletter-form";
import { Hr } from "src/components/mdx/hr";
import { Markdown } from "src/components/markdown";

const WrapContent = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const Content = styled.div`
  width: 100%;
`;

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

export default function Page({ params, navItems, meta, source }: ContentProps) {
  const contentRef = useRef();
  useLayoutEffect(() => {
    twemoji.parse(contentRef.current as any, {
      ext: ".svg",
      size: "svg",
    });
  }, []);

  if (meta.draft) {
    return (
      <main id="main-content">
        <WrapContent>
          <PageNavigation items={navItems} currentPart={meta.part} />
          <Content ref={contentRef as any}>
            <h1>{meta.title}</h1>
            {meta.subtitle && (
              <Subtitle role="doc-subtitle">{meta.subtitle}</Subtitle>
            )}
            <Hr />
            <NewsletterForm
              align="center"
              title="This article has not been finished yet. Do you want to get notified when it is?"
            />
          </Content>
        </WrapContent>
      </main>
    );
  }

  return (
    <main id="main-content">
      <WrapContent>
        <PageNavigation items={navItems} currentPart={meta.part} />
        <Content ref={contentRef as any}>
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
