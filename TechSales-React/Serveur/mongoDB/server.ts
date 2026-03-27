import { config } from "dotenv";
import { connectToMongo, getProduits } from "./db/mongo.js";
import { createProduit, getProduitById, updateProduit, deleteProduitById } from "./controllers/produitController.js";

config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}
console.log("Connexion a MongoDB reussi!! :)");

await connectToMongo(uri);

const produits = getProduits();

/*await createProduit(produits, {
  nom: "ASUS ROG Strix G16",
  description: "Laptop gaming haute performance avec RTX 4060",
  prix: 1499.99,
  stock: 10,
  image_url: "https://dlcdnwebimgs.asus.com/gain/3C38EBCB-420C-438B-B02F-072F4A9E47DB",
  categorie: { nom_categorie: "Ordinateur" },
  specification: {
    type_produit: "Laptop",
    processeur: "Intel Core i7-13700H",
    frequence_processeur: 5,
    type_ram: "DDR5",
    taille_ram: 16,
    type_stockage: "SSD",
    taille_stockage: 512,
    carte_graphqiue: "NVIDIA RTX 4060"
  }
});*/


const idProduit = "69c68b927ae89047861260c9"
const idProduit2 = "69c6790517ea9db4f53e8bbc"

const get = await getProduitById(produits, idProduit);
//console.log(get);

await updateProduit(produits, idProduit, {
  prix: 1699.99,
  stock: 15
});

//await deleteProduitById(produits, idProduit2);

const getNew = await getProduitById(produits, idProduit);
//console.log(getNew);