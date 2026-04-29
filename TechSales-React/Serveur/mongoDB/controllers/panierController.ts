import { Collection, ObjectId, UpdateResult } from "mongodb";
import { ItemPanier } from "../models/itemPanier.js";
import { Utilisateur } from "../models/utilisateur.js";

/**
 * Controller pour la collection "panier" de la base de donnees "TechSales"
 */

/**
 * READ -- get le panier d'un utilisateur specifique
 * @param collection "TechSales.utilisateur"
 * @param utilisateurId Id de l'utilisateur associe au panier
 * @returns le panier au complet d'un utilisateur sous forme de array
 */
export async function demandePanierUtilisateur(
  collection: Collection<Utilisateur>,
  utilisateurId: ObjectId,
): Promise<ItemPanier[] | null> {
  const utilisateur = await collection.findOne(
    { _id: utilisateurId },
    { projection: { panier: 1 } },
  );

  return utilisateur ? utilisateur.panier : null;
}

/**
 * UPDATE -- ajout d'un item dans le panier d'un utilisateur
 * @param collection "TechSales.utilisateur"
 * @param utilisateurId id de l'utilisateur
 * @param item nouvel ItemPanier a rajouter au panier
 * @returns l'ajout d'un nouvel ItemPanier dans le array "panier" de l'utilisateur
 */
export async function ajoutItemPanier(
  collection: Collection<Utilisateur>,
  utilisateurId: ObjectId,
  item: ItemPanier,
): Promise<UpdateResult<Utilisateur>> {
  return await collection.updateOne(
    { _id: utilisateurId },
    {
      $push: { panier: item },
    },
  );
}

/**
 * UPDATE -- retrait d'un element du panier
 * @param collection "TechSales.utilisateur"
 * @param utilisateurId id de l'utilisateur
 * @param produitId id du produit a retirer
 * @returns retrait de l'ItemPanier du panier de l'utilisateur
 */
export async function retraitItemPanier(
  collection: Collection<Utilisateur>,
  utilisateurId: ObjectId,
  produitId: ObjectId,
): Promise<UpdateResult<Utilisateur>> {
  return await collection.updateOne(
    { _id: utilisateurId },
    {
      $pull: { panier: { produitId: produitId } },
    },
  );
}

/**
 * GET -- verifie s'il existe un item specifique dans le panier de l'utilisateur
 * @param collection "TechSales.utilisateur"
 * @param utilisateurId id de l'utilsateur
 * @param produitId id de l'ItemPanier contenu dans le panier
 * @returns l'item qui concorde avec le produitId en params
 */
export async function verifierExistenceItem(
  collection: Collection<Utilisateur>,
  utilisateurId: ObjectId,
  produitId: ObjectId,
): Promise<Utilisateur | null> {
  return await collection.findOne({
    _id: utilisateurId,
    "panier.produitId": produitId,
  });
}

//
/**
 * UPDATE -- modification de la quantite d'un item
 * @param collection "TechSales.utilisateur"
 * @param utilisateurId id de l'utilisateur
 * @param produitId id de l'ItemPanier a modifier
 * @param nouvelleQuantite nouvelle quantite
 * @returns update de la quantite dans le panier d'un utilisateur
 */
export async function miseAJourQuantiteItem(
  collection: Collection<Utilisateur>,
  utilisateurId: ObjectId,
  produitId: ObjectId,
  nouvelleQuantite: number,
): Promise<UpdateResult<Utilisateur>> {
  return await collection.updateOne(
    { _id: utilisateurId, "panier.produitId": produitId },
    {
      $set: {
        "panier.$.quantite": nouvelleQuantite,
      },
    },
  );
}

//
/**
 * DELETE -- on vide le panier lorsque lors d'une commande
 * @param collection "TechSales.utilisateur"
 * @param utilisateurId id de l'utilisateur
 * @returns vide le array panier de l'utilisateur
 */
export async function viderPanier(
  collection: Collection<Utilisateur>,
  utilisateurId: ObjectId,
): Promise<UpdateResult<Utilisateur>> {
  return await collection.updateOne(
    { _id: utilisateurId },
    {
      $set: {
        panier: [],
      },
    },
  );
}
