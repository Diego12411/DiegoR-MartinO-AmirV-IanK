import { Router, Request, Response } from "express";
import {
  createCart,
  getCartFromUser,
  addNewItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  clearCart,
} from "../controllers/panierController.js";
import { getPaniers } from "../db/mongo.js";
import { Panier } from "../models/panier.js";
import { ObjectId } from "mongodb";

const router = Router();

// Test des endpoins avec le serveur
router.get("/testTest", async (req: Request, res: Response) => {
  res.send("Endpond test reussi!!");
});

export default router;
