import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import PageView from "./PageView";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const page = await fetchQuery(api.pages.getPageBySlug, { slug });

    if (!page || page.status !== "published") {
      return { title: "Página não encontrada" };
    }

    const title = page.seoTitle || page.title;
    const description = page.seoDescription || page.description || "";

    let ogImage: string | undefined;
    if (page.seoImage) {
      if (page.seoImage.startsWith("http")) {
        ogImage = page.seoImage;
      } else {
        const resolved = await fetchQuery(api.files.getImageUrl, {
          storageId: page.seoImage,
        });
        ogImage = resolved ?? undefined;
      }
    }

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
    return { title: "Página" };
  }
}

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <PageView params={params} />;
}
