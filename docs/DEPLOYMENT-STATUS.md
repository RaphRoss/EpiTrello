# Configuration du déploiement CI/CD

## 🚨 Les workflows CD (déploiement) sont désactivés par défaut

Pour activer le déploiement automatique, tu dois configurer les **secrets obligatoires** dans GitHub.

---

## 📝 Secrets à configurer

### Secrets OBLIGATOIRES pour le déploiement :

Va sur : **Settings > Secrets and variables > Actions > New repository secret**

| Secret | Description | Exemple |
|--------|-------------|---------|
| `SSH_PRIVATE_KEY` | Clé SSH privée générée | Contenu de `.ssh-deploy/id_rsa` |
| `SERVER_HOST` | IP ou domaine du serveur | `192.168.1.100` ou `epitrello.com` |
| `SERVER_USER` | Utilisateur SSH | `ubuntu`, `root`, ou `deploy` |
| `DEPLOY_PATH` | Chemin sur le serveur | `/opt/epitrello` |
| `DOCKER_USERNAME` | Username Docker Hub | `balghar` |
| `DOCKER_PASSWORD` | Token Docker Hub | `dckr_pat_...` |
| `APP_URL` | URL de l'application | `http://192.168.1.100:3000` |

### Secrets OPTIONNELS :

| Secret | Description | Impact si absent |
|--------|-------------|------------------|
| `SLACK_WEBHOOK_URL` | Webhook Slack | Pas de notifications Slack |
| `SWARM_SSH_KEY` | Clé pour Docker Swarm | Job deploy-swarm ignoré |
| `SWARM_MANAGER` | Manager Swarm | Job deploy-swarm ignoré |

---

## 🎯 Comportement actuel

### Sans secrets configurés :

✅ **CI workflows (fonctionnent)** :
- Tests backend avec PostgreSQL
- Tests frontend
- Build frontend
- Linting
- Security scans
- PR checks

❌ **CD workflows (ignorés)** :
- Deploy to Production → skippé
- Deploy to Swarm → skippé  
- Database Backup → skippé
- Notifications Slack → skippées

### Avec secrets configurés :

✅ Tous les workflows fonctionnent

---

## 🚀 Activer le déploiement

### 1. Générer la clé SSH

```bash
./setup-ssh.sh
```

### 2. Configurer le serveur

Sur ton **serveur**, exécute :
```bash
# Copie la clé publique affichée par setup-ssh.sh
mkdir -p ~/.ssh
echo 'TA_CLE_PUBLIQUE' >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Prépare le serveur
./setup-server.sh
```

### 3. Ajouter les secrets GitHub

```bash
# 1. SSH_PRIVATE_KEY
cat .ssh-deploy/id_rsa
# Copie TOUT le contenu dans GitHub Secret

# 2. Les autres secrets
# SERVER_HOST, SERVER_USER, DEPLOY_PATH, APP_URL
# DOCKER_USERNAME, DOCKER_PASSWORD
```

### 4. Tester

```bash
git add .
git commit -m "ci: configure deployment secrets"
git push origin main
```

Les workflows CD s'activeront automatiquement ! 🎉

---

## 📊 Statut des workflows

### Workflows toujours actifs (CI) :

- ✅ `ci.yml` - Tests & Build  
- ✅ `pr-check.yml` - PR validation  
- ✅ `release.yml` - Release automation  
- ✅ `cron-jobs.yml` - Security audit & cleanup

### Workflows conditionnels (CD) :

- ⏸️ `cd.yml` - Deploy (nécessite SSH_PRIVATE_KEY + SERVER_HOST)  
- ⏸️ `cron-jobs.yml` - Database Backup (nécessite SSH_PRIVATE_KEY)

---

## 🔍 Vérifier les secrets

Dans GitHub Actions, tu verras :

**Sans secrets** :
```
✅ Backend Tests - passed
✅ Frontend Tests - passed
✅ Docker Build & Push - passed
⏭️ Deploy to Production - skipped (secrets not configured)
```

**Avec secrets** :
```
✅ Backend Tests - passed
✅ Frontend Tests - passed
✅ Docker Build & Push - passed
✅ Deploy to Production - passed
✅ Health check - passed
```

---

## 📚 Documentation complète

- [docs/CICD.md](CICD.md) - Guide complet CI/CD
- [docs/SSH-SETUP.md](SSH-SETUP.md) - Configuration SSH détaillée
- [setup-ssh.sh](../setup-ssh.sh) - Script génération clés
- [setup-server.sh](../setup-server.sh) - Script configuration serveur

---

**En résumé** : Les CI workflows fonctionnent toujours. Les CD workflows s'activent uniquement quand tu configures les secrets. Pas de secrets = pas d'erreur, juste des jobs skippés. ✅
