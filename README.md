# 📋 EpiTrello

Application web de gestion de projets type Trello avec drag & drop, collaboration temps réel et PostgreSQL.

## 🚀 Démarrage rapide

```bash
# Cloner et lancer
git clone <votre-repo-url>
cd EpiTrello
docker compose up -d

# Accéder à l'application
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
```

## ✨ Fonctionnalités

- 📊 Tableaux, listes et cartes avec **drag & drop**
- 💬 **Commentaires** et historique d'activité
- 📎 **Pièces jointes** téléchargeables
- 📅 **Échéances** avec indicateurs visuels
- 🔍 **Recherche avancée** et filtres
- 🎨 **Templates** de tableaux réutilisables
- 🔄 **WebSocket** pour sync temps réel
- 🔐 **Authentification** PostgreSQL

## 🛠️ Stack technique

**Frontend:** React 18, React Beautiful DnD, Socket.IO Client, Axios  
**Backend:** Node.js, Express, Socket.IO, PostgreSQL, node-postgres  
**Infrastructure:** Docker, Docker Compose, PostgreSQL 15

## 📚 Structure

```
EpiTrello/
├── frontend/          # React app
│   └── src/
│       ├── components/
│       └── services/
├── backend/           # Node.js API
│   ├── routes/        # API endpoints
│   ├── db.js          # PostgreSQL config
│   └── uploads/       # Fichiers attachés
└── docker-compose.yml
```

## 🔌 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/boards` | Lister les tableaux |
| `POST /api/cards` | Créer une carte |
| `GET /api/comments/card/:id` | Commentaires |
| `POST /api/uploads/upload` | Upload fichier |
| `GET /api/search` | Recherche avancée |

Documentation complète : [COMMENTS.md](COMMENTS.md)

## 💻 Développement local

```bash
# Backend
cd backend && npm install && npm start

# Frontend
cd frontend && npm install && npm start

# Tests
cd backend && npm test
```

## 🗄️ Base de données

PostgreSQL 15 avec tables : `users`, `boards`, `lists`, `cards`, `comments`, `activity_logs`, `attachments`, `board_templates`

```bash
# Accéder à PostgreSQL
docker exec -it epitrello-postgres psql -U postgres -d epitrello

# Backup
docker exec epitrello-postgres pg_dump -U postgres epitrello > backup.sql
```

## 🐛 Dépannage

```bash
# Vérifier les logs
docker compose logs backend

# Réinitialiser
docker compose down -v
docker compose up --build

# Diagnostic commentaires
./check_comments.sh
```

## 📖 Documentation

- **[📚 Documentation complète des fonctionnalités](docs/FEATURES.md)** - Guide détaillé de toutes les fonctionnalités

## 📄 Licence

MIT License
