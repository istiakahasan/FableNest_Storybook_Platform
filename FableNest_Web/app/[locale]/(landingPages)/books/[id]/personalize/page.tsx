import PersonalizeBook from "@/components/landingPages/bookPage/PersonalizeBook";
import { booksData } from "@/components/landingPages/bookPage/bookData";
import { notFound } from "next/navigation";

export default async function PersonalizeBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = booksData.find((b) => b.id === id);

  if (!book) {
    notFound();
  }

  return <PersonalizeBook book={book} />;
}

