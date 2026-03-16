# TechSales (｡◕‿‿◕｡)

## Description ( ´◔ ω◔`) ノシ
Ce projet est la conception d'un site web de vente en ligne d'ordinateurs portable. Ce projet sert de pratique et d'apprentissage dans le développement fullstack.

## Fonctionnalités (ﾉ⚆ヮ⚆)ﾉ
### Usager
- se connecter ou se créer un compte pour passer des commandes
- accès à une page *Compte*
    - capacité de modifier ses informations personnelles
    - afficher l'historique des commandes passées
- naviguer l'inventaire des ordinateurs portables
- afficher les détails complets d'un produit
- placer un produit dans le panier
- simuler la vente d'un produit

*Notre projet ne fait pas tout ça encore*

### Administrateur 
- connexion à une page pour l'admin
    - capacité de modifier l'inventaire (Modifier un produit ou le supprimer)
    - capacité à modifier les données des usagers ou supprimer un utilisateur
    - bloquer des comptes utilisateur au besoin
- afficher toutes les commandes passées

## Prérequis
Avant d’installer le projet, assurez-vous d’avoir installé :

- Node.js
- Docker
- Visual Studio Code
- Git
## Installation (͡ ° ͜ʖ ͡ °)
1. En utilisant un outil de gestion de Git, clonez le répertoire suivant à l'endroit de votre choix sur votre ordinateur 
>  https://github.com/Diego12411/DiegoR-MartinO-AmirV-IanK.git

2. Localisez le fichier suivant ***VenteEnLigneDDL.ddl*** dans l'arborescence du répertoire cloné et ouvrez-le avec l'application NotePad
> ```
> === Arborescence du projet ===
> DiegoR-MartinO-AmirV-IanK/
> ├── Livrables/
> ├── TechSales-React/
> └── VenteBD/
>     └──► VenteEnLigneDDL.ddl
> ```

3. Ouvrez l'application Docker, ouvrez un terminal puis lancez la commande suivante
> ```docker run -d --name TechSales-server -p 3306:3306 -e MYSQL_ROOT_PASSWORD=oracle -e MYSQL_DATABASE=TechSales -e MYSQL_USER=martin -e MYSQL_PASSWORD=oracle mysql/mysql-server:latest```

4. Ouvrez un terminal à partir de la nouvelle image **TechSales-Server** créée à l'étape précédente puis entrez la commande suivante
> ```mysql -u root -p```  
> Entrez le mot de passe suivant : *MOT DE PASSE* et appuyez sur la touche *Enter*

5. Sur le même terminal qu'à l'étape 4, sélectionnez la base de données à utiliser avec la commande suivante
> ```use NOM DU DATABASE```

6. Copier tout le contenu du fichier ***VenteEnLigneDDL.ddl*** de l'étape 2, puis collez le dans le terminal de l'étape 4 et appuyer sur la touche *Enter*

#### Avant de continuer! Nous devons ajouter quelques produits préalablement 
> ```
> === Arborescence du projet ===
> DiegoR-MartinO-AmirV-IanK/
> ├── Livrables/
> ├── ScriptsAjoutProduit/
>     └──► Script_insert_specs_produit.txt
> ├── TechSales-React/
> └── VenteBD/
> ```
>> 1. Ouvrez le fichier **Script_insert_specs_produit.txt**
>> 2. Copier tout le comptenu dans le Terminal de l'image mySQL ouvert préalablement dans Docker et faite **Enter**

### Configuration du fichier .env
Avant de démarrer le serveur, créez un fichier `.env` dans le dossier `Serveur` du projet.  
Exemple de contenu :
```
env
DB_HOST=localhost
DB_PORT=3306
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
DB_NAME=TechSales
JWT_SECRET=votre_cle_secrete
PORT=4000
```

### Petite remarque importante
Si vous utilisez `.env`, il faut aussi vérifier que :
- `.env` est dans `.gitignore`
- vous ne poussez pas vos environnements sur GitHub

7. Ouvrez une nouvelle fenêtre de Visual Studio Code

8. Dans Visual Studio Code, ouvrez le dossier ***TechSales-React*** contenant le projet
> 1. File ► Open Folder...
> 2. Sélectionner le dossier ***TechSales-React***
> ```
> === Arborescence du projet ===
> DiegoR-MartinO-AmirV-IanK/
> ├── Livrables/
> ├──► TechSales-React/
> └── VenteBD/
> ```

9. Dans l'arborescence du projet, déplacez-vous à l'intérieur du dossier ***Server***
> ```
> === Arborescence du projet ===
> DiegoR-MartinO-AmirV-IanK/
> ├── Livrables/
> ├── TechSales-React/
> │   ├── Images
> │   ├── node_modules
> │   ├── public
> │   ├──► Serveur
> │   ├── sql-scripts
> │   └── src
> └── VenteBD/
> ```

10. Faites un clic droit dans un espace vide du dossier et choisissez l'option suivante
> Open in Terminal

11. Entrez la commande suivante dans le terminal pour activer la base de données du site web
> ...\DiegoR-MartinO-AmirV-IanK\TechSales-React\Serveur
>
> ```npm run dev```

12. Dans l'arborescence du projet, déplacez-vous à l'intérieur du dossier ***TechSales-React***
> ```
> === Arborescence du projet ===
> DiegoR-MartinO-AmirV-IanK/
> ├── Livrables/
> ├──► TechSales-React/
> └── VenteBD/
> ```

13. Faites un clic droit dans un espace vide du dossier et choisissez l'option suivante
> Open in Terminal

14. Entrez la commande suivante dans le terminal pour activer le projet React.
> ...\DiegoR-MartinO-AmirV-IanK\TechSales-React
>
> ```npm run dev```

15. En maintenant la touche ***crtl***, cliquez sur le lien qui apparaîtra
> Exemple de lien
> ```
> ➜  Local:   http://localhost:XXXX/
> ```

16. Le lien s'ouvrira dans le navigateur de votre choix

17. Ajouter "***/affichageprincipalproduit***" au lien se trouvant dans la barre de recherche

18. Voilà! Vous arriverez sur la page principale du site ***TechSales***, et donc vous pourrez naviguer vers d’autres pages avec les liens à cliquer !

## Technologies utilisées (⌐■_■)
- React Vite
- TypeScript
- Docker
- MySQL
- Express.js
- GitHub
- Postman

## Auteurs (ʘ‿ʘ)╯
* Amirhossein
* Diego
* Ian
* Martin

 ---

# Dépendances à installer

Si le projet affiche des erreurs, pensez à installer les dépendances suivantes :

### Dans un terminal du dossier TechSales-React

- npm install
- npm install --save bootstrap react-router-dom
- npm install jsonwebtoken
- npm install --save @types/jsonwebtoken

### Dans un terminal du dossier Serveur
- npm install
