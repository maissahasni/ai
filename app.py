import streamlit as st
import pandas as pd
import numpy as np
import pickle
import plotly.express as px
import plotly.graph_objects as go
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import LabelEncoder
import warnings
warnings.filterwarnings('ignore')

# Configuration de la page
st.set_page_config(
    page_title="🎓 Système de Recommandation de Formations",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# CSS personnalisé
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 2rem;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
    }
    .sub-header {
        font-size: 1.5rem;
        color: #2c3e50;
        margin-top: 2rem;
        margin-bottom: 1rem;
    }
    .metric-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1rem;
        border-radius: 10px;
        color: white;
        text-align: center;
        margin: 0.5rem 0;
    }
    .recommendation-card {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 10px;
        border-left: 4px solid #1f77b4;
        margin: 0.5rem 0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .budget-ok {
        color: #28a745;
        font-weight: bold;
    }
    .budget-no {
        color: #dc3545;
        font-weight: bold;
    }
</style>
""", unsafe_allow_html=True)

@st.cache_data
def load_data():
    """Charge les données et le modèle"""
    try:
        # Chargement des données
        formations = pd.read_csv('formations.csv', encoding='utf-8')
        etudiants = pd.read_csv('etudiants.csv', encoding='utf-8')
        
        # Chargement du modèle
        with open('meilleur_modele.pkl', 'rb') as f:
            modele = pickle.load(f)
        
        return formations, etudiants, modele
    except Exception as e:
        st.error(f"Erreur lors du chargement des données : {e}")
        return None, None, None

@st.cache_data
def prepare_vectorizer():
    """Prépare le vectoriseur TF-IDF"""
    formations, _, _ = load_data()
    if formations is None:
        return None
    
    # Création du profil complet pour les formations
    formations['profil_complet'] = (
        formations['domaine'] + ' ' +
        formations['competences_requises'] + ' ' +
        formations['niveau'] + ' ' +
        formations['langue_enseignement']
    )
    
    # Vectorisation TF-IDF
    vectorizer = TfidfVectorizer(
        max_features=1000,
        stop_words=None,
        ngram_range=(1, 2)
    )
    
    X_formations = vectorizer.fit_transform(formations['profil_complet'])
    
    return vectorizer, X_formations

def create_student_profile(domaine_interet, competences, niveau_etude, langue_preferee, 
                          objectif_carriere, budget_max, age, localisation):
    """Crée un profil étudiant pour la recommandation"""
    profil_complet = f"{domaine_interet} {competences} {niveau_etude} {langue_preferee} {objectif_carriere}"
    
    vectorizer, X_formations = prepare_vectorizer()
    if vectorizer is None:
        return None, None
    
    # Vectorisation du profil étudiant
    X_etudiant = vectorizer.transform([profil_complet])
    
    # Calcul de la similarité
    similarites = cosine_similarity(X_etudiant, X_formations)[0]
    
    return similarites, profil_complet

def get_recommendations(similarites, budget_max, top_n=5):
    """Génère les recommandations basées sur la similarité"""
    formations, _, _ = load_data()
    if formations is None:
        return None
    
    # Obtenir les indices des formations triées par similarité
    indices_tries = np.argsort(similarites)[::-1]
    
    recommandations = []
    for i, idx in enumerate(indices_tries[:top_n]):
        formation = formations.iloc[idx]
        score = similarites[idx]
        dans_budget = formation['prix_dt'] <= budget_max
        
        recommandations.append({
            'Rang': i + 1,
            'Formation': formation['nom_formation'],
            'Domaine': formation['domaine'],
            'Description': formation['description'],
            'Niveau': formation['niveau'],
            'Durée': f"{formation['duree_mois']} mois",
            'Prix': formation['prix_dt'],
            'Localisation': formation['localisation'],
            'Langue': formation['langue_enseignement'],
            'Compétences Requises': formation['competences_requises'],
            'Score Similarité': score,
            'Dans Budget': dans_budget
        })
    
    return pd.DataFrame(recommandations)

def main():
    # En-tête principal
    st.markdown('<h1 class="main-header">🎓 Système de Recommandation de Formations</h1>', unsafe_allow_html=True)
    st.markdown("### Pour les étudiants tunisiens - Trouvez la formation idéale pour votre carrière")
    
    # Chargement des données
    formations, etudiants, modele = load_data()
    
    if formations is None or etudiants is None:
        st.error("Impossible de charger les données. Vérifiez que les fichiers CSV sont présents.")
        return
    
    # Sidebar pour la navigation
    st.sidebar.title("🧭 Navigation")
    page = st.sidebar.selectbox(
        "Choisissez une page :",
        ["🏠 Accueil", "🎯 Recommandations", "📊 Statistiques", "👥 Étudiants", "📚 Formations"]
    )
    
    if page == "🏠 Accueil":
        show_homepage(formations, etudiants)
    elif page == "🎯 Recommandations":
        show_recommendations_page()
    elif page == "📊 Statistiques":
        show_statistics_page(formations, etudiants)
    elif page == "👥 Étudiants":
        show_students_page(etudiants)
    elif page == "📚 Formations":
        show_formations_page(formations)

def show_homepage(formations, etudiants):
    """Page d'accueil avec vue d'ensemble"""
    st.markdown('<h2 class="sub-header">📈 Vue d\'ensemble du système</h2>', unsafe_allow_html=True)
    
    # Métriques principales
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric(
            label="👥 Nombre d'étudiants",
            value=f"{len(etudiants):,}",
            delta=None
        )
    
    with col2:
        st.metric(
            label="📚 Nombre de formations",
            value=f"{len(formations):,}",
            delta=None
        )
    
    with col3:
        st.metric(
            label="💰 Prix moyen formations",
            value=f"{formations['prix_dt'].mean():.0f} DT",
            delta=None
        )
    
    with col4:
        st.metric(
            label="💵 Budget moyen étudiants",
            value=f"{etudiants['budget_max'].mean():.0f} DT",
            delta=None
        )
    
    # Graphiques principaux
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("### 🎯 Domaines les plus demandés")
        domaines_demandes = etudiants['domaine_interet'].value_counts().head(10)
        fig = px.bar(
            x=domaines_demandes.values,
            y=domaines_demandes.index,
            orientation='h',
            title="Nombre d'étudiants par domaine d'intérêt",
            color=domaines_demandes.values,
            color_continuous_scale='Blues'
        )
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.markdown("### 📚 Statistiques des formations")
        st.metric("Total formations", len(formations))
        st.metric("Domaines disponibles", formations['domaine'].nunique())
        st.metric("Prix moyen", f"{formations['prix_dt'].mean():.0f} DT")
    
    # Instructions
        
   
def show_recommendations_page():
    """Page de recommandations personnalisées"""
    st.markdown('<h2 class="sub-header">🎯 Recommandations Personnalisées</h2>', unsafe_allow_html=True)
    
    # Formulaire de saisie
    with st.form("student_form"):
        st.markdown("### 📝 Vos informations")
        
        col1, col2 = st.columns(2)
        
        with col1:
            nom = st.text_input("Nom", placeholder="Votre nom")
            prenom = st.text_input("Prénom", placeholder="Votre prénom")
            age = st.slider("Âge", min_value=18, max_value=65, value=25)
            budget_max = st.number_input("Budget maximum (DT)", min_value=1000, max_value=10000, value=3000)
        
        with col2:
            localisation = st.selectbox(
                "Localisation",
                ["Tunis", "Sfax", "Sousse", "Monastir", "Kairouan", "Autre"]
            )
            langue_preferee = st.selectbox(
                "Langue préférée",
                ["Français", "Anglais", "Arabe"]
            )
            niveau_etude = st.selectbox(
                "Niveau d'étude",
                ["Bac", "Bac+2", "Licence", "Master", "Doctorat"]
            )
        
        # Informations académiques et professionnelles
        st.markdown("### 🎓 Profil Professionnel")
        
        # Section domaine d'intérêt avec description
        st.markdown("**🎯 Domaine d'intérêt**")
        st.markdown("*Sélectionnez le domaine qui vous intéresse le plus*")
        domaine_interet = st.selectbox(
            "Choisissez votre domaine",
            ["Informatique", "Data Science", "Sécurité", "AWS", "Mobile", "Design", 
             "Blockchain", "Management", "Réseaux", "BI", "Marketing", "Cloud", 
             "Programmation", "QA", "Architecture", "IoT", "Fintech", "VR/AR", 
             "MLOps", "DevOps", "Game Development", "Web Development"],
            help="Ce domaine sera utilisé pour trouver les formations les plus adaptées à vos intérêts"
        )
        
        # Section compétences avec suggestions
        st.markdown("**💼 Compétences actuelles**")
        st.markdown("*Listez vos compétences techniques et professionnelles*")
        
        # Suggestions de compétences par domaine
        suggestions_competences = {
            "Informatique": "Python, Java, C++, Algorithmes, Structures de données",
            "Data Science": "Python, R, SQL, Machine Learning, Statistiques, Pandas",
            "Web Development": "HTML, CSS, JavaScript, React, Node.js, PHP",
            "Mobile": "React Native, Flutter, Swift, Kotlin, Android Studio",
            "Cloud": "AWS, Azure, Google Cloud, Docker, Kubernetes",
            "DevOps": "Docker, Jenkins, Git, Linux, CI/CD, Monitoring",
            "Sécurité": "Cybersécurité, Pentesting, Cryptographie, ISO 27001",
            "Design": "Figma, Adobe Creative Suite, UX/UI, Prototypage",
            "Management": "Leadership, Gestion de projet, Communication, Agile"
        }
        
        # Affichage des suggestions si le domaine est sélectionné
        if domaine_interet in suggestions_competences:
            st.info(f"💡 **Suggestions pour {domaine_interet}:** {suggestions_competences[domaine_interet]}")
        
        competences = st.text_area(
            "Décrivez vos compétences",
            placeholder="Exemples: Python, JavaScript, SQL, Machine Learning, Gestion de projet...",
            help="Séparez vos compétences par des virgules pour une meilleure analyse"
        )
        
        # Section objectif de carrière avec exemples
        st.markdown("**🚀 Objectif de carrière**")
        st.markdown("*Décrivez où vous souhaitez être dans 2-3 ans*")
        
        objectif_carriere = st.text_area(
            "Vos objectifs professionnels",
            placeholder="Exemples: Devenir développeur full-stack, Data Scientist senior, Chef de projet IT...",
            help="Plus vous êtes précis, meilleures seront les recommandations"
        )
        
        submitted = st.form_submit_button("🎯 Obtenir mes recommandations", use_container_width=True)
    
    if submitted:
        if not nom or not prenom or not competences or not objectif_carriere:
            st.error("Veuillez remplir tous les champs obligatoires.")
        else:
            with st.spinner("🔄 Calcul des recommandations en cours..."):
                # Création du profil et calcul des similarités
                similarites, profil_complet = create_student_profile(
                    domaine_interet, competences, niveau_etude, langue_preferee,
                    objectif_carriere, budget_max, age, localisation
                )
                
                if similarites is not None:
                    # Génération des recommandations
                    recommandations = get_recommendations(similarites, budget_max, 5)
                    
                    if recommandations is not None:
                        st.success(f"✅ Recommandations générées pour {prenom} {nom}")
                        
                        # Affichage des recommandations
                        st.markdown("### 🏆 Vos formations recommandées")
                        
                        for idx, row in recommandations.iterrows():
                            with st.container():
                                col1, col2 = st.columns([3, 1])
                                
                                with col1:
                                    st.markdown(f"""
                                    <div class="recommendation-card">
                                        <h4>#{row['Rang']} {row['Formation']}</h4>
                                        <p><strong>Domaine:</strong> {row['Domaine']}</p>
                                        <p><strong>Description:</strong> {row['Description']}</p>
                                        <p><strong>Niveau:</strong> {row['Niveau']} | <strong>Durée:</strong> {row['Durée']}</p>
                                        <p><strong>Localisation:</strong> {row['Localisation']} | <strong>Langue:</strong> {row['Langue']}</p>
                                        <p><strong>Compétences requises:</strong> {row['Compétences Requises']}</p>
                                    </div>
                                    """, unsafe_allow_html=True)
                                
                                with col2:
                                    st.metric("Prix", f"{row['Prix']} DT")
                                    
                                    if row['Dans Budget']:
                                        st.markdown('<p class="budget-ok">✅ Dans votre budget</p>', unsafe_allow_html=True)
                                    else:
                                        st.markdown('<p class="budget-no">❌ Dépassement budget</p>', unsafe_allow_html=True)
                                
                                st.divider()
                        
                        
                        # Analyse du budget
                        st.markdown("### 💰 Analyse du budget")
                        dans_budget = recommandations['Dans Budget'].sum()
                        total = len(recommandations)
                        
                        col1, col2, col3 = st.columns(3)
                        with col1:
                            st.metric("Formations dans budget", f"{dans_budget}/{total}")
                        with col2:
                            st.metric("Pourcentage", f"{(dans_budget/total)*100:.1f}%")
                        with col3:
                            prix_moyen = recommandations['Prix'].mean()
                            st.metric("Prix moyen recommandé", f"{prix_moyen:.0f} DT")

def show_statistics_page(formations, etudiants):
    """Page des statistiques détaillées"""
    st.markdown('<h2 class="sub-header">📊 Statistiques Détaillées</h2>', unsafe_allow_html=True)
    
    # Vérification des données
    if formations is None or etudiants is None:
        st.error("Impossible d'afficher les statistiques : données non chargées")
        return
    
    if len(formations) == 0 or len(etudiants) == 0:
        st.warning("Aucune donnée disponible pour les statistiques")
        return
    
    # Affichage des informations de débogage
    with st.expander("🔍 Informations de débogage"):
        st.write(f"**Formations:** {len(formations)} enregistrements")
        st.write(f"**Étudiants:** {len(etudiants)} enregistrements")
        st.write(f"**Colonnes formations:** {list(formations.columns)}")
        st.write(f"**Colonnes étudiants:** {list(etudiants.columns)}")
    
    # Onglets pour différentes analyses
    tab1, tab2, tab3, tab4 = st.tabs(["🎯 Domaines", "💰 Budgets", "📍 Localisation", "📈 Tendances"])
    
    with tab1:
        st.markdown("### Analyse par domaine")
        
        col1, col2 = st.columns(2)
        
        with col1:
            # Domaines d'intérêt des étudiants
            domaines_etudiants = etudiants['domaine_interet'].value_counts()
            fig = px.bar(
                domaines_etudiants,
                title="Domaines d'intérêt des étudiants",
                color=domaines_etudiants.values,
                color_continuous_scale='Blues'
            )
            fig.update_layout(xaxis_tickangle=45)
            st.plotly_chart(fig, use_container_width=True)
        
        with col2:
            # Statistiques des domaines de formations
            domaines_formations = formations['domaine'].value_counts()
            st.markdown("### 📊 Statistiques des domaines")
            st.metric("Nombre de domaines", len(domaines_formations))
            st.metric("Domaine le plus populaire", domaines_formations.index[0])
            st.metric("Formations dans ce domaine", domaines_formations.iloc[0])
    
    with tab2:
        st.markdown("### Analyse des budgets")
        
        col1, col2 = st.columns(2)
        
        with col1:
            # Distribution des budgets étudiants
            fig = px.histogram(
                etudiants,
                x='budget_max',
                nbins=20,
                title="Distribution des budgets étudiants",
                color_discrete_sequence=['#1f77b4']
            )
            fig.update_layout(xaxis_title="Budget maximum (DT)")
            fig.update_layout(yaxis_title="Nombre d'étudiants")
            st.plotly_chart(fig, use_container_width=True)
        
        with col2:
            # Distribution des prix formations
            fig = px.histogram(
                formations,
                x='prix_dt',
                nbins=20,
                title="Distribution des prix des formations",
                color_discrete_sequence=['#ff7f0e']
            )
            fig.update_layout(xaxis_title="Prix (DT)")
            fig.update_layout(yaxis_title="Nombre de formations")
            st.plotly_chart(fig, use_container_width=True)
        
        # Comparaison budget vs prix
        st.markdown("### 💡 Analyse de compatibilité budget")
        
        budget_moyen_etudiants = etudiants['budget_max'].mean()
        prix_moyen_formations = formations['prix_dt'].mean()
        
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Budget moyen étudiants", f"{budget_moyen_etudiants:.0f} DT")
        with col2:
            st.metric("Prix moyen formations", f"{prix_moyen_formations:.0f} DT")
        with col3:
            difference = budget_moyen_etudiants - prix_moyen_formations
            
    
    with tab3:
        st.markdown("### Analyse géographique")
        
        col1, col2 = st.columns(2)
        
        with col1:
            # Localisation des étudiants
            localisation_etudiants = etudiants['localisation'].value_counts()
            fig = px.bar(
                localisation_etudiants,
                title="Répartition des étudiants par ville",
                color=localisation_etudiants.values,
                color_continuous_scale='Greens'
            )
            st.plotly_chart(fig, use_container_width=True)
        
        with col2:
            # Localisation des formations
            localisation_formations = formations['localisation'].value_counts()
            if len(localisation_formations) > 0:
                fig = px.pie(
                    values=localisation_formations.values,
                    names=localisation_formations.index,
                    title="Répartition des formations par ville",
                    color_discrete_sequence=px.colors.qualitative.Pastel
                )
                st.plotly_chart(fig, use_container_width=True)
            else:
                st.warning("Aucune donnée de localisation disponible pour les formations")
    
    with tab4:
        st.markdown("### Tendances et insights")
        
        # Top 10 des formations les plus chères
        formations_cheres = formations.nlargest(10, 'prix_dt')
        fig = px.bar(
            formations_cheres,
            x='nom_formation',
            y='prix_dt',
            title="Top 10 des formations les plus chères",
            color='prix_dt',
            color_continuous_scale='Reds'
        )
        fig.update_layout(xaxis_tickangle=45)
        st.plotly_chart(fig, use_container_width=True)
        
        # Analyse des niveaux
        col1, col2 = st.columns(2)
        
        with col1:
            niveaux_formations = formations['niveau'].value_counts()
            if len(niveaux_formations) > 0:
                fig = px.pie(
                    values=niveaux_formations.values,
                    names=niveaux_formations.index,
                    title="Répartition par niveau de formation",
                    color_discrete_sequence=px.colors.qualitative.Set2
                )
                st.plotly_chart(fig, use_container_width=True)
            else:
                st.warning("Aucune donnée de niveau disponible pour les formations")
        
        with col2:
            niveaux_etudiants = etudiants['niveau_etude'].value_counts()
            if len(niveaux_etudiants) > 0:
                fig = px.pie(
                    values=niveaux_etudiants.values,
                    names=niveaux_etudiants.index,
                    title="Répartition par niveau d'étude des étudiants",
                    color_discrete_sequence=px.colors.qualitative.Pastel2
                )
                st.plotly_chart(fig, use_container_width=True)
            else:
                st.warning("Aucune donnée de niveau disponible pour les étudiants")

def show_students_page(etudiants):
    """Page de visualisation des étudiants"""
    st.markdown('<h2 class="sub-header">👥 Base de données des étudiants</h2>', unsafe_allow_html=True)
    
    # Filtres
    st.markdown("### 🔍 Filtres de recherche")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        domaine_filter = st.selectbox(
            "Filtrer par domaine d'intérêt",
            ["Tous"] + list(etudiants['domaine_interet'].unique())
        )
    
    with col2:
        niveau_filter = st.selectbox(
            "Filtrer par niveau d'étude",
            ["Tous"] + list(etudiants['niveau_etude'].unique())
        )
    
    with col3:
        budget_min = st.number_input("Budget minimum (DT)", min_value=0, value=0)
    
    # Application des filtres
    filtered_etudiants = etudiants.copy()
    
    if domaine_filter != "Tous":
        filtered_etudiants = filtered_etudiants[filtered_etudiants['domaine_interet'] == domaine_filter]
    
    if niveau_filter != "Tous":
        filtered_etudiants = filtered_etudiants[filtered_etudiants['niveau_etude'] == niveau_filter]
    
    filtered_etudiants = filtered_etudiants[filtered_etudiants['budget_max'] >= budget_min]
    
    st.markdown(f"### 📊 Résultats ({len(filtered_etudiants)} étudiants trouvés)")
    
    # Affichage des données
    if len(filtered_etudiants) > 0:
        # Sélection des colonnes à afficher
        colonnes_a_afficher = ['nom', 'prenom', 'age', 'domaine_interet', 'niveau_etude', 
                              'localisation', 'budget_max', 'langue_preferee', 'objectif_carriere']
        
        st.dataframe(
            filtered_etudiants[colonnes_a_afficher],
            use_container_width=True,
            height=400
        )
        
        # Statistiques des étudiants filtrés
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric("Nombre d'étudiants", len(filtered_etudiants))
        with col2:
            st.metric("Budget moyen", f"{filtered_etudiants['budget_max'].mean():.0f} DT")
        with col3:
            st.metric("Âge moyen", f"{filtered_etudiants['age'].mean():.1f} ans")
        with col4:
            st.metric("Villes uniques", filtered_etudiants['localisation'].nunique())
    else:
        st.warning("Aucun étudiant ne correspond aux critères de recherche.")

def show_formations_page(formations):
    """Page de visualisation des formations"""
    st.markdown('<h2 class="sub-header">📚 Catalogue des formations</h2>', unsafe_allow_html=True)
    
    # Filtres
    st.markdown("### 🔍 Filtres de recherche")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        domaine_filter = st.selectbox(
            "Filtrer par domaine",
            ["Tous"] + list(formations['domaine'].unique()),
            key="formation_domaine"
        )
    
    with col2:
        niveau_filter = st.selectbox(
            "Filtrer par niveau",
            ["Tous"] + list(formations['niveau'].unique()),
            key="formation_niveau"
        )
    
    with col3:
        prix_max = st.number_input("Prix maximum (DT)", min_value=0, value=formations['prix_dt'].max())
    
    # Application des filtres
    filtered_formations = formations.copy()
    
    if domaine_filter != "Tous":
        filtered_formations = filtered_formations[filtered_formations['domaine'] == domaine_filter]
    
    if niveau_filter != "Tous":
        filtered_formations = filtered_formations[filtered_formations['niveau'] == niveau_filter]
    
    filtered_formations = filtered_formations[filtered_formations['prix_dt'] <= prix_max]
    
    st.markdown(f"### 📊 Résultats ({len(filtered_formations)} formations trouvées)")
    
    # Affichage des données
    if len(filtered_formations) > 0:
        # Sélection des colonnes à afficher
        colonnes_a_afficher = ['nom_formation', 'domaine', 'niveau', 'duree_mois', 
                              'prix_dt', 'localisation', 'langue_enseignement']
        
        st.dataframe(
            filtered_formations[colonnes_a_afficher],
            use_container_width=True,
            height=400
        )
        
        # Statistiques des formations filtrées
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric("Nombre de formations", len(filtered_formations))
        with col2:
            st.metric("Prix moyen", f"{filtered_formations['prix_dt'].mean():.0f} DT")
        with col3:
            st.metric("Durée moyenne", f"{filtered_formations['duree_mois'].mean():.1f} mois")
        with col4:
            st.metric("Villes uniques", filtered_formations['localisation'].nunique())
        
        # Graphique des prix par domaine
        if len(filtered_formations) > 1:
            st.markdown("### 💰 Prix par domaine")
            prix_par_domaine = filtered_formations.groupby('domaine')['prix_dt'].mean().sort_values(ascending=False)
            
            fig = px.bar(
                x=prix_par_domaine.index,
                y=prix_par_domaine.values,
                title="Prix moyen par domaine",
                color=prix_par_domaine.values,
                color_continuous_scale='Viridis'
            )
            fig.update_layout(xaxis_tickangle=45)
            st.plotly_chart(fig, use_container_width=True)
    else:
        st.warning("Aucune formation ne correspond aux critères de recherche.")

if __name__ == "__main__":
    main()
