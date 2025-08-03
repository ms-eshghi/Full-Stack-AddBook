import express from "express";
import cors, { CorsOptions } from "cors";
import mongoose from "mongoose";
import Books from "./models/books";
import path from "path";

const app = express();
const PORT = process.env.PORT || 1234;


app.use(express.json());

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/books")
.then(async () => {
    console.log("Connected to MongoDB");

    // Ensure 'books' collection exists
    const db = mongoose.connection.db;
    if (!db) {
      console.error("Database not initialized");
      return;
    }

    const collections = await db.listCollections({ name: "books" }).toArray();
    if (collections.length === 0) {
      await db.createCollection("books");
      console.log("Created books collection");
    }
  })
  .catch((err) => console.error("MongoDB connection error:", err));

if (process.env.NODE_ENV === "development") {
  const corsOptions: CorsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });
}


app.post("/api/book", async (req, res) => {
  const { name, author, pages } = req.body;
  const book = new Books({ name, author, pages });
  await book.save();
  res.json(book);
});

app.get("/api/book/:name", async (req, res) => {
  const name = req.params.name;
  const book = await Books.findOne({ name });
  if (!book) return res.status(404).send("Not found");
  res.json(book);
});

if (process.env.NODE_ENV === "test") {
  app.post("/api/test/reset", async (req, res) => {
    await Books.deleteMany({});
    res.status(204).end();
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
