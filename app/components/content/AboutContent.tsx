import Image from "next/image";

type Props = {
  paragraphs: string[];
  /** "page" shows the large photo (/about); "bubble" shows a small round avatar (speech bubble in the room). */
  variant: "page" | "bubble";
};

// Shared by the person's speech bubble in the room and the /about page.
export default function AboutContent({ paragraphs, variant }: Props) {
  if (variant === "bubble") {
    return (
      <div className="flex items-start gap-4">
        <Image
          src="/images/avatar.webp"
          alt="Photo of Akid"
          width={64}
          height={64}
          loading="lazy"
          className="h-16 w-16 shrink-0 rounded-full object-cover"
        />
        <div className="space-y-2 text-sm leading-relaxed sm:text-base">
          {paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
      <Image
        src="/images/Akid_RAW.jpg"
        alt="Photo of Akid"
        width={1080}
        height={1920}
        sizes="(max-width: 768px) 60vw, 320px"
        className="aspect-square w-60 shrink-0 rounded-2xl object-cover md:w-80"
        priority
      />
      <div className="space-y-4 text-lg leading-relaxed text-ink">
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </div>
  );
}
