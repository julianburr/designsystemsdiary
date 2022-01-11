import { ComponentProps, useLayoutEffect, useRef } from "react";
import styled from "styled-components";
import { MDXRemote } from "next-mdx-remote";
import twemoji from "twemoji";

import { Image } from "src/components/mdx/image";
import { Hr } from "src/components/mdx/hr";

const Container = styled.div`
  width: 100%;

  h1,
  h2,
  h3,
  h4 {
    line-height: 1.1;
  }

  h2 {
    margin: 3.2rem 0 0;
  }

  h3 {
    margin: 2.4rem 0 -0.8rem;
  }

  h2,
  h3,
  h4 {
    position: relative;

    a[aria-hidden="true"] {
      position: absolute;
      right: 100%;
      padding: 0.1em 0.6rem 0 0;
      opacity: 0;
      transition: opacity 0.2s;

      &:before {
        content: "#";
      }
    }

    &:hover a[aria-hidden="true"] {
      opacity: 1;
      text-decoration: none;
    }
  }

  ul li {
    margin: 1.2rem 0;
  }
`;

const components = {
  img: Image,
  hr: Hr,
};

export function Markdown(props: ComponentProps<typeof MDXRemote>) {
  const contentRef = useRef();
  useLayoutEffect(() => {
    twemoji.parse(contentRef.current as any, {
      ext: ".svg",
      size: "svg",
    });
  }, []);

  return (
    <Container ref={contentRef as any}>
      <MDXRemote {...props} components={components} />
    </Container>
  );
}
