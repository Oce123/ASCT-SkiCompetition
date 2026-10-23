const {
    onDocumentCreated
} = require("firebase-functions/v2/firestore");

const {
    defineSecret
} = require("firebase-functions/params");

const admin = require("firebase-admin");

const {
    google
} = require("googleapis");

const PDFDocument = require("pdfkit");

const axios = require("axios");

const path = require("path");


// ============================================================
// FIREBASE
// ============================================================

admin.initializeApp();

const db = admin.firestore();


// ============================================================
// SECRETS GOOGLE
// ============================================================

const GOOGLE_CLIENT_ID =
    defineSecret("GOOGLE_CLIENT_ID");

const GOOGLE_CLIENT_SECRET =
    defineSecret("GOOGLE_CLIENT_SECRET");

const GOOGLE_DRIVE_REFRESH_TOKEN =
    defineSecret("GOOGLE_DRIVE_REFRESH_TOKEN");


// ============================================================
// CONFIGURATION
// ============================================================

const DRIVE_ROOT_FOLDER_ID =
    "14w4f8GmX4bFi5J4mevpv1UwychosQ2p3";

const SAISON =
    "2026-2027";


// ============================================================
// AUTHENTIFICATION GOOGLE DRIVE
// ============================================================

function getGoogleDrive() {

    const auth =
        new google.auth.OAuth2(
            GOOGLE_CLIENT_ID.value(),
            GOOGLE_CLIENT_SECRET.value()
        );

    auth.setCredentials({
        refresh_token:
            GOOGLE_DRIVE_REFRESH_TOKEN.value()
    });

    return google.drive({
        version: "v3",
        auth
    });
}


// ============================================================
// NETTOYAGE DES NOMS
// ============================================================

function safeName(value) {

    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[<>:"/\\|?*]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .substring(0, 100);
}


// ============================================================
// TROUVER / CRÉER UN DOSSIER
// ============================================================

async function getOrCreateFolder(
    drive,
    name,
    parentId,
    appProperties = {}
) {

    const safe = safeName(name);

    // ========================================================
    // 1. RECHERCHE PAR IDENTIFIANT TECHNIQUE
    // ========================================================
    //
    // Pour une famille, on utilise le familleId.
    // Le nom du dossier n'est donc PAS l'identifiant.
    //

    let response;

    const propertyEntries =
        Object.entries(appProperties);

    if (propertyEntries.length > 0) {

        const propertiesQuery =
            propertyEntries
                .map(
                    ([key, value]) =>
                        `appProperties has { key='${key}' and value='${String(value).replace(/'/g, "\\'")}' }`
                )
                .join(" and ");

        response =
            await drive.files.list({

                q:
                    `'${parentId}' in parents` +
                    ` and ${propertiesQuery}` +
                    ` and mimeType = 'application/vnd.google-apps.folder'` +
                    ` and trashed = false`,

                fields:
                    "files(id,name,appProperties)",

                spaces:
                    "drive"

            });

        if (
            response.data.files &&
            response.data.files.length > 0
        ) {

            const folder =
                response.data.files[0];

            console.log(
                "📁 Dossier existant retrouvé par identifiant :",
                folder.name
            );

            return folder.id;

        }
    }


    // ========================================================
    // 2. RECHERCHE PAR NOM
    // ========================================================
    //
    // Utile notamment pour récupérer un ancien dossier
    // créé avant la mise en place de l'identifiant famille.
    //

    response =
        await drive.files.list({

            q:
                `'${parentId}' in parents` +
                ` and name = '${safe.replace(/'/g, "\\'")}'` +
                ` and mimeType = 'application/vnd.google-apps.folder'` +
                ` and trashed = false`,

            fields:
                "files(id,name,appProperties)",

            spaces:
                "drive"

        });


    if (
        response.data.files &&
        response.data.files.length > 0
    ) {

        const folder =
            response.data.files[0];


        // ====================================================
        // ON AJOUTE LES IDENTIFIANTS TECHNIQUES
        // À L'ANCIEN DOSSIER
        // ====================================================

        if (propertyEntries.length > 0) {

            await drive.files.update({

                fileId:
                    folder.id,

                requestBody: {

                    appProperties

                },

                fields:
                    "id,name,appProperties"

            });

            console.log(
                "🔗 Ancien dossier relié à son identifiant :",
                safe
            );

        }


        return folder.id;

    }


    // ========================================================
    // 3. CRÉATION DU DOSSIER
    // ========================================================

    const requestBody = {

        name: safe,

        mimeType:
            "application/vnd.google-apps.folder",

        parents: [
            parentId
        ]

    };


    if (propertyEntries.length > 0) {

        requestBody.appProperties =
            appProperties;

    }


    const created =
        await drive.files.create({

            requestBody,

            fields:
                "id,name,appProperties"

        });


    console.log(
        "📁 Dossier créé :",
        safe
    );


    return created.data.id;
}


// ============================================================
// CRÉATION DE L'ARBORESCENCE
// ============================================================

async function prepareDriveFolders(
    drive,
    inscription
) {

    const familleId =
        inscription.familleId;

    const membreId =
        inscription.membreId;


    if (!familleId) {

        throw new Error(
            "familleId manquant"
        );

    }


    if (!membreId) {

        throw new Error(
            "membreId manquant"
        );

    }


    // --------------------------------------------------------
    // FAMILLE
    // --------------------------------------------------------

    const familleRef =
        db.doc(
            `familles/${familleId}`
        );

    const familleSnap =
        await familleRef.get();

    const famille =
        familleSnap.exists
            ? familleSnap.data()
            : {};


    // --------------------------------------------------------
	// FAMILLE
	// --------------------------------------------------------
	//
	// Le nom affiché vient du responsable du compte.
	// L'identité réelle de la famille est le familleId.
	//
	// Exemple :
	//
	// familleId = "abc123..."
	// nomResponsable = "Dupont"
	//
	// Google Drive :
	// Famille DUPONT
	//
	// Si un enfant s'appelle Martin, cela ne change rien.
	// Il restera dans cette même famille.
	// --------------------------------------------------------

	const familleNom =
		famille.nomResponsable ||
		"Famille";


	const familleFolderName =
		`Famille ${safeName(familleNom).toUpperCase()}`;


	const familleFolderId =
		await getOrCreateFolder(

			drive,

			familleFolderName,

			DRIVE_ROOT_FOLDER_ID,

			{
				familleId: familleId
			}

		);


    // --------------------------------------------------------
    // MEMBRE
    // --------------------------------------------------------

    const membreRef =
        db.doc(
            `familles/${familleId}/membres/${membreId}`
        );

    const membreSnap =
        await membreRef.get();

    const membre =
        membreSnap.exists
            ? membreSnap.data()
            : {};


    const prenom =
        membre.prenom ||
        inscription.prenom ||
        "Participant";


    const nom =
        membre.nom ||
        inscription.nom ||
        "SansNom";


    const membreFolderName =
        `${safeName(prenom)} ${safeName(nom)}`;


    const membreFolderId =
        await getOrCreateFolder(
            drive,
            membreFolderName,
            familleFolderId
        );


    // --------------------------------------------------------
    // SAISON
    // --------------------------------------------------------

    const saisonFolderId =
        await getOrCreateFolder(
            drive,
            `Saison ${SAISON}`,
            membreFolderId
        );


    return {

        familleFolderId,

        membreFolderId,

        saisonFolderId

    };

}


// ============================================================
// GENERATION DU PDF
// ============================================================

async function generateRegistrationPdf(
    inscription
) {

    return new Promise(
        (resolve, reject) => {

            const doc =
                new PDFDocument({
                    size: "A4",
                    margin: 45
                });

            const chunks = [];

            doc.on(
                "data",
                chunk => chunks.push(chunk)
            );

            doc.on(
                "end",
                () => {

                    resolve(
                        Buffer.concat(chunks)
                    );

                }
            );

            doc.on(
                "error",
                reject
            );


            // ------------------------------------------------
            // TITRE
            // ------------------------------------------------

            doc
                .fontSize(22)
                .font("Helvetica-Bold")
                .text(
                    "ASCT SKI COMPÉTITION",
                    {
                        align: "center"
                    }
                );

            doc
                .moveDown(0.5)
                .fontSize(16)
                .text(
                    "Fiche d'inscription",
                    {
                        align: "center"
                    }
                );

            doc
                .moveDown(0.3)
                .fontSize(11)
                .font("Helvetica")
                .text(
                    `Saison ${SAISON}`,
                    {
                        align: "center"
                    }
                );


            doc.moveDown(2);
			
			function section(title) {
				// Réinitialiser explicitement le style du texte
				doc.font("Helvetica-Bold");
				doc.fontSize(13);
				doc.fillColor("#1D3557");

				doc.moveDown(0.7);

				// Forcer un nouveau bloc de texte indépendant
				doc.text(title, {
					continued: false,
					lineBreak: true
				});

				// Réinitialiser le style pour les champs suivants
				doc.moveDown(0.2);
				doc.font("Helvetica");
				doc.fontSize(10);
				doc.fillColor("#000000");
			}

            function field(label, value) {

                doc
                    .font("Helvetica-Bold")
                    .text(
                        `${label} : `,
                        {
                            continued: true
                        }
                    )
                    .font("Helvetica")
                    .text(
                        value || "-"
                    );

            }


            // ------------------------------------------------
            // PARTICIPANT
            // ------------------------------------------------

            section(
                "1. Participant"
            );

            field(
                "Nom",
                inscription.nom
            );

            field(
                "Prénom",
                inscription.prenom
            );

            field(
                "Date de naissance",
                inscription.dateNaissance
            );

            field(
                "Sexe",
                inscription.sexe
            );


            field(
                "Email",
                inscription.email
            );

            field(
                "Téléphone",
                inscription.telephone
            );

            field(
                "Adresse",
                inscription.adresse
            );

            field(
                "Code postal",
                inscription.codePostal
            );

            field(
                "Ville",
                inscription.ville
            );



            // ------------------------------------------------
            // ACTIVITÉ
            // ------------------------------------------------

            section(
                "2. Activité"
            );

            field(
                "Niveau ski",
                inscription.niveauSki
            );

            field(
                "Niveau snow",
                inscription.niveauSnow
            );

            field(
                "Scolarité",
                inscription.scolarite
            );

            field(
                "Location matériel",
                inscription.materiel
            );

            if (inscription.materiel === "oui") {

                field(
                    "Pack loué",
                    inscription.locationMateriel &&
                    inscription.locationMateriel !== "Aucune"
                        ? inscription.locationMateriel
                        : ""
                );

                field(
                    "Taille",
                    inscription.locationTaille
                );

                field(
                    "Poids",
                    inscription.locationPoids
                );

                field(
                    "Pointure",
                    inscription.locationPointure
                );
            }


            field(
                "Participation fédéraux",
                inscription.federaux
            );

            if (inscription.federaux === "oui") {

                field(
                    "Fédéraux : en tant que",
                    inscription.federauxRole
                );

                field(
                    "Fédéraux : discipline",
                    inscription.federauxDiscipline
                );

                field(
                    "Fédéraux : licence",
                    inscription.federauxLicence
                );

                field(
                    "Fédéraux : catégorie course",
                    inscription.federauxCategorie
                );
            }


            field(
                "Encadrant",
                inscription.encadrant
            );


            // ------------------------------------------------
            // SAFRAN
            // ------------------------------------------------

            section(
                "3. Situation SAFRAN"
            );

            field(
                "Statut SAFRAN",
                inscription.statutSafran
            );

            field(
                "Service",
                inscription.service
            );

            field(
                "Correspondant",
                inscription.correspondant
            );

            if (inscription.telephoneTm || inscription.emailTm) {

                field(
                    "Téléphone TM",
                    inscription.telephoneTm
                );

                field(
                    "E-mail TM",
                    inscription.emailTm
                );
            }


            field(
                "QF",
                inscription.qf
            );


            // ------------------------------------------------
            // N'PY
            // ------------------------------------------------

            section(
                "4. Carte N'Py"
            );

            field(
                "Commande / recharge",
                inscription.forfaitNpy
            );

            field(
                "Numéro N'Py",
                inscription.numeroNpy
            );


            // ------------------------------------------------
            // URGENCE
            // ------------------------------------------------

            section(
                "5. Contact d'urgence"
            );

            field(
                "Contact",
                inscription.contactUrgence
            );

            field(
                "Téléphone",
                inscription.telephoneUrgence
            );

            field(
                "Lien",
                inscription.lienUrgence
            );


            // ------------------------------------------------
            // REPRÉSENTANTS LÉGAUX (mineurs)
            // ------------------------------------------------

            const aResponsableLegal = [
                "responsableLegal1Nom",
                "responsableLegal1Prenom",
                "responsableLegal1Telephone",
                "responsableLegal1Email",
                "responsableLegal2Nom",
                "responsableLegal2Prenom",
                "responsableLegal2Telephone",
                "responsableLegal2Email"
            ].some(cle => inscription[cle]);

            if (aResponsableLegal) {

                section(
                    "5 bis. Représentants légaux"
                );

                field(
                    "Représentant légal 1",
                    `${inscription.responsableLegal1Prenom || ""} ${inscription.responsableLegal1Nom || ""}`.trim()
                );

                field(
                    "Téléphone",
                    inscription.responsableLegal1Telephone
                );

                field(
                    "Email",
                    inscription.responsableLegal1Email
                );

                if (
                    inscription.responsableLegal2Nom ||
                    inscription.responsableLegal2Prenom ||
                    inscription.responsableLegal2Telephone ||
                    inscription.responsableLegal2Email
                ) {

                    field(
                        "Représentant légal 2",
                        `${inscription.responsableLegal2Prenom || ""} ${inscription.responsableLegal2Nom || ""}`.trim()
                    );

                    field(
                        "Téléphone",
                        inscription.responsableLegal2Telephone
                    );

                    field(
                        "Email",
                        inscription.responsableLegal2Email
                    );
                }
            }

            // ------------------------------------------------
			// MÉDICAL
			// ------------------------------------------------

			section(
				"6. Informations médicales"
			);

			field(
				"Vaccins",
				inscription.vaccins
			);

			field(
				"Traitement",
				inscription.traitement
			);

			field(
				"Détails traitement",
				inscription.detailsTraitement
			);

			field(
				"Allergies",
				inscription.allergies
			);

			field(
				"Détails allergies",
				inscription.allergiesDetails
			);

			field(
				"Antécédents",
				inscription.antecedents
			);

			field(
				"Maladies infantiles",
				inscription.maladies
			);

			field(
				"Recommandations",
				inscription.recommandations
			);

			field(
				"Groupe sanguin",
				inscription.groupeSanguin
			);

			field(
				"Médecin",
				inscription.medecin
			);

            // ------------------------------------------------
			// DROITS
			// ------------------------------------------------

			section(
				"7. Autorisations"
			);

			field(
				"Droit à l'image",
				inscription.droitImageAccord
			);

			field(
				"WhatsApp",
				inscription.whatsappAccord
			);

			field(
				"Cloud",
				inscription.cloudAccord
			);

			// Ancienne autorisation (retirée du formulaire) :
			// affichée seulement pour les anciennes inscriptions.
			if (inscription.calendrierAccord) {

				field(
					"Calendrier",
					inscription.calendrierAccord
				);
			}

			field(
				"Photos / vidéos",
				inscription.photosVideosAccord
			);

			field(
				"Ville",
				inscription.droitImageVille
			);

			field(
				"Date",
				inscription.droitImageDate
			);


            // ------------------------------------------------
            // PAIEMENT
            // ------------------------------------------------

            section(
                "8. Paiement"
            );

            if (inscription.montantCotisation !== undefined) {

                field(
                    "Cotisation",
                    `${inscription.montantCotisation || 0} €`
                );

                field(
                    "Forfait Luz Ardiden",
                    inscription.forfaitNpy === "oui"
                        ? `${inscription.montantForfaitLuz || 0} €`
                        : "Non"
                );

            } else {

                field(
                    "Forfait Luz Ardiden",
                    inscription.forfaitNpy === "oui" ? "Oui" : "Non"
                );
            }

            field(
                "Montant club",
                `${inscription.montantClub || 0} €`
            );

            field(
                "Location matériel",
                `${inscription.montantLocation || 0} €`
            );

            field(
                "Montant total",
                `${inscription.montantTotal || 0} €`
            );

            field(
                "Caution matériel",
                `${inscription.cautionMateriel || 0} €`
            );

            field(
                "Règlement cotisation / forfait",
                inscription.modePaiement
            );

            if (inscription.modePaiement === "Chèques") {

                field(
                    "Nombre de chèques (cotisation)",
                    inscription.nombreCheques
                );

                field(
                    "Banque (chèques cotisation)",
                    inscription.banqueCheques
                );
            }

            if (inscription.materiel === "oui") {

                field(
                    "Règlement location",
                    inscription.locationModePaiement
                );
            }

            if (inscription.locationBanque) {

                field(
                    "Banque du chèque de caution",
                    inscription.locationBanque
                );
            }



            // ------------------------------------------------
            // SIGNATURE
            // ------------------------------------------------

            section(
                "9. Signature"
            );

            field(
                "Ville",
                inscription.signatureVille
            );

            field(
                "Accord",
                inscription.signatureAccord
            );


            doc
                .moveDown(2)
                .fontSize(8)
                .fillColor("#777777")
                .text(
                    `Document généré automatiquement le ${new Date().toLocaleString("fr-FR")}`,
                    {
                        align: "center"
                    }
                );


            doc.end();

        }
    );

}


// ============================================================
// UPLOAD PDF
// ============================================================

async function uploadBufferToDrive(
    drive,
    buffer,
    fileName,
    mimeType,
    parentId
) {

    const { Readable } =
        require("stream");

    const stream =
        Readable.from(buffer);

    const result =
        await drive.files.create({

            requestBody: {

                name: fileName,

                parents: [
                    parentId
                ]

            },

            media: {

                mimeType,

                body: stream

            },

            fields:
                "id,name,webViewLink"

        });


    return result.data;

}


// ============================================================
// TELECHARGER UN DOCUMENT
// ============================================================

async function downloadDocument(
    url
) {

    const response =
        await axios.get(
            url,
            {
                responseType:
                    "arraybuffer"
            }
        );

    return {

        buffer:
            Buffer.from(
                response.data
            ),

        contentType:
            response.headers[
                "content-type"
            ] ||
            "application/octet-stream"

    };

}


// ============================================================
// ARCHIVAGE DES DOCUMENTS
// ============================================================

async function archiveDocuments(
    drive,
    inscription,
    folderId
) {

    const documents =
        inscription.documents || {};


    for (
        const [key, documentInfo]
        of Object.entries(documents)
    ) {

        if (
            !documentInfo ||
            !documentInfo.url
        ) {

            continue;

        }


        console.log(
            "📄 Archivage :",
            key
        );


        const downloaded =
            await downloadDocument(
                documentInfo.url
            );


        let extension =
            path.extname(
                documentInfo.nom || ""
            );


        if (!extension) {

            extension = ".bin";

        }


        const names = {

            cni:
                "CNI",

            photo:
                "Photo",

            safran:
                "SAFRAN",

            scolarite:
                "Certificat scolaire"

        };


        const fileName =
            `${names[key] || key}${extension}`;

		
		await uploadBufferToDrive(
			drive,
			downloaded.buffer,
			fileName,
			downloaded.contentType,
			folderId
		);

		console.log(
			"✅ Document archivé :",
			fileName
		);
    }

}


// ============================================================
// CLOUD FUNCTION
// ============================================================

exports.archiverInscription =
    onDocumentCreated(

        {
            document:
                "inscriptions/{inscriptionId}",

            region:
                "europe-west1",

            secrets: [

                GOOGLE_CLIENT_ID,

                GOOGLE_CLIENT_SECRET,

                GOOGLE_DRIVE_REFRESH_TOKEN

            ]

        },

        async event => {

            const snapshot =
                event.data;

            if (!snapshot) {

                return;

            }


            const inscription =
                snapshot.data();

            const inscriptionId =
                snapshot.id;


            console.log(
                "================================="
            );

            console.log(
                "📥 NOUVELLE INSCRIPTION"
            );

            console.log(
                inscriptionId
            );

            console.log(
                "================================="
            );


            // ------------------------------------------------
            // Vérification
            // ------------------------------------------------

            if (
                !inscription.familleId
            ) {

                console.error(
                    "❌ familleId manquant"
                );

                return;

            }


            if (
                !inscription.membreId
            ) {

                console.error(
                    "❌ membreId manquant"
                );

                return;

            }


            try {

                const drive =
                    getGoogleDrive();


                // ------------------------------------------------
                // Dossiers
                // ------------------------------------------------

                const folders =
                    await prepareDriveFolders(
                        drive,
                        inscription
                    );


                // ------------------------------------------------
                // PDF
                // ------------------------------------------------

                console.log(
                    "📄 Génération du PDF..."
                );

                const pdfBuffer =
                    await generateRegistrationPdf(
                        inscription
                    );


                const prenom =
                    safeName(
                        inscription.prenom
                    );

                const nom =
                    safeName(
                        inscription.nom
                    );


                
				const pdfFile = await uploadBufferToDrive(
					drive,
					pdfBuffer,
					"Fiche inscription.pdf",
					"application/pdf",
					folders.saisonFolderId
				);



                console.log(
                    "✅ PDF archivé"
                );


                // ------------------------------------------------
                // DOCUMENTS
                // ------------------------------------------------

                await archiveDocuments(

                    drive,

                    inscription,

                    folders.saisonFolderId

                );


                // ------------------------------------------------
                // FIRESTORE
                // ------------------------------------------------

                await db
                    .collection("inscriptions")
                    .doc(inscriptionId)
                    .update({
						driveArchive: "archivée",
						driveArchiveDate: new Date().toISOString(),
						driveSaison: SAISON,

						drivePdfId: pdfFile.id,
						drivePdfUrl: pdfFile.webViewLink
					});

                console.log("=================================");
                console.log("🎉 ARCHIVAGE TERMINÉ");
                console.log("=================================");


            } catch (error) {
                console.error("❌ ERREUR ARCHIVAGE DRIVE");
                console.error(error);


                await db
                    .collection("inscriptions")
                    .doc(inscriptionId)
                    .update({

                        driveArchive:
                            "erreur",

                        driveArchiveError:
                            error.message,

                        driveArchiveDate:
                            new Date().toISOString()

                    });
                throw error;
            }

        }
    );