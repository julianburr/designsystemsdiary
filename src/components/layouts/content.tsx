import { ReactNode } from "react";
import styled from "styled-components";

import { BREAKPOINTS } from "src/theme";

const Container = styled.main`
  display: flex;
  flex-direction: column;

  ${BREAKPOINTS.TABLET} {
    flex-direction: row;
  }
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Right = styled.aside`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 100%;
  margin: 5.2rem 0 0;

  ${BREAKPOINTS.TABLET} {
    width: 26rem;
    margin: 0 0 0 4rem;
  }
`;

type ContentLayoutProps = {
  left: ReactNode;
  right: ReactNode;
};

export function ContentLayout({ left, right }: ContentLayoutProps) {
  return (
    <Container id="main-content">
      <Left>{left}</Left>
      <Right>{right}</Right>
    </Container>
  );
}
