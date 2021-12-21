import { HTMLProps, PropsWithChildren } from "react";
import styled from "styled-components";

const Button = styled.button`
  display: flex;
  width: 3.2rem;
  height: 3.2rem;
  background: transparent;
  border: 0 none;
  position: relative;
  z-index: 1;

  & span {
    &,
    &:before,
    &:after {
      display: flex;
      width: 3.2rem;
      height: 0.3rem;
      background: currentColor;
      transition: width 0.15s, left 0.15s;
      left: 0;
      position: absolute;
    }

    & {
      top: 50%;
      transform: translateY(-50%);
    }

    &:before,
    &:after {
      content: " ";
      position: absolute;
    }

    &:before {
      top: -0.6rem;
    }

    &:after {
      top: 0.6rem;
    }
  }

  &:hover span {
     {
      &:before,
      &:after {
        width: 2.6rem;
        left: 0.3rem;
      }
    }
  }
`;

export function HamburgerButton(props: any) {
  return (
    <Button {...props}>
      <span />
    </Button>
  );
}
