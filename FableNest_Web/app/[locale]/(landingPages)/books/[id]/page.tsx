import BookDetails from "@/components/landingPages/bookPage/BookDetails";
import { booksData } from "@/components/landingPages/bookPage/bookData";
import CreateBookSection from "@/components/landingPages/homePage/CreateBookSection";
import { notFound } from "next/navigation";

export default async function BookDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const book = booksData.find((b) => b.id === id);

  if (!book) {
    notFound();
  }

  return <div><div className="mt-20 sm:mt-28 md:mt-36 lg:mt-[200px]"><BookDetails book={book} /></div>   <div className="mt-10 sm:mt-12 md:mt-14 lg:mt-[120px]"><CreateBookSection /></div></div>;
}

