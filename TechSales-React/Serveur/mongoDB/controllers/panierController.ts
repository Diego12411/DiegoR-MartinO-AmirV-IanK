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

/**
 * UPDATE -- ajout d'un item dans le panier
 * @param collection "TechSales.panier"
 * @param userId id de l'utilisateur
 * @param item nouvel item a rajouter au panier
 * @returns l'ajout d'un nouvel item dans le array "items" du panier de l'utilisateur
 */
export async function addNewItemToCart(
  collection: Collection<Panier>,
  userId: ObjectId,
  item: ItemPanier,
) {
  return await collection.updateOne(
    { userId: userId },
    {
      $push: { items: item },
      $set: { modifiedTime: new Date() },
    },
  );
}

/**
 * UPDATE -- retrait d'un element du panier
 * @param collection "TechSales.panier"
 * @param userId id de l'utilisateur
 * @param productId id du produit a retirer
 * @returns retrait de l'"item" du panier de l'utilisateur
 */
export async function removeItemFromCart(
  collection: Collection<Panier>,
  userId: ObjectId,
  productId: ObjectId,
) {
  return await collection.updateOne(
    { userId: userId },
    {
      $pull: { items: { productId: productId } },
      $set: { modifiedTime: new Date() },
    },
  );
}

// UPDATE -- modification de la quantite d'un item

// DELETE -- aka on vide le panier lorsque la commande est passee
