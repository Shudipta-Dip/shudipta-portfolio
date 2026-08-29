import { cn } from "@/lib/utils";

type ProjectEmbedProps = {
  url: string;
  title: string;
  className?: string;
  loading?: "lazy" | "eager";
  onLoad?: () => void;
};

export function ProjectEmbed({ url, title, className, loading = "lazy", onLoad }: ProjectEmbedProps) {
  return (
    <iframe
      src={url}
      title={title}
      className={cn("w-full border-0 bg-white", className)}
      loading={loading}
      tabIndex={-1}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; geolocation; gyroscope; picture-in-picture"
      referrerPolicy="no-referrer-when-downgrade"
      onLoad={onLoad}
    />
  );
}
