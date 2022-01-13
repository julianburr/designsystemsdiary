import { Fragment } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  Countable,
  getContentMeta,
  GlossaryContentMeta,
} from "src/utils/content";
import { BREAKPOINTS } from "src/theme";
import { ContentLayout } from "src/components/layouts/content";
import { NewsletterForm } from "src/components/newsletter-form";

const List = styled.ul`
  margin: 0;
  padding: 0;
  width: 100%;
  display: grid;
  gap: 1.2rem;
  grid-template-columns: 1fr;

  ${BREAKPOINTS.TABLET} {
    grid-template-columns: 1fr 1fr;
  }

  ${BREAKPOINTS.DESKTOP} {
    grid-template-columns: 1fr 1fr 1fr;
  }

  li {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
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

const Meta = styled.span`
  font-size: 1.2rem;
  color: #888;
  margin: 0.2rem 0 0;
`;

const Character = styled.h2`
  font-size: 2rem;
  color: #888;
  margin: 3.2rem 0 0.4rem;
`;

type GlossaryPageProps = {
  list: GlossaryContentMeta[][];
  tags: Countable[];
};

export default function GlossaryPage({ list, tags }: GlossaryPageProps) {
  const router = useRouter();

  return (
    <ContentLayout
      left={
        <>
          <h1>
            <span>Glossary</span>
            {router.query.category && ` — ${router.query.category}`}
          </h1>

          {list.map((group) => (
            <Fragment key={group[0].title[0]}>
              <Character id={group[0].title[0]}>{group[0].title[0]}</Character>
              <List>
                {group.map((data) => (
                  <li key={data.slug}>
                    <Link href={data.slug}>
                      <a>
                        <h3>{data.title}</h3>
                        {data.summary && <Meta>{data.summary}</Meta>}
                      </a>
                    </Link>
                  </li>
                ))}
              </List>
            </Fragment>
          ))}
        </>
      }
      right={
        <section>
          <NewsletterForm />
        </section>
      }
    />
  );
}

export async function getStaticProps() {
  const meta = await getContentMeta();

  // Sort by newest first
  const list = meta.glossary.sort((a, b) => (a.title! > b.title! ? 1 : -1));
  const grouped = list.reduce<GlossaryContentMeta[][]>((all, item) => {
    const lastGroup = all[all.length - 1];
    if (!all.length || lastGroup[0].title.startsWith(item.title[0])) {
      all.push([item]);
    } else {
      lastGroup.push(item);
    }
    return all;
  }, []);

  return { props: { list: grouped } };
}
