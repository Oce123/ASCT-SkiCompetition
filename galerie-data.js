
const galerieData = [
    {
        saison: "2025-2026",
        titre: "Saison 2025-2026",
        albums: [
            {
                titre: "Championnat Font-Romeu",
                description: "Les photos du championnat FSGT",
                couverture: "photos_galerie/2025-2026/stage-font-romeu/photo6.jpeg",
                photos: [
                    "photos_galerie/2025-2026/stage-font-romeu/photo3.jpeg",
					"photos_galerie/2025-2026/stage-font-romeu/photo4.jpeg",
					"photos_galerie/2025-2026/stage-font-romeu/photo6.jpeg",
					"photos_galerie/2025-2026/stage-font-romeu/photo7.jpeg",
					"photos_galerie/2025-2026/stage-font-romeu/photo27.jpeg",
					"photos_galerie/2025-2026/stage-font-romeu/photo28.jpeg",
					"photos_galerie/2025-2026/stage-font-romeu/photo29.jpeg",
					"photos_galerie/2025-2026/stage-font-romeu/photo30.jpeg"
                ]
            },
            {
                titre: "Compétitions",
                description: "Les moments forts de la saison",
                couverture: "photos_galerie/2025-2026/competitions/photo1.jpeg",
                photos: [
                    "photos_galerie/2025-2026/competitions/photo1.jpeg",
					"photos_galerie/2025-2026/competitions/photo2.jpeg",
					"photos_galerie/2025-2026/competitions/photo11.jpeg",
					"photos_galerie/2025-2026/competitions/photo12.jpeg",
					"photos_galerie/2025-2026/competitions/photo16.jpeg",
					"photos_galerie/2025-2026/competitions/photo17.jpeg",
					"photos_galerie/2025-2026/competitions/photo18.jpeg",
					"photos_galerie/2025-2026/competitions/photo24.jpeg",
					"photos_galerie/2025-2026/competitions/photo25.jpeg",
					"photos_galerie/2025-2026/competitions/photo26.jpeg"
                ]
            },
			{
                titre: "Divers",
                description: "Parce qu'on a une bonne ambiance",
                couverture: "photos_galerie/2025-2026/divers/photo21.jpeg",
                photos: [
                    "photos_galerie/2025-2026/divers/photo3.jpeg",
					"photos_galerie/2025-2026/divers/photo5.jpeg",
					"photos_galerie/2025-2026/divers/photo8.jpeg",
					"photos_galerie/2025-2026/divers/photo9.jpeg",
					"photos_galerie/2025-2026/divers/photo10.jpeg",
					"photos_galerie/2025-2026/divers/photo13.jpeg",
					"photos_galerie/2025-2026/divers/photo14.jpeg",
					"photos_galerie/2025-2026/divers/photo15.jpeg",
					"photos_galerie/2025-2026/divers/photo19.jpeg",
					"photos_galerie/2025-2026/divers/photo20.jpeg",
					"photos_galerie/2025-2026/divers/photo21.jpeg",
					"photos_galerie/2025-2026/divers/photo22.jpeg",
					"photos_galerie/2025-2026/divers/photo23.jpeg"

                ]
            }
        ]
    },
    {
        saison: "2026-2027",
        titre: "Saison 2026-2027",
        albums: [
            {
                titre: "Stage Font-Romeu",
                description: "Le stage de décembre",
                couverture: "photos_galerie/2026-2027/stage-font-romeu/photo1.jpeg",
                photos: [
                    "photos_galerie/2026-2027/stage-font-romeu/photo1.jpeg"
                ]
            },
            {
                titre: "Entraînements",
                description: "La préparation sur les pistes",
                couverture: "photos_galerie/2026-2027/entrainements/photo1.jpeg",
                photos: [
                    "photos_galerie/2026-2027/entrainements/photo1.jpeg"
                ]
            },
            {
                titre: "Compétitions",
                description: "Les courses de la saison",
                couverture: "photos_galerie/2026-2027/competitions/photo1.jpeg",
                photos: [
                    "photos_galerie/2026-2027/competitions/photo1.jpeg"
                ]
            }
        ]
    }
];

document.addEventListener("DOMContentLoaded", () => {
    const seasonButtonsContainer =
        document.getElementById("gallery-season-buttons");
    const albumsContainer = document.getElementById("gallery-albums");
    const photosContainer = document.getElementById("gallery-photos");
    const titreSection = document.getElementById("gallery-current-title");
    const descriptionSection =
        document.getElementById("gallery-current-description");

    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeButton = document.querySelector(".lightbox .close");
    const prevButton = document.querySelector(".prev-lightbox");
    const nextButton = document.querySelector(".next-lightbox");

    if (
        !seasonButtonsContainer ||
        !albumsContainer ||
        !photosContainer ||
        !titreSection ||
        !descriptionSection
    ) {
        console.error("Galerie : un conteneur HTML est introuvable.");
        return;
    }

    let albumActif = null;
    let indexPhoto = 0;
    let photosActives = [];

    function afficherSaisons() {
        seasonButtonsContainer.replaceChildren();
        albumsContainer.replaceChildren();
        photosContainer.replaceChildren();

        titreSection.textContent = "Choisissez une saison";
        descriptionSection.textContent =
            "Sélectionnez une saison pour découvrir les albums du club.";

        albumActif = null;
        photosActives = [];

        galerieData.forEach((saison) => {
            const bouton = document.createElement("button");
            bouton.type = "button";
            bouton.className = "gallery-season-button";
            bouton.textContent = saison.titre;

            bouton.addEventListener("click", () => {
                afficherAlbums(saison);
            });

            seasonButtonsContainer.appendChild(bouton);
        });
    }

    function afficherAlbums(saison) {
        seasonButtonsContainer.replaceChildren();
        albumsContainer.replaceChildren();
        photosContainer.replaceChildren();

        titreSection.textContent = saison.titre;
        descriptionSection.textContent =
            "Choisissez un album pour découvrir ses photos.";

        albumActif = null;
        photosActives = [];

        const retour = document.createElement("button");
        retour.type = "button";
        retour.className = "gallery-back-button";
        retour.textContent = "← Retour aux saisons";
        retour.addEventListener("click", afficherSaisons);

        seasonButtonsContainer.appendChild(retour);

        saison.albums.forEach((album) => {
            const carte = document.createElement("button");
            carte.type = "button";
            carte.className = "gallery-album";

            const image = document.createElement("img");
            image.src = album.couverture;
            image.alt = `Couverture : ${album.titre}`;
            image.loading = "lazy";

            const contenu = document.createElement("span");
            contenu.className = "gallery-album-content";

            const titre = document.createElement("strong");
            titre.textContent = album.titre;

            const description = document.createElement("span");
            description.textContent = album.description;

            const compteur = document.createElement("small");
            compteur.textContent =
                `${album.photos.length} photo${album.photos.length > 1 ? "s" : ""}`;

            contenu.append(titre, description, compteur);
            carte.append(image, contenu);

            carte.addEventListener("click", () => {
                afficherPhotos(album);
            });

            albumsContainer.appendChild(carte);
        });
    }

    function afficherPhotos(album) {
        albumActif = album;
        photosActives = album.photos;
        photosContainer.replaceChildren();

        titreSection.textContent = album.titre;
        descriptionSection.textContent = album.description;

        album.photos.forEach((src, index) => {
            const image = document.createElement("img");
            image.src = src;
            image.alt = `${album.titre} — photo ${index + 1}`;
            image.className = "gallery-item";
            image.loading = "lazy";
            image.tabIndex = 0;

            image.addEventListener("click", () => ouvrirLightbox(index));

            image.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    ouvrirLightbox(index);
                }
            });

            photosContainer.appendChild(image);
        });
    }

    function ouvrirLightbox(index) {
        if (!lightbox || !lightboxImg || !photosActives.length) return;

        indexPhoto = index;
        mettreAJourLightbox();
        lightbox.classList.add("active");
        document.body.classList.add("lightbox-open");
    }

    function mettreAJourLightbox() {
        if (!lightboxImg || !photosActives.length) return;

        lightboxImg.src = photosActives[indexPhoto];
        lightboxImg.alt =
            `${albumActif?.titre || "Galerie"} — photo ${indexPhoto + 1} sur ${photosActives.length}`;
    }

    function fermerLightbox() {
        if (!lightbox) return;

        lightbox.classList.remove("active");
        document.body.classList.remove("lightbox-open");
    }

    function photoPrecedente() {
        if (!photosActives.length) return;

        indexPhoto =
            (indexPhoto - 1 + photosActives.length) % photosActives.length;
        mettreAJourLightbox();
    }

    function photoSuivante() {
        if (!photosActives.length) return;

        indexPhoto = (indexPhoto + 1) % photosActives.length;
        mettreAJourLightbox();
    }

    closeButton?.addEventListener("click", fermerLightbox);
    prevButton?.addEventListener("click", photoPrecedente);
    nextButton?.addEventListener("click", photoSuivante);

    lightbox?.addEventListener("click", (event) => {
        if (event.target === lightbox) fermerLightbox();
    });

    document.addEventListener("keydown", (event) => {
        if (!lightbox?.classList.contains("active")) return;

        if (event.key === "Escape") fermerLightbox();
        if (event.key === "ArrowLeft") photoPrecedente();
        if (event.key === "ArrowRight") photoSuivante();
    });

    afficherSaisons();
});
