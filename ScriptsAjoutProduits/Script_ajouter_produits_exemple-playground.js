use("TechSales");

db.produits.insertMany([
  {
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
      carte_graphique: "NVIDIA RTX 4060"
    }
  },
  {
    nom: "Lenovo Legion Pro 7",
    description: "Laptop gaming AMD avec écran 240Hz",
    prix: 1899.99,
    stock: 7,
    image_url: "https://news.lenovo.com/wp-content/uploads/2025/01/09_Yoga_Slim_9i_14_10_Tidal_Teal_CameraOn_Right_Side_Open-e1736186936951-1024x862.png",
    categorie: { nom_categorie: "Ordinateur" },
    specification: {
      type_produit: "Laptop",
      processeur: "AMD Ryzen 9 7945HX",
      frequence_processeur: 5,
      type_ram: "DDR5",
      taille_ram: 32,
      type_stockage: "SSD",
      taille_stockage: 1000,
      carte_graphique: "AMD Radeon RX 7600M"
    }
  },
  {
    nom: 'MacBook Pro 14"',
    description: "Laptop Apple avec puce M3 Pro",
    prix: 2199.99,
    stock: 5,
    image_url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310",
    categorie: { nom_categorie: "Ordinateur" },
    specification: {
      type_produit: "Laptop",
      processeur: "Apple M3 Pro",
      frequence_processeur: 4,
      type_ram: "LPDDR5",
      taille_ram: 18,
      type_stockage: "SSD",
      taille_stockage: 512,
      carte_graphique: "GPU intégré"
    }
  },
  {
    nom: "Dell XPS 13",
    description: "Laptop ultraportable élégant pour usage quotidien",
    prix: 999.99,
    stock: 15,
    image_url: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9350/media-gallery/graphite/notebook-xps-13-9350-t-oled-gy-gallery-5.psd",
    categorie: { nom_categorie: "Ordinateur" },
    specification: {
      type_produit: "Laptop",
      processeur: "Intel Core i5-1335U",
      frequence_processeur: 5,
      type_ram: "DDR4",
      taille_ram: 8,
      type_stockage: "SSD",
      taille_stockage: 0,
      carte_graphique: "Intel Iris Xe"
    }
  },
  {
    nom: "LG Gram 17",
    description: "Laptop léger avec grande autonomie de batterie",
    prix: 1299.99,
    stock: 8,
    image_url: "https://www.lg.com/content/dam/channel/wcms/ca_en/images/laptops/gram/17z90sp-g-aa75a9/DZ-02.jpg",
    categorie: { nom_categorie: "Ordinateur" },
    specification: {
      type_produit: "Laptop",
      processeur: "AMD Ryzen 7 7730U",
      frequence_processeur: 5,
      type_ram: "DDR4",
      taille_ram: 16,
      type_stockage: "SSD",
      taille_stockage: 512,
      carte_graphique: "AMD Radeon 610M"
    }
  },
  {
    nom: "ASUS ProArt Studiobook 16",
    description: "Laptop créatif haute performance avec RTX 4070",
    prix: 2499.99,
    stock: 4,
    image_url: "https://dlcdnwebimgs.asus.com/gain/838fbdac-6d10-4190-8e52-d4b9463f5d23/",
    categorie: { nom_categorie: "Ordinateur" },
    specification: {
      type_produit: "Laptop",
      processeur: "Intel Core i9-13900H",
      frequence_processeur: 5,
      type_ram: "DDR5",
      taille_ram: 32,
      type_stockage: "SSD",
      taille_stockage: 1000,
      carte_graphique: "NVIDIA RTX 4070"
    }
  },
  {
    nom: 'MacBook Air 13"',
    description: "Laptop Apple léger et silencieux avec puce M2",
    prix: 1299.99,
    stock: 12,
    image_url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-midnight-select-202402",
    categorie: { nom_categorie: "Ordinateur" },
    specification: {
      type_produit: "Laptop",
      processeur: "Apple M2",
      frequence_processeur: 4,
      type_ram: "LPDDR5",
      taille_ram: 8,
      type_stockage: "SSD",
      taille_stockage: 256,
      carte_graphique: "GPU intégré"
    }
  },
  {
    nom: "Microsoft Surface Pro 11",
    description: "Laptop 2-en-1 avec processeur Snapdragon X Elite",
    prix: 1599.99,
    stock: 6,
    image_url: "https://www.pc-canada.com/dd2/img/item/A-1500x1500/8747297.jpg",
    categorie: { nom_categorie: "Ordinateur" },
    specification: {
      type_produit: "Laptop",
      processeur: "Qualcomm Snapdragon X Elite",
      frequence_processeur: 4,
      type_ram: "LPDDR5",
      taille_ram: 16,
      type_stockage: "SSD",
      taille_stockage: 512,
      carte_graphique: "Adreno X1"
    }
  }
]);