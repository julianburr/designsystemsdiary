import { ReactNode, Ref, useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Placement } from "@popperjs/core";
import { usePopper } from "react-popper";
import styled from "styled-components";

const Container = styled.div`
  padding: 0.9rem;
  background: #222;
  color: #fff;
  font-size: 1.2rem;
  position: relative;
  filter: drop-shadow(0 0 1rem rgba(0, 0, 0, 0.25));
`;

const Arrow = styled.div`
  visibility: hidden;

  &:before {
    visibility: visible;
    content: " ";
    transform: rotate(45deg);
  }

  &,
  &:before {
    position: absolute;
    width: 0.6rem;
    height: 0.6rem;
    background: #222;
  }

  [data-popper-placement^="top"] > & {
    bottom: -0.3rem;
  }

  [data-popper-placement^="bottom"] > & {
    top: -0.3rem;
  }

  [data-popper-placement^="left"] > & {
    right: -0.3rem;
  }

  [data-popper-placement^="right"] > & {
    left: -0.3rem;
  }
`;

type UpdateFn = () => any;

type ChildrenProps = {
  elementRef: Ref<any>;
  onMouseOver: (e: any) => void;
  onMouseLeave: (e: any) => void;
  update: UpdateFn | null;
};

type TooltipProps = {
  children: (props: ChildrenProps) => JSX.Element;
  content: ReactNode;
  placement?: Placement;
};

// Storing the current callback independent from the component instance
// to be able to ensure that only one tooltip is ever visible at the
// same time
let currentCallback: any = null;

export function Tooltip({
  children,
  content,
  placement = "top",
}: TooltipProps) {
  const showTimer = useRef<any>();
  const hideTimer = useRef<any>();

  const [visible, setVisible] = useState(false);

  const [element, setElement] = useState(null);

  const [popper, setPopper] = useState(null);
  const [arrow, setArrow] = useState(null);
  const { styles, attributes, update } = usePopper(element, popper, {
    placement,
    modifiers: [
      {
        name: "arrow",
        options: {
          element: arrow,
        },
      },
      {
        name: "offset",
        options: {
          offset: [0, 8],
        },
      },
    ],
  });

  const handleMouseOver = useCallback(() => {
    clearTimeout(hideTimer.current);

    if (currentCallback) {
      currentCallback();
      setVisible(true);
    } else {
      showTimer.current = setTimeout(() => {
        setVisible(true);
        currentCallback = () => setVisible(false);
      }, 300);
    }

    currentCallback = () => setVisible(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(showTimer.current);

    hideTimer.current = setTimeout(() => {
      setVisible(false);
    }, 500);
  }, []);

  return (
    <>
      {children({
        elementRef: setElement,
        onMouseOver: handleMouseOver,
        onMouseLeave: handleMouseLeave,
        update,
      })}

      {visible &&
        createPortal(
          <Container
            ref={setPopper as any}
            role="tooltip"
            style={styles.popper}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            {...attributes.popper}
          >
            <div>{content}</div>
            <Arrow
              data-popper-arrow
              ref={setArrow as any}
              style={styles.arrow}
            />
          </Container>,
          window.document.body
        )}
    </>
  );
}
