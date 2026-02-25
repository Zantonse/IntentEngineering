import { notFound } from "next/navigation";
import { getReferencePage } from "@/lib/mdx";

export default async function ReferenceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getReferencePage(slug);

  if (!page) notFound();

  return (
    <article>
      <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-2">
        {page.frontmatter.title}
      </h1>
      {page.frontmatter.description && (
        <p className="text-lg text-text-secondary mb-8">
          {page.frontmatter.description}
        </p>
      )}
      <div className="prose-workshop">{page.content}</div>
    </article>
  );
}
