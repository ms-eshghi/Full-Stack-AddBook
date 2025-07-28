import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  name: String,
  author: String,
  pages: Number,
});

const Books = mongoose.model("books", BookSchema); // explicitly use "books"

export default Books;