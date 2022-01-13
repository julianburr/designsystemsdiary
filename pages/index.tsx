import Link from "next/link";
import styled from "styled-components";
import * as path from "path";
import * as fs from "fs";
import matter from "gray-matter";
import getReadingTime from "reading-time";

import { BREAKPOINTS } from "src/theme";
import { glob } from "src/utils/glob";

import BookSvg from "src/assets/icons/book.svg";
import AwardSvg from "src/assets/icons/award.svg";
import FileSvg from "src/assets/icons/file-text.svg";
import ArchiveSvg from "src/assets/icons/archive.svg";
import { DiaryItem } from "src/components/slideshow/items/diary";
import { Slideshow } from "src/components/slideshow";
import { TutorialItem } from "src/components/slideshow/items/tutorial";
import { ResourceItem } from "src/components/slideshow/items/resource";
import { Tags } from "src/components/tags";
import { AllContentMeta, getContentMeta } from "src/utils/content";
import { Spacer } from "src/components/spacer";

const Banner = styled.div`
  width: 100%;
  padding: 3.2rem;
  background: #dd8470;

  h1 {
    line-height: 1.25;
    width: 100%;
    max-width: 68rem;
    font-size: 4.4rem;
    margin: 0 auto 4rem 0;
    text-align: left;

    ${BREAKPOINTS.TABLET} {
      font-size: 5.8rem;
      margin: 0 0 4rem auto;
      text-align: right;
    }
  }
`;

const Cards = styled.ul`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.8rem;
  margin: 0;
  padding: 0;

  ${BREAKPOINTS.TABLET} {
    grid-template-columns: 1fr 1fr;
  }

  ${BREAKPOINTS.DESKTOP} {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  li {
    padding: 0;
    margin: 0;
    list-style: none;
    width: 100%;
  }
`;

const Card = styled.li`
  width: 100%;

  a {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: #c87462;
    padding: 1.8rem;
    font-size: 1.4rem;
    line-height: 1.3;
    text-decoration: none;
    color: inherit;
    transition: transform 0.15s;
    font-weight: 400;
    position: relative;

    ${BREAKPOINTS.TABLET} {
      height: 14rem;
    }

    ${BREAKPOINTS.DESKTOP} {
      height: 16rem;
    }

    h2 {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 0 0 -0.6rem;

      svg {
        height: auto;
        width: 1.3em;
        margin: 0 0.8rem 0 0;
        color: #b06453;
        transition: transform 0.2s;
      }
    }

    &:hover,
    &:focus-within {
      text-decoration: none;

      h2 {
        text-decoration: underline;

        svg {
          transform: scale(1.1);
        }
      }
    }
  }
`;

const Main = styled.main`
  section {
    margin: 0 0 4.8rem;
  }
`;

const TagsGroup = styled(Tags)`
  margin: 1.8rem 0 0;
`;

type HomepageProps = {
  content: AllContentMeta;
};

export default function Homepage({ content }: HomepageProps) {
  console.log({ content });
  return (
    <>
      <Banner>
        <h1>
          Learning together how to build, maintain and improve design systems
        </h1>

        <Cards>
          <Card>
            <Link href="/diary" passHref>
              <a>
                <h2>
                  <BookSvg role="presentation" />
                  <span>Diary</span>
                </h2>
                <p>
                  A collection of personal lessons and learnings, going through
                  the process of creating a new design system.
                </p>
              </a>
            </Link>
          </Card>
          <Card>
            <Link href="/tutorials" passHref>
              <a>
                <h2>
                  <AwardSvg role="presentation" />
                  <span>Tutorials</span>
                </h2>
                <p>
                  Hands on tutorials that help you build design systems and
                  understand the concepts within them better.
                </p>
              </a>
            </Link>
          </Card>
          <Card>
            <Link href="/glossary" passHref>
              <a>
                <h2>
                  <FileSvg />
                  <span>Glossary</span>
                </h2>
                <p>
                  Learn about termonologies, different paradigms and concepts
                  related to building design systems.
                </p>
              </a>
            </Link>
          </Card>
          <Card>
            <Link href="/resources" passHref>
              <a>
                <h2>
                  <ArchiveSvg />
                  <span>Resources</span>
                </h2>
                <p>
                  A collection of useful resources to learn more about design
                  systems and everything related to them.
                </p>
              </a>
            </Link>
          </Card>
        </Cards>
      </Banner>

      <Main id="main-content">
        <section>
          <h2>Latest diary entries</h2>
          <Slideshow>
            {content.diary?.map?.((data) => (
              <DiaryItem key={data.slug} data={data} />
            ))}
          </Slideshow>
        </section>

        <section>
          <h2>Latest resources</h2>
          <Slideshow>
            {content.resources?.map?.((data) => (
              <ResourceItem key={data.slug} data={data} />
            ))}
          </Slideshow>
          <Spacer height="1.6rem" />
          <Tags items={content.categories} />
        </section>

        <section>
          <h2>Latest tutorials</h2>
          <Slideshow>
            {content.tutorials?.map?.((data) => (
              <TutorialItem key={data.slug} data={data} />
            ))}
          </Slideshow>
        </section>
      </Main>
    </>
  );
}

export async function getStaticProps() {
  const content = await getContentMeta();

  // Sort content based on type + only take the first 10 items from
  // each list
  content.diary
    ?.sort?.((a: any, b: any) => (a.part < b.part ? 1 : -1))
    ?.slice?.(0, 10);
  content.tutorials
    ?.sort?.((a: any, b: any) => (a.published > b.published ? 1 : -1))
    ?.slice?.(0, 10);
  content.resources
    ?.sort?.((a: any, b: any) => (a.published > b.published ? 1 : -1))
    ?.slice?.(0, 10);

  // Get resource categories sorted by popularity
  content.tags = content.tags?.sort?.((a, b) => (a.count > b.count ? -1 : 1));
  content.categories = content.categories?.sort?.((a, b) =>
    a.count > b.count ? -1 : 1
  );

  return { props: { content } };
}
