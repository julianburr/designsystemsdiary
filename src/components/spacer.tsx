import styled from "styled-components";

export const Spacer = styled.div<{
  height?: string | number;
  width?: string | number;
}>`
  width: ${(props) => props.width ?? ".1rem"};
  height: ${(props) => props.height ?? ".1rem"};
`;
