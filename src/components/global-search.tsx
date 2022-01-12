import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import hotkeys from "hotkeys-js";
import { Spinner } from "./spinner";

const Container = styled.div<{ active?: boolean }>`
  position: fixed;
  z-index: 1000;
  inset: 0;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(${(props) => (props.active ? ".5rem" : "0")});
  opacity: ${(props) => (props.active ? 1 : 0)};
  pointer-events: ${(props) => (props.active ? "all" : "none")};
  transition: backdrop-filter 0.2s, opacity 0.2s;
`;

const Content = styled.div`
  width: 100%;
  max-width: 55rem;
  margin: 10vh auto 0;
  padding: 2.4rem;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  filter: drop-shadow(0 0.2rem 2.4rem rgba(0, 0, 0, 0.3));
`;

const WrapInput = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  font-size: 2rem;
  width: 100%;
  border: 0 none;
  padding: 1.8rem 6.2rem 1.8rem 1.8rem;
  background: #fff;

  &:focus {
    outline: none;
  }
`;

const WrapSpinner = styled.div`
  display: flex;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 1.8rem;
`;

const SearchResults = styled.ul`
  width: 100%;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  max-height: 70vh;
  overflow: auto;

  & li {
    margin: 0.2rem 0 0;
    list-style: none;

    & a {
      padding: 1.2rem 1.8rem;
      background: #fff;
      display: flex;
      flex-direction: column;
      color: inherit;
      opacity: 0.85;
      transition: opacity 0.2s;
      font-weight: 400;
      line-height: 1.2;

      &:hover,
      &:focus-within {
        opacity: 1;
      }

      &:hover {
        text-decoration: none;
      }
    }
  }
`;

const Title = styled.span`
  font-size: 1.2em;
  font-family: Staatliches;

  a:hover & {
    text-decoration: underline;
  }
`;

const Subtitle = styled.span`
  font-size: 1.2rem;
  margin: 0 0 0.4rem;
`;

const Url = styled.span`
  color: #888;
  text-transform: uppercase;
  font-size: 0.8rem;
  margin: 0.2rem 0 0;
`;

// Util method to trigger the global search from anywhere in the app
// A bit hacky, but good enough for now
export function toggleGlobalSearch() {
  const event = new CustomEvent("dsd--toggleGlobalSearch");
  window.document.dispatchEvent(event);
}

export function GlobalSearch() {
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [results, setResults] = useState([]);

  const inputRef = useRef<HTMLElement>();
  const timer = useRef<NodeJS.Timeout>();

  // Register keybinding for cmd+k to open and close the global search
  useEffect(() => {
    function toggle() {
      setActive((state) => {
        const newState = !state;
        if (newState) {
          inputRef.current?.focus?.();
        }
        return newState;
      });
    }

    // Custom event to be able to trigger the toggle from anywhere
    window.document.addEventListener("dsd--toggleGlobalSearch", toggle);

    // Key binding, filter to ensure it triggers even from within text fields
    hotkeys.filter = () => true;
    hotkeys("cmd+k", toggle);

    return () => {
      // 🧹
      window.document.removeEventListener("dsd--toggleGlobalSearch", toggle);
      hotkeys.unbind("cmd+k", toggle);
    };
  }, []);

  // Whenever the input value changes, we want to change the search value
  // throttled by 800ms
  useEffect(() => {
    setLoading(true);
    clearTimeout(timer.current as NodeJS.Timeout);
    timer.current = setTimeout(() => {
      setSearchValue(inputValue);
    }, 800);
  }, [inputValue]);

  // Whenever the search value changes, we do an API request with that value
  // to retrieve the respective search results
  useEffect(() => {
    if (!searchValue?.trim?.()) {
      setResults([]);
      setLoading(false);
      return;
    }

    fetch(
      `${window.location.origin}/api/search?term=${encodeURIComponent(
        searchValue.trim()
      )}`
    )
      .then((res) => res.json())
      .then((res) => {
        setResults(res?.results || []);
        setLoading(false);
      });
  }, [searchValue]);

  // Whenever the global search is closed we reset the state
  useEffect(() => {
    if (!active) {
      setInputValue("");
      setSearchValue("");
    }
  }, [active]);

  return (
    <Container active={active} onClick={() => setActive(false)}>
      <Content>
        <Inner
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <WrapInput>
            <Input
              type="text"
              ref={inputRef as any}
              placeholder="Start typing to search..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
            />
            {loading && (
              <WrapSpinner>
                <Spinner />
              </WrapSpinner>
            )}
          </WrapInput>
          {results.length > 0 && (
            <SearchResults>
              {results.map((result: any) => {
                return (
                  <li key={result.ref}>
                    <a
                      href={result.linkUrl}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActive(false);
                        window.location.href = `${window.location.origin}${result.linkUrl}`;
                      }}
                    >
                      <Title>{result.originalData?.title}</Title>
                      {result.originalData?.subtitle && (
                        <Subtitle>{result.originalData.subtitle}</Subtitle>
                      )}
                      <Url>
                        {window.location.origin}
                        {result.originalData.slug}
                      </Url>
                    </a>
                  </li>
                );
              })}
            </SearchResults>
          )}
        </Inner>
      </Content>
    </Container>
  );
}
