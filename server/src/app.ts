import express from "express";
import cors, { CorsOptions } from "cors";
import mongoose from "mongoose";
import Book from "./models/Book.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 1234;

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  const corsOption: CorsOptions={
    origin: 'http://localhost:3000',
    optionsSuccessStatus:200
  }
  app.use(cors(corsOption ));
} 
if (process.env.NODE_ENV === "production") {

  app.use(express.static(path.resolve('../..','client','build')));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve('../..','client','build','index.html'));
  });
}

mongoose.connect("mongodb://localhost:27017/books");

app.post("/api/book", async (req, res) => {
  const { name, author, pages } = req.body;
  const book = new Book({ name, author, pages });
  await book.save();
  res.json(book);
});

app.get("/api/book/:name", async (req, res) => {
  const name = req.params.name;
  const book = await Book.findOne({ name });
  if (!book) return res.status(404).send("Not found");
  res.json(book);
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
