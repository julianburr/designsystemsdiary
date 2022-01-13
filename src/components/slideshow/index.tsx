import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

const Container = styled.ul`
  display: flex;
  flex-direction: row;
  margin: 0;
  padding: 0;
  overflow-x: auto;
  scroll-snap-type: mandatory;
  scroll-snap-points-x: repeat(21.8rem);
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  overscroll-behaviour: contain;

  &::-webkit-scrollbar {
    display: none;
  }

  & li {
    scroll-snap-align: start;
    margin: 0 0.8rem 0 0;
    padding: 0;
    list-style: none;

    &:last-child {
      margin: 0;
    }

    a {
      display: flex;
      flex-direction: column;
      width: 21rem;
      height: 18rem;
      background: #fafafa;
      color: inherit;
      position: relative;
      font-weight: 400;
      padding: 1.6rem;

      h3 {
        line-height: 1.2;
      }

      p {
        margin: 0;
        padding: 0.3rem 0;
        font-size: 1.4rem;
        line-height: 1.3;
      }

      &:hover,
      &:focus-within {
        text-decoration: none;

        h3 {
          text-decoration: underline;
        }
      }

      &:focus {
        outline: none;

        &:before {
          content: " ";
          position: absolute;
          z-index: 10;
          inset: 0.3rem;
          border: 0.2rem solid rgba(0, 0, 0, 0.3);
          pointer-events: none;
        }
      }
    }
  }
`;

const Scrollbar = styled.div<{
  clientWidth: number;
  scrollWidth: number;
}>`
  display: flex;
  height: 0.1rem;
  width: 12rem;
  max-width: 50vw;
  background: #ccc;
  margin: 0 0 1.6rem;

  span {
    content: " ";
    display: flex;
    width: ${(props) =>
      Math.min(props.clientWidth / props.scrollWidth, 1) * 100}%;
    height: 100%;
    background: currentColor;
    position: relative;
    transition: left 0.1s;
  }
`;

let uuid = 0;

export function Slideshow({ children }: PropsWithChildren<Record<never, any>>) {
  const [instanceUuid] = useState(++uuid);

  const [meta, setMeta] = useState<{
    clientWidth: number;
    scrollWidth: number;
  }>({
    clientWidth: 0,
    scrollWidth: 0,
  });

  const barRef = useRef<HTMLElement>();
  const scrollRef = useRef<HTMLElement>();
  const setScrollPosition = useCallback(
    (scrollPosition = 0) => {
      if (!barRef.current) {
        return;
      }

      const width = Math.min(meta.clientWidth / meta.scrollWidth, 1) * 100;
      const maxScroll = meta.scrollWidth - meta.clientWidth;

      const progress =
        maxScroll <= 0 ? 0 : (scrollPosition / maxScroll) * (100 - width);
      barRef.current.style.left = `${progress}%`;

      scrollRef.current?.setAttribute(
        "aria-valuenow",
        scrollPosition.toString()
      );
    },
    [meta.clientWidth, meta.scrollWidth]
  );

  const containerRef = useRef<HTMLElement>();
  useEffect(() => {
    function handleScroll(e: any) {
      setScrollPosition(e.target.scrollLeft);
    }

    containerRef?.current?.addEventListener("scroll", handleScroll);
    return () =>
      containerRef?.current?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function measureMeta() {
      setMeta({
        clientWidth: containerRef.current?.clientWidth || 0,
        scrollWidth: containerRef.current?.scrollWidth || 0,
      });
      setScrollPosition(containerRef.current?.scrollLeft);
    }

    measureMeta();
    window.addEventListener("resize", measureMeta);
    return () => window.removeEventListener("scroll", measureMeta);
  }, []);

  return (
    <>
      <Scrollbar
        ref={scrollRef as any}
        role="scrollbar"
        aria-saria-controls={`slideshow-${instanceUuid}`}
        aria-orientation="horizontal"
        aria-valuemax={
          meta.scrollWidth > meta.clientWidth
            ? meta.scrollWidth - meta.clientWidth
            : 0
        }
        aria-valuemin={0}
        clientWidth={meta.clientWidth}
        scrollWidth={meta.scrollWidth}
      >
        <span ref={barRef as any} />
      </Scrollbar>
      <Container id={`slideshow-${instanceUuid}`} ref={containerRef as any}>
        {children}
      </Container>
    </>
  );
}
