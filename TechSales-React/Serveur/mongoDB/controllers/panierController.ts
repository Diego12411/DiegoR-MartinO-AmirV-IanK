import { Collection, ObjectId } from "mongodb";
import { Panier } from "../models/panier.js";
import { ItemPanier } from "../models/itemPanier.js";

/**
 * Controller pour la collection "panier" de la base de donnees "TechSales"
 */

/**
 * CREATE -- un nouveau panier vide associe a un utilisateur specifique lors de son enregistrement
 * @param collection fait reference a "TechSales.panier"
 * @param userId identification d'un usager specifique
 * @returns la creation d'un nouveau document "panier"
 */
export async function createCart(
  collection: Collection<Panier>,
  userId: ObjectId,
) {
  const newCartForNewUser: Panier = {
    userId: userId,
    items: [],
    modifiedTime: new Date(),
  };

  return await collection.insertOne(newCartForNewUser);
}

/**
 * READ -- get le panier d'un utilisateur specifique
 * @param collection "TechSales.panier"
 * @param userId Id de l'utilisateur associe au panier
 * @returns le panier au complet d'un utilisateur
 */
export async function getCartFromUser(
  collection: Collection<Panier>,
  userId: ObjectId,
): Promise<Panier | null> {
  return await collection.findOne({ userId: userId });
}

// UPDATE
export async function updateCartFromUser(
  collection: Collection<Panier>,
  userId: ObjectId,
) {}

// DELETE
