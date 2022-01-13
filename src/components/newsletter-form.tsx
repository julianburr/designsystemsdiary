import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { useForm } from "react-cool-form";
import { BREAKPOINTS } from "src/theme";

const Wrapper = styled.div<{ align?: string }>`
  width: 100%;
  margin: 0 auto;
  text-align: ${(props) => props.align};

  ${BREAKPOINTS.TABLET} {
    max-width: 45rem;
  }

  p {
    margin: 0;
    padding: 0.6rem 0 1.2rem;
  }
`;

const Container = styled.div<{ layout: string }>`
  width: 100%;
  background: #83ded8;
  padding: 1.6rem;

  form {
    display: grid;
    gap: 0.4rem;
    grid-template-columns: ${(props) =>
      props.layout === "small" ? "1fr" : "auto auto"};
  }

  input {
    border: 0 none;
    background: rgba(255, 255, 255, 0.5);
    height: 3.6rem;
    padding: 0 1.2rem;
  }

  button {
    background: #4ed0c7;
    border: 0 none;
    font-family: Staatliches;
    cursor: pointer;
    height: 3.6rem;
    padding: 0 1.2rem;
    transition: background 0.2s, opacity 0.2s;

    &:hover {
    }

    &[disabled] {
      opacity: 0.4;
    }
  }
`;

const ErrorContainer = styled.div`
  width: 100%;
  background: #f2b6b6;
  padding: 1.6rem;

  button {
    display: inline-block;
    margin: 0;
    padding: 0;
    background: transparent;
    border: 0 none;
    text-decoration: none;
    font-weight: bold;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const SuccessContainer = styled.div`
  width: 100%;
  background: #c8dfaa;
  padding: 1.6rem;
`;

type NewsletterFormProps = {
  align?: string;
  title?: string;
  source?: string;
};

export function NewsletterForm({
  align = "left",
  title = "Want to stay up-to-date?",
  source,
}: NewsletterFormProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>();
  const [error, setError] = useState<string>();

  const router = useRouter();

  const { form } = useForm({
    onSubmit: async (values: any) => {
      setLoading(true);

      try {
        const response = await fetch(
          `${window.location.origin}/api/subscribe`,
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              email: values.email,
              source: source || router.asPath,
            }),
          }
        ).then((res) => res.json());

        if (response.status !== "success") {
          setError(response.message);
          setStatus("error");
          setLoading(false);
        } else {
          setStatus("success");
          setLoading(false);
        }
      } catch (e: any) {
        setError(e.message);
        setStatus("error");
        setLoading(false);
      }
    },
  });

  // A bit hacky, but until CSS container queries are a thing this was the best
  // I could come up with to change the layout of the form based on the container
  // width, so that the component can be used in the main content area as well as
  // the sidebar
  const [layout, setLayout] = useState("large");
  const wrapperRef = useRef<HTMLElement>();
  useEffect(() => {
    const element: any = wrapperRef.current;
    const resizeObserver = new ResizeObserver((entries) => {
      setLayout(entries[0].target.clientWidth < 400 ? "small" : "large");
    });
    resizeObserver.observe(element);
    return () => resizeObserver.unobserve(element);
  }, []);

  return (
    <Wrapper align={align} ref={wrapperRef as any}>
      <h2>{title}</h2>
      <p>
        Simply enter your email adress below to subscribe to our mailing list,
        and we’ll notify you whenever new content is ready.
      </p>

      {status === "error" ? (
        <ErrorContainer>
          {error || "Looks like something went wrong trying to add your email."}{" "}
          <button onClick={() => setStatus(undefined)}>Try again!</button>
        </ErrorContainer>
      ) : status === "success" ? (
        <SuccessContainer>
          <b>Thank you for subscribing, you’re almost done!</b> We’ve sent you
          an email to confirm you’re subscription. Once confirmed, you’ll
          receive notifications from us about new content.
        </SuccessContainer>
      ) : (
        <Container layout={layout}>
          <form ref={form} method="POST">
            <input type="hidden" name="u" value="b3332854e2f6138457fa2e830" />
            <input type="hidden" name="id" value="f25a5ffb08" />
            <input type="hidden" name="SOURCE" value={source} />

            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              required
            />

            <button disabled={loading} type="submit">
              Subscribe
            </button>
          </form>
        </Container>
      )}
    </Wrapper>
  );
}
