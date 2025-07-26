import { useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

function BookPage() {
  const { name } = useParams();
  const [book, setBook] = useState<any | null | undefined>(null);

  useEffect(() => {
    fetch(`/api/book/${encodeURIComponent(name || "")}`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Book not found");
        }
        return res.json();
      })
      .then(data => setBook(data))
      .catch(() => setBook(undefined));
  }, [name]);

  if (book === null) return <div>Loading...</div>;
  if (book === undefined) return <Navigate to="/notfound" />;

  return (
    <div>
      <h1>{book.name}</h1>
      <p>Author: {book.author}</p>
      <p>Pages: {book.pages}</p>
    </div>
  );
}

export default BookPage;
