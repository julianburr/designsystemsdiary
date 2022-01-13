import { Fragment, useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import { ReadTimeResults } from "reading-time";

import { Tooltip } from "src/components/tooltip";

import TwitterSvg from "src/assets/icons/twitter.svg";
import LinkedInSvg from "src/assets/icons/linkedin.svg";
import LinkSvg from "src/assets/icons/link.svg";
import HeartSvg from "src/assets/icons/heart.svg";

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

const Button = styled(({ as: As, ...props }) => <As {...props} />)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.2rem;
  height: 3.2rem;
  background: #ccc;
  color: #222;
  cursor: pointer;
  border: 0 none;
  padding: 0;
  outline-offset: 0;
  transition: background 0.2s, color 0.2s;

  &:hover,
  &.active {
    color: #fff;
    background: ${(props) => props.color ?? "#222"};
  }
`;

const Spacer = styled.div`
  width: 0.4rem;
  height: 0.1rem;
`;

const CopyInput = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;

type UpdateFn = () => any;

type PageMetaProps = {
  title: string;
  readingTime?: ReadTimeResults;
  tags?: string[];
};

let copyTimer: any = null;

export function PageMeta({ tags = [], readingTime, title }: PageMetaProps) {
  const router = useRouter();

  const copyInputRef = useRef();

  const time = Math.ceil(readingTime?.minutes || 1);
  const timeText = `${time} ${time === 1 ? "minute" : "minutes"} read`;

  const shareText = encodeURIComponent(`Design Systems Diary — ${title}`);

  const url = `https://www.designsystemsdiary.com` + router.asPath;
  const shareUrl = encodeURIComponent(url);

  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback((updateTooltipPosition: UpdateFn | null) => {
    clearTimeout(copyTimer);
    setCopied(true);
    updateTooltipPosition?.();

    const copyText: any = copyInputRef.current;
    copyText.select();
    document.execCommand("copy");

    copyTimer = setTimeout(() => {
      setCopied(false);
      updateTooltipPosition?.();
    }, 3000);
  }, []);

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
        <Tooltip content="Share on Twitter">
          {({ elementRef, ...props }) => (
            <Button
              {...props}
              ref={elementRef}
              as="a"
              color="#1d9bf1"
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
          )}
        </Tooltip>
        <Tooltip content="Share on LinkedIn">
          {({ elementRef, ...props }) => (
            <Button
              {...props}
              ref={elementRef}
              as="a"
              color="#0b66c2"
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
          )}
        </Tooltip>

        <Spacer />

        <CopyInput
          ref={copyInputRef as any}
          tabIndex={-1}
          type="text"
          value={
            typeof window !== "undefined" ? window.location.href : undefined
          }
        />
        <Tooltip content={copied ? "Copied to clipboard" : "Copy link"}>
          {({ elementRef, update, ...props }) => (
            <Button
              {...props}
              onClick={() => handleCopy(update)}
              ref={elementRef}
              as="button"
            >
              <LinkSvg />
            </Button>
          )}
        </Tooltip>

        <Spacer />

        <Tooltip content="Add to favorites">
          {({ elementRef, ...props }) => (
            <Button
              {...props}
              onClick={() => alert("Favorites not implemented yet!")}
              ref={elementRef}
              as="button"
              color="#c87462"
            >
              <HeartSvg />
            </Button>
          )}
        </Tooltip>
      </WrapButtons>
    </Container>
  );
}
