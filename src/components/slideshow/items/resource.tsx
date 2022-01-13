import Link from "next/link";
import styled from "styled-components";

const Category = styled.span`
  font-size: 1.4rem;
  font-family: Staatliches;
  color: #888;
  margin: 0 0 1.2rem;
`;

type ResourceItemProps = {
  data: {
    slug: string;
    title?: string;
    subtitle?: string;
    category?: string;
  };
};

export function ResourceItem({ data }: ResourceItemProps) {
  return (
    <li>
      <Link href={data.slug}>
        <a>
          <Category>{data.category}</Category>
          <h3>{data.title}</h3>
          <p>{data.subtitle}</p>
        </a>
      </Link>
    </li>
  );
}
