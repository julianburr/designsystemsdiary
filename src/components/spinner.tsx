import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% {
    transform: rotate(0deg);
    stroke-dashoffset: ${0.6 * 24}px;
  } 

  50% {
    transform: rotate(720deg);
    stroke-dashoffset: ${Math.PI * 24}px;
  } 

  100% {
    transform: rotate(1080deg);
    stroke-dashoffset: ${0.6 * 24}px;
  }
`;

const Svg = styled.svg`
  width: 24px;
  height: 24px;
  x: 0px;
  y: 0px;
  viewbox: 0 0 24px 24px;
`;

const Circle = styled.circle`
  fill: transparent;
  stroke: #888;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-dasharray: ${Math.PI * 24}px;
  stroke-radius: 2px;
  transform-origin: 12px 12px 0;
  animation: ${spin} 2s linear infinite;
`;

export function Spinner() {
  return (
    <Svg>
      <Circle cx={12} cy={12} r={11} />
    </Svg>
  );
}
