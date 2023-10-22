import express from "express";
import { publiRouter } from "../route/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { userRouter } from "../route/api.js";

export const web = express();

// middleware parse json
web.use(express.json());

// daftarkan public router
web.use(publiRouter);

// daftarkan user router
web.use(userRouter);

// daftarkan middleware error handling
web.use(errorMiddleware);