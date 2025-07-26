import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./App.css"

function App() {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [pages, setPages] = useState<number>(0);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, author, pages }),
    });
    if (res.ok) navigate(`/book/${encodeURIComponent(name)}`);
  };

  return (
    <form onSubmit={handleSubmit}>
       <h1>books</h1>
      <label htmlFor="name">Name: </label>
      <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        <br />
      <label htmlFor="author">Author: </label>
      <input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <br />
     <label htmlFor="pages">Pages: </label>
      <input id="pages" type="number" value={pages} onChange={(e) => setPages(+e.target.value)} />
      <br />
      <input id="submit" type="submit" value="Submit" />
    </form>
  );
}
export default App;
