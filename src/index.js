import "dotenv/config";
import express from "express";

import session from "express-session";
import MongoStore from "connect-mongo";
import connectDB from "../config/database";
import rootRouter from "./routes/root-router";
import userRouter from "./routes/user-router";
import videoRouter from "./routes/video-router";
import morgan from "morgan";

const app = express();
const logger = morgan("dev");
connectDB();

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/uploads", express.static("uploads"));

const port = 3000; // Choose your desired port number
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
