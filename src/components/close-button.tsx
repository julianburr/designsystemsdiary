import { HTMLProps, PropsWithChildren } from "react";
import styled from "styled-components";

const Button = styled.button`
  display: flex;
  width: 3.2rem;
  height: 3.2rem;
  border: 0 none;
  position: relative;
  background: transparent;
  z-index: 1;

  & span {
    &:before,
    &:after {
      content: " ";
      position: absolute;
      left: 50%;
      top: 50%;
      width: 3.2rem;
      height: 0.3rem;
      background: currentColor;
      transition: transform 0.2s, width 0.2s;
      transform-origin: center center;
    }

    &:before {
      transform: translate3d(-50%, -50%, 0) rotate(45deg);
    }

    &:after {
      transform: translate3d(-50%, -50%, 0) rotate(-45deg);
    }
  }

  &:hover span {
    &:before,
    &:after {
      width: 2.9rem;
    }
  }
`;

export function CloseButton(props: any) {
  return (
    <Button {...props}>
      <span />
    </Button>
  );
}
