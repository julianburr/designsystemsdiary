import styled from "styled-components";
import Link from "next/link";

import {
  Countable,
  getContentMeta,
  TutorialContentMeta,
} from "src/utils/content";
import { BREAKPOINTS } from "src/theme";
import { ContentLayout } from "src/components/layouts/content";
import { NewsletterForm } from "src/components/newsletter-form";
import { Spacer } from "src/components/spacer";
import { Tags } from "src/components/tags";

const List = styled.ul`
  margin: 2.4rem 0 0;
  padding: 0;
  width: 100%;
  display: grid;
  gap: 1.2rem;
  grid-template-columns: 1fr;

  ${BREAKPOINTS.DESKTOP} {
    grid-template-columns: 1fr 1fr;
  }

  li {
    width: 100%;
    height: 100%;
    margin: 1.2rem 0 0;
    padding: 0;
    list-style: none;

    &:first-child {
      margin: 0;
    }

    a {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      padding: 1.6rem;
      background: #fafafa;
      color: inherit;
      font-weight: 400;

      &:hover {
        text-decoration: none;

        h3 {
          text-decoration: underline;
        }
      }

      h3 {
        line-height: 1.2;
      }
    }
  }
`;

const Subtitle = styled.span`
  margin: 0 0 0.2rem;
  font-family: Staatliches;
`;

const Meta = styled.span`
  font-size: 1.2rem;
  color: #888;
  margin: 0.2rem 0 0;
`;

type TutorialsPageProps = {
  list: TutorialContentMeta[];
  tags: Countable[];
};

export default function TutorialsPage({ list, tags }: TutorialsPageProps) {
  return (
    <ContentLayout
      left={
        <>
          <h1>Tutorials</h1>

          <List>
            {list.map((data) => (
              <li key={data.slug}>
                <Link href={data.slug}>
                  <a>
                    <h3>{data.title}</h3>
                    {data.subtitle && <Subtitle>{data.subtitle}</Subtitle>}
                    {!data.draft && (
                      <Meta>
                        {Math.ceil(data.readingTime?.minutes || 0)} min read
                        {data.tags.length > 0 && ` — ${data.tags.join(", ")}`}
                      </Meta>
                    )}
                  </a>
                </Link>
              </li>
            ))}
          </List>
        </>
      }
      right={
        <section>
          <NewsletterForm />

          <Spacer height="4rem" />

          <h2>Tags</h2>
          <Spacer height=".4rem" />
          <Tags items={tags} />
        </section>
      }
    />
  );
}

export async function getStaticProps() {
  const meta = await getContentMeta();

  // Sort by newest first
  const list = meta.tutorials.sort((a, b) =>
    a.published! > b.published! ? -1 : 1
  );

  // Only show tags that are actually sourced from tutorials entries
  const tags = meta.tags.filter((tag) => tag.sources.includes("tutorials"));

  return { props: { list, tags } };
}
