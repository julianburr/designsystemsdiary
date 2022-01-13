import Link from "next/link";
import styled from "styled-components";

const Container = styled.li`
  && {
    a {
      padding: 0;
      height: 26rem;
    }

    h3 {
      padding: 2.8rem 1.6rem 0;
    }

    p {
      padding: 0.3rem 1.6rem;
    }
  }
`;

const Part = styled.span`
  display: flex;
  width: 100%;
  background: #f5f5f5;
  height: 7rem;
  clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
  font-size: 7.2rem;
  padding: 0 1.6rem;
  color: #ddd;
  font-family: Staatliches;
  z-index: 0;

  & span {
    transition: transform 0.2s;

    a:hover &,
    a:focus-within & {
      transform: scale(1.1);
    }
  }
`;

type DiaryItemProps = {
  data: {
    slug: string;
    part?: number;
    title?: string;
    subtitle?: string;
  };
};

export function DiaryItem({ data }: DiaryItemProps) {
  return (
    <Container>
      <Link href={data.slug}>
        <a>
          <Part>
            <span>{data.part?.toString()?.padStart?.(2, "0")}</span>
          </Part>
          <h3>{data.title}</h3>
          {data.subtitle && <p>{data.subtitle}</p>}
        </a>
      </Link>
    </Container>
  );
}
