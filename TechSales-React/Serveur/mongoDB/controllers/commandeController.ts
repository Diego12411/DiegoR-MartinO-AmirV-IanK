import { Collection, ObjectId } from "mongodb";
import { Commande, Statut, STATUTS } from "../models/commande.js";
import { ItemAchat } from "../models/itemAchat.js";
import { Utilisateurv2 } from "../models/utilisateurv2.js";
import { Produit } from "../models/produit.js";
import { getPrixProduit } from "../controllers/produitController.js";

/**
 * Controller pour la collection "commande" de la base de donnees "TechSales"
 */

/**
 * CREATE -- Creation d'une nouvelle commande a partir du panier de l'utilisateur
 * @param collectionCommande
 * @param collectionUtilisateur
 * @param collectionProduit
 * @param utilisateurId
 * @returns le id de la nouvelle commande cree
 */
export async function creationCommande(
  collectionCommande: Collection<Commande>,
  collectionUtilisateur: Collection<Utilisateurv2>,
  collectionProduit: Collection<Produit>,
  utilisateurId: ObjectId,
): Promise<ObjectId | null> {
  //On recupere l'utilisateur specifique dans la base de donnees
  const utilisateur = await collectionUtilisateur.findOne({
    _id: utilisateurId,
  });
  // Si l'utilisateur n'existe pas ou que le panier est vide, on return null
  if (!utilisateur || utilisateur.panier.length === 0) {
    return null;
  }

  // Convertir ItemPanier[] en ItemAchat[]
  const achat: ItemAchat[] = await Promise.all(
    utilisateur.panier.map(async (item) => {
      const prix = await getPrixProduit(collectionProduit, item.produitId);
      return {
        produitId: item.produitId,
        quantite: item.quantite,
        prix: prix ?? 0,
      };
    }),
  );

  // Creation de la commande
  const nouvelleCommande: Commande = {
    utilisateurId: utilisateurId,
    achat: achat,
    statut: STATUTS.COMMANDE_RECU,
    dateAchat: new Date(),
    dateModification: new Date(),
  };

  const resultatCommande = await collectionCommande.insertOne(nouvelleCommande);

  // On doit vider le panier de l'utilisateur aka remettre un panier vide
  await collectionUtilisateur.updateOne(
    { _id: utilisateurId },
    { $set: { panier: [] } },
  );

  // On return le _id cree de la nouvelle commande
  return resultatCommande.insertedId;
}

/**
 * READ -- Retourne tous les commandes appertenant a un utilisateur
 * @param collection reference a "TechSales.commande"
 * @param utilisateur le _id d'un utilsateur specifique
 * @returns un array contenant toutes les commandes d'un utilisateur
 */
export async function obtenirCommandesParUtilisateur(
  collection: Collection<Commande>,
  utilisateur: ObjectId,
): Promise<Commande[] | null> {
  return await collection.find({ _id: utilisateur }).toArray();
}

/**
 * READ -- Permet d'obtenir toutes les commandes passees
 * @param collection reference a "TechSales.commande"
 * @returns
 */
export async function obtenirToutesCommandes(
  collection: Collection<Commande>,
): Promise<Commande[] | null> {
  return await collection.find().toArray();
}

/**
 * UPDATE -- Met a jour le statut d'une commande
 * @param collection reference a "TechSales.commande"
 * @param commande le id d'une commande en particulier
 * @param statut le nouvel statut de la commande
 * @returns un boolean verifiant si le changement a ete realise
 */
export async function mettreAJourStatut(
  collection: Collection<Commande>,
  commande: ObjectId,
  statut: Statut,
): Promise<boolean | null> {
  const resultat = await collection.updateOne(
    { _id: commande },
    {
      $set: {
        statut: statut,
        dateModification: new Date(),
      },
    },
  );

  return resultat.modifiedCount === 1;
}

/**
 * DELETE -- supprime une commande passee
 * @param collection
 * @param commande
 * @returns
 */
export async function supprimerCommande(
  collection: Collection<Commande>,
  commande: ObjectId,
): Promise<boolean | null> {
  const result = await collection.deleteOne({ _id: commande });

  return result.deletedCount === 1;
}
