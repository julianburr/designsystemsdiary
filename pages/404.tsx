import { BREAKPOINTS } from "src/theme";
import styled from "styled-components";

const Container = styled.main`
  && {
    padding: 12rem 20%;
    text-align: center;

    ${BREAKPOINTS.TABLET} {
      padding: 20vh 20%;
    }

    h1 {
      font-size: 6rem;
    }

    p {
      font-family: Staatliches;
      margin: 0;
      padding: 0;
    }
  }
`;

export default function Custom404Page() {
  return (
    <Container id="main-content">
      <h1>404</h1>
      <p>This page could not be found.</p>
    </Container>
  );
}
