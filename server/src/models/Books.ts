import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  name: String,
  author: String,
  pages: Number,
});

export default mongoose.model("Books", BookSchema);
