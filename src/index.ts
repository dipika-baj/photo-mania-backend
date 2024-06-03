import express from "express";
import dotenv from "dotenv";
import { routers } from "./route";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

Object.entries(routers).forEach(([route, router]) => {
  app.use(`/api/${route}`, router);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
