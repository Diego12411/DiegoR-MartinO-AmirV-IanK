import { Link } from "react-router";

export default function ProduitDetails() {
  return (
    <main className="container-fluid vw-100 px-5">
      <h5>Produit</h5>

      <div className="row">
        {/* Affichage de l'image du laptop */}
        <div className="col">
          <img
            src="https://dlcdnwebimgs.asus.com/gain/838fbdac-6d10-4190-8e52-d4b9463f5d23/"
            alt="Image d'un laptop :')"
            style={{ width: "100%", height: "auto", objectFit: "cover" }}
          />
        </div>

        {/* Affichage des informations generales de l'ordinateur */}
        <div className="col">
          <h4 className="fw-bold">Nom de l'ordinateur portable</h4>
          <h5 className="text-success">En stock</h5>
          <h5>Prix du laptop $$$</h5>
          <p className="fs-6">Description du laptop</p>
          <hr className="w-75" style={{ border: "1px solid", opacity: 1 }} />

          {/* Affichage des caracteristiques du laptop */}
          <div className="card">
            <ul className="list-group list-group-flush">
              {/* Affichage du processeur */}
              <li className="list-group-item d-flex align-items-center gap-3">
                <img
                  src="https://icons.veryicon.com/png/o/internet--web/elegant-linear-icon/cpu-6.png"
                  alt="image d'un CPU"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
                <div>
                  <small className="text-body-secondary">Processeur</small>
                  <br />
                  Nom du processeur + frequence
                </div>
              </li>
              {/* Affichage de la carte graphique */}
              <li className="list-group-item d-flex align-items-center gap-3">
                <img
                  src="https://static.vecteezy.com/system/resources/thumbnails/014/935/546/small_2x/chip-gpu-card-icon-simple-graphic-pc-vector.jpg"
                  alt="image d'un CPU"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
                <div>
                  <small className="text-body-secondary">Carte Graphique</small>
                  <br />
                  Modele de la carte graphique
                </div>
              </li>
              {/* Affichage de la memoire */}
              <li className="list-group-item d-flex align-items-center gap-3">
                <img
                  src="https://t4.ftcdn.net/jpg/05/62/71/77/360_F_562717748_ZAfTzKz4sLPlm9KGDIsWASVcQgh7GOta.jpg"
                  alt="image d'un CPU"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
                <div>
                  <small className="text-body-secondary">Memoire</small>
                  <br />
                  Capacite de RAM et modele
                </div>
              </li>
              {/* Affichage de la capacite de stockage */}
              <li className="list-group-item d-flex align-items-center gap-3">
                <img
                  src="https://static.vecteezy.com/system/resources/previews/006/793/680/non_2x/storage-ssd-icon-hardware-line-style-free-free-vector.jpg"
                  alt="image d'un CPU"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
                <div>
                  <small className="text-body-secondary">Stockage</small>
                  <br />
                  Capacite de stockage et type
                </div>
              </li>
            </ul>
          </div>

          {/* Affichge de la livraison gratuite */}
          <div className="card my-5">
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex align-items-center gap-3">
                <img
                  src="https://static.vecteezy.com/system/resources/thumbnails/002/206/240/small_2x/fast-delivery-icon-free-vector.jpg"
                  alt="image d'un camion de livraison"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
                <div className="fw-bold">Livraison Gratuite</div>
              </li>
            </ul>
          </div>

          {/* Affichage de la selection de la quantite et du boutton acheter */}
          <div className="d-flex gap-5">
            <input
              type="number"
              className="w-25 form-control-sm"
              id="quantite"
              min={1}
              placeholder="1"
            />
            <Link to="/" className="flex-fill">
              <button type="button" className="btn btn-dark w-100">
                Acheter
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Affichage des autres produits au bas de la page (!= footer) */}
      <div className="row px-5 mx-5">
        <hr
          className="mt-5 w-25 rounded-5"
          style={{
            border: "3px solid #000000",
            opacity: 1,
          }}
        />
        <h5>Autres produits</h5>

        <div className="row row-cols-1 row-cols-md-4 g-3 mb-5">
          {/* Card 1 */}
          <div className="col">
            <div className="card h-100">
              <Link to="PageProduit">
                <img
                  src="https://multimedia.bbycastatic.ca/multimedia/products/1500x1500/152/15268/15268122.jpeg"
                  alt="Image demo produit 1"
                  style={{ width: "100%", height: "125px", objectFit: "cover" }}
                />
              </Link>
              <div className="card-body">
                <h6 className="card-title">Demo produit 1</h6>
                <small className="text-body-secondary">
                  Prix du produit $$$
                </small>
              </div>
            </div>
          </div>
          {/* Card 2 */}
          <div className="col">
            <div className="card h-100">
              <Link to="PageProduit">
                <img
                  src="https://news.lenovo.com/wp-content/uploads/2025/01/09_Yoga_Slim_9i_14_10_Tidal_Teal_CameraOn_Right_Side_Open-e1736186936951-1024x862.png"
                  alt="Image demo produit 2"
                  style={{ width: "100%", height: "125px", objectFit: "cover" }}
                />
              </Link>
              <div className="card-body">
                <h6 className="card-title">Demo produit 2</h6>
                <small className="text-body-secondary">
                  Prix du produit $$$
                </small>
              </div>
            </div>
          </div>
          {/* Card 3 */}
          <div className="col">
            <div className="card h-100">
              <Link to="PageProduit">
                <img
                  src="https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9350/media-gallery/graphite/notebook-xps-13-9350-t-oled-gy-gallery-5.psd?fmt=png-alpha&pscan=auto&scl=1&hei=804&wid=1362&qlt=100,1&resMode=sharp2&size=1362,804&chrss=full"
                  alt="Image demo produit 3"
                  style={{ width: "100%", height: "125px", objectFit: "cover" }}
                />
              </Link>
              <div className="card-body">
                <h6 className="card-title">Demo produit 3</h6>
                <small className="text-body-secondary">
                  Prix du produit $$$
                </small>
              </div>
            </div>
          </div>
          {/* Card 4 */}
          <div className="col">
            <div className="card h-100">
              <Link to="PageProduit">
                <img
                  src="https://www.lg.com/content/dam/channel/wcms/ca_en/images/laptops/gram/17z90sp-g-aa75a9/DZ-02.jpg/jcr:content/renditions/thum-1600x1062.jpeg"
                  alt="Image demo produit 4"
                  style={{ width: "100%", height: "125px", objectFit: "cover" }}
                />
              </Link>
              <div className="card-body">
                <h6 className="card-title">Demo produit 4</h6>
                <small className="text-body-secondary">
                  Prix du produit $$$
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
