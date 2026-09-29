import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "server is running fine!" });
});

export default app;
