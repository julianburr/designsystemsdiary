import { Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import { ReadTimeResults } from "reading-time";

import TwitterSvg from "src/assets/icons/twitter.svg";
import LinkedInSvg from "src/assets/icons/linkedin.svg";
import LinkSvg from "src/assets/icons/link.svg";

const Container = styled.div`
  width: 100%;
  margin: 4.8rem 0;
  display: flex;
  flex-direction: column;
  color: #888;
`;

const WrapButtons = styled.div`
  display: flex;
  flex-direction: row;

  margin: 0.8rem 0 0;

  & > * {
    margin: 0 0.3rem 0 0;

    &:last-child {
      margin: 0;
    }
  }

  & svg {
    height: 1.6rem;
    width: auto;
  }
`;

const Button = styled(({ as: As = "button", ...props }) => <As {...props} />)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.2rem;
  height: 3.2rem;
  background: #222;
  color: #fff;
  cursor: pointer;
  border: 0 none;
  padding: 0;
  outline-offset: 0;

  &:hover {
    background: ${(props) => props.color ?? "#444"};
  }
`;

type PageMetaProps = {
  title: string;
  readingTime?: ReadTimeResults;
  tags?: string[];
};

export function PageMeta({ tags = [], readingTime, title }: PageMetaProps) {
  const router = useRouter();

  const time = Math.ceil(readingTime?.minutes || 1);
  const timeText = `${time} ${time === 1 ? "minute" : "minutes"} read`;

  const shareText = encodeURIComponent(`Design Systems Diary — ${title}`);

  const url = `https://www.designsystemsdiary.com` + router.asPath;
  const shareUrl = encodeURIComponent(url);

  return (
    <Container>
      <div>
        {timeText} —{" "}
        {tags.map((tag, index) => (
          <Fragment key={tag}>
            {index > 0 && ", "}
            <Link href={`/search?tags=${tag}`}>
              <a>{tag}</a>
            </Link>
          </Fragment>
        ))}
      </div>
      <WrapButtons>
        <Button
          as="a"
          href={
            `https://twitter.com/intent/tweet` +
            `?text=${shareText}` +
            `&url=${shareUrl}`
          }
          target="_blank"
          rel="noopen nofollow"
        >
          <TwitterSvg />
        </Button>
        <Button
          as="a"
          href={
            `https://www.linkedin.com/shareArticle` +
            `?url=${shareUrl}` +
            `&title=${shareText}`
          }
          target="_blank"
          rel="noopen nofollow"
        >
          <LinkedInSvg />
        </Button>
        <Button>
          <LinkSvg />
        </Button>
      </WrapButtons>
    </Container>
  );
}
