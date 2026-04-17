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
export async function creationNouveauPanier(
  collection: Collection<Panier>,
  userId: ObjectId,
) {
  const nouveauPanier: Panier = {
    utilisateurId: userId,
    items: [],
    modificationTemps: new Date(),
  };

  return await collection.insertOne(nouveauPanier);
}

/**
 * READ -- get le panier d'un utilisateur specifique
 * @param collection "TechSales.panier"
 * @param utilisateurId Id de l'utilisateur associe au panier
 * @returns le panier au complet d'un utilisateur
 */
export async function demandePanierUtilisateur(
  collection: Collection<Panier>,
  utilisateurId: ObjectId,
): Promise<Panier | null> {
  return await collection.findOne({ utilisateurId: utilisateurId });
}

/**
 * UPDATE -- ajout d'un item dans le panier
 * @param collection "TechSales.panier"
 * @param utilisateurId id de l'utilisateur
 * @param item nouvel item a rajouter au panier
 * @returns l'ajout d'un nouvel item dans le array "items" du panier de l'utilisateur
 */
export async function ajoutItemPanier(
  collection: Collection<Panier>,
  utilisateurId: ObjectId,
  item: ItemPanier,
) {
  return await collection.updateOne(
    { utilisateurId: utilisateurId },
    {
      $push: { items: item },
      $set: { modificationTemps: new Date() },
    },
  );
}

/**
 * UPDATE -- retrait d'un element du panier
 * @param collection "TechSales.panier"
 * @param utilisateurId id de l'utilisateur
 * @param produitId id du produit a retirer
 * @returns retrait de l'"item" du panier de l'utilisateur
 */
export async function retraitItemPanier(
  collection: Collection<Panier>,
  utilisateurId: ObjectId,
  produitId: ObjectId,
) {
  return await collection.updateOne(
    { utilisateurId: utilisateurId },
    {
      $pull: { items: { produitId: produitId } },
      $set: { modificationTemps: new Date() },
    },
  );
}

/**
 * GET -- verifie s'il existe un item specifique dans le panier de l'utilisateur
 * @param collection "TechSales.panier"
 * @param utilisateurId id de l'utilsateur
 * @param produitId id de l'item dans le panier
 * @returns l'item qui concorde avec le produitId en params
 */
export async function verifierExistenceItem(
  collection: Collection<Panier>,
  utilisateurId: ObjectId,
  produitId: ObjectId,
): Promise<Panier | null> {
  return await collection.findOne({
    utilisateurId: utilisateurId,
    "items.produitId": produitId,
  });
}

//
/**
 * UPDATE -- modification de la quantite d'un item
 * @param collection "TechSales.panier"
 * @param utilisateurId id de l'utilisateur
 * @param produitId id du produit vise
 * @param nouvelleQuantite nouvelle quantite
 * @returns update de la quantite dans le panier d'un utilisateur
 */
export async function miseAJourQuantiteItem(
  collection: Collection<Panier>,
  utilisateurId: ObjectId,
  produitId: ObjectId,
  nouvelleQuantite: number,
) {
  return await collection.updateOne(
    { utilisateurId: utilisateurId, "items.produitId": produitId },
    {
      $set: {
        "items.$.quantite": nouvelleQuantite,
        modificationTemps: new Date(),
      },
    },
  );
}

//
/**
 * DELETE -- on vide le panier lorsque la commande est passee
 * @param collection "TechSales.panier"
 * @param utilisateurId id de l'utilisateur
 * @returns vide le array "items" contenant les items selectionne par l'utilisateur
 */
export async function viderPanier(
  collection: Collection<Panier>,
  utilisateurId: ObjectId,
) {
  return await collection.updateOne(
    { utilisateurId: utilisateurId },
    {
      $set: {
        items: [],
        modificationTemps: new Date(),
      },
    },
  );
}
