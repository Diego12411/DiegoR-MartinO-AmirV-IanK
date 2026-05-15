TechSales (｡◕‿‿◕｡)
Description ( ´◔ ω◔`) ノシ
Ce projet est la conception d'un site web de vente en ligne d'ordinateurs portable. Ce projet sert de pratique et d'apprentissage dans le développement fullstack.

Fonctionnalités (ﾉ⚆ヮ⚆)ﾉ
Usager
se connecter ou se créer un compte afin de passer des commandes
accès à une page Compte
capacité de modifier ses informations personnelles
afficher l'historique des commandes passées (souhaitable?)
naviguer l'inventaire des ordinateurs portables
afficher les détails complets d'un produit
placer un produit dans le panier
simuler la vente d'un produit
Administrateur
connexion à une page destinée spécifiquement à l'administrateur
capacité de modifier l'inventaire (Modifier un produit ou le supprimer)
capacité à modifier les données des usagers ou supprimer un utilisateur
bloquer des comptes utilisateur au besoin (souhaitable?)
afficher toutes les commandes passées
Prérequis
Avant de cloner le projet, assurez-vous d’avoir installé :

Node.js
Docker
Visual Studio Code
Git Bash ou tout autre logiciel de gestion de version
Installation (͡ ° ͜ʖ ͡ °)
Clonage du projet
En utilisant un outil de gestion Git, clonez le répertoire suivant à l'endroit de votre choix sur votre ordinateur
https://github.com/Diego12411/DiegoR-MartinO-AmirV-IanK.git

Ouvrez l'application Docker, ouvrez un terminal puis copiez la commande suivante et appuyez de la touche ENTER
docker run --name TechSales -d -p 27017:27017 mongodb/mongodb-community-server:latest

Le container TechSales devrait commencer automatiquement

Connexion à MongoDB avec Visual Studio Code
Ouvrez une nouvelle fenêtre Visual Studio Code

Assurez-vous d'avoir l'extension MongoDB for VS Code installé avant de continuer

Allez dans l'onglet MongoDB

Créer une nouvelle connexion MongoDB

Entrez dans la barre qui apparaît la chaine de connection suivante : mongodb://localhost:27017

Insertion des données fictives
Dans le même onglet MongoDB, cliquez sur le boutton Create New Playground
Effacez tout le contenu se trouvant dans le nouveau document ouvert

Touches : Ctrl + A puis BACKSPACE

Localisez le fichier suivant Script_ajouter_utilisateurs_NoSQL.txt dans l'arborescence du répertoire cloné et ouvrez-le avec un éditeur de texte
=== Arborescence du projet ===
DiegoR-MartinO-AmirV-IanK/s
├── Livrables/
├── ScriptAjoutUtilisateurs/
    └──► Script_ajouter_utilisateurs_NoSQL.txt
├── ScriptAjoutProduits/
├── TechSales-React/
├── VenteBD/
...
Copiez le contenu du fichier Script_ajouter_utilisateurs_NoSQL.txt dans le nouveau document du Playground dans Visual Studio Code

Localisez le fichier suivant Script_ajouter_produits_exemple-playground dans l'arborescence du répertoire cloné et ouvrez-le avec un éditeur de texte

=== Arborescence du projet ===
DiegoR-MartinO-AmirV-IanK/s
├── Livrables/
├── ScriptAjoutUtilisateurs/
├── ScriptAjoutProduits/
    └──► Script_ajouter_utilisateurs_NoSQL.txt
├── TechSales-React/
├── VenteBD/
...
Copier tout le contenu du fichier Script_ajouter_utilisateurs_NoSQL.txt dans le nouveau doucument Playground dans Visual Studio Code

Une fois que les deux documents ont été copié dans le Playground, appuyez sur la flèche en haut à droite afin d’exécuter le code

Configuration du fichier .env
Créez un nouveau fichier .env dans le dossier Serveur du projet.
=== Arborescence du projet ===
DiegoR-MartinO-AmirV-IanK/s
├── Livrables/
├── ScriptAjoutUtilisateurs/
├── ScriptAjoutProduits/
├── TechSales-React/
    ...
    ├── Serveur
        └──► .env
    ...
├── VenteBD/
...
Copiez les informations ci-dessous dans le nouveau fichier .env et sauvegardez le fichier
PORT=4000

DB_HOST=localhost
DB_USER=martin
DB_PASSWORD=oracle
DB_NAME=TechSales
DB_PORT=3306
JWT_SECRET=techsales_secret_123456

MONGODB_URI=mongodb://localhost:27017

REACT_URI=http://localhost:5173
Petite remarque importante
Si vous utilisez .env, il faut aussi vérifier que :

.env est dans .gitignore
vous ne poussez pas vos environnements sur GitHub
Démarrage du projet
Les étapes suivantes représente le démarrage du serveur de la base de données ainsi que React

Dans l'arborescence du projet, déplacez-vous à l'intérieur du dossier Serveur
=== Arborescence du projet ===
DiegoR-MartinO-AmirV-IanK/
├── Livrables/
...
├── TechSales-React/
│   ...
│   ├──► Serveur
    ...
└── VenteBD/
Faites un clic droit dans un espace vide du dossier et choisissez l'option suivante
Open in Terminal

Avant de continuer, assurez-vous d'installer les dépendances nécessaires pour la base de données avec la commande suivante
...\DiegoR-MartinO-AmirV-IanK\TechSales-React\Serveur> npm install

Entrez la commande suivante dans le terminal pour activer la base de données du site web
...\DiegoR-MartinO-AmirV-IanK\TechSales-React\Serveur> npm run dev

Dans l'arborescence du projet, déplacez-vous à l'intérieur du dossier TechSales-React
=== Arborescence du projet ===
DiegoR-MartinO-AmirV-IanK/
├── Livrables/
...
├──► TechSales-React/
...
Faites un clic droit dans un espace vide du dossier et choisissez l'option suivante
Open in Terminal

Avant de continuer, assurez-vous d'installer les dépendances nécessaires pour l'utilisation de React
...\DiegoR-MartinO-AmirV-IanK\TechSales-React\Serveur> npm install

Entrez la commande suivante dans le terminal pour activer le projet React
...\DiegoR-MartinO-AmirV-IanK\TechSales-React> npm run dev

En maintenant la touche Ctrl, cliquez sur le lien qui apparaîtra
➜ Local: http://localhost:XXXX/

Le lien s'ouvrira dans le navigateur de votre choix

Voilà! Vous arriverez sur la page principale du site TechSales

Technologies utilisées (⌐■_■)
React Vite
TypeScript
Docker
MySQL (SQL)
MongoDB (NoSQL)
Express.js
GitHub
Postman
Auteurs (ʘ‿ʘ)╯
Amirhossein
Diego
Ian
Martin
API externe utilisé
À compléter
