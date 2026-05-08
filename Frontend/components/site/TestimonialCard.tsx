export default function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <figure className="rounded-xl border bg-background p-6 shadow-sm">
      <blockquote className="text-sm text-foreground/90">“{quote}”</blockquote>
      <figcaption className="mt-4 text-sm font-semibold">
        {author}
        <span className="ml-2 font-normal text-muted-foreground">{role}</span>
      </figcaption>
    </figure>
  );
}
