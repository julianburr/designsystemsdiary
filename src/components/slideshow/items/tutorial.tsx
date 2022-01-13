import Link from "next/link";

type TutorialItemProps = {
  data: {
    slug: string;
    title?: string;
    subtitle?: string;
  };
};

export function TutorialItem({ data }: TutorialItemProps) {
  return (
    <li>
      <Link href={data.slug}>
        <a>
          <h3>{data.title}</h3>
          <p>{data.subtitle}</p>
        </a>
      </Link>
    </li>
  );
}
