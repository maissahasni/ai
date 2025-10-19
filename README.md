# 🎓 Système de Recommandation de Formations - Application Streamlit

## Description

Cette application Streamlit propose un système de recommandation intelligent pour aider les étudiants tunisiens à trouver les formations les plus adaptées à leur profil, leurs compétences et leur budget.

## Fonctionnalités

### 🏠 Page d'accueil
- Vue d'ensemble du système avec métriques clés
- Graphiques des domaines les plus demandés et offerts
- Instructions d'utilisation

### 🎯 Recommandations personnalisées
- Formulaire de saisie des informations étudiant
- Calcul de similarité en temps réel
- Recommandations basées sur le profil et le budget
- Visualisation des scores de similarité
- Analyse de compatibilité budget

### 📊 Statistiques détaillées
- Analyse par domaine (étudiants vs formations)
- Analyse des budgets et prix
- Répartition géographique
- Tendances et insights

### 👥 Base de données des étudiants
- Visualisation et filtrage des étudiants
- Recherche par domaine, niveau, budget
- Statistiques des étudiants filtrés

### 📚 Catalogue des formations
- Visualisation et filtrage des formations
- Recherche par domaine, niveau, prix
- Analyse des prix par domaine

## Installation et utilisation

### Prérequis
- Python 3.8 ou plus récent
- Les fichiers de données : `etudiants.csv`, `formations.csv`, `meilleur_modele.pkl`

### Installation

1. **Cloner ou télécharger le projet**
```bash
# Si vous avez git
git clone <url-du-repo>
cd recommandation

# Ou téléchargez et extrayez les fichiers
```

2. **Installer les dépendances**
```bash
pip install -r requirements.txt
```

3. **Lancer l'application**
```bash
streamlit run app.py
```

4. **Ouvrir dans le navigateur**
L'application s'ouvrira automatiquement dans votre navigateur à l'adresse `http://localhost:8501`

## Structure des données

### Fichiers requis
- `etudiants.csv` : Base de données des étudiants avec leurs profils
- `formations.csv` : Catalogue des formations disponibles
- `meilleur_modele.pkl` : Modèle de machine learning entraîné

### Colonnes des étudiants
- `id`, `nom`, `prenom`, `email`
- `age`, `niveau_etude`, `domaine_interet`
- `competences_actuelles`, `localisation`
- `budget_max`, `langue_preferee`, `objectif_carriere`

### Colonnes des formations
- `id`, `nom_formation`, `description`
- `domaine`, `competences_requises`, `niveau`
- `localisation`, `duree_mois`, `prix_dt`, `langue_enseignement`

## Algorithme de recommandation

L'application utilise un système de recommandation basé sur :

1. **Vectorisation TF-IDF** : Conversion des profils textuels en vecteurs numériques
2. **Similarité cosinus** : Calcul de la similarité entre profils étudiants et formations
3. **Filtrage par budget** : Vérification de la compatibilité financière
4. **Machine Learning** : Utilisation d'un modèle Logistic Regression pour optimiser les recommandations

## Personnalisation

### Modifier les domaines
Pour ajouter de nouveaux domaines, modifiez les listes dans `app.py` :
```python
domaine_interet = st.selectbox(
    "Domaine d'intérêt",
    ["Informatique", "Data Science", "Sécurité", ...]  # Ajoutez vos domaines
)
```

### Ajuster les filtres
Les filtres de budget, âge, etc. peuvent être modifiés dans les fonctions `st.slider()` et `st.number_input()`.

### Modifier le style
Le CSS personnalisé se trouve dans la section `st.markdown()` au début de `app.py`.

## Dépannage

### Erreur de chargement des données
- Vérifiez que les fichiers CSV sont dans le même dossier que `app.py`
- Vérifiez l'encodage des fichiers (UTF-8 recommandé)
- Vérifiez que le fichier `meilleur_modele.pkl` existe

### Erreur de dépendances
```bash
pip install --upgrade streamlit pandas numpy scikit-learn plotly
```

### Problème de performance
- Réduisez le nombre de formations affichées
- Utilisez `@st.cache_data` pour les fonctions coûteuses
- Limitez le nombre de résultats dans les filtres

## Support

Pour toute question ou problème :
1. Vérifiez que tous les fichiers requis sont présents
2. Vérifiez l'installation des dépendances
3. Consultez les logs d'erreur dans le terminal

## Licence

Ce projet est fourni à des fins éducatives et de démonstration.
