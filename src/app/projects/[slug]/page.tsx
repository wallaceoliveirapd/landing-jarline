import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import ProjectDetail from "./ProjectDetail";

export const dynamic = "force-dynamic";

function resolveImgUrl(storageId?: string | null): string | undefined {
  if (!storageId) return undefined;
  if (storageId.startsWith("http")) return storageId;
  return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${storageId}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const project = await fetchQuery(api.projects.getProjectBySlug, { slug });

    if (!project || project.status !== "published") {
      return { title: "Projeto não encontrado" };
    }

    const title = project.seoTitle || project.title;
    const description = project.seoDescription || project.summary || "";
    const ogImage =
      resolveImgUrl(project.seoImage) ||
      resolveImgUrl(project.coverImage);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: ogImage ? [ogImage] : [],
      },
    };
  } catch {
    return { title: "Projeto" };
  }
}

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <ProjectDetail params={params} />;
}
