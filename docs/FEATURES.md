# 📚 Documentation des fonctionnalités - EpiTrello

## Table des matières

1. [Gestion des tableaux](#gestion-des-tableaux)
2. [Listes et organisation](#listes-et-organisation)
3. [Cartes et tâches](#cartes-et-tâches)
4. [Système de commentaires](#système-de-commentaires)
5. [Pièces jointes](#pièces-jointes)
6. [Échéances et notifications](#échéances-et-notifications)
7. [Recherche et filtres](#recherche-et-filtres)
8. [Templates de tableaux](#templates-de-tableaux)
9. [Collaboration temps réel](#collaboration-temps-réel)
10. [Authentification](#authentification)

---

## 📊 Gestion des tableaux

### Créer un tableau

**Interface :**
- Cliquer sur "Nouveau tableau" dans la barre latérale
- Saisir un nom et une description (optionnel)
- Choisir de créer un tableau vide ou depuis un template

**API :**
```bash
POST /api/boards
Content-Type: application/json

{
  "name": "Mon projet",
  "description": "Description du projet"
}
```

**Réponse :**
```json
{
  "id": 1,
  "name": "Mon projet",
  "description": "Description du projet",
  "created_at": "2026-01-16T00:00:00.000Z"
}
```

### Fonctionnalités
- ✅ Création de tableaux illimités
- ✅ Modification du nom et description
- ✅ Suppression avec confirmation
- ✅ Navigation entre tableaux
- ✅ Attribution à un utilisateur

---

## 📝 Listes et organisation

### Créer une liste

**Interface :**
- Cliquer sur "+ Ajouter une liste" dans un tableau
- Saisir le nom de la liste
- La liste apparaît à droite des listes existantes

**API :**
```bash
POST /api/lists
Content-Type: application/json

{
  "title": "À faire",
  "boardId": 1,
  "position": 0
}
```

### Organiser les listes

- **Réorganisation :** Drag & drop entre les positions
- **Suppression :** Icône 🗑️ avec confirmation
- **Modification :** Cliquer sur le titre pour éditer

### Cas d'usage courants

**Workflow Kanban :**
- À faire → En cours → Revue → Terminé

**Gestion de bugs :**
- Nouveau → Assigné → En cours → Testé → Résolu

**Sprint Agile :**
- Backlog → Sprint actuel → En développement → En test → Déployé

---

## 🎴 Cartes et tâches

### Créer une carte

**Interface :**
1. Cliquer sur "+ Ajouter une carte" dans une liste
2. Remplir le formulaire :
   - **Titre** (obligatoire)
   - **Description** (optionnel)
   - **Date limite** (optionnel)
   - **Pièces jointes** (optionnel)

**API :**
```bash
POST /api/cards
Content-Type: application/json

{
  "title": "Implémenter login",
  "description": "Créer la page de connexion",
  "listId": 1,
  "dueDate": "2026-01-20T12:00:00.000Z",
  "attachments": []
}
```

### Déplacer une carte

**Drag & Drop :**
- Glisser-déposer entre listes
- Réorganiser dans la même liste
- Synchronisation automatique

**API :**
```bash
PUT /api/cards/1
Content-Type: application/json

{
  "listId": 2,
  "position": 0
}
```

### Modifier une carte

**Interface :**
- Cliquer sur la carte
- Cliquer sur "Edit Card"
- Modifier les champs
- Sauvegarder

### Supprimer une carte

- Bouton × sur la carte
- Confirmation requise
- Supprime aussi : commentaires, attachements, activité

---

## 💬 Système de commentaires

### Ajouter un commentaire

**Interface :**
1. Cliquer sur une carte
2. Onglet "Comments"
3. Écrire dans la zone de texte
4. Cliquer "Add Comment"

**API :**
```bash
POST /api/comments
Content-Type: application/json

{
  "cardId": 1,
  "userId": 42,
  "content": "Travail en cours sur cette tâche"
}
```

### Fonctionnalités

- **Auteur affiché :** Nom et email de l'utilisateur
- **Date :** Timestamp de création
- **Modification :** Possibilité d'éditer ses commentaires
- **Suppression :** Avec confirmation
- **Tri :** Chronologique (plus récent en bas)

### Historique d'activité

**Onglet "Activity" :**
- Création de carte
- Ajout de commentaire
- Modification de carte
- Changement de liste
- Ajout de pièce jointe

**API :**
```bash
GET /api/activity/card/1
```

**Réponse :**
```json
[
  {
    "id": 1,
    "action": "comment_added",
    "details": "Added comment: Travail en cours...",
    "user_name": "John Doe",
    "created_at": "2026-01-16T10:30:00.000Z"
  }
]
```

---

## 📎 Pièces jointes

### Uploader un fichier

**Interface :**
1. Lors de la création d'une carte : choisir des fichiers
2. Les fichiers sont uploadés automatiquement
3. Badge 📎 avec le nombre apparaît sur la carte

**API (Upload) :**
```bash
POST /api/uploads/upload
Content-Type: application/json

{
  "fileName": "document.pdf",
  "fileData": "data:application/pdf;base64,JVBERi0x...",
  "cardId": "temp_123456"
}
```

**Réponse :**
```json
{
  "fileName": "document.pdf",
  "storedName": "temp_123_456_document.pdf",
  "size": 245760,
  "uploadedAt": "2026-01-16T10:30:00.000Z"
}
```

### Voir et télécharger

**Interface :**
1. Cliquer sur la carte
2. Section "Attachments"
3. Liste des fichiers avec :
   - Nom original
   - Taille
   - Bouton "Download"

**API (Download) :**
```bash
GET /api/uploads/download/temp_123_456_document.pdf
```

### Formats supportés

- Documents : PDF, DOC, DOCX, TXT
- Images : PNG, JPG, JPEG, GIF
- Archives : ZIP, RAR
- Autres : Tous formats (limite 50MB)

### Stockage

- **Emplacement :** `/backend/uploads/`
- **Nommage :** `{cardId}_{timestamp}_{filename}`
- **Base de données :** Métadonnées dans table `attachments`

---

## 📅 Échéances et notifications

### Définir une échéance

**Interface :**
- Lors de la création : champ "Due Date"
- En édition : modifier la date
- Format : JJ/MM/AAAA

**Indicateurs visuels :**

| État | Couleur | Badge | Description |
|------|---------|-------|-------------|
| **En retard** | 🔴 Rouge | Bordure rouge | Date dépassée |
| **À venir** | 🟡 Jaune | Fond jaune | < 24h restantes |
| **Future** | ⚪ Gris | Fond gris | > 24h restantes |

### Notifications

**Système de notifications :**
- Vérification automatique des échéances
- Notification visuelle en haut de l'écran
- Compteur de cartes en retard
- Compteur de cartes à venir

**Déclencheurs :**
- Carte devient en retard
- Échéance dans moins de 24h
- Nouvelle carte avec échéance proche

---

## 🔍 Recherche et filtres

### Recherche textuelle

**Interface :**
- Barre de recherche en haut du tableau
- Recherche en temps réel
- Résultats affichés en grille

**API :**
```bash
GET /api/search?query=login&boardId=1
```

**Critères de recherche :**
- Titre de carte
- Description de carte
- Contenu des commentaires

### Filtres avancés

**Par date d'échéance :**
```bash
GET /api/search?boardId=1&dueDateFrom=2026-01-01&dueDateTo=2026-01-31
```

**Cartes en retard :**
```bash
GET /api/search/overdue?boardId=1
```

**Cartes à venir (7 jours) :**
```bash
GET /api/search/due-soon?boardId=1
```

**Par contenu :**
- Cartes avec commentaires
- Cartes avec pièces jointes
- Cartes sans échéance

### Filtres rapides

Interface avec boutons :
- 🔴 En retard
- 🟡 À venir
- 💬 Avec commentaires
- 📎 Avec fichiers

---

## 🎨 Templates de tableaux

### Créer un template

**Interface :**
1. Ouvrir un tableau existant
2. Cliquer "Sauvegarder comme template"
3. Donner un nom au template
4. Template ajouté à la bibliothèque

**API :**
```bash
POST /api/templates
Content-Type: application/json

{
  "name": "Sprint Planning",
  "description": "Template pour sprint Scrum",
  "boardId": 1
}
```

### Utiliser un template

**Interface :**
1. Cliquer "Nouveau tableau"
2. Onglet "Depuis un template"
3. Sélectionner un template
4. Donner un nom au nouveau tableau

**API :**
```bash
POST /api/templates/1/create-board
Content-Type: application/json

{
  "name": "Sprint Q1 2026",
  "userId": 42
}
```

### Templates par défaut

Au premier démarrage, 5 templates sont créés :

1. **Kanban Board** : À faire, En cours, Terminé
2. **Project Management** : Backlog, Sprint, En cours, Revue, Déployé
3. **Sprint Planning** : User Stories, Tâches, En cours, Terminé, Bloqué
4. **Simple To-Do** : À faire, Terminé
5. **Bug Tracking** : Nouveau, Assigné, En cours, Testé, Résolu

### Structure d'un template

```json
{
  "id": 1,
  "name": "Kanban Board",
  "description": "Template Kanban simple",
  "template_data": {
    "lists": [
      {"title": "À faire", "position": 0},
      {"title": "En cours", "position": 1},
      {"title": "Terminé", "position": 2}
    ]
  },
  "is_public": true
}
```

---

## 🔄 Collaboration temps réel

### WebSocket (Socket.IO)

**Connexion :**
```javascript
const socket = io('http://localhost:3001');
socket.emit('join-board', boardId);
```

### Événements diffusés

| Événement | Données | Description |
|-----------|---------|-------------|
| `card-created` | `{boardId, card}` | Nouvelle carte ajoutée |
| `card-updated` | `{boardId, card}` | Carte modifiée |
| `card-deleted` | `{boardId, cardId}` | Carte supprimée |
| `list-created` | `{boardId, list}` | Nouvelle liste ajoutée |
| `list-updated` | `{boardId, list}` | Liste modifiée |
| `list-deleted` | `{boardId, listId}` | Liste supprimée |

### Synchronisation

**Automatique :**
- Ajout de carte → tous les utilisateurs voient la nouvelle carte
- Drag & drop → position mise à jour pour tous
- Modification → changements visibles instantanément

**Gestion des conflits :**
- Dernier événement prévaut
- Pas de verrouillage optimiste
- Rafraîchissement automatique

---

## 🔐 Authentification

### Inscription

**Interface :**
1. Page de connexion
2. Onglet "Create Account"
3. Remplir : nom, email, mot de passe
4. Compte créé dans PostgreSQL

**API :**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "motdepasse123"
}
```

**Réponse :**
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "a1b2c3d4...xyz-1"
}
```

### Connexion

**API :**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "motdepasse123"
}
```

### Gestion de session

**Stockage :**
- Token dans `localStorage`
- User dans `localStorage`
- Vérification au chargement de l'app

**Déconnexion :**
- Suppression du token
- Suppression des données user
- Redirection vers login

### Sécurité

- **Hachage :** SHA-256 pour les mots de passe
- **Tokens :** Générés avec crypto.randomBytes
- **SQL Injection :** Requêtes paramétrées
- **CORS :** Configuré pour dev (à restreindre en prod)

### Vérification

**API :**
```bash
GET /api/auth/me
Authorization: Bearer {token}
```

---

## 📊 Récapitulatif technique

### Limites et contraintes

| Élément | Limite |
|---------|--------|
| Fichiers | 50 MB par fichier |
| Commentaires | Illimité |
| Cartes par liste | Illimité |
| Listes par tableau | Illimité |
| Tableaux | Illimité |

### Performances

- **Base de données :** Index sur clés étrangères
- **Requêtes :** Paramétrées et optimisées
- **Fichiers :** Stockage disque local
- **WebSocket :** Connexion persistante par utilisateur
- **Frontend :** React avec optimisations de rendu

### Compatibilité

- **Navigateurs :** Chrome, Firefox, Safari, Edge (modernes)
- **Docker :** Version 20.10+
- **Node.js :** Version 18+
- **PostgreSQL :** Version 15+

---

## 🚀 Utilisation avancée

### Workflow recommandé

1. **Configuration initiale**
   - Créer un compte
   - Créer un tableau depuis un template

2. **Organisation**
   - Définir les listes selon votre workflow
   - Créer les cartes principales

3. **Détails**
   - Ajouter descriptions
   - Définir échéances
   - Attacher documents

4. **Collaboration**
   - Inviter l'équipe (futur)
   - Commenter sur les cartes
   - Suivre l'activité

5. **Suivi**
   - Utiliser la recherche pour retrouver des cartes
   - Filtrer par échéance
   - Consulter l'historique

### Bonnes pratiques

✅ **Nommage clair** : Utiliser des titres descriptifs  
✅ **Dates réalistes** : Définir des échéances atteignables  
✅ **Documentation** : Ajouter descriptions et fichiers  
✅ **Communication** : Commenter régulièrement  
✅ **Organisation** : Garder les listes à jour  

---

## 🔮 Roadmap future

### Fonctionnalités prévues

- [ ] Système de permissions (lecteur/éditeur/admin)
- [ ] Notifications email
- [ ] Labels colorés pour les cartes
- [ ] Checklists dans les cartes
- [ ] Mentions @utilisateur dans commentaires
- [ ] Vue calendrier des échéances
- [ ] Export PDF/CSV
- [ ] Intégrations (Slack, GitHub)
- [ ] Mode hors ligne
- [ ] Application mobile

---

Pour toute question : voir [README.md](../README.md) principal
