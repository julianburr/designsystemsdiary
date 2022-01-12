import type { NextPage } from "next";
import Link from "next/link";
import styled from "styled-components";

import { BREAKPOINTS } from "src/theme";

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

    h2 {
      margin: 0 0 -0.6rem;
    }

    &:hover,
    &:focus-within {
      text-decoration: none;

      h2 {
        text-decoration: underline;
      }
    }

    ${BREAKPOINTS.TABLET} {
      height: 14rem;
    }

    ${BREAKPOINTS.DESKTOP} {
      height: 16rem;
    }
  }
`;

const Home: NextPage = () => {
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
                <h2>Diary</h2>
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
                <h2>Tutorials</h2>
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
                <h2>Glossary</h2>
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
                <h2>Resources</h2>
                <p>
                  A collection of useful resources to learn more about design
                  systems and everything related to them.
                </p>
              </a>
            </Link>
          </Card>
        </Cards>
      </Banner>

      <main id="main-content">
        <section>
          <h2>Latest diary entries</h2>
          <p>...</p>
        </section>

        <section>
          <h2>Latest tutorials</h2>
          <p>...</p>
        </section>

        <section>
          <h2>Latest resources</h2>
          <p>...</p>
        </section>
      </main>
    </>
  );
};

export default Home;
