import styled from "styled-components";

const Placeholder = styled.p`
  margin: 3.2rem 0 0;

  span {
    color: #f4f4f4;
    background: #f4f4f4;
    line-height: 1.6;
  }
`;

export function SkeletonText() {
  return (
    <Placeholder role="presentation">
      <span>
        Bacon ipsum dolor amet meatloaf cupim pig, rump tongue prosciutto jerky
        filet mignon spare ribs turducken pancetta landjaeger fatback. Shank
        shoulder fatback, rump jowl bacon turkey shankle filet mignon chislic.
        Filet mignon chuck swine meatball corned beef flank ham beef ground
        round t-bone frankfurter andouille salami pork belly rump. Cupim tail
        rump, swine boudin doner picanha pancetta short ribs salami jerky
        alcatra ham chicken tenderloin.
      </span>
    </Placeholder>
  );
}
