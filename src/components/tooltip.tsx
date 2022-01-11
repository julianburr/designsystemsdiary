import {
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
  onFocus: (e: any) => void;
  onBlur: (e: any) => void;
  "aria-describedy": string;
  update: UpdateFn | null;
};

type TooltipProps = {
  children: (props: ChildrenProps) => JSX.Element;
  content: ReactNode;
  placement?: Placement;
  portalTarget?: HTMLElement;
};

// Used to give tooltips a unique ID
let uuid = 0;

// Storing the current callback independent from the component instance
// to be able to ensure that only one tooltip is ever visible at the
// same time
let currentCallback: any = null;

export function Tooltip({
  children,
  content,
  placement = "top",
  portalTarget,
}: TooltipProps) {
  const [instanceUuid] = useState(++uuid);

  // Component instance specific timers to deal with show and hide delays
  const showTimer = useRef<any>();
  const hideTimer = useRef<any>();

  // Internal state keeping track of visibility of tooltip
  const [visible, setVisible] = useState(false);

  // Initialise popper
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

  // Show tooltip
  const handleShow = useCallback((e) => {
    clearTimeout(hideTimer.current);

    if (e.type === "focus" || currentCallback) {
      // On focus, or when another tooltip is currently visibly, we want
      // to show the new tooltip immediately
      currentCallback?.();
      setVisible(true);
    } else {
      showTimer.current = setTimeout(() => {
        setVisible(true);
        currentCallback = () => setVisible(false);
      }, 300);
    }

    currentCallback = () => setVisible(false);
  }, []);

  // Helper to hide tooltip
  const handleHide = useCallback((e) => {
    clearTimeout(showTimer.current);

    if (e.type === "blur") {
      // On blur we want to hide immediately
      setVisible(false);
    } else {
      hideTimer.current = setTimeout(() => {
        setVisible(false);
      }, 500);
    }
  }, []);

  // Tooltips should also close when the user presses the `esc` key
  // so we register an event listener whenever the visible state is true
  useEffect(() => {
    function handleKeydown(e: any) {
      if (e.key === "Escape") {
        setVisible(false);
      }
    }

    if (visible) {
      window.document.addEventListener("keydown", handleKeydown);
      return () =>
        window.document.removeEventListener("keydown", handleKeydown);
    }
  }, [visible]);

  return (
    <>
      {children({
        elementRef: setElement,
        onMouseOver: handleShow,
        onMouseLeave: handleHide,
        onFocus: handleShow,
        onBlur: handleHide,
        "aria-describedy": `tooltip-${instanceUuid}`,
        update,
      })}

      {visible &&
        createPortal(
          <Container
            ref={setPopper as any}
            id={`tooltip-${instanceUuid}`}
            role="tooltip"
            style={styles.popper}
            onMouseOver={handleShow}
            onMouseLeave={handleHide}
            {...attributes.popper}
          >
            <div>{content}</div>
            <Arrow
              data-popper-arrow
              ref={setArrow as any}
              style={styles.arrow}
            />
          </Container>,
          portalTarget || window.document.body
        )}
    </>
  );
}