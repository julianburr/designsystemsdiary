import { BREAKPOINTS } from "src/theme";
import styled from "styled-components";

const Container = styled.footer`
  text-align: center;
  font-size: 1.2rem;
  color: #888;
  width: 100%;
  max-width: 60rem;
  padding: 1.2rem 1.2rem 5.2rem;
  margin: 0 auto;

  ${BREAKPOINTS.TABLET} {
    padding: 0.6rem 4rem 5.2rem;
  }

  & a {
    color: #888;
  }
`;

export function Footer() {
  return (
    <Container>
      <p>
        You can{" "}
        <a
          href="https://github.com/julianburr/designsystemsdiary/issues/new"
          target="_blank"
          rel="noreferrer nofollow"
        >
          report issues
        </a>{" "}
        and contribute to this website on{" "}
        <a
          href="https://github.com/julianburr/designsystemsdiary"
          target="_blank"
          rel="noreferrer nofollow"
        >
          Github
        </a>
        .
      </p>
      <p>
        If you like what you read, or you share our interests, please share this
        website and{" "}
        <a href="mailto:designsystemsdiary@julianburr.de">let us know</a> what
        you would like to see next, so we can continue build up useful content.
      </p>
      <p>
        &copy; Copyright {new Date().getFullYear()} — Design Systems Diary by
        <a
          href="https://twitter.com/jburr90"
          target="_blank"
          rel="noreferrer nofollow"
        >
          Julian Burr
        </a>
      </p>
    </Container>
  );
}
