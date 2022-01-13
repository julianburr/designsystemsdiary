import { PropsWithChildren, useEffect, useRef, useState } from "react";
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
  scrollPosition: number;
}>`
  display: flex;
  height: 0.1rem;
  width: 12rem;
  max-width: 50vw;
  background: #ccc;
  margin: 0 0 1.6rem;

  &:before {
    content: " ";
    display: flex;
    width: ${(props) =>
      Math.min(props.clientWidth / props.scrollWidth, 1) * 100}%;
    height: 100%;
    background: currentColor;
    position: relative;
    transition: left 0.1s;
    left: ${(props) => {
      const width = Math.min(props.clientWidth / props.scrollWidth, 1) * 100;
      const maxScroll = props.scrollWidth - props.clientWidth;
      if (maxScroll <= 0) {
        return 0;
      }
      return `${(props.scrollPosition / maxScroll) * (100 - width)}%`;
    }};
  }
`;

let uuid = 0;

export function Slideshow({ children }: PropsWithChildren<Record<never, any>>) {
  const [instanceUuid] = useState(++uuid);

  const [meta, setMeta] = useState<{
    clientWidth: number;
    scrollWidth: number;
    scrollPosition: number;
  }>({
    clientWidth: 0,
    scrollWidth: 0,
    scrollPosition: 0,
  });

  const containerRef = useRef<HTMLElement>();
  useEffect(() => {
    function handleScroll(e: any) {
      setMeta((meta) => ({
        ...meta,
        scrollPosition: e.target.scrollLeft,
      }));
    }

    containerRef?.current?.addEventListener("scroll", handleScroll);
    return () =>
      containerRef?.current?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function measureMeta() {
      console.log("hello");
      setMeta({
        clientWidth: containerRef.current?.clientWidth || 0,
        scrollWidth: containerRef.current?.scrollWidth || 0,
        scrollPosition: containerRef.current?.scrollLeft || 0,
      });
    }

    measureMeta();
    window.addEventListener("resize", measureMeta);
    return () => window.removeEventListener("scroll", measureMeta);
  }, []);

  return (
    <>
      <Scrollbar
        role="scrollbar"
        aria-saria-controls={`slideshow-${instanceUuid}`}
        aria-orientation="horizontal"
        aria-valuemax={
          meta.scrollWidth > meta.clientWidth
            ? meta.scrollWidth - meta.clientWidth
            : 0
        }
        aria-valuemin={0}
        aria-valuenow={meta.scrollPosition}
        clientWidth={meta.clientWidth}
        scrollWidth={meta.scrollWidth}
        scrollPosition={meta.scrollPosition}
      />
      <Container id={`slideshow-${instanceUuid}`} ref={containerRef as any}>
        {children}
      </Container>
    </>
  );
}
