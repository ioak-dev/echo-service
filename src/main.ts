if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => {
    process.exit();
  });
}

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { initializeSequences } from "./startup";
var ApiRoute = require("./route");

const databaseUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
mongoose.connect(databaseUri, {});
mongoose.pluralize(undefined);

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json({ limit: 5000000 }));
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Routes
app.get("/hello", (_: any, res: any) => {
  res.send(
    "basic connection to server works. database connection is not validated"
  );
  res.end();
});

app.use("/api", ApiRoute);

// 404 Handler
app.use((_: any, res: any) => {
  res.status(404);
  res.send("Not found");
  res.end();
});

// Error Handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Error:", err);
  res.status(500).send(err.stack);
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});

// Startup scripts
initializeSequences();
