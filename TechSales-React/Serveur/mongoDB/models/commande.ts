import { ObjectId} from "mongodb"

export interface Commande {
    _id?: ObjectId
    utilisateurId: ObjectId
    achat: ItemsAchat[]
    statut: 
    dateAchat: Date
    dateModification: Date
}