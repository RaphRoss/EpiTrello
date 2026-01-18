# Configuration du déploiement CI/CD

## 🚨 Les workflows CD (déploiement) sont DÉSACTIVÉS par défaut

Les workflows de déploiement automatique sont désactivés tant que les secrets ne sont pas configurés.

---

## 🎯 Workflows actifs actuellement

### ✅ CI - Toujours actifs (pas besoin de secrets)

- **ci.yml** - Tests backend, frontend, builds, security scans
- **pr-check.yml** - Validation des pull requests
- **release.yml** - Création de releases automatiques

### ⏸️ CD - Désactivés (nécessitent configuration)

- **cd.yml** - Déploiement en production (manuel uniquement)
- **cron-jobs.yml** - Backups et audits (désactivés)

---

## 🚀 Activer le déploiement automatique

### 1. Configure tous les secrets obligatoires

Va sur : **Settings > Secrets and variables > Actions**

**Secrets obligatoires :**
```
SSH_PRIVATE_KEY      - Clé SSH générée par ./setup-ssh.sh
SERVER_HOST          - IP ou domaine du serveur
SERVER_USER          - Utilisateur SSH (ubuntu, root, deploy)
DEPLOY_PATH          - Chemin déploiement (/opt/epitrello)
DOCKER_USERNAME      - Username Docker Hub
DOCKER_PASSWORD      - Token Docker Hub
APP_URL              - URL de l'app (http://IP:3000)
```

**Optionnel :**
```
SLACK_WEBHOOK_URL    - Notifications Slack
SWARM_SSH_KEY        - Pour Docker Swarm
SWARM_MANAGER        - Manager Swarm
```

### 2. Modifie les workflows

**Pour activer le déploiement automatique :**

Édite [.github/workflows/cd.yml](.github/workflows/cd.yml) :
```yaml
on:
  workflow_dispatch:  # Garder pour déploiement manuel
  push:               # Décommenter ces lignes
    branches: [ main ]
  tags:
    - 'v*'
```

**Pour activer les backups/audits :**

Édite [.github/workflows/cron-jobs.yml](.github/workflows/cron-jobs.yml) :
```yaml
on:
  workflow_dispatch:
  schedule:  # Décommenter ces lignes
    - cron: '0 2 * * *'    # Audit quotidien
    - cron: '0 3 * * 0'    # Backup hebdomadaire
```

Et change dans le job `database-backup` :
```yaml
if: false  # Changer en: if: github.event.schedule == '0 3 * * 0'
```

### 3. Test manuel d'abord

Avant d'activer l'automatique, teste manuellement :

1. Va sur **Actions** dans GitHub
2. Sélectionne "CD - Deploy to Production"
3. Clique **Run workflow**
4. Choisis l'environnement
5. Vérifie que ça marche ✅

### 4. Active l'automatique

Une fois le test manuel réussi, décommente les déclencheurs automatiques.

---

## 📝 Déploiement manuel (actuel)

**Comment déployer maintenant :**

1. Va sur GitHub → **Actions**
2. Sélectionne **"CD - Deploy to Production"**
3. Clique **"Run workflow"**
4. Choisis **production** ou **staging**
5. Clique **"Run workflow"**

Le déploiement se lancera uniquement quand tu le décides ! 🎯

---

## 📊 Avantages de cette configuration

✅ **CI fonctionne toujours** - Tests, builds, scans sur chaque push  
✅ **Pas d'erreurs** - CD ne se lance pas sans secrets  
✅ **Contrôle total** - Tu décides quand déployer  
✅ **Facile à activer** - Juste décommenter quelques lignes  

---

## 📚 Documentation

- [docs/CICD.md](CICD.md) - Guide complet CI/CD
- [setup-ssh.sh](../setup-ssh.sh) - Générer clés SSH
- [setup-server.sh](../setup-server.sh) - Configurer serveur

---

**Résumé :** CI fonctionne automatiquement. CD est manuel jusqu'à configuration des secrets. Aucune erreur, juste du contrôle ! ✅
