require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Lire les données JSON envoyées par le navigateur.
app.use(express.json());

// Autoriser les requêtes de notre site local.
app.use(cors());

// Afficher les fichiers HTML, CSS et JavaScript du projet.
app.use(express.static(__dirname));
console.log("Dossier du projet :", __dirname);

// Créer le client IA seulement si une clé API est configurée.
const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Vérifier que le serveur fonctionne.
app.get("/api/sante", (req, res) => {
  res.json({
    message: "Le serveur de Mon Jardin de Prière fonctionne.",
    iaConfiguree: Boolean(client)
  });
});

// Première version de l'assistant de prière.
app.post("/api/priere", async (req, res) => {
  try {
    const sujet = req.body.sujet;

    if (typeof sujet !== "string" || sujet.trim().length < 3) {
      return res.status(400).json({
        erreur: "Écris un sujet de prière d'au moins 3 caractères."
      });
    }

    if (sujet.length > 1500) {
      return res.status(400).json({
        erreur: "Le sujet est trop long. Limite-le à 1500 caractères."
      });
    }

    
if (!client) {
  const sujetMinuscule = sujet.toLowerCase();

  // Choisir le thème de prière
  let theme = "paix";

  if (
    sujetMinuscule.includes("famille") ||
    sujetMinuscule.includes("parent")
  ) {
    theme = "famille";
  } else if (
    sujetMinuscule.includes("santé") ||
    sujetMinuscule.includes("maladie") ||
    sujetMinuscule.includes("guérison") ||
    sujetMinuscule.includes("douleur")
  ) {
    theme = "sante";
  } else if (
    sujetMinuscule.includes("emploi") ||
    sujetMinuscule.includes("travail") ||
    sujetMinuscule.includes("entretien") ||
    sujetMinuscule.includes("recrutement")
  ) {
    theme = "travail";
  } else if (
    sujetMinuscule.includes("argent") ||
    sujetMinuscule.includes("finance") ||
    sujetMinuscule.includes("dette") ||
    sujetMinuscule.includes("besoin matériel")
  ) {
    theme = "finances";
  } else if (
    sujetMinuscule.includes("étude") ||
    sujetMinuscule.includes("examen") ||
    sujetMinuscule.includes("école") ||
    sujetMinuscule.includes("formation")
  ) {
    theme = "etudes";
  } else if (
    sujetMinuscule.includes("couple") ||
    sujetMinuscule.includes("relation") ||
    sujetMinuscule.includes("pardon") ||
    sujetMinuscule.includes("conflit")
  ) {
    theme = "relations";
  } else if (
    sujetMinuscule.includes("protection") ||
    sujetMinuscule.includes("danger") ||
    sujetMinuscule.includes("sécurité")
  ) {
    theme = "protection";
  } else if (
    sujetMinuscule.includes("foi") ||
    sujetMinuscule.includes("doute") ||
    sujetMinuscule.includes("spirituel")
  ) {
    theme = "foi";
  } else if (
    sujetMinuscule.includes("courage") ||
    sujetMinuscule.includes("découragement") ||
    sujetMinuscule.includes("difficulté") ||
    sujetMinuscule.includes("tristesse")
  ) {
    theme = "courage";
  } else if (
    sujetMinuscule.includes("reconnaissance") ||
    sujetMinuscule.includes("remerc") ||
    sujetMinuscule.includes("merci")
  ) {
    theme = "reconnaissance";
  } else if (
    sujetMinuscule.includes("sagesse") ||
    sujetMinuscule.includes("décision") ||
    sujetMinuscule.includes("choix")
  ) {
    theme = "sagesse";
  }

  // Prières disponibles
  const prieres = {
    paix: {
      titre: "Prière pour la paix intérieure",
      texte: "Seigneur, je viens devant toi avec mes inquiétudes et mes pensées. Apaise mon cœur, aide-moi à avancer avec patience et donne-moi la force de traverser cette période. Apprends-moi à faire ma part et à te confier ce qui me dépasse. Amen.",
      verset: "Philippiens 4:6-7",
      reflexion: "Prends quelques minutes de silence et identifie ce qui te préoccupe le plus aujourd'hui."
    },

    famille: {
      titre: "Prière pour la famille",
      texte: "Seigneur, veille sur ma famille. Apprends-nous à nous aimer, à nous écouter et à nous pardonner. Donne-nous la sagesse pour résoudre nos désaccords et la force de rester unis dans les moments difficiles. Que notre maison soit un lieu de paix, de respect et d'amour. Amen.",
      verset: "Josué 24:15",
      reflexion: "Pense à un membre de ta famille à qui tu pourrais apporter de l'écoute, du soutien ou un geste d'affection."
    },

    sante: {
      titre: "Prière pour la santé",
      texte: "Seigneur, je te confie ma santé et celle des personnes que j'aime. Donne-nous du courage dans les moments difficiles, soutiens les personnes malades et accorde de la sagesse à celles et ceux qui prennent soin d'elles. Aide-nous à garder espoir et à chercher l'aide nécessaire. Amen.",
      verset: "Psaume 41:4",
      reflexion: "Prends soin de toi et, si nécessaire, rapproche-toi d'un professionnel de santé ou d'une personne de confiance."
    },

    travail: {
      titre: "Prière pour le travail et l'emploi",
      texte: "Seigneur, je te confie mes recherches, mes projets professionnels et mes démarches. Donne-moi la persévérance face aux refus, la confiance pour présenter mes compétences et la sagesse pour reconnaître les bonnes occasions. Aide-moi à avancer avec sérieux, honnêteté et espérance. Amen.",
      verset: "Proverbes 16:3",
      reflexion: "Choisis une action concrète pour avancer : préparer ton CV, postuler à une offre ou te préparer à un entretien."
    },

    finances: {
      titre: "Prière pour les finances",
      texte: "Seigneur, je te confie mes besoins matériels et mes préoccupations financières. Donne-moi la sagesse pour gérer ce que je possède, le courage de chercher des solutions et l'humilité de demander de l'aide lorsque cela est nécessaire. Aide-moi à avancer avec responsabilité et à garder l'espérance. Amen.",
      verset: "Matthieu 6:31-33",
      reflexion: "Note tes priorités financières et identifie une petite action réaliste que tu peux entreprendre aujourd'hui."
    },

    etudes: {
      titre: "Prière pour les études et les examens",
      texte: "Seigneur, accompagne-moi dans mes études et mes apprentissages. Donne-moi la concentration, la discipline et la patience nécessaires pour comprendre et retenir ce que j'apprends. Aide-moi à gérer mon stress et à donner le meilleur de moi-même sans perdre courage. Amen.",
      verset: "Jacques 1:5",
      reflexion: "Organise tes révisions en petites étapes et commence par le sujet qui demande le plus d'attention."
    },

    relations: {
      titre: "Prière pour les relations et le pardon",
      texte: "Seigneur, aide-moi à construire des relations fondées sur le respect, la vérité et l'amour. Donne-moi un cœur capable d'écouter, la sagesse de reconnaître mes erreurs et le courage de pardonner lorsque cela est possible. Aide-moi aussi à poser des limites saines et à rechercher la paix. Amen.",
      verset: "Colossiens 3:13",
      reflexion: "Réfléchis à une conversation que tu pourrais mener avec calme et respect, sans oublier tes propres besoins."
    },

    protection: {
      titre: "Prière pour la protection",
      texte: "Seigneur, je te confie mes déplacements, mes projets et les personnes qui me sont chères. Accompagne-nous dans nos activités, donne-nous du discernement face aux risques et aide-nous à prendre des décisions prudentes. Que la paix et la sagesse nous accompagnent chaque jour. Amen.",
      verset: "Psaume 121:7-8",
      reflexion: "Confie tes inquiétudes dans la prière et prends également les précautions nécessaires pour ta sécurité."
    },

    foi: {
      titre: "Prière pour fortifier la foi",
      texte: "Seigneur, aide-moi à approfondir ma foi, même lorsque je traverse des moments de doute. Apprends-moi à te chercher avec sincérité, à méditer ta Parole et à avancer un jour à la fois. Donne-moi un cœur humble, patient et ouvert à ton enseignement. Amen.",
      verset: "Marc 9:24",
      reflexion: "Lis quelques versets de la Bible et note ce qu'ils t'inspirent pour ta journée."
    },

    courage: {
      titre: "Prière pour retrouver le courage",
      texte: "Seigneur, lorsque je me sens fatigué ou découragé, rappelle-moi que je peux avancer pas à pas. Donne-moi la force de ne pas abandonner, la sagesse de demander du soutien et la patience d'accepter que certaines choses prennent du temps. Aide-moi à retrouver l'espérance. Amen.",
      verset: "Ésaïe 41:10",
      reflexion: "Identifie une petite victoire récente et une personne de confiance à qui tu pourrais parler."
    },

    reconnaissance: {
      titre: "Prière de reconnaissance",
      texte: "Seigneur, merci pour le don de la vie, pour les personnes qui m'entourent et pour les occasions d'apprendre et de grandir. Même lorsque tout n'est pas facile, aide-moi à reconnaître les petites joies et les gestes de bonté de chaque jour. Garde mon cœur dans la gratitude. Amen.",
      verset: "1 Thessaloniciens 5:18",
      reflexion: "Écris trois choses pour lesquelles tu éprouves de la reconnaissance aujourd'hui."
    },

    sagesse: {
      titre: "Prière pour la sagesse",
      texte: "Seigneur, accompagne-moi dans les décisions que je dois prendre. Donne-moi du discernement pour examiner les possibilités, de l'humilité pour écouter les bons conseils et du courage pour choisir ce qui est juste. Aide-moi à ne pas agir dans la précipitation. Amen.",
      verset: "Proverbes 3:5-6",
      reflexion: "Écris les options qui s'offrent à toi, leurs conséquences possibles et les conseils utiles que tu peux demander."
    }
  };

  const priere = prieres[theme];

    
return res.json({
  reponse:
    priere.titre + "\n\n" +
    priere.texte + "\n\n" +
    "📖 Verset biblique : " + priere.verset + "\n\n" +
    "🌿 Réflexion : " + priere.reflexion,
  mode: "demonstration",
  priere: {
    titre: priere.titre,
    texte: priere.texte,
    verset: priere.verset,
    reflexion: priere.reflexion
  }
});

}

    const reponse = await client.responses.create({
      model: "gpt-4.1-mini",
      instructions:
        "Tu es un assistant de prière chrétien bienveillant. Réponds en français simple et respectueux. Propose une prière adaptée au sujet, puis un passage biblique pertinent et une courte réflexion. Ne prétends pas parler au nom de Dieu et ne juge jamais la personne.",
      input: sujet.trim()
    });

    res.json({
      reponse: reponse.output_text
    });
  } catch (erreur) {
    console.error("Erreur de l'assistant :", erreur.message);

    res.status(500).json({
      erreur: "Impossible de générer une prière pour le moment. Réessaie plus tard."
    });
  }
});

// Démarrer le serveur.
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Mon Jardin de Prière est disponible sur le port ${PORT}`);
});
