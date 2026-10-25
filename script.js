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
    pack.addEventListener("change", () => {
        updateTarif();
        calculPaiement();
        updateRecapFinal();
    });
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

    const paiementType = document.getElementById("paiement-type");
    const paiementStatut = document.getElementById("paiement-statut");
    const paiementForfait = document.getElementById("paiement-forfait");
    const paiementLocation = document.getElementById("paiement-location");
    const paiementTotal = document.getElementById("paiement-total");
    const paiementCaution = document.getElementById("paiement-caution");

    let categorie = "";

    if (age !== null) {
        categorie = age < 18 ? "enfant" : "adulte";
    }

    if (paiementType) {
        paiementType.textContent =
            categorie === "enfant" ? "ENFANT" :
            categorie === "adulte" ? "ADULTE" :
            "Non renseigné";
    }

    if (paiementStatut) {
        paiementStatut.textContent = getStatutSafran();
    }

    const forfaitClub = npy === "oui";

    if (paiementForfait) {
        paiementForfait.textContent = forfaitClub ? "Oui" : "Non";
    }

    if (!categorie || !statut) {
        if (paiementTotal) paiementTotal.textContent = "Tarif non disponible";
        if (paiementLocation) paiementLocation.textContent = "Aucune";
        if (paiementCaution) paiementCaution.style.display = "none";
        return 0;
    }

    const tarifs = window.TARIFS;

    if (!tarifs || !tarifs[categorie] || !tarifs[categorie][statut]) {
        console.warn("Tarif introuvable pour :", categorie, statut);
        if (paiementTotal) paiementTotal.textContent = "Tarif non trouvé";
        return 0;
    }

    const tarif = tarifs[categorie][statut];

    let montantClub = Number(tarif.cotisation) || 0;

    if (forfaitClub) {
        montantClub += Number(tarif.forfaitLuz) || 0;
    }

    let montantLocation = 0;
    let libelleLocation = "Aucune";

    if (materiel === "oui") {

        const pack = document.querySelector('input[name="pack"]:checked');

        if (pack && tarifs.location && tarifs.location[categorie]) {

            montantLocation =
                Number(tarifs.location[categorie][pack.value]) || 0;

            const libelles = {
                pack1: "Ski + bâtons / Snow",
                pack2: "Chaussures",
                pack3: "Pack complet"
            };

            libelleLocation =
                `${libelles[pack.value] || pack.value} — ${montantLocation.toFixed(2)} €`;
        }
    }

    const total = montantClub + montantLocation;

    if (paiementLocation) {
        paiementLocation.textContent = libelleLocation;
    }

    if (paiementTotal) {
        paiementTotal.textContent =
            `${montantClub.toFixed(2)} € hors loc. matériel`;
    }

    // Dernier calcul disponible pour l'enregistrement Firebase.
    window.DERNIER_PAIEMENT = {
		cotisation: Number(tarif.cotisation) || 0,
        forfaitLuz: forfaitClub ? (Number(tarif.forfaitLuz) || 0) : 0,
        montantClub,
        montantLocation,
        total,
        location: libelleLocation,
        caution: montantLocation > 0 ? 100 : 0
    };

    if (paiementCaution) {
        paiementCaution.style.display =
            montantLocation > 0 ? "block" : "none";
    }

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

function setVerif(id, ok, intro, manquants) {

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

    // Explication sous le KO : ce qu'il faut faire pour passer à OK
    const detail =
        document.getElementById(id + "-detail");

    if (detail) {

        if (!ok && manquants && manquants.length) {

            detail.textContent =
                "Pour passer à OK, il faut " +
                intro + " : " +
                manquants.join(", ") + ".";

            detail.classList.add("visible");

        } else {

            detail.textContent = "";
            detail.classList.remove("visible");
        }
    }
}


function verificationFinale() {

    // Retourne les libellés des champs encore vides
    function vides(liste) {
        return liste
            .filter(([id]) => !getValue(id))
            .map(([id, libelle]) => libelle);
    }

    // -------------------------
    // FORMULAIRE
    // -------------------------

    const manqueFormulaire = vides([
        ["nom", "le nom"],
        ["prenom", "le prénom"],
        ["email", "l'adresse e-mail"],
        ["telephone", "le téléphone"],
        ["birthdate", "la date de naissance"],
        ["adresse", "l'adresse"],
        ["niveau_ski", "le niveau de ski"],
        ["niveau_snow", "le niveau de snow"],
        ["materiel", "la location de matériel (oui / non)"],
        ["federaux", "la participation aux fédéraux (oui / non)"],
        ["encadrant", "l'encadrement (oui / non)"],
        ["safran-status", "le statut (salarié, retraité, extérieur…)"],
        ["npy", "la commande / recharge de la carte N'Py (oui / non)"]
    ]);

    const formulaireOK = manqueFormulaire.length === 0;

    setVerif(
        "verif-formulaire",
        formulaireOK,
        "renseigner",
        manqueFormulaire
    );


    // -------------------------
    // FICHE SANITAIRE
    // -------------------------

    const manqueSanitaire = vides([
        ["sanitaire-nom", "le nom (recopié du formulaire)"],
        ["sanitaire-prenom", "le prénom (recopié du formulaire)"],
        ["sanitaire-tel", "le téléphone (recopié du formulaire)"],
        ["sanitaire-adresse", "l'adresse (recopiée du formulaire)"]
    ]);

    if (!getNameValue("vaccins")) {
        manqueSanitaire.push("les vaccins");
    }

    if (!getNameValue("traitement")) {
        manqueSanitaire.push("le traitement en cours (oui / non)");
    }

    manqueSanitaire.push(...vides([
        ["nom-urgence", "le nom du contact d'urgence"],
        ["prenom-urgence", "le prénom du contact d'urgence"],
        ["telephone-urgence", "le téléphone du contact d'urgence"],
        ["lien", "le lien avec le contact d'urgence"],
        ["accord-select", "le « Bon pour accord » (ou le refus) en bas de la fiche sanitaire"]
    ]));

    const sanitaireOK = manqueSanitaire.length === 0;

    setVerif(
        "verif-sanitaire",
        sanitaireOK,
        "renseigner",
        manqueSanitaire
    );


    // -------------------------
    // LOCATION
    // -------------------------

    const materiel =
        getValue("materiel");

    const manqueLocation = [];

    if (materiel === "oui") {

        const pack =
            document.querySelector(
                'input[name="pack"]:checked'
            );

        if (!pack) {
            manqueLocation.push("le pack choisi");
        }

        manqueLocation.push(...vides([
            ["loc-taille", "la taille"],
            ["loc-poids", "le poids"],
            ["loc-pointure", "la pointure"],
            ["loc-paiement", "le moyen de paiement de la location"]
        ]));
    }

    const locationOK = manqueLocation.length === 0;

    setVerif(
        "verif-location",
        locationOK,
        "renseigner",
        manqueLocation
    );


    // -------------------------
    // DROIT IMAGE
    // -------------------------

    const imageOK = !!getValue("droit-image-accord");

    setVerif(
        "verif-image",
        imageOK,
        "choisir",
        ["« Bon pour accord » ou « Refus pour accord » en bas de l'étape « Droit à l'image »"]
    );


    // -------------------------
    // FEDERAUX
    // -------------------------

    const manqueFederaux = [];

    if (getValue("federaux") === "oui") {

        manqueFederaux.push(...vides([
            ["federaux-role", "le rôle"],
            ["federaux-discipline", "la discipline"],
            ["federaux-licence", "le numéro de licence"],
            ["federaux-categorie", "la catégorie (calculée selon la date de naissance, le rôle et la discipline)"]
        ]));
    }

    const federauxOK = manqueFederaux.length === 0;

    setVerif(
        "verif-federaux",
        federauxOK,
        "renseigner",
        manqueFederaux
    );


    // -------------------------
    // DOCUMENTS
    // -------------------------

    const libellesDocuments = {
        "doc-cni": "la pièce d'identité",
        "doc-photo": "la photo d'identité",
        "doc-scolarite": "le certificat de scolarité",
        "doc-safran": "la capture d'écran ou le mail d'inscription ASCT"
    };

    const documentsOK =
        typeof window.verifierDocuments === "function"
            ? window.verifierDocuments()
            : false;

    const manqueDocuments = [];

    documentConfig.forEach(doc => {

        const input = document.getElementById(doc.input);

        if (!input) return;

        if (doc.input === "doc-scolarite" && !scolariteSelectionnee()) return;

        const aFichier = !!(input.files && input.files.length > 0);

        if (!aFichier) {

            const libelle = libellesDocuments[doc.input] || doc.input;

            manqueDocuments.push(
                input.dataset.erreur
                    ? libelle + " (fichier refusé : " + input.dataset.erreur + ")"
                    : libelle
            );
        }
    });

    setVerif(
        "verif-documents",
        documentsOK,
        "ajouter",
        manqueDocuments
    );


    // -------------------------
    // REGLEMENT (cotisation et forfait)
    // -------------------------

    const manqueReglement = [];

    const modeReglement = getValue("reglement-mode");

    if (!modeReglement) {

        manqueReglement.push("le moyen de paiement de la cotisation et du forfait");

    } else if (modeReglement === "Chèques") {

        if (!getValue("reglement-nb-cheques")) {
            manqueReglement.push("le nombre de chèques");
        }

        if (!getValue("reglement-banque")) {
            manqueReglement.push("le nom de la banque");
        }
    }

    const reglementOK = manqueReglement.length === 0;

    setVerif(
        "verif-reglement",
        reglementOK,
        "indiquer",
        manqueReglement
    );

    return {
        formulaireOK,
        sanitaireOK,
        locationOK,
        imageOK,
        federauxOK,
        documentsOK,
        reglementOK
    };
}



// =========================
// DOCUMENTS OBLIGATOIRES
// =========================

const documentConfig = [
    { input: "doc-cni", check: "doc-cni-check", name: "doc-cni-name", row: "document-cni-row" },
    { input: "doc-photo", check: "doc-photo-check", name: "doc-photo-name", row: "document-photo-row" },
    { input: "doc-scolarite", check: "doc-scolarite-check", name: "doc-scolarite-name", row: "document-scolarite-row" },
    { input: "doc-safran", check: "doc-safran-check", name: "doc-safran-name", row: "document-safran-row" }
];

function scolariteSelectionnee() {
    const valeur = getValue("scolarite");
    return !!valeur && valeur !== "Scolarité" && valeur !== "/";
}

function mettreAJourDocumentScolarite() {

    const row = document.getElementById("document-scolarite-row");
    const input = document.getElementById("doc-scolarite");
    const check = document.getElementById("doc-scolarite-check");
    const name = document.getElementById("doc-scolarite-name");

    if (!row) return;

    const visible = scolariteSelectionnee();

    row.style.display = visible ? "flex" : "none";

    if (!visible) {
        if (input) input.value = "";
        if (check) check.checked = false;
        if (name) name.textContent = "Aucun fichier";
    }
}

// Formats et taille acceptés pour les documents.
// À garder identiques aux règles Firebase Storage.
const FORMATS_DOCUMENTS_ACCEPTES = [
    "application/pdf",
    "image/jpeg",
    "image/png"
];

const TAILLE_MAX_DOCUMENT = 10 * 1024 * 1024; // 10 Mo

function messageErreurFichier(fichier) {

    if (!FORMATS_DOCUMENTS_ACCEPTES.includes(fichier.type)) {
        return "Format non accepté : utilisez un PDF, un JPG ou un PNG.";
    }

    if (fichier.size >= TAILLE_MAX_DOCUMENT) {
        return "Fichier trop volumineux : 10 Mo maximum.";
    }

    return "";
}

function mettreAJourEtatDocuments() {

    mettreAJourDocumentScolarite();

    documentConfig.forEach(doc => {

        const input = document.getElementById(doc.input);
        const check = document.getElementById(doc.check);
        const name = document.getElementById(doc.name);
        const row = document.getElementById(doc.row);

        if (!input || !check) return;

        // Contrôle du fichier qui vient d'être choisi
        if (input.files && input.files.length > 0) {

            const erreur = messageErreurFichier(input.files[0]);

            if (erreur) {
                input.dataset.erreur = erreur;
                input.value = "";
            } else {
                delete input.dataset.erreur;
            }
        }

        const hasFile = !!(input.files && input.files.length > 0);
        const erreurFichier = input.dataset.erreur || "";

        check.checked = hasFile;

        if (name) {

            if (hasFile) {
                name.textContent = input.files[0].name;
            } else if (erreurFichier) {
                name.textContent = "⚠️ " + erreurFichier;
            } else {
                name.textContent = "Aucun fichier";
            }

            name.classList.toggle("file-error", !hasFile && !!erreurFichier);
        }

        if (row) {
            row.classList.toggle("document-ok", hasFile);
        }
    });

    const obligatoire = documentConfig.filter(doc => {
        return doc.input === "doc-scolarite"
            ? scolariteSelectionnee()
            : true;
    });

    const complet = obligatoire.every(doc => {
        const input = document.getElementById(doc.input);
        return !!(input && input.files && input.files.length > 0);
    });

    const status = document.getElementById("documents-status");

    if (status) {
        status.textContent = complet
            ? "✅ Tous les documents obligatoires sont sélectionnés"
            : "⚠️ Documents manquants";

        status.classList.toggle("documents-complete", complet);
    }

    return complet;
}

window.verifierDocuments = mettreAJourEtatDocuments;

window.reinitialiserDocuments = function () {
    documentConfig.forEach(doc => {
        const input = document.getElementById(doc.input);
        const check = document.getElementById(doc.check);
        const name = document.getElementById(doc.name);
        const row = document.getElementById(doc.row);

        if (input) {
            input.value = "";
            delete input.dataset.erreur;
        }
        if (check) check.checked = false;
        if (name) {
            name.textContent = "Aucun fichier";
            name.classList.remove("file-error");
        }
        if (row) row.classList.remove("document-ok");
    });

    mettreAJourDocumentScolarite();
    mettreAJourEtatDocuments();
};

documentConfig.forEach(doc => {
    const input = document.getElementById(doc.input);

    if (input) {
        input.addEventListener("change", mettreAJourEtatDocuments);
    }
});

const scolariteDocuments = document.getElementById("scolarite");

if (scolariteDocuments) {
    scolariteDocuments.addEventListener("change", mettreAJourEtatDocuments);
}

mettreAJourDocumentScolarite();
mettreAJourEtatDocuments();

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
        mettreAJourEtatDocuments();
        updateRecapFinal();
    }

    updateProgress();
}

    // =========================
    // BON POUR ACCORD OBLIGATOIRE
    // (fiche sanitaire et droit à l'image) :
    // on ne passe pas à la suite sans accord OU refus.
    // =========================

    const SELECTS_ACCORD = ["accord-select", "droit-image-accord"];

    const MESSAGE_ACCORD =
        "⚠️ Vous devez indiquer votre accord ou votre refus " +
        "(« Bon pour accord » ou « Refus pour accord ») " +
        "pour passer à la suite.";

    function masquerErreurAccord(select) {

        select.classList.remove("champ-invalide");

        const message = select.parentElement
            ? select.parentElement.querySelector(".erreur-accord")
            : null;

        if (message) message.remove();
    }

    function afficherErreurAccord(select) {

        masquerErreurAccord(select);

        const message = document.createElement("p");

        message.className = "erreur-accord";
        message.setAttribute("role", "alert");
        message.textContent = MESSAGE_ACCORD;

        select.classList.add("champ-invalide");
        select.insertAdjacentElement("afterend", message);

        select.focus();

        if (select.scrollIntoView) {
            select.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }

    SELECTS_ACCORD.forEach(id => {

        const select = document.getElementById(id);

        if (select) {
            select.addEventListener("change", () => {
                if (select.value) masquerErreurAccord(select);
            });
        }
    });

    function verifierAccordEtape(etape) {

        if (!etape) return true;

        for (const id of SELECTS_ACCORD) {

            const select = etape.querySelector("#" + id);

            if (select && !select.value) {
                afficherErreurAccord(select);
                return false;
            }
        }

        return true;
    }

    // NEXT
    nextBtns.forEach(btn => {
        btn.addEventListener("click", () => {

            // Accord (ou refus) obligatoire pour continuer
            if (!verifierAccordEtape(steps[currentStep])) {
                return;
            }

            if (steps[currentStep] && steps[currentStep].id === "recap-step") {
                if (!window.verifierDocuments()) {
                    alert("⚠️ Vous devez sélectionner tous les documents obligatoires avant de continuer.");
                    return;
                }
            }

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

["materiel", "npy", "safran-status"].forEach(id => {
    const element = document.getElementById(id);

    if (element) {
        element.addEventListener("change", () => {
            calculPaiement();
            updateRecapFinal();
        });
    }
});