import express, { Request, Response } from "express";
import "dotenv/config";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import http from "http";
import { errorMiddleware } from "./src/middleware/errorHandler";
import { connectToDB } from "./src/utils/helpers";
import router from "./src/routes/index.router";

const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());
// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/v1", router);

app.use(errorMiddleware);

const port=process.env.PORT
connectToDB()
  .then(() => {
    console.log("Connected to DB successfully", process.env.MONGO_URI);

    http.createServer(app).listen(port, () => {
      console.log(`HTTP Server on ${port}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to DB", error);
  });



