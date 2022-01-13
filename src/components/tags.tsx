import Link from "next/link";
import styled from "styled-components";

import { Countable } from "src/utils/content";

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: -0.2rem;

  a {
    display: flex;
    padding: 0.6rem 0.8rem;
    background: #ccc;
    margin: 0.2rem;
    font-family: Staatliches;
    color: inherit;
    transition: background 0.2s, color 0.2s;

    &:hover,
    &:focus {
      color: #fff;
      background: #222;
      text-decoration: none;
    }
  }
`;

type TagsProps = {
  items: Countable[];
};

export function Tags({ items }: TagsProps) {
  return (
    <Container>
      {items.map((tag) => (
        <Link key={tag.slug} href={tag.slug}>
          <a>{tag.name}</a>
        </Link>
      ))}
    </Container>
  );
}
