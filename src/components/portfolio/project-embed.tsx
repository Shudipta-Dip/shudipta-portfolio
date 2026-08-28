import { cn } from "@/lib/utils";

type ProjectEmbedProps = {
  url: string;
  title: string;
  className?: string;
};

export function ProjectEmbed({ url, title, className }: ProjectEmbedProps) {
  return (
    <iframe
      src={url}
      title={title}
      className={cn("w-full border-0 bg-white", className)}
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; geolocation; gyroscope; picture-in-picture"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
