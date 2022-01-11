import styled from "styled-components";

const Figure = styled.figure`
  width: 100%;
  max-width: 68rem;
  margin: 3.2rem auto;
  padding: 0;

  a {
    display: flex;
  }

  img {
    width: 100%;
    height: auto;
  }

  figcaption {
    font-size: 1.2rem;
    color: #ccc;
    text-align: center;
    padding: 0 10%;
    margin: 0.6rem 0 0;
  }
`;

export function Image(props: any) {
  return (
    <Figure>
      <a href={props.src} target="_blank" rel="noreferrer nofollow">
        <img {...props} role="presentation" />
      </a>
      <figcaption>{props.alt}</figcaption>
    </Figure>
  );
}
