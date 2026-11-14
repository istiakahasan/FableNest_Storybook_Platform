import BookPreview from "@/components/landingPages/bookPage/BookPreview";
import { booksData } from "@/components/landingPages/bookPage/bookData";
import { notFound } from "next/navigation";

export default async function BookPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ childName?: string; age?: string; language?: string; gender?: string }>;
}) {
  const { id } = await params;
  const search = await searchParams;
  const book = booksData.find((b) => b.id === id);

  if (!book) {
    notFound();
  }

  return (
    <BookPreview
      book={book}
      childName={search.childName || "Rakib"}
      age={search.age || "6"}
      language={search.language || "English"}
      gender={search.gender || ""}
    />
  );
}

