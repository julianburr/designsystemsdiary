import { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";

import { BREAKPOINTS } from "src/theme";
import { CloseButton } from "src/components/close-button";
import { HamburgerButton } from "src/components/hamburger-button";
import { toggleGlobalSearch } from "src/components/global-search";
import { Tooltip } from "src/components/tooltip";

import SearchSvg from "src/assets/icons/search.svg";
import CommandSvg from "src/assets/icons/command.svg";

const Container = styled.header<{ active: boolean }>`
  width: 100%;
  padding: 2.4rem;
  background: #c87462;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;

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
    flex: 1;
    align-items: center;
    justify-content: center;
    position: fixed;
    inset: 0;
    color: #fff;
    z-index: 2;

    ${BREAKPOINTS.TABLET} {
      display: flex;
      justify-content: flex-end;
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

        a,
        button {
          display: flex;
          text-decoration: none;
          font: inherit;
          font-size: 4.8rem;
          color: inherit;
          margin: 0;
          padding: 0;
          background: transparent;
          border: 0 none;
          text-decoration: none;

          ${BREAKPOINTS.TABLET} {
            font-size: 2.2rem;
          }

          &:hover {
            text-decoration: underline;
          }

          & svg {
            height: 3.2rem;
            width: auto;
            margin: -0.3rem 0 0;
          }
        }
      }
    }
  }
`;

const WrapClose = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 3.2rem;
  display: flex;

  ${BREAKPOINTS.TABLET} {
    display: none;
  }

  button {
    color: inherit;
  }
`;

const WrapCloseInner = styled(WrapClose)`
  top: 4.6rem;
  right: 4rem;
`;

const Logo = styled.div`
  font-size: 2.8rem;
  line-height: 1.1;
  font-family: Staatliches;

  ${BREAKPOINTS.TABLET} {
    font-size: 3.2rem;
  }

  & a {
    color: inherit;
    text-decoration: none;
  }
`;

const SkipLink = styled.a`
  font-family: Staatliches;
  transition: opacity 0.2s;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  background: #222;
  color: #fff;
  padding: 0.4rem 0.8rem;

  &:focus {
    opacity: 1;
  }
`;

const TabletLi = styled.li`
  display: none;

  ${BREAKPOINTS.TABLET} {
    display: flex;
  }
`;

const MobileLi = styled.li`
  display: flex;

  ${BREAKPOINTS.TABLET} {
    display: none;
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
      <SkipLink href="#main-content">Skip to main content</SkipLink>

      <Logo>
        <Link href="/">
          <a>Design Systems Diary</a>
        </Link>
      </Logo>

      <menu>
        <WrapCloseInner>
          <CloseButton
            aria-label="Close mobile menu"
            onClick={() => setActive(false)}
          />
        </WrapCloseInner>
        <ul>
          <MobileLi>
            <Link href="/">Home</Link>
          </MobileLi>

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

          <TabletLi>
            <Tooltip
              content={
                <>
                  Search (<CommandSvg /> + k)
                </>
              }
              placement="bottom"
            >
              {({ elementRef, ...props }) => (
                <button
                  {...props}
                  ref={elementRef}
                  onClick={() => toggleGlobalSearch()}
                >
                  <SearchSvg aria-label="Open global search" />
                </button>
              )}
            </Tooltip>
          </TabletLi>

          <MobileLi>
            <button
              onClick={() => {
                setActive(false);
                toggleGlobalSearch();
              }}
            >
              Search
            </button>
          </MobileLi>
        </ul>
      </menu>

      <WrapClose>
        <HamburgerButton
          aria-label="Open mobile menu"
          onClick={() => setActive(true)}
        >
          <span />
        </HamburgerButton>
      </WrapClose>
    </Container>
  );
}
