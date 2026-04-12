import { getTypeImageSrc } from "@/lib/result-media";

type ResultPosterProps = {
  code: string;
  cn: string;
  intro: string;
};

export function ResultPoster({ code, cn, intro }: ResultPosterProps) {
  const imageSrc = getTypeImageSrc(code);

  if (!imageSrc) {
    return null;
  }

  return (
    <figure className="result-poster">
      <img className="result-poster__image" src={imageSrc} alt={`${code} ${cn}`} />
      <figcaption className="result-poster__caption">{intro}</figcaption>
    </figure>
  );
}
