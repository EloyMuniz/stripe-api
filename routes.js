import express from "express";
import StripeController from "./src/controllers/StripeController.js";
const apiVersion = "/v1";
const routes = express.Router();
//Rotas que serão utilizadas nas APIs
routes.post(`${apiVersion}/stripe-webhook`, StripeController.handleStripeWebhook);
export default routes;