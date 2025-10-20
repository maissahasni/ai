# 🎓 Adaptive Learning Suite (Powered by AI)

## 🌟 Project Overview

This project is an advanced educational platform designed to enhance and personalize the student learning experience. It leverages sophisticated AI models to adapt content, assess comprehension, and provide intelligent navigation, moving beyond static curricula to offer truly personalized learning paths.

-----

## ✨ Key Features

The suite is built around three core AI-driven modules:

### 1\. 🤖 Lesson Recommendation Engine

This module is the core of the personalization effort, ensuring every student receives content optimized for their needs.

| Objectif | Description |
| :--- | :--- |
| **Profilage Adaptatif** | Proposer une **liste classée de leçons** adaptées aux préférences, au niveau actuel et à l'historique de chaque étudiant. |
| **Analyse Sémantique** | Le moteur utilise des modèles d'IA pour analyser sémantiquement les contenus (`titres`, `mots-clés`, `résumés`) et identifier les **similitudes de préférences** entre utilisateurs. |
| **Sortie** | Génération d'un *prompt* contextuel pour l'IA ("Propose trois nouvelles leçons basées sur les intérêts et l'historique...") et affichage des résultats avec un score de pertinence. |

### 2\. 📝 Quiz Generator

This tool transforms static learning material into dynamic, actionable assessments.

| Objectif | Description |
| :--- | :--- |
| **Évaluation Personnalisée** | Générer automatiquement des **quiz et des questions personnalisées** basées sur le contenu d'une leçon ou d'un chapitre spécifique. |
| **Variété de Questions** | Supporte la génération de différents formats (QCM, questions ouvertes courtes, vrai/faux) pour évaluer divers niveaux de connaissance. |
| **Intégration** | Le quiz peut être généré à la volée après la lecture d'une leçon, assurant une **vérification immédiate de la compréhension**. |

### 3\. 📖 AI Summarizer

A powerful utility to improve efficiency and focus by condensing lengthy texts.

| Objectif | Description |
| :--- | :--- |
| **Synthèse de Contenu** | Fournir un **résumé concis et précis** de n'importe quel document ou leçon soumis par l'utilisateur. |
| **Gain de Temps** | Permettre aux étudiants d'absorber rapidement les points clés d'un contenu, facilitant la révision et la pré-lecture. |
| **Flexibilité** | Supporte des options pour des résumés courts (points clés) ou des résumés plus détaillés (paragraphes structurés). |

-----

## 🛠️ Stack Technique

  * **Frontend:** **Angular** (TypeScript, SCSS/Bootstrap-like styling)
      * **Composants Clés:** `Chat.component.ts` (pour l'interface de conversation), `Quiz.component.ts`, `Recommender.service.ts`.
  * **Backend / API Layer:** **[Specify your Backend, e.g., Node.js/Express, Python/Flask]**
      * **Sécurité:** Le backend sert de proxy sécurisé pour masquer les clés d'API.
  * **Intelligence Artificielle:** **Google Gemini API** (`gemini-2.5-flash` ou autre modèle spécifié)

-----

## 🚀 Getting Started

### 1\. Prerequisites

  * Node.js (LTS version)
  * Angular CLI
  * Access to the Google Gemini API

### 2\. Installation

```bash
# Clone the repository
git clone [YOUR_REPO_URL]
cd [project-name]

# Install frontend dependencies
npm install

# [OPTIONAL] Set up backend dependencies if applicable
# cd backend
# npm install
```

### 3\. Configuration

1.  **API Key Setup:**

      * Locate the **environment configuration file** (or a secure configuration file in your backend proxy).
      * Set the `GEMINI_API_KEY` environment variable with your actual key.

2.  **Run the Application:**

<!-- end list -->

```bash
# Run the Angular frontend
ng serve

# [OPTIONAL] Run the backend server
# npm run start-server
```

The application will be accessible at `http://localhost:4200/`.

-----

## 🤝 Contribution

We welcome contributions to this project\! Please follow these steps:

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

-----

## 📜 License

Distributed under the [Specify License, e.g., MIT] License. See `LICENSE` for more information.

