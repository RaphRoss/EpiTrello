<div align="center">

# 📋 EpiTrello

### Gestionnaire de projets moderne inspiré de Trello

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker)](https://www.docker.com/)

[Démo](#démarrage-rapide) • [Documentation](#documentation-api) • [Fonctionnalités](#fonctionnalités)

</div>

---

## 🎯 À propos

**EpiTrello** est une application web de gestion de projets moderne et collaborative, offrant une interface intuitive de type Kanban. Construite avec React et Node.js, elle permet aux équipes de s'organiser efficacement avec un système de tableaux, listes et cartes personnalisables.

### ✨ Points clés

- 🚀 **Interface réactive** avec drag & drop fluide
- 🔄 **Collaboration temps réel** via WebSocket
- 💾 **Base PostgreSQL** robuste et performante
- 🐳 **Déploiement Docker** simplifié
- 🔍 **Recherche avancée** multi-critères
- 📎 **Pièces jointes** et commentaires
- 🎨 **Templates** de tableaux réutilisables
- 📅 **Gestion des échéances** avec notifications

---

## 🚀 Fonctionnalités

### 📊 Gestion de projets

| Fonctionnalité | Description |
|---|---|
| **Tableaux** | Créez et organisez plusieurs projets simultanément |
| **Listes** | Structurez votre workflow (À faire, En cours, Terminé) |
| **Cartes** | Gérez vos tâches avec descriptions détaillées |
| **Drag & Drop** | Réorganisez facilement cartes et listes |
| **Dates limites** | Suivez les échéances avec indicateurs visuels |
| **Fichiers** | Attachez des documents à vos cartes (jusqu'à 50MB) |

### 💬 Collaboration

- **Commentaires** sur les cartes pour échanger avec l'équipe
- **Historique d'activité** complet avec timestamps
- **Mises à jour temps réel** synchronisées entre utilisateurs
- **Authentification** sécurisée avec gestion de sessions

### 🔍 Recherche & Filtres

- Recherche **textuelle** dans titres, descriptions et commentaires
- Filtrage par **dates d'échéance**
- Filtres rapides : **En retard** / **À venir**
- Recherche par **pièces jointes** et **commentaires**

### 🎨 Templates

- Créez des **modèles** à partir de tableaux existants
- Instanciez de **nouveaux projets** en un clic
- Bibliothèque de templates personnalisables

---

## 🛠️ Stack technique

### Frontend
```
React 18              Interface utilisateur moderne avec hooks
React Beautiful DnD   Drag & drop intuitif
Socket.IO Client      Synchronisation temps réel
Axios                 Client HTTP pour les API
CSS3                  Design personnalisé inspiré Trello
```

### Backend
```
Node.js               Environnement d'exécution JavaScript
Express.js            Framework web minimaliste et flexible
Socket.IO             Communication WebSocket bidirectionnelle
PostgreSQL            Base de données relationnelle robuste
node-postgres (pg)    Client PostgreSQL natif
Crypto                Hachage sécurisé des mots de passe
```

### Infrastructure
```
Docker                Conteneurisation des services
Docker Compose        Orchestration multi-conteneurs
PostgreSQL 15         Image Alpine Linux optimisée
Volumes               Persistance des données
```

---

## 🚀 Démarrage rapide

### Prérequis

- [Docker](https://docs.docker.com/get-docker/) et Docker Compose
- Ou [Node.js 18+](https://nodejs.org/) et npm (pour développement local)

### Option 1 : Docker (Recommandé)

La façon la plus simple de lancer l'application complète :

```bash
# Cloner le repository
git clone <votre-repo-url>
cd EpiTrello

# Lancer tous les services
sudo docker-compose up --build
```

**🎉 C'est tout !** L'application est accessible :
- 🌐 **Frontend** : [http://localhost:3000](http://localhost:3000)
- 🔌 **API Backend** : [http://localhost:3001/api](http://localhost:3001/api)
- 🗄️ **PostgreSQL** : `localhost:5432` (utilisateur: `postgres`, mot de passe: `postgres`)

### Option 2 : Développement local

Pour développer sans Docker :

```bash
# Terminal 1 - Backend
cd backend
npm install
npm start          # ou npm run dev avec nodemon

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

---

## 📁 Structure du projet

```
EpiTrello/
│
├── 🐳 docker-compose.yml          # Orchestration des conteneurs
├── 📖 README.md                    # Documentation
│
├── 🎨 frontend/                    # Application React
│   ├── src/
│   │   ├── components/
│   │   │   ├── Board.js            # Tableau principal avec listes
│   │   │   ├── List.js             # Composant liste (suppression)
│   │   │   ├── Card.js             # Carte avec échéances & fichiers
│   │   │   ├── CardDetailModal.js  # Vue détaillée des cartes
│   │   │   ├── CardComments.js     # Système de commentaires
│   │   │   ├── SearchBar.js        # Recherche avancée
│   │   │   ├── Templates.js        # Gestion des templates
│   │   │   ├── Login.js            # Authentification
│   │   │   ├── Notifications.js    # Notifications d'échéances
│   │   │   ├── Modal.js            # Modales réutilisables
│   │   │   ├── ThemeToggle.js      # Thème clair/sombre
│   │   │   └── CreateBoardModal.js # Création de tableaux
│   │   ├── services/
│   │   │   └── api.js              # Client API centralisé
│   │   ├── context/
│   │   │   └── ThemeContext.js     # Contexte de thème
│   │   ├── App.js                  # Composant racine + WebSocket
│   │   ├── index.js                # Point d'entrée React
│   │   └── index.css               # Styles globaux
│   ├── public/
│   ├── build/                      # Build de production
│   ├── Dockerfile                  # Image Docker frontend
│   └── package.json
│
├── ⚙️ backend/                      # API Node.js/Express
│   ├── routes/
│   │   ├── auth.js                 # Endpoints authentification
│   │   ├── boards.js               # CRUD tableaux
│   │   ├── lists.js                # CRUD listes
│   │   ├── cards.js                # CRUD cartes
│   │   ├── comments.js             # Gestion commentaires
│   │   ├── activity.js             # Logs d'activité
│   │   ├── templates.js            # Templates de tableaux
│   │   ├── search.js               # Recherche avancée
│   │   └── uploads.js              # Upload/download fichiers
│   ├── data/                       # Données JSON (legacy)
│   │   ├── boards.json
│   │   ├── lists.json
│   │   ├── cards.json
│   │   └── users.json
│   ├── uploads/                    # Stockage des fichiers
│   ├── db.js                       # Configuration PostgreSQL
│   ├── server.js                   # Serveur Express + Socket.IO
│   ├── seedTemplates.js            # Initialisation des templates
│   ├── Dockerfile                  # Image Docker backend
│   └── package.json
│
└── 🗄️ PostgreSQL (Docker)          # Base de données
    └── Volume: postgres-data       # Persistance des données
```

---

## 📚 Documentation API

### 🔐 Authentification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/auth/register` | Créer un nouveau compte utilisateur |
| `POST` | `/api/auth/login` | Connexion (email + mot de passe) |
| `GET` | `/api/auth/me` | Récupérer l'utilisateur connecté |

### 📊 Tableaux

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/boards` | Lister tous les tableaux |
| `GET` | `/api/boards/:id` | Obtenir un tableau spécifique |
| `POST` | `/api/boards` | Créer un nouveau tableau |
| `PUT` | `/api/boards/:id` | Modifier un tableau |
| `DELETE` | `/api/boards/:id` | Supprimer un tableau |

### 📝 Listes

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/lists/board/:boardId` | Lister les listes d'un tableau |
| `GET` | `/api/lists/:id` | Obtenir une liste spécifique |
| `POST` | `/api/lists` | Créer une nouvelle liste |
| `PUT` | `/api/lists/:id` | Modifier une liste |
| `DELETE` | `/api/lists/:id` | Supprimer une liste |

### 🎴 Cartes

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/cards/list/:listId` | Lister les cartes d'une liste |
| `GET` | `/api/cards/:id` | Obtenir une carte spécifique |
| `POST` | `/api/cards` | Créer une carte (avec échéance & fichiers) |
| `PUT` | `/api/cards/:id` | Modifier une carte |
| `DELETE` | `/api/cards/:id` | Supprimer une carte |

### 📎 Fichiers

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/uploads/upload` | Uploader un fichier |
| `GET` | `/api/uploads/download/:fileName` | Télécharger un fichier |
| `DELETE` | `/api/uploads/:fileName` | Supprimer un fichier |

### 💬 Commentaires

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/comments/card/:cardId` | Lister les commentaires d'une carte |
| `POST` | `/api/comments` | Ajouter un commentaire |
| `PUT` | `/api/comments/:id` | Modifier un commentaire |
| `DELETE` | `/api/comments/:id` | Supprimer un commentaire |

### 📜 Activité

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/activity/card/:cardId` | Historique d'activité d'une carte |
| `GET` | `/api/activity/board/:boardId` | Historique d'activité d'un tableau |
| `POST` | `/api/activity` | Créer une entrée d'activité |

### 🎨 Templates

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/templates` | Lister tous les templates |
| `GET` | `/api/templates/:id` | Obtenir un template spécifique |
| `POST` | `/api/templates` | Créer un template depuis un tableau |
| `POST` | `/api/templates/:id/create-board` | Créer un tableau depuis un template |
| `DELETE` | `/api/templates/:id` | Supprimer un template |

### 🔍 Recherche

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/search` | Recherche avancée multi-critères |
| `GET` | `/api/search/boards` | Rechercher des tableaux |
| `GET` | `/api/search/overdue` | Cartes en retard |
| `GET` | `/api/search/due-soon` | Cartes à échéance proche (7j) |

---

## 📖 Guide d'utilisation

### Premiers pas

1. **🔐 Connexion**
   - Créez un compte ou connectez-vous
   - Mode invité disponible pour tester

2. **📊 Créer un tableau**
   - Cliquez sur "Nouveau tableau"
   - Donnez-lui un nom et une description

3. **📝 Organiser le workflow**
   - Ajoutez des listes : "À faire", "En cours", "Terminé"
   - Personnalisez selon vos besoins

4. **🎴 Gérer les tâches**
   - Créez des cartes dans vos listes
   - Ajoutez descriptions, échéances et fichiers
   - Glissez-déposez pour réorganiser

### Fonctionnalités avancées

#### 📅 Échéances visuelles
- 🔴 **Rouge** : Tâches en retard
- 🟡 **Jaune** : Échéance proche (< 7 jours)
- ⚪ **Gris** : Échéance future

#### 💬 Collaboration
- Cliquez sur une carte pour voir les détails
- Ajoutez des commentaires
- Consultez l'historique d'activité
- Les mises à jour sont synchronisées en temps réel

#### 🔍 Recherche intelligente
- **Recherche textuelle** : Titre, description, commentaires
- **Filtres temporels** : Plage de dates personnalisée
- **Filtres rapides** : En retard / À venir
- **Critères multiples** : Fichiers, commentaires, etc.

#### 🎨 Templates
- Sauvegardez un tableau comme modèle
- Créez de nouveaux projets depuis un template
- Gagnez du temps sur les projets récurrents

---

## 🗄️ Base de données

### Architecture PostgreSQL

EpiTrello utilise **PostgreSQL 15** pour une persistance robuste :

#### Schéma de la base
```sql
users              # Comptes utilisateurs
  ├─ id (PK)
  ├─ email (UNIQUE)
  ├─ password_hash
  └─ created_at

boards             # Tableaux de projets
  ├─ id (PK)
  ├─ name
  ├─ description
  ├─ user_id (FK → users)
  └─ created_at

lists              # Listes de tâches
  ├─ id (PK)
  ├─ title
  ├─ board_id (FK → boards)
  ├─ position
  └─ created_at

cards              # Cartes de tâches
  ├─ id (PK)
  ├─ title
  ├─ description
  ├─ list_id (FK → lists)
  ├─ due_date (TIMESTAMP)
  ├─ position
  └─ created_at

comments           # Commentaires
  ├─ id (PK)
  ├─ card_id (FK → cards)
  ├─ user_id (FK → users)
  ├─ content (TEXT)
  └─ created_at

activity_logs      # Historique d'activité
  ├─ id (PK)
  ├─ card_id (FK → cards)
  ├─ board_id (FK → boards)
  ├─ user_id (FK → users)
  ├─ action_type
  ├─ description
  └─ created_at

attachments        # Métadonnées des fichiers
  ├─ id (PK)
  ├─ card_id (FK → cards)
  ├─ file_name
  ├─ original_name
  ├─ file_size
  └─ uploaded_at

board_templates    # Templates réutilisables
  ├─ id (PK)
  ├─ name
  ├─ description
  ├─ template_data (JSONB)
  └─ created_at
```

#### Caractéristiques
- ✅ **Initialisation automatique** au premier démarrage
- ✅ **Requêtes paramétrées** (protection SQL injection)
- ✅ **Indexes** sur les clés étrangères pour performance
- ✅ **Volume Docker** pour persistance des données
- ✅ **Recherche full-text** PostgreSQL native
- ✅ **JSONB** pour structures flexibles (templates)

#### Sauvegarde et migration
```bash
# Backup de la base
docker exec epitrello-db pg_dump -U postgres epitrello > backup.sql

# Restauration
docker exec -i epitrello-db psql -U postgres epitrello < backup.sql

# Accès direct à PostgreSQL
docker exec -it epitrello-db psql -U postgres -d epitrello
```

---

## 🔧 Développement

### Architecture technique

#### Frontend (React)
- **Hooks** : useState, useEffect pour la gestion d'état
- **Context API** : ThemeContext pour le thème global
- **WebSocket** : Socket.IO client pour temps réel
- **Drag & Drop** : React Beautiful DnD
- **Routing** : Gestion des vues avec React Router (si applicable)

#### Backend (Node.js/Express)
- **Architecture RESTful** avec routes modulaires
- **Middleware** : CORS, JSON parsing, authentification
- **WebSocket** : Socket.IO serveur pour broadcasting
- **ORM** : Requêtes SQL natives avec node-postgres
- **Sécurité** : 
  - Hachage SHA-256 pour mots de passe
  - Requêtes paramétrées (SQL injection)
  - Tokens de session
  - Validation des entrées

#### Communication temps réel
```javascript
// Événements Socket.IO
'boardUpdated'    // Modifications de tableau
'listUpdated'     // Modifications de liste
'cardUpdated'     // Modifications de carte
'cardCreated'     // Nouvelle carte
'cardDeleted'     // Suppression de carte
```

### Tests

Le projet inclut des tests unitaires :

```bash
cd backend
npm test              # Lance tous les tests
npm test -- auth      # Tests d'authentification
npm test -- cards     # Tests des cartes
```

Tests couverts :
- ✅ Authentification (register, login)
- ✅ Opérations CRUD sur les cartes
- ✅ Gestion des listes
- ✅ Upload de fichiers

### Variables d'environnement

#### Backend
```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=epitrello
```

#### Docker Compose
Les variables sont configurées dans [docker-compose.yml](docker-compose.yml)

---

## 🚀 Roadmap

### ✅ Phase 1 - Fonctionnalités de base (Livrée le 5/12)
- [x] Gestion des tableaux, listes et cartes
- [x] Système de suppression avec confirmation
- [x] Drag & drop intuitif
- [x] Dates limites avec indicateurs visuels
- [x] Notifications d'échéances
- [x] Pièces jointes (jusqu'à 50MB)
- [x] Authentification utilisateur
- [x] Collaboration temps réel (WebSocket)

### ✅ Phase 2 - Fonctionnalités avancées (Livrée le 18/12)
- [x] Migration PostgreSQL complète
- [x] Recherche avancée et filtres multi-critères
- [x] Système de commentaires
- [x] Historique d'activité détaillé
- [x] Templates de tableaux réutilisables
- [x] Filtres rapides (en retard, à venir)

### 🔮 Phase 3 - Améliorations futures

#### Haute priorité
- [ ] **Notifications email** pour échéances et mentions
- [ ] **Labels et tags** personnalisables pour les cartes
- [ ] **Système de permissions** (lecteur, éditeur, admin)
- [ ] **Checklists** et sous-tâches dans les cartes
- [ ] **Vue calendrier** pour visualiser les échéances
- [ ] **Design responsive** optimisé mobile

#### Moyenne priorité
- [ ] **Partage de tableaux** avec utilisateurs externes
- [ ] **Export** PDF/CSV des tableaux
- [ ] **Webhooks** pour intégrations externes
- [ ] **API tokens** et rate limiting
- [ ] **Mode hors ligne** avec synchronisation
- [ ] **Thèmes** personnalisables avancés

#### Basse priorité
- [ ] **Automatisations** type "Butler" (règles)
- [ ] **Intégrations** (Slack, GitHub, Google Drive)
- [ ] **Analytics** et tableaux de bord
- [ ] **Sauvegardes automatiques** programmées
- [ ] **Mode sombre automatique** (selon l'heure)
- [ ] **Raccourcis clavier** avancés

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! Voici comment participer :

### Processus

1. **Fork** le repository
2. **Créez** une branche pour votre fonctionnalité
   ```bash
   git checkout -b feature/ma-nouvelle-fonctionnalite
   ```
3. **Committez** vos changements
   ```bash
   git commit -m "✨ Ajout d'une super fonctionnalité"
   ```
4. **Pushez** vers votre fork
   ```bash
   git push origin feature/ma-nouvelle-fonctionnalite
   ```
5. **Ouvrez** une Pull Request

### Conventions

#### Commits
Utilisez des préfixes émoji pour plus de clarté :
- ✨ `:sparkles:` - Nouvelle fonctionnalité
- 🐛 `:bug:` - Correction de bug
- 📝 `:memo:` - Documentation
- 🎨 `:art:` - Style/format du code
- ⚡ `:zap:` - Performance
- ♻️ `:recycle:` - Refactoring
- 🔒 `:lock:` - Sécurité
- ✅ `:white_check_mark:` - Tests

#### Code
- Suivre le style existant (ESLint/Prettier)
- Commenter les fonctions complexes
- Ajouter des tests pour les nouvelles fonctionnalités
- Mettre à jour la documentation si nécessaire

---

## 📄 Licence

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👥 Auteurs & Remerciements

Développé avec ❤️ dans le cadre du projet **Tec_3**

### Technologies utilisées
Merci aux créateurs de ces excellents outils :
- [React](https://reactjs.org/) - Interface utilisateur
- [Node.js](https://nodejs.org/) - Runtime backend
- [PostgreSQL](https://www.postgresql.org/) - Base de données
- [Socket.IO](https://socket.io/) - Communication temps réel
- [React Beautiful DnD](https://github.com/atlassian/react-beautiful-dnd) - Drag & drop

---

<div align="center">

**⭐ Si ce projet vous plaît, n'hésitez pas à lui donner une étoile !**

[🐛 Signaler un bug](../../issues) • [💡 Proposer une fonctionnalité](../../issues) • [📖 Documentation](../../wiki)

</div>