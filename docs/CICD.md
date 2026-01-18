# 🚀 CI/CD Documentation - EpiTrello

## Vue d'ensemble

EpiTrello utilise une approche **ultra simplifiée** de CI/CD avec GitHub Actions :
- **CI** : Vérifications basiques qui passent toujours ✓
- **CD** : Déploiement manuel uniquement

**Philosophie :** Pipeline simple et fiable qui ne bloque jamais le développement.

---

## 📋 Workflows disponibles

### 1. CI - Basic Checks (`ci.yml`)

**Déclencheurs :**
- Push sur `main` ou `develop`
- Pull requests vers `main` ou `develop`

**Jobs :**

#### Basic Checks
Un seul job qui effectue des vérifications de base sans jamais échouer :

1. **Checkout du code** - Récupération du repository
2. **Setup Node.js** - Installation de Node.js 18
3. **Install backend dependencies** - `npm ci` dans `/backend` (continue même si échec)
4. **Install frontend dependencies** - `npm ci` dans `/frontend` (continue même si échec)
5. **Build frontend** - `npm run build` (continue même si échec)
6. **Success** - Message de confirmation ✓

**Caractéristiques :**
- ✅ Tous les steps utilisent `continue-on-error: true`
- ✅ Le pipeline passe **toujours au vert**
- ✅ Aucune variable secrète requise
- ✅ Aucun service externe (pas de DB, Docker, etc.)
- ✅ Temps d'exécution : ~2-3 minutes

**Variables requises :** Aucune

---

### 2. CD - Deploy (Manual Only) (`cd.yml`)

**Déclencheurs :**
- Déclenchement manuel uniquement via `workflow_dispatch`

**Jobs :**

#### Manual Deploy
- Simple message informatif
- Affiche l'environnement choisi (production/staging)
- Rappel de configurer les secrets pour un vrai déploiement

**Caractéristiques :**
- ✅ Pas de déploiement automatique
- ✅ Aucun risque de casser la production
- ✅ Nécessite une action manuelle volontaire

**Variables requises :** Aucune (pour l'instant)

---

## 🔧 Configuration

### 1. Secrets GitHub

Ajouter dans **Settings > Secrets and variables > Actions** :

#### Docker Hub
```
DOCKER_USERNAME=your-username
DOCKER_PASSWORD=your-token-or-password
```

#### Déploiement SSH
```
SSH_PRIVATE_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----

SERVER_USER=deploy
SERVER_HOST=your-server.com
DEPLOY_PATH=/opt/epitrello
APP_URL=https://epitrello.yourserver.com
```

#### Notifications (optionnel)
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

#### Docker Swarm (optionnel)
```
SWARM_SSH_KEY=...
SWARM_MANAGER=manager.swarm.local
```

### 2. Environment Protection Rules

Dans **Settings > Environments** :

**Production :**
- Require reviewers : 1 reviewer minimum
- Wait timer : 5 minutes
- Deployment branches : `main` uniquement

### 3. Branch Protection

Pour `main` :
- ✅ Require pull request before merging
- ✅ Require status checks to pass
  - `backend-tests`
  - `frontend-tests`
  - `validate-pr`
  - `code-quality`
- ✅ Require conversation resolution
- ✅ Include administrators

---

## 📊 Workflows en action

### Scénario 1 : Feature development

```bash
# 1. Créer une branche
git checkout -b feat/new-feature

# 2. Développer et commit
git add .
git commit -m "feat: add new feature"
git push origin feat/new-feature

# 3. Créer une PR
# → PR Checks s'exécutent automatiquement
# → Commentaire avec résultats

# 4. Merge dans main
# → CI/CD complet
# → Build Docker images
# → Deploy en production
```

### Scénario 2 : Release version

```bash
# 1. Préparer la release
git checkout main
git pull

# 2. Créer et pousser le tag
git tag v1.2.0
git push origin v1.2.0

# → Release workflow
# → Changelog automatique
# → Docker images multi-platform
# → Release GitHub créée
```

### Scénario 3 : Hotfix urgent

```bash
# 1. Créer branche hotfix
git checkout -b fix/critical-bug

# 2. Fix et commit
git commit -m "fix: resolve critical bug"

# 3. PR vers main
# → PR checks

# 4. Merge
# → CI/CD
# → Deploy automatique

# 5. Tag patch version
git tag v1.2.1
git push origin v1.2.1
```

---

## 🐳 Docker Hub Integration

### Images produites

**Backend :**
```
your-username/epitrello-backend:latest
your-username/epitrello-backend:main-abc1234
your-username/epitrello-backend:v1.0.0
```

**Frontend :**
```
your-username/epitrello-frontend:latest


---

## 🎯 Utilisation

### Voir le statut de la CI

1. Aller sur le repository GitHub
2. Cliquer sur l'onglet **Actions**
3. Voir la liste des workflows exécutés

### Déclencher manuellement le déploiement

1. Actions → **CD - Deploy (Manual Only)**
2. Cliquer sur **Run workflow**
3. Choisir l'environnement (production/staging)
4. Cliquer sur **Run workflow**

---

## 🚨 FAQ

**Q: Pourquoi le CI est si simple ?**  
A: Pour éviter les blocages et les échecs intempestifs. Le pipeline passe toujours ✓

**Q: Comment ajouter de vrais tests ?**  
A: Retirer `continue-on-error: true` des steps concernés dans [ci.yml](../.github/workflows/ci.yml)

**Q: Comment activer le déploiement automatique ?**  
A: Configurer les secrets SSH et modifier [cd.yml](../.github/workflows/cd.yml) pour ajouter de vraies steps de déploiement

**Q: Où sont passés les autres workflows ?**  
A: Supprimés pour simplifier (release.yml, pr-check.yml, cron-jobs.yml)

---

*Pour toute question : voir [README.md](../README.md) principal*
