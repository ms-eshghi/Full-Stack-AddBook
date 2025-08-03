import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import Books from "./models/books";

const app = express();
const router = express.Router();
const PORT = process.env.PORT || 1234;

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/books")
  .then(async () => {
    console.log("Connected to MongoDB");
    const db = mongoose.connection.db;
    if (!db) return console.error("No DB connection");

    const collections = await db.listCollections({ name: "books" }).toArray();
    if (collections.length === 0) {
      await db.createCollection("books");
      console.log("Created books collection");
    }
  })
  .catch(err => console.error("Mongo error:", err));

// CORS for development
if (process.env.NODE_ENV === "development") {
  const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
}

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });
}

// Define routes WITHOUT '/api' prefix here because router is mounted on '/api'
router.post("/book", async (req, res) => {
  const { name, author, pages } = req.body;
  const book = new Books({ name, author, pages });
  await book.save();
  res.json(book);
});

router.get("/book/:name", async (req, res) => {
  const book = await Books.findOne({ name: req.params.name });
  if (!book) return res.status(404).send("Not found");
  res.json(book);
});

if (process.env.NODE_ENV === "test") {
  router.post("/test/reset", async (req, res) => {
    await Books.deleteMany({});
    res.status(204).end();
  });
}

// Mount the router under '/api'
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
