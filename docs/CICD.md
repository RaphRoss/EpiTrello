# 🚀 CI/CD Documentation - EpiTrello

## Vue d'ensemble

EpiTrello utilise GitHub Actions pour automatiser le cycle de développement complet :
- **CI** : Tests, linting, builds, scans de sécurité
- **CD** : Déploiement automatique en production
- **Monitoring** : Audits quotidiens, backups hebdomadaires

---

## 📋 Workflows disponibles

### 1. CI - Tests & Build (`ci.yml`)

**Déclencheurs :**
- Push sur `main` ou `develop`
- Pull requests vers `main` ou `develop`

**Jobs :**

#### Backend Tests
- Installation des dépendances
- Linting du code
- Exécution des tests avec PostgreSQL
- Upload des rapports de couverture

#### Frontend Tests
- Installation des dépendances
- Linting du code
- Exécution des tests
- Build de production
- Upload des artefacts

#### Docker Build & Push
- Construction des images Docker
- Push vers Docker Hub (uniquement sur `main`)
- Tagging automatique : `latest`, `branch-sha`, version

#### Security Scan
- Scan Trivy pour les vulnérabilités
- Audit npm pour les dépendances
- Upload des résultats SARIF

**Variables requises :**
```yaml
DOCKER_USERNAME: votre-username
DOCKER_PASSWORD: votre-token
```

---

### 2. CD - Deploy to Production (`cd.yml`)

**Déclencheurs :**
- Push sur `main`
- Tags `v*`
- Déclenchement manuel

**Jobs :**

#### Deploy
- Connexion SSH au serveur
- Pull du code
- Pull des images Docker
- Restart des services
- Health check
- Notification Slack

#### Deploy Docker Swarm (optionnel)
- Déploiement sur cluster Swarm
- Mise à jour du stack

#### Rollback
- Exécuté en cas d'échec
- Retour à la version précédente
- Notification de rollback

**Variables requises :**
```yaml
SSH_PRIVATE_KEY: clé-ssh-privée
SERVER_USER: user
SERVER_HOST: votre-serveur.com
DEPLOY_PATH: /path/to/app
APP_URL: https://epitrello.com
SLACK_WEBHOOK: webhook-url (optionnel)
SWARM_SSH_KEY: clé-pour-swarm (optionnel)
SWARM_MANAGER: manager-node (optionnel)
```

---

### 3. PR Checks (`pr-check.yml`)

**Déclencheurs :**
- Pull request opened/synchronize/reopened

**Jobs :**

#### Validate PR
- Vérification du titre (Conventional Commits)
- Détection de conflits de merge
- Vérification des tailles de fichiers (>10MB)

**Format de titre accepté :**
- `feat: nouvelle fonctionnalité`
- `fix: correction de bug`
- `docs: documentation`
- `style: formatage`
- `refactor: refactoring`
- `perf: amélioration performance`
- `test: ajout de tests`
- `chore: maintenance`

#### Code Quality
- ESLint sur backend et frontend
- Prettier check
- Rapport dans les commentaires

#### Dependency Review
- Analyse des nouvelles dépendances
- Détection de vulnérabilités

#### Comment on PR
- Commentaire automatique avec résultats
- Mise à jour si déjà existant

---

### 4. Release (`release.yml`)

**Déclencheurs :**
- Push de tag `v*.*.*` (ex: `v1.0.0`)

**Jobs :**

#### Create Release
- Génération du changelog
- Création de la release GitHub
- Notes de version automatiques

#### Build Release Artifacts
- Build du frontend
- Création d'archive `.tar.gz`
- Upload des artefacts

#### Docker Release
- Build multi-platform (amd64, arm64)
- Tag avec version et `latest`
- Push vers Docker Hub

**Créer une release :**
```bash
git tag v1.0.0
git push origin v1.0.0
```

---

### 5. Scheduled Tasks (`cron-jobs.yml`)

**Déclencheurs :**
- Quotidien à 2h : Security audit
- Dimanche à 3h : Database backup
- Manuel

**Jobs :**

#### Security Audit (quotidien)
- Audit npm backend + frontend
- Détection de vulnérabilités critiques
- Création d'issue si problèmes

#### Database Backup (hebdomadaire)
- Connexion au serveur
- Dump PostgreSQL
- Compression
- Suppression backups > 28 jours
- Notification Slack

#### Cleanup Artifacts
- Suppression artefacts > 30 jours
- Conservation des 5 plus récents

---

### 6. Dependabot (`dependabot.yml`)

**Automatisation des mises à jour :**
- Backend npm (lundi 9h)
- Frontend npm (lundi 9h)
- Docker images (lundi 9h)
- GitHub Actions (lundi 9h)

**Configuration :**
- Max 5 PRs ouvertes simultanément
- Labels automatiques
- Reviewers assignés
- Commit messages conventionnels

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
SLACK_WEBHOOK=https://hooks.slack.com/services/...
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
your-username/epitrello-frontend:main-abc1234
your-username/epitrello-frontend:v1.0.0
```

### Utilisation

```bash
# Latest version
docker pull your-username/epitrello-backend:latest

# Version spécifique
docker pull your-username/epitrello-backend:v1.0.0

# Commit spécifique
docker pull your-username/epitrello-backend:main-abc1234
```

---

## 🔒 Sécurité

### Scans automatiques

1. **Trivy** : Scan des fichiers et dépendances
2. **npm audit** : Vulnérabilités npm
3. **Dependabot** : Mises à jour de sécurité
4. **CodeQL** (optionnel) : Analyse de code statique

### Audit quotidien

- Exécution à 2h UTC
- Détection de vulnérabilités critiques
- Création automatique d'issues

### Bonnes pratiques

- ✅ Secrets stockés dans GitHub Secrets
- ✅ Variables d'environnement séparées
- ✅ SSH keys avec passphrase
- ✅ Tokens avec droits minimaux
- ✅ Scans de sécurité sur chaque PR

---

## 📈 Monitoring & Notifications

### Slack Integration

Configuration du webhook :
```yaml
SLACK_WEBHOOK: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

**Notifications envoyées :**
- ✅ Déploiement réussi
- ❌ Déploiement échoué
- ⚠️ Rollback exécuté
- 📦 Backup complété
- 🚨 Vulnérabilités détectées

### Artefacts sauvegardés

- Rapports de couverture de tests
- Builds frontend
- Archives de release
- Résultats de scan de sécurité

**Rétention :** 30 jours, 5 derniers conservés

---

## 🛠 Maintenance

### Backups

**Base de données :**
- Fréquence : Hebdomadaire (dimanche 3h)
- Rétention : 28 jours
- Format : SQL gzippé
- Emplacement : `/backups/` sur serveur

**Restauration :**
```bash
ssh user@server
cd /backups
gunzip epitrello_20260118_030000.sql.gz
docker exec -i epitrello-postgres psql -U epitrello epitrello < epitrello_20260118_030000.sql
```

### Cleanup

**Artefacts GitHub :**
- Suppression automatique > 30 jours
- Conservation des 5 plus récents

**Images Docker :**
- Cleanup manuel via Docker Hub UI
- Ou script personnalisé

---

## 🚨 Troubleshooting

### Workflow échoue

**1. Vérifier les logs :**
```
GitHub → Actions → Workflow → Job → Step
```

**2. Problèmes courants :**

| Erreur | Solution |
|--------|----------|
| `docker login failed` | Vérifier DOCKER_USERNAME et DOCKER_PASSWORD |
| `SSH connection refused` | Vérifier SSH_PRIVATE_KEY et SERVER_HOST |
| `Tests failed` | Lancer tests localement, vérifier PostgreSQL |
| `Image push failed` | Vérifier quotas Docker Hub |
| `Health check failed` | Vérifier APP_URL et endpoint /health |

**3. Redéclencher un workflow :**
```
Actions → Workflow → Re-run all jobs
```

### Rollback manuel

```bash
# SSH au serveur
ssh user@server

# Retour version précédente
cd /opt/epitrello
git log --oneline -5
git reset --hard <commit-hash>
docker compose down
docker compose up -d
```

### Annuler un déploiement

```bash
# Si le workflow est en cours
GitHub → Actions → Workflow → Cancel workflow run

# Puis rollback manuel
```

---

## 📚 Ressources

### Documentation GitHub Actions
- [Workflows syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Contexts](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions)
- [Secrets](https://docs.github.com/en/actions/reference/encrypted-secrets)

### Docker
- [Docker Hub](https://hub.docker.com)
- [Dockerfile best practices](https://docs.docker.com/develop/dev-best-practices/)

### Sécurité
- [Trivy](https://github.com/aquasecurity/trivy)
- [Dependabot](https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically)

---

## 🎯 Next Steps

### Améliorations possibles

- [ ] Ajout de tests E2E (Playwright/Cypress)
- [ ] Déploiement multi-environnements (staging, prod)
- [ ] Monitoring avec Prometheus/Grafana
- [ ] Logs centralisés (ELK Stack)
- [ ] Performance testing (k6)
- [ ] Blue-green deployment
- [ ] Canary releases
- [ ] Auto-scaling avec Kubernetes

### Intégrations

- [ ] Jira/Linear pour tracking
- [ ] Sentry pour error monitoring
- [ ] DataDog/New Relic pour APM
- [ ] SonarQube pour code quality

---

*Pour toute question : voir [README.md](../README.md) principal*
