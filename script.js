const formulaire = document.getElementById("prayer-form");
const champTitre = document.getElementById("titre");
const champCategorie = document.getElementById("categorie");
const champDetails = document.getElementById("details");
const listePrieres = document.getElementById("prayer-list");
const messageVide = document.getElementById("message-vide");

// Charger les sujets enregistrés dans le navigateur
let prieres = JSON.parse(localStorage.getItem("mesPrieres")) || [];

// Enregistrer les sujets
function sauvegarderPrieres() {
    localStorage.setItem("mesPrieres", JSON.stringify(prieres));
}

// Afficher les sujets de prière
function afficherPrieres() {
    listePrieres.innerHTML = "";

    if (prieres.length === 0) {
        listePrieres.appendChild(messageVide);
        messageVide.style.display = "block";
        return;
    }

    prieres.forEach(function (priere) {
        const carte = document.createElement("article");
        carte.className = "prayer-card";

        const titre = document.createElement("h3");
        titre.textContent = priere.titre;

        const categorie = document.createElement("p");
        categorie.className = "categorie";
        categorie.textContent = "Catégorie : " + priere.categorie;

        const details = document.createElement("p");
        details.textContent = priere.details || "Aucun détail ajouté.";

        const boutonSupprimer = document.createElement("button");
        boutonSupprimer.textContent = "Supprimer";
        boutonSupprimer.className = "delete-button";
        boutonSupprimer.type = "button";

        boutonSupprimer.addEventListener("click", function () {
            prieres = prieres.filter(function (element) {
                return element.id !== priere.id;
            });

            sauvegarderPrieres();
            afficherPrieres();
        });

        carte.appendChild(titre);
        carte.appendChild(categorie);
        carte.appendChild(details);
        carte.appendChild(boutonSupprimer);

        listePrieres.appendChild(carte);
    });
}

// Ajouter un nouveau sujet
formulaire.addEventListener("submit", function (event) {
    event.preventDefault();

    const nouvellePriere = {
        id: Date.now(),
        titre: champTitre.value.trim(),
        categorie: champCategorie.value,
        details: champDetails.value.trim()
    };

    if (nouvellePriere.titre === "") {
        alert("Veuillez saisir un sujet de prière.");
        return;
    }

    prieres.push(nouvellePriere);

    sauvegarderPrieres();
    afficherPrieres();

    formulaire.reset();

    alert("Ton sujet de prière a été ajouté !");
});

// Afficher les sujets au démarrage
afficherPrieres();

/* PROGRAMME DE PRIERE SUR 7 JOURS */

const joursPriere = [
    {
        jour: 1,
        theme: "La reconnaissance",
        reference: "Psaume 100:4",
        reflexion: "Prends un moment pour remercier Dieu pour les bienfaits de ta vie."
    },
    {
        jour: 2,
        theme: "La confiance en Dieu",
        reference: "Proverbes 3:5-6",
        reflexion: "Confie tes projets à Dieu et prends le temps de prier pour être guidé."
    },
    {
        jour: 3,
        theme: "La famille",
        reference: "Josué 24:15",
        reflexion: "Prie pour ta famille, l'unité, l'amour et la paix dans ton foyer."
    },
    {
        jour: 4,
        theme: "La paix intérieure",
        reference: "Philippiens 4:6-7",
        reflexion: "Exprime tes inquiétudes dans la prière et médite sur la paix de Dieu."
    },
    {
        jour: 5,
        theme: "La sagesse",
        reference: "Jacques 1:5",
        reflexion: "Demande à Dieu de t'aider à prendre de bonnes décisions."
    },
    {
        jour: 6,
        theme: "Le pardon",
        reference: "Éphésiens 4:32",
        reflexion: "Prends le temps de réfléchir au pardon et à la bonté envers les autres."
    },
    {
        jour: 7,
        theme: "La foi et l'espérance",
        reference: "Hébreux 11:1",
        reflexion: "Médite sur la foi et confie ton avenir à Dieu."
    }
];

const programmeListe = document.getElementById("programme-liste");
const progressionTexte = document.getElementById("progression-texte");
const progressionRemplissage = document.getElementById("progression-remplissage");
const progressionBarre = document.getElementById("progression-barre");
const boutonReinitialiser = document.getElementById("reinitialiser-programme");

// Charger les jours déjà terminés
let joursTermines = JSON.parse(
    localStorage.getItem("joursPriereTermines")
) || [];

// Afficher les sept journées
function afficherProgramme() {
    programmeListe.innerHTML = "";

    joursPriere.forEach(function (jour) {
        const termine = joursTermines.includes(jour.jour);

        const carte = document.createElement("article");
        carte.className = "journee-priere";

        if (termine) {
            carte.classList.add("terminee");
        }

        const titre = document.createElement("h3");
        titre.textContent = "Jour " + jour.jour + " : " + jour.theme;

        const reference = document.createElement("p");
        reference.textContent = "📖 À lire : " + jour.reference;

        const reflexion = document.createElement("p");
        reflexion.textContent = jour.reflexion;

        const label = document.createElement("label");
        const caseCoche = document.createElement("input");

        caseCoche.type = "checkbox";
        caseCoche.checked = termine;

        const texteCase = document.createElement("span");
        texteCase.textContent = termine
            ? "Journée terminée ✓"
            : "Marquer cette journée comme terminée";

        caseCoche.addEventListener("change", function () {
            if (caseCoche.checked) {
                if (!joursTermines.includes(jour.jour)) {
                    joursTermines.push(jour.jour);
                }
            } else {
                joursTermines = joursTermines.filter(function (numero) {
                    return numero !== jour.jour;
                });
            }

            localStorage.setItem(
                "joursPriereTermines",
                JSON.stringify(joursTermines)
            );

            afficherProgramme();
        });

        label.appendChild(caseCoche);
        label.appendChild(texteCase);

        carte.appendChild(titre);
        carte.appendChild(reference);
        carte.appendChild(reflexion);
        carte.appendChild(label);

        programmeListe.appendChild(carte);
    });

    // Mettre à jour la progression
    const nombreTermines = joursTermines.length;
    const pourcentage = (nombreTermines / joursPriere.length) * 100;

    progressionTexte.textContent =
        nombreTermines + " sur " + joursPriere.length + " jours";

    progressionRemplissage.style.width = pourcentage + "%";
    progressionBarre.setAttribute("aria-valuenow", nombreTermines);
}

// Réinitialiser le programme
boutonReinitialiser.addEventListener("click", function () {
    const confirmer = confirm(
        "Veux-tu vraiment recommencer le programme depuis le début ?"
    );

    if (confirmer) {
        joursTermines = [];

        localStorage.setItem(
            "joursPriereTermines",
            JSON.stringify(joursTermines)
        );

        afficherProgramme();
    }
});

// Afficher le programme dès l'ouverture de la page
afficherProgramme();

/* JOURNAL SPIRITUEL */

// Recuperer les elements HTML
const journalForm = document.getElementById("journal-form");
const journalTitre = document.getElementById("journal-titre");
const journalType = document.getElementById("journal-type");
const journalReference = document.getElementById("journal-reference");
const journalContenu = document.getElementById("journal-contenu");
const journalListe = document.getElementById("journal-liste");
const journalCompteur = document.getElementById("journal-compteur");
const journalBouton = document.getElementById("journal-bouton");
const journalAnnuler = document.getElementById("journal-annuler");

// Charger les notes sauvegardees
let notesJournal = JSON.parse(
    localStorage.getItem("notesJournal")
) || [];

// Identifier la note en cours de modification
let noteEnModification = null;

// Sauvegarder les notes dans le navigateur
function sauvegarderJournal() {
    localStorage.setItem(
        "notesJournal",
        JSON.stringify(notesJournal)
    );
}

// Afficher toutes les notes
function afficherJournal() {
    journalListe.innerHTML = "";

    journalCompteur.textContent =
        notesJournal.length +
        (notesJournal.length > 1 ? " notes" : " note");

    if (notesJournal.length === 0) {
        const message = document.createElement("p");
        message.textContent =
            "Ton journal est encore vide. Tu peux écrire ta première note.";

        journalListe.appendChild(message);
        return;
    }

    // Afficher les notes les plus recentes en premier
    const notesTriees = [...notesJournal].reverse();

    notesTriees.forEach(function (note) {
        const carte = document.createElement("article");
        carte.className = "journal-carte";

        const titre = document.createElement("h4");
        titre.textContent = note.titre;

        const type = document.createElement("p");
        type.className = "journal-meta";
        type.textContent = "Type : " + note.type;

        const date = document.createElement("p");
        date.className = "journal-meta";

        const dateModif = new Date(note.modifieeLe || note.date);
        date.textContent = "Dernière modification : " +
            dateModif.toLocaleString("fr-FR");

        const contenu = document.createElement("p");
        contenu.textContent = note.contenu;

        carte.appendChild(titre);
        carte.appendChild(type);

        if (note.reference) {
            const reference = document.createElement("p");
            reference.className = "journal-reference";
            reference.textContent =
                "📖 Référence : " + note.reference;

            carte.appendChild(reference);
        }

        carte.appendChild(contenu);
        carte.appendChild(date);

        // Creer les boutons d'action
        const actions = document.createElement("div");
        actions.className = "journal-actions";

        const boutonModifier = document.createElement("button");
        boutonModifier.type = "button";
        boutonModifier.textContent = "Modifier";
        boutonModifier.className = "journal-modifier";

        boutonModifier.addEventListener("click", function () {
            journalTitre.value = note.titre;
            journalType.value = note.type;
            journalReference.value = note.reference || "";
            journalContenu.value = note.contenu;

            noteEnModification = note.id;

            journalBouton.textContent = "Enregistrer les modifications";
            journalAnnuler.hidden = false;

            journalForm.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            journalTitre.focus();
        });

        const boutonSupprimer = document.createElement("button");
        boutonSupprimer.type = "button";
        boutonSupprimer.textContent = "Supprimer";
        boutonSupprimer.className = "journal-supprimer";

        boutonSupprimer.addEventListener("click", function () {
            const confirmer = confirm(
                "Veux-tu vraiment supprimer cette note ?"
            );

            if (confirmer) {
                notesJournal = notesJournal.filter(function (element) {
                    return element.id !== note.id;
                });

                sauvegarderJournal();

                if (noteEnModification === note.id) {
                    annulerModificationJournal();
                }

                afficherJournal();
            }
        });

        actions.appendChild(boutonModifier);
        actions.appendChild(boutonSupprimer);
        carte.appendChild(actions);

        journalListe.appendChild(carte);
    });
}

// Ajouter une note ou enregistrer ses modifications
journalForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const titre = journalTitre.value.trim();
    const contenu = journalContenu.value.trim();

    if (titre === "" || contenu === "") {
        alert("Veuillez remplir le titre et la réflexion.");
        return;
    }

    const maintenant = new Date().toISOString();

    if (noteEnModification !== null) {
        // Modifier une note existante
        notesJournal = notesJournal.map(function (note) {
            if (note.id === noteEnModification) {
                return {
                    ...note,
                    titre: titre,
                    type: journalType.value,
                    reference: journalReference.value.trim(),
                    contenu: contenu,
                    modifieeLe: maintenant
                };
            }

            return note;
        });

        alert("Ta note a été modifiée !");
    } else {
        // Creer une nouvelle note
        const nouvelleNote = {
            id: Date.now(),
            titre: titre,
            type: journalType.value,
            reference: journalReference.value.trim(),
            contenu: contenu,
            date: maintenant,
            modifieeLe: maintenant
        };

        notesJournal.push(nouvelleNote);

        alert("Ta note a été enregistrée !");
    }

    sauvegarderJournal();
    afficherJournal();
    annulerModificationJournal();
});

// Annuler une modification
function annulerModificationJournal() {
    journalForm.reset();

    noteEnModification = null;

    journalBouton.textContent = "Enregistrer ma note";
    journalAnnuler.hidden = true;
}

journalAnnuler.addEventListener("click", function () {
    annulerModificationJournal();
});

// Charger les notes au demarrage
afficherJournal();

/* ASSISTANT DE PRIERE AVEC IA */

const assistantForm = document.getElementById("assistant-form");
const sujetPriere = document.getElementById("sujet-priere");
const assistantBouton = document.getElementById("assistant-bouton");
const assistantChargement = document.getElementById("assistant-chargement");
const assistantReponse = document.getElementById("assistant-reponse");

assistantForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const sujet = sujetPriere.value.trim();

    if (sujet.length < 3) {
        assistantReponse.textContent =
            "Écris un sujet de prière d'au moins 3 caractères.";
        return;
    }

    assistantBouton.disabled = true;
    assistantChargement.hidden = false;
    assistantReponse.textContent = "";

    try {
        const reponseServeur = await fetch("http://localhost:3000/api/priere", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sujet: sujet
            })
        });

        const donnees = await reponseServeur.json();

        if (!reponseServeur.ok) {
            throw new Error(
                donnees.erreur || "Une erreur est survenue."
            );
        }

        // textContent affiche le texte sans interpréter du code HTML.
        
if (donnees.priere) {
    dernierePriereGeneree = donnees.priere;
    boutonEnregistrerPriere.hidden = false;
    // Vider l'ancien résultat.
    assistantReponse.replaceChildren();

    // Créer le titre de la prière.
    const titre = document.createElement("h3");
    titre.className = "priere-titre";
    titre.textContent = donnees.priere.titre;

    // Créer le texte de la prière.
    const textePriere = document.createElement("p");
    textePriere.className = "priere-texte";
    textePriere.textContent = donnees.priere.texte;

    // Créer le bloc du verset biblique.
    const blocVerset = document.createElement("div");
    blocVerset.className = "priere-verset";

    const titreVerset = document.createElement("h4");
    titreVerset.textContent = "📖 Verset biblique";

    const texteVerset = document.createElement("p");
    texteVerset.textContent = donnees.priere.verset;

    blocVerset.append(titreVerset, texteVerset);

    // Créer le bloc de réflexion.
    const blocReflexion = document.createElement("div");
    blocReflexion.className = "priere-reflexion";

    const titreReflexion = document.createElement("h4");
    titreReflexion.textContent = "🌱 Pour méditer";

    const texteReflexion = document.createElement("p");
    texteReflexion.textContent = donnees.priere.reflexion;

    blocReflexion.append(titreReflexion, texteReflexion);

    // Ajouter les éléments à la réponse.
    assistantReponse.append(
        titre,
        textePriere,
        blocVerset,
        blocReflexion
    );
} else {
    // Garder la compatibilité avec une réponse IA en texte simple.
    assistantReponse.textContent = donnees.reponse;
}


    } catch (erreur) {
        console.error("Erreur de l'assistant :", erreur);

        assistantReponse.textContent =
            "Impossible de préparer ta prière pour le moment. " +
            "Vérifie que le serveur fonctionne et réessaie.";
    } finally {
        assistantBouton.disabled = false;
        assistantChargement.hidden = true;
    }
});

/* RELIER L'ASSISTANT AU JOURNAL SPIRITUEL */

let dernierePriereGeneree = null;

const boutonEnregistrerPriere =
    document.getElementById("enregistrer-priere");

const messageEnregistrement =
    document.getElementById("message-enregistrement");

const formulaireJournal =
    document.getElementById("journal-form");

const titreJournal =
    document.getElementById("journal-titre");

const typeJournal =
    document.getElementById("journal-type");

const referenceJournal =
    document.getElementById("journal-reference");

const contenuJournal =
    document.getElementById("journal-contenu");

// Afficher le bouton après la génération d'une prière.
assistantForm.addEventListener("submit", function () {
    dernierePriereGeneree = null;
    boutonEnregistrerPriere.hidden = true;
    messageEnregistrement.textContent = "";
});

// Enregistrer la prière dans le journal existant.
boutonEnregistrerPriere.addEventListener("click", function () {
    if (!dernierePriereGeneree) {
        messageEnregistrement.textContent =
            "Génère d'abord une prière.";
        return;
    }

    if (!formulaireJournal) {
        messageEnregistrement.textContent =
            "Le formulaire du journal est introuvable.";
        return;
    }

    // Préparer les informations de la prière.
    titreJournal.value = dernierePriereGeneree.titre;
    referenceJournal.value = dernierePriereGeneree.verset;

    contenuJournal.value =
        dernierePriereGeneree.texte +
        "\n\nVerset biblique : " +
        dernierePriereGeneree.verset +
        "\n\nRéflexion : " +
        dernierePriereGeneree.reflexion;

    // Sélectionner le type Prière si cette option existe.
    const optionPriere = Array.from(typeJournal.options).find(
        function (option) {
            return /pri[eè]re/i.test(
                option.textContent + " " + option.value
            );
        }
    );

    if (optionPriere) {
        typeJournal.value = optionPriere.value;
    }

    // Soumettre le formulaire existant pour utiliser
    // son mécanisme habituel d'enregistrement.
    formulaireJournal.requestSubmit();

    messageEnregistrement.textContent =
        "🌿 La prière a été envoyée au formulaire du journal.";
});
