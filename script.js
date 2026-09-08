// =========================
// HEADER SCROLL
// =========================
const header = document.getElementById("header");

if (header) {
    window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
            header.classList.add("shrink");
        } else {
            header.classList.remove("shrink");
        }
    });
}

// =========================
// MENU BURGER
// =========================

const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

if (burger && nav) {

    burger.addEventListener("click", () => {

        burger.classList.toggle("active");
        nav.classList.toggle("active");
    });

    // ferme menu quand on clique un lien
    document.querySelectorAll("#nav a").forEach(link => {

        link.addEventListener("click", () => {

            burger.classList.remove("active");
            nav.classList.remove("active");
        });
    });

    // ferme si clic extérieur
    document.addEventListener("click", (e) => {

        if (
            !nav.contains(e.target) &&
            !burger.contains(e.target)
        ) {
            burger.classList.remove("active");
            nav.classList.remove("active");
        }
    });
}

// =========================
// GALERIE LIGHTBOX
// =========================
const images = document.querySelectorAll(".gallery-grid img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.querySelector(".close");
const prevBtn = document.querySelector(".prev-lightbox");
const nextBtn = document.querySelector(".next-lightbox");

let currentIndex = 0;

if (images.length > 0 && lightbox && lightboxImg) {

    images.forEach((img, index) => {
        img.addEventListener("click", () => {
            currentIndex = index;
            showImage();
            lightbox.style.display = "flex";
        });
    });

    function showImage() {
        lightboxImg.src = images[currentIndex].src;
    }

    function changeImage(direction) {

        lightboxImg.classList.add(
            direction === "next" ? "slide-out-left" : "slide-out-right"
        );

        setTimeout(() => {

            if (direction === "next") {
                currentIndex = (currentIndex + 1) % images.length;
            } else {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
            }

            lightboxImg.src = images[currentIndex].src;

            lightboxImg.classList.remove("slide-out-left", "slide-out-right");
            lightboxImg.classList.add("slide-in");

        }, 300);
    }

    if (nextBtn) nextBtn.addEventListener("click", () => changeImage("next"));
    if (prevBtn) prevBtn.addEventListener("click", () => changeImage("prev"));

    document.addEventListener("keydown", (e) => {
        if (lightbox.style.display === "flex") {
            if (e.key === "ArrowRight") changeImage("next");
            if (e.key === "ArrowLeft") changeImage("prev");
            if (e.key === "Escape") lightbox.style.display = "none";
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            lightbox.style.display = "none";
        });
    }

    lightbox.addEventListener("click", (e) => {
        if (e.target !== lightboxImg) {
            lightbox.style.display = "none";
        }
    });

    // SWIPE MOBILE
    let startX = 0;
    let endX = 0;

    lightbox.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    lightbox.addEventListener("touchend", (e) => {
        endX = e.changedTouches[0].clientX;

        const diff = startX - endX;

        if (Math.abs(diff) < 50) return;

        if (diff > 0) {
            changeImage("next");
        } else {
            changeImage("prev");
        }
    });
}

// =========================
// ANIMATION SECTIONS
// =========================
const sections = document.querySelectorAll(".section");

if (sections.length > 0) {
    function checkScroll() {
        const triggerBottom = window.innerHeight * 0.8;

        sections.forEach(section => {
            const boxTop = section.getBoundingClientRect().top;

            if (boxTop < triggerBottom) {
                section.classList.add("visible");
            }
        });
    }

    window.addEventListener("scroll", checkScroll);
    window.addEventListener("load", checkScroll);
}

// =========================
// SAFRAN HE
// =========================

const safranStatus = document.getElementById("safran-status");
const safranFields = document.getElementById("safran-fields");

const qfInput = document.getElementById("qf");
const serviceInput = document.getElementById("service");
const correspondantInput = document.getElementById("correspondant");

if (safranStatus) {

    safranStatus.addEventListener("change", function () {

        const value = this.value;

        safranFields.style.display =
            value ? "block" : "none";

        // reset
        serviceInput.parentElement.style.display = "none";
        correspondantInput.parentElement.style.display = "none";

        // Salarié / Retraité
        if (value === "salarie" || value === "retraite") {

            serviceInput.parentElement.style.display = "flex";

        }

        // Régie / Extérieur
        if (value === "regie" || value === "exterieur") {

            correspondantInput.parentElement.style.display = "flex";

        }
    });
}

// =========================
// NPY
// =========================

const npy = document.getElementById("npy");
const npyNumber = document.getElementById("npy-number");

if (npy) {

    npy.addEventListener("change", function () {

        npyNumber.style.display =
            this.value === "oui" ? "flex" : "none";
    });
}

// =========================
// FICHE SANITAIRE AUTO
// =========================

const sanitaireNom =
    document.getElementById("sanitaire-nom");

const sanitairePrenom =
    document.getElementById("sanitaire-prenom");

const sanitaireTel =
    document.getElementById("sanitaire-tel");

const sanitaireAdresse =
    document.getElementById("sanitaire-adresse");

const sanitaireContactUrgence =
    document.getElementById("sanitaire-contact-urgence");

const sanitaireContactTel =
    document.getElementById("sanitaire-contact-tel");

// INPUTS EXISTANTS
const nom =
    document.getElementById("nom");

const prenom =
    document.getElementById("prenom");
	
const email =
    document.getElementById("email");

const telephone =
    document.getElementById("telephone");

const adresse =
    document.getElementById("adresse");

// adapte avec tes ids existants
const urgenceNom =
    document.getElementById("nom-urgence");

const urgenceTel =
    document.getElementById("telephone-urgence");

function updateSanitaire() {

    if (sanitaireNom)
        sanitaireNom.value = nom.value;

    if (sanitairePrenom)
        sanitairePrenom.value = prenom.value;

    if (sanitaireTel)
        sanitaireTel.value = telephone.value;

    if (sanitaireAdresse)
        sanitaireAdresse.value = adresse.value;

    if (urgenceNom && sanitaireContactUrgence)
        sanitaireContactUrgence.value = urgenceNom.value;

    if (urgenceTel && sanitaireContactTel)
        sanitaireContactTel.value = urgenceTel.value;
}

if (nom) nom.addEventListener("input", updateSanitaire);
if (prenom) prenom.addEventListener("input", updateSanitaire);
if (telephone) telephone.addEventListener("input", updateSanitaire);
if (adresse) adresse.addEventListener("input", updateSanitaire);

if (urgenceNom)
    urgenceNom.addEventListener("input", updateSanitaire);

if (urgenceTel)
    urgenceTel.addEventListener("input", updateSanitaire);

updateSanitaire();

// =========================
// RECAP FICHE SANITAIRE
// =========================

const recapNom =
    document.getElementById("recap-nom");

const recapPrenom =
    document.getElementById("recap-prenom");

const recapNaissance =
    document.getElementById("recap-naissance");

const signatureNom =
    document.getElementById("signature-nom");

const signatureDate =
    document.getElementById("signature-date");
	
const birthdate =
    document.getElementById("birthdate");

function updateRecap() {

    if (recapNom)
        recapNom.textContent = nom.value;

    if (recapPrenom)
        recapPrenom.textContent = prenom.value;

    if (recapNaissance)
        recapNaissance.textContent = birthdate.value;

    if (signatureNom)
        signatureNom.textContent =
            prenom.value + " " + nom.value;

    if (signatureDate) {

        const today = new Date();

        signatureDate.textContent =
            today.toLocaleDateString("fr-FR");
    }
}

if (nom)
    nom.addEventListener("input", updateRecap);

if (prenom)
    prenom.addEventListener("input", updateRecap);

if (birthdate)
    birthdate.addEventListener("change", updateRecap);

updateRecap();

// =========================
// SIGNATURE DYNAMIQUE
// =========================

const accordSelect =
    document.getElementById("accord-select");

const signatureArea =
    document.getElementById("signature-area");

if (accordSelect && signatureArea) {

    accordSelect.addEventListener("change", function () {

        signatureArea.textContent = this.value;

        if (this.value === "REFUS POUR ACCORD") {

            signatureArea.style.color = "#c62828";

        } else {

            signatureArea.style.color = "#13a113";
        }
    });
}

// =========================
// LOCATION MATERIEL
// =========================

const locReferantNom =
    document.getElementById("loc-referant-nom");

const locReferantPrenom =
    document.getElementById("loc-referant-prenom");

const locReferantAdresse =
    document.getElementById("loc-referant-adresse");

const locReferantTel =
    document.getElementById("loc-referant-tel");

const locReferantMail =
    document.getElementById("loc-referant-mail");

const locParticipant =
    document.getElementById("loc-participant");

const locSki =
    document.getElementById("loc-ski");

const locSnow =
    document.getElementById("loc-snow");

const locAgeType =
    document.getElementById("location-age-type");

const locTotal =
    document.getElementById("loc-total");

const packs =
    document.querySelectorAll('input[name="pack"]');

// IMPORTANT
// Mets des IDs sur représentant légal 1
// ex:
// id="legal1-nom"
// id="legal1-prenom"
// id="legal1-tel"
// id="legal1-mail"

function isMineur() {

    const birth = new Date(birthdate.value);
    const today = new Date();

    let age =
        today.getFullYear() - birth.getFullYear();

    const m =
        today.getMonth() - birth.getMonth();

    if (
        m < 0 ||
        (m === 0 && today.getDate() < birth.getDate())
    ) {
        age--;
    }

    return age < 18;
}

function updateLocationMateriel() {

    // participant
    locParticipant.value =
        `${prenom.value} ${nom.value}`;

    locSki.value =
        document.getElementById("niveau_ski").value;

    locSnow.value =
        document.getElementById("niveau_snow").value;

    // adulte ou enfant
    const mineur = isMineur();

    locAgeType.textContent =
        mineur ? "ENFANT" : "ADULTE";

    // REFERANT
    if (mineur) {

        locReferantNom.value =
            document.getElementById("legal1-nom").value;

        locReferantPrenom.value =
            document.getElementById("legal1-prenom").value;

        locReferantTel.value =
            document.getElementById("legal1-tel").value;

        locReferantMail.value =
            document.getElementById("legal1-mail").value;

    } else {

        locReferantNom.value = nom.value;
        locReferantPrenom.value = prenom.value;
        locReferantAdresse.value = adresse.value;
        locReferantTel.value = telephone.value;
        locReferantMail.value = email.value;
    }
}

function updateTarif() {

    const mineur = isMineur();

    let total = 0;

    packs.forEach(pack => {

        if (pack.checked) {

            if (pack.value === "pack1") {
                total = mineur ? 25 : 50;
            }

            if (pack.value === "pack2") {
                total = mineur ? 15 : 20;
            }

            if (pack.value === "pack3") {
                total = mineur ? 40 : 70;
            }
        }
    });

    locTotal.value = total + " €";
}

packs.forEach(pack => {
    pack.addEventListener("change", updateTarif);
});

// AUTO UPDATE
[
    nom,
    prenom,
    telephone,
    adresse,
    email,
    birthdate
].forEach(el => {

    if (el) {
        el.addEventListener("input", updateLocationMateriel);
    }
});

updateLocationMateriel();



// =========================
// DROIT A L'IMAGE
// =========================

const droitImageNom =
    document.getElementById("droit-image-nom");

const droitImageVille =
    document.getElementById("droit-image-ville");

const droitImageDate =
    document.getElementById("droit-image-date");

const droitImageAccord =
    document.getElementById("droit-image-accord");

const droitImageSignature =
    document.getElementById("droit-image-signature");

function updateDroitImage() {

    if (droitImageNom) {

        droitImageNom.textContent =
            `${prenom.value} ${nom.value}`;
    }

    // ville
    const villeInput =
        document.querySelector('input[placeholder="Ville"]');

    if (villeInput && droitImageVille) {

        droitImageVille.value =
            villeInput.value;
    }

    // date
    if (droitImageDate) {

        droitImageDate.textContent =
            new Date().toLocaleDateString("fr-FR");
    }
}

// auto update
if (nom)
    nom.addEventListener("input", updateDroitImage);

if (prenom)
    prenom.addEventListener("input", updateDroitImage);

const villeField =
    document.querySelector('input[placeholder="Ville"]');

if (villeField)
    villeField.addEventListener("input", updateDroitImage);

updateDroitImage();

// SIGNATURE
if (droitImageAccord && droitImageSignature) {

    droitImageAccord.addEventListener("change", function () {

        droitImageSignature.textContent =
            this.value;

        if (this.value === "REFUS POUR ACCORD") {

            droitImageSignature.style.color =
                "#c62828";

        } else {

            droitImageSignature.style.color =
                "#13a113";
        }
    });
}


// =========================
// RECAP FINAL
// =========================

function getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
}

function getNameValue(name) {
    const el = document.querySelector(`[name="${name}"]`);
    return el ? el.value.trim() : "";
}

function getAge() {

    const birthValue = getValue("birthdate");

    if (!birthValue) return null;

    const birth = new Date(birthValue);
    const today = new Date();

    let age =
        today.getFullYear() -
        birth.getFullYear();

    const month =
        today.getMonth() -
        birth.getMonth();

    if (
        month < 0 ||
        (
            month === 0 &&
            today.getDate() < birth.getDate()
        )
    ) {
        age--;
    }

    return age;
}


// =========================
// CATEGORIE
// =========================

function getCategorieParticipant() {

    const age = getAge();

    if (age === null) {
        return "";
    }

    return age < 18
        ? "Enfant"
        : "Adulte";
}


// =========================
// ALLERGIES
// =========================

function getAllergies() {

    const allergies = [];

    const asthme =
        document.querySelector(
            '[name="allergie-asthme"]'
        );

    const alimentaire =
        document.querySelector(
            '[name="allergie-alimentaire"]'
        );

    const medicamenteuse =
        document.querySelector(
            '[name="allergie-medicamenteuse"]'
        );

    if (asthme && asthme.checked) {
        allergies.push("Asthme");
    }

    if (alimentaire && alimentaire.checked) {
        allergies.push("Alimentaire");
    }

    if (medicamenteuse && medicamenteuse.checked) {
        allergies.push("Médicamenteuse");
    }

    const details =
        getNameValue("allergies-details");

    if (details) {
        allergies.push(details);
    }

    return allergies.length > 0
        ? allergies.join(" — ")
        : "Aucune";
}


// =========================
// TRAITEMENT
// =========================

function getTraitement() {

    const traitement =
        getNameValue("traitement");

    const details =
        getNameValue("details-traitement");

    if (!traitement) {
        return "Non renseigné";
    }

    if (
        traitement.toLowerCase() === "non"
    ) {
        return "Non";
    }

    if (details) {
        return `Oui — ${details}`;
    }

    return "Oui";
}


// =========================
// PAIEMENT
// =========================

function getStatutSafran() {

    const statut =
        getValue("safran-status");

    const textes = {

        exterieur: "Extérieur",

        salarie: "Salarié",

        retraite: "Retraité TM",

        regie: "Régie"
    };

    return textes[statut] || "Non renseigné";
}


// =========================
// CALCUL PAIEMENT
// =========================

function calculPaiement() {

    const age = getAge();

    const statut = getValue("safran-status");
    const npy = getValue("npy");
    const materiel = getValue("materiel");

    const paiementType =
        document.getElementById("paiement-type");

    const paiementStatut =
        document.getElementById("paiement-statut");

    const paiementForfait =
        document.getElementById("paiement-forfait");

    const paiementTotal =
        document.getElementById("paiement-total");
		
	const paiementLocation =
		document.getElementById("paiement-location");

	const paiementCaution =
		document.getElementById("paiement-caution");

    // -------------------------
    // CATÉGORIE
    // -------------------------

    let categorie = "";

    if (age !== null) {
        categorie =
            age < 18
                ? "enfant"
                : "adulte";
    }

    // -------------------------
    // AFFICHAGE TYPE
    // -------------------------

    if (paiementType) {

        paiementType.textContent =
            categorie === "enfant"
                ? "ENFANT"
                : categorie === "adulte"
                    ? "ADULTE"
                    : "Non renseigné";
    }

    // -------------------------
    // AFFICHAGE STATUT
    // -------------------------

    if (paiementStatut) {
        paiementStatut.textContent =
            getStatutSafran();
    }

    // -------------------------
    // FORFAIT LUZ
    // -------------------------

    const forfaitClub =
        npy === "oui";

    if (paiementForfait) {

        paiementForfait.textContent =
            forfaitClub
                ? "Oui"
                : "Non";
    }

    // -------------------------
    // VÉRIFICATION TARIF
    // -------------------------

    const tarifs = window.TARIFS;

    if (
        !tarifs ||
        !tarifs[categorie] ||
        !tarifs[categorie][statut]
    ) {

        console.warn(
            "Tarif introuvable pour :",
            categorie,
            statut
        );

        if (paiementTotal) {
            paiementTotal.textContent =
                "Tarif non trouvé";
        }

        return 0;
    }

    const tarif =
        tarifs[categorie][statut];

    // -------------------------
    // CALCUL DE BASE
    // -------------------------

    let total =
        Number(tarif.cotisation) || 0;

    // -------------------------
    // FORFAIT LUZ
    // -------------------------

    if (forfaitClub) {

        total +=
            Number(tarif.forfaitLuz) || 0;
    }

    // -------------------------
    // LOCATION MATÉRIEL
    // -------------------------

    let locationPrix = 0;

    let packChoisi = null;

    if (materiel === "oui") {

        packChoisi =
            document.querySelector(
                'input[name="pack"]:checked'
            );

        if (
            packChoisi &&
            tarifs.location &&
            tarifs.location[categorie]
        ) 
		{

            locationPrix =
                Number(
                    tarifs.location[categorie][
                        packChoisi.value
                    ]
                ) || 0;

            total += locationPrix;
        }
		
		if (paiementLocation) {

			if (packChoisi && locationPrix > 0) {

				const nomsPacks = {
					pack1: "Ski + bâtons / Snow",
					pack2: "Chaussures",
					pack3: "Pack complet"
				};

				paiementLocation.textContent =
					`${nomsPacks[packChoisi.value]} — ${locationPrix} €`;

			} else {

				paiementLocation.textContent =
					"Pas de location";
			}
		}
		
		if (paiementCaution) {

			paiementCaution.style.display =
				packChoisi
					? "block"
					: "none";
		}
    }

    // -------------------------
    // AFFICHAGE DU MONTANT
    // -------------------------

    if (paiementTotal) {

        paiementTotal.textContent =
            total.toFixed(2) + " €";
    }

    // -------------------------
    // DEBUG
    // -------------------------

    console.log("===== CALCUL PAIEMENT =====");
    console.log("Catégorie :", categorie);
    console.log("Statut :", statut);
    console.log("N'Py :", npy);
    console.log("Forfait Luz :", forfaitClub);
    console.log(
        "Pack matériel :",
        packChoisi
            ? packChoisi.value
            : "Aucun"
    );
    console.log(
        "Prix location :",
        locationPrix
    );
    console.log(
        "TOTAL :",
        total
    );

    return total;
}

// =========================
// CHEQUES
// =========================

function updateCheques() {

    const total =
        calculPaiement();

    const nbElement =
        document.getElementById("nb-cheques");

    const detail =
        document.getElementById("detail-cheques");

    if (!nbElement || !detail) {
        return;
    }

    const nb =
        parseInt(nbElement.value);

    if (!nb || nb < 1) {

        detail.innerHTML = "";

        return;
    }


    /*
     * Répartition à l'unité près.
     *
     * Exemple :
     * 100 € / 3
     *
     * => 34 €
     * => 33 €
     * => 33 €
     */

    const montantBase =
        Math.floor(total / nb);

    const reste =
        Math.round(total - montantBase * nb);

    let html = "";

    for (
        let i = 1;
        i <= nb;
        i++
    ) {

        const montant =
            montantBase +
            (
                i <= reste
                    ? 1
                    : 0
            );

        html +=
            `<div>Chèque ${i} : <strong>${montant} €</strong></div>`;
    }

    detail.innerHTML = html;
}


// =========================
// RECAP COMPLET
// =========================

function updateRecapFinal() {

    // -------------------------
    // PARTICIPANT
    // -------------------------

    const finalNom =
        document.getElementById("final-nom");

    if (finalNom)
        finalNom.textContent =
            getValue("nom") || "-";


    const finalPrenom =
        document.getElementById("final-prenom");

    if (finalPrenom)
        finalPrenom.textContent =
            getValue("prenom") || "-";


    const finalEmail =
        document.getElementById("final-email");

    if (finalEmail)
        finalEmail.textContent =
            getValue("email") || "-";


    const finalTelephone =
        document.getElementById("final-telephone");

    if (finalTelephone)
        finalTelephone.textContent =
            getValue("telephone") || "-";


    const finalNaissance =
        document.getElementById("final-naissance");

    if (finalNaissance)
        finalNaissance.textContent =
            getValue("birthdate") || "-";


    // -------------------------
    // CATEGORIE
    // -------------------------

    const finalCategorie =
        document.getElementById("final-categorie");

    if (finalCategorie)
        finalCategorie.textContent =
            getCategorieParticipant() || "-";


    // -------------------------
    // ACTIVITE
    // -------------------------

    const finalSki =
        document.getElementById("final-ski");

    if (finalSki)
        finalSki.textContent =
            getValue("niveau_ski") || "-";


    const finalSnow =
        document.getElementById("final-snow");

    if (finalSnow)
        finalSnow.textContent =
            getValue("niveau_snow") || "-";


    const finalFederaux =
        document.getElementById("final-federaux");

    if (finalFederaux)
        finalFederaux.textContent =
            getValue("federaux-role") || "Non";


    const finalEsf =
        document.getElementById("final-esf");

    if (finalEsf)
        finalEsf.textContent =
            getValue("federaux-licence") || "-";


    // -------------------------
    // CONTACT URGENCE
    // -------------------------

    const finalUrgenceNom =
        document.getElementById(
            "final-urgence-nom"
        );

    if (finalUrgenceNom) {

        const nomUrgence =
            getValue("nom-urgence");

        const prenomUrgence =
            getValue("prenom-urgence");

        finalUrgenceNom.textContent =
            `${nomUrgence} ${prenomUrgence}`.trim()
            || "-";
    }


    const finalUrgenceTel =
        document.getElementById(
            "final-urgence-tel"
        );

    if (finalUrgenceTel)
        finalUrgenceTel.textContent =
            getValue("telephone-urgence")
            || "-";


    // -------------------------
    // MEDICAL
    // -------------------------

    const finalAllergies =
        document.getElementById(
            "final-allergies"
        );

    if (finalAllergies)
        finalAllergies.textContent =
            getAllergies();


    const finalTraitement =
        document.getElementById(
            "final-traitement"
        );

    if (finalTraitement)
        finalTraitement.textContent =
            getTraitement();


    // -------------------------
    // VERIFICATIONS
    // -------------------------

    verificationFinale();


    // -------------------------
    // PAIEMENT
    // -------------------------

    calculPaiement();
}


// =========================
// VERIFICATIONS
// =========================

function setVerif(id, ok) {

    const element =
        document.getElementById(id);

    if (!element) return;

    element.textContent =
        ok ? "OK" : "KO";

    element.classList.remove(
        "ok",
        "ko"
    );

    element.classList.add(
        ok ? "ok" : "ko"
    );
}


function verificationFinale() {

    // -------------------------
    // FORMULAIRE
    // -------------------------

    const formulaireOK =
        !!(
            getValue("nom") &&
            getValue("prenom") &&
            getValue("email") &&
            getValue("telephone") &&
            getValue("birthdate") &&
            getValue("adresse") &&
            getValue("niveau_ski") &&
            getValue("niveau_snow") &&
            getValue("materiel") &&
            getValue("federaux") &&
            getValue("encadrant") &&
            getValue("safran-status") &&
            getValue("npy")
        );

    setVerif(
        "verif-formulaire",
        formulaireOK
    );


    // -------------------------
    // FICHE SANITAIRE
    // -------------------------

    const sanitaireOK =
        !!(
            getValue("sanitaire-nom") &&
            getValue("sanitaire-prenom") &&
            getValue("sanitaire-tel") &&
            getValue("sanitaire-adresse") &&

            getNameValue("vaccins") &&
            getNameValue("traitement") &&

            getValue("nom-urgence") &&
            getValue("prenom-urgence") &&
            getValue("telephone-urgence") &&
            getValue("lien")
        );

    setVerif(
        "verif-sanitaire",
        sanitaireOK
    );


    // -------------------------
    // LOCATION
    // -------------------------

    const materiel =
        getValue("materiel");

    let locationOK = true;

    if (materiel === "oui") {

        const pack =
            document.querySelector(
                'input[name="pack"]:checked'
            );

        locationOK =
            !!(
                pack &&
                getValue("loc-taille") &&
                getValue("loc-poids") &&
                getValue("loc-pointure")
            );
    }

    setVerif(
        "verif-location",
        locationOK
    );


    // -------------------------
    // DROIT IMAGE
    // -------------------------

    setVerif(
        "verif-image",
        !!getValue("droit-image-accord")
    );


    // -------------------------
    // FEDERAUX
    // -------------------------

    let federauxOK = true;

    if (
        getValue("federaux") === "oui"
    ) {

        federauxOK =
            !!(
                getValue("federaux-role") &&
                getValue("federaux-discipline") &&
                getValue("federaux-licence") &&
                getValue("federaux-categorie")
            );
    }

    setVerif(
        "verif-federaux",
        federauxOK
    );
}


// =========================
// PAIEMENT : EVENEMENTS
// =========================

const moyenPaiement =
    document.getElementById("loc-paiement");

if (moyenPaiement) {

    moyenPaiement.addEventListener(
        "change",
        () => {

            const blocCheques =
                document.getElementById(
                    "bloc-cheques"
                );

            if (blocCheques) {

                blocCheques.style.display =
                    moyenPaiement.value === "Chèques"
                        ? "block"
                        : "none";
            }

            updateRecapFinal();
        }
    );
}


const nbCheques =
    document.getElementById("nb-cheques");

if (nbCheques) {

    nbCheques.addEventListener(
        "change",
        () => {

            updateCheques();
            updateRecapFinal();

        }
    );
}

// =========================
// FORMULAIRE MULTI-ETAPES
// =========================
const steps = document.querySelectorAll(".form-step");
steps.forEach(step => {
    if (!step.dataset.enabled) {
        step.dataset.enabled = "true";
    }
});

if (steps.length > 0) {

    const nextBtns = document.querySelectorAll(".next");
    const prevBtns = document.querySelectorAll(".prev");
    const progress = document.querySelector(".progress");

    let currentStep = 0;

    const mineurSection = document.getElementById("mineur-section");
    const materielSection = document.getElementById("materiel-section");
    const federauxSection = document.getElementById("federaux-section");

    // cacher au départ
    if (mineurSection) mineurSection.classList.add("step-disabled");
	if (materielSection) materielSection.classList.add("step-disabled");
	if (federauxSection) federauxSection.classList.add("step-disabled");


    function updateProgress() {
        progress.style.width = ((currentStep + 1) / steps.length) * 100 + "%";
    }

    function showStep(index) {

    steps.forEach(step => {
        step.classList.remove("active");
    });

    if (steps[index]) {
        steps[index].classList.add("active");
    }
	
	// Si on arrive sur l'étape récap
    if (steps[index].id === "recap-step") {
        updateRecapFinal();
    }

    updateProgress();
}

    // NEXT
    nextBtns.forEach(btn => {
        btn.addEventListener("click", () => {

            steps[currentStep].classList.remove("active");
            currentStep++;
			

            while (
                steps[currentStep] &&
                steps[currentStep].classList.contains("step-disabled")
            ) {
                currentStep++;
            }

            if (steps[currentStep]) {
                showStep(currentStep);
            }
        });
    });

    // PREV
    prevBtns.forEach(btn => {
        btn.addEventListener("click", () => {

            steps[currentStep].classList.remove("active");
            currentStep--;

            while (
                steps[currentStep] &&
                steps[currentStep].classList.contains("step-disabled")
            ) {
                currentStep--;
            }

            if (steps[currentStep]) {
                showStep(currentStep);
            }
        });
    });

    // CONDITIONS

    const birthdate = document.getElementById("birthdate");

	if (birthdate) {

		birthdate.addEventListener("change", function () {

			const today = new Date();
			const birth = new Date(this.value);

			let age = today.getFullYear() - birth.getFullYear();

			const monthDiff = today.getMonth() - birth.getMonth();

			if (
				monthDiff < 0 ||
				(monthDiff === 0 && today.getDate() < birth.getDate())
			) {
				age--;
			}

			if (mineurSection) {
				mineurSection.classList.toggle("step-disabled", age >= 18);
			}
		});
	}

    const materiel = document.getElementById("materiel");

	if (materiel) {

		materiel.addEventListener("change", function () {

			if (materielSection) {
				materielSection.classList.toggle("step-disabled", materiel.value !== "oui");
			}
		});
	}

    const federaux = document.getElementById("federaux");

	if (federaux) {

		federaux.addEventListener("change", function () {

			if (federauxSection) {
				federauxSection.classList.toggle("step-disabled", federaux.value !== "oui");
			}
		});
	}
	
	// =========================
	// FEDERAUX AUTO
	// =========================

	const nomInput = document.getElementById("nom");
	const prenomInput = document.getElementById("prenom");

	const federauxNom = document.getElementById("federaux-nom");
	const federauxRole = document.getElementById("federaux-role");
	const federauxDiscipline = document.getElementById("federaux-discipline");
	const federauxCategorie = document.getElementById("federaux-categorie");

	// auto nom prénom
	function updateFederauxNom() {

		if (!federauxNom) return;

		federauxNom.value =
			`${prenomInput.value} ${nomInput.value}`;
	}

	if (nomInput) {
		nomInput.addEventListener("input", updateFederauxNom);
	}

	if (prenomInput) {
		prenomInput.addEventListener("input", updateFederauxNom);
	}

	// catégorie auto
	function updateCategorie() {

		if (!federauxCategorie) return;

		const role = federauxRole.value;
		const discipline = federauxDiscipline.value;

		const birthdate = document.getElementById("birthdate").value;

		let texte = "";

		// =========================
		// CALCUL AGE
		// =========================

		let age = null;

		if (birthdate) {

			const naissance = new Date(birthdate);

			const today = new Date();

			age = today.getFullYear() - naissance.getFullYear();

			const m = today.getMonth() - naissance.getMonth();

			if (
				m < 0 ||
				(m === 0 && today.getDate() < naissance.getDate())
			) {
				age--;
			}
		}

		// =========================
		// CATEGORIES
		// =========================

		let categorieFFS = "";
		let categorieFSGT = "";

		// FFS / FIS
		if (age !== null) {

			if (age <= 12) categorieFFS = "U12";
			else if (age <= 14) categorieFFS = "U14";
			else if (age <= 16) categorieFFS = "U16";
			else if (age <= 18) categorieFFS = "U18";
			else if (age <= 21) categorieFFS = "U21";
			else if (age <= 30) categorieFFS = "U30";
			else if (age <= 40) categorieFFS = "Master";
			else categorieFFS = "Master+";
		}

		// FSGT
		if (age !== null) {

			if (age <= 10) categorieFSGT = "Poussin";
			else if (age <= 12) categorieFSGT = "Benjamin";
			else if (age <= 14) categorieFSGT = "Minime";
			else if (age <= 16) categorieFSGT = "Cadet";
			else if (age <= 20) categorieFSGT = "Junior";
			else if (age <= 30) categorieFSGT = "Senior";
			else if (age <= 40) categorieFSGT = "Master";
			else categorieFSGT = "Vétéran";
		}

		// =========================
		// TEXTE FINAL
		// =========================

		if (role === "Coureur") {

			texte =
	`FSGT HAUTES-PYRENNEES & CHAMPIONNAT FSGT: ${categorieFSGT} 
FIS SKI & FFS SKI : ${categorieFFS}`;

		}

		else if (role === "Officiel") {

			texte =
	`Participation en tant qu'officiel`;

		}

		else if (role === "Accompagnant") {

			texte =
	`Participation en tant qu'accompagnant`;

		}

		federauxCategorie.value = texte;
	}

	if (federauxRole) {
		federauxRole.addEventListener("change", updateCategorie);
	}

	if (federauxDiscipline) {
		federauxDiscipline.addEventListener("change", updateCategorie);
	}
	const birthdateInput = document.getElementById("birthdate");

	if (birthdateInput) {
		birthdateInput.addEventListener("change", updateCategorie);
	}

    showStep(currentStep);
}

let allData = [];

onSnapshot(collection(db, "inscriptions"), (snapshot) => {

    liste.innerHTML = "";
    allData = [];

    snapshot.forEach(doc => {
        const data = doc.data();
        allData.push(data);

        const div = document.createElement("div");
        div.classList.add("card");

        div.innerHTML = `
            <strong>${data.prenom} ${data.nom}</strong><br>
            📧 ${data.email || "—"}<br>
            📱 ${data.telephone || "—"}<br>
            🎂 ${data.dateNaissance || "—"}
        `;

        liste.appendChild(div);
    });
});

