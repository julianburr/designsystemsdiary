import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { BREAKPOINTS } from "src/theme";

import { HamburgerButton } from "./hamburger-button";
import { CloseButton } from "./close-button";
import { useRouter } from "next/router";

const Container = styled.header<{ active: boolean }>`
  width: 100%;
  padding: 2.4rem;
  background: #c87462;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  ${BREAKPOINTS.TABLET} {
    padding: 3.2rem;
  }

  h1 {
    font-size: 3.2rem;

    ${BREAKPOINTS.TABLET} {
      font-size: 3.6rem;
    }
  }

  menu {
    margin: 0;
    padding: 0;
    font-family: Staatliches;
    display: ${(props) => (props.active ? "flex" : "none")};
    align-items: center;
    justify-content: center;
    position: fixed;
    inset: 0;
    color: #fff;
    z-index: 2;

    ${BREAKPOINTS.TABLET} {
      display: flex;
      position: relative;
      background: transparent;
      color: inherit;
    }

    &:before {
      content: " ";
      position: fixed;
      background: #000;
      inset: 0;
      z-index: -1;
      transition: opacity 1.2s;
      opacity: ${(props) => (props.active ? 0.9 : 0.2)};
      pointer-events: ${(props) => (props.active ? "all" : "none")};

      ${BREAKPOINTS.TABLET} {
        display: none;
      }
    }

    button {
      position: absolute;
      top: 3.6rem;
      right: 3.2rem;
      color: inherit;
    }

    ul {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0;
      padding: 0;

      ${BREAKPOINTS.TABLET} {
        flex-direction: row;
      }

      li {
        list-style: none;
        margin: 0;
        padding: 0;
        margin: 0 0 0 2.4rem;

        a {
          text-decoration: none;
          color: inherit;
          font-size: 4.8rem;

          ${BREAKPOINTS.TABLET} {
            font-size: 2.2rem;
          }

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }

  button {
    display: flex;

    ${BREAKPOINTS.TABLET} {
      display: none;
    }
  }
`;

export function Header() {
  const [active, setActive] = useState(false);
  const router = useRouter();

  useEffect(() => {
    window.document.body.style.overflow = active ? "hidden" : "auto";
  }, [active]);

  useEffect(() => {
    setActive(false);
  }, [router.asPath]);

  return (
    <Container active={active}>
      <h1>Design Systems Diary</h1>

      <menu>
        <CloseButton
          aria-label="Close mobile menu"
          onClick={() => setActive(false)}
        />
        <ul>
          <li>
            <Link href="/diary">Diary</Link>
          </li>
          <li>
            <Link href="/tutorials">Tutorials</Link>
          </li>
          <li>
            <Link href="/glossary">Glossary</Link>
          </li>
          <li>
            <Link href="/resources">Resources</Link>
          </li>
        </ul>
      </menu>

      <HamburgerButton
        aria-label="Open mobile menu"
        onClick={() => setActive(true)}
      >
        <span />
      </HamburgerButton>
    </Container>
  );
}
