import express from "express";
import userController from "../controller/user-controller.js";

const publiRouter = express.Router();

publiRouter.post('/api/users', userController.register);
publiRouter.post('/api/users/login', userController.login);

export {
  publiRouter
}