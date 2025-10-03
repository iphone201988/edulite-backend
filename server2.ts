import express, { Request, Response } from "express";
import "dotenv/config";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import http2 from "http";
import { connectToDB } from "./src/utils/helpers";
import { errorMiddleware } from "./src/middleware/errorHandler";
import router from "./src/routes/index.router";

const app2 = express();

app2.use(express.json());
app2.use(morgan("tiny"));
app2.use(cors());
app2.use("/api/v1", router);
app2.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app2.use(errorMiddleware);

const port=5002

connectToDB()
  .then(() => {
    console.log("Connected to DB successfully", process.env.MONGO_URI);

    http2.createServer(app2).listen(port, () => {
      console.log(`HTTP Server on ${port}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to DB", error);
  });




