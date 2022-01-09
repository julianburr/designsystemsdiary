import Link from "next/link";
import styled from "styled-components";
import classnames from "classnames";

const Menu = styled.menu`
  display: flex;
  flex-direction: column;
  align-self: start;
  justify-self: start;
  flex-shrink: 0;
  position: sticky;
  top: 3.2rem;
  margin: 0 0 0 4rem;
  padding: 0;
  width: 25rem;

  ul {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;

    li {
      list-style: none;
      margin: 0.6rem 0;
      padding: 0;

      a {
        color: inherit;
        opacity: 0.6;
        text-decoration: none;
        transition: opacity 0.2s;
        line-height: 1.2;

        &:hover,
        &.active {
          opacity: 1;
        }
      }
    }
  }
`;

const Part = styled.span`
  color: #c87462;
  font-family: Staatliches;
  font-variant-numeric: tabular-nums;
`;

type Item = {
  url: string;
  part?: number;
  title: string;
};

type NavigationProps = {
  items?: Item[];
  currentPart?: number;
};

export function Navigation({ items = [], currentPart }: NavigationProps) {
  return (
    <Menu>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <Link href={item.url}>
              <a className={classnames({ active: item.part === currentPart })}>
                <Part>{item.part.toString().padStart(2, "0")}</Part> -{" "}
                {item.title}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </Menu>
  );
}
