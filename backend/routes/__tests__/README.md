# Tests Backend - EpiTrello

Ce dossier contient tous les tests unitaires pour l'API backend d'EpiTrello.

## Structure

```
__tests__/
├── auth.test.js        # Tests d'authentification
├── cards.test.js       # Tests des cartes
├── lists.test.js       # Tests des listes
├── uploads.test.js     # Tests des uploads
└── comments.test.js    # Tests des commentaires
```

## Exécution des tests

### Tous les tests
```bash
npm test
```

### Tests spécifiques
```bash
# Authentification
npm test -- auth.test.js

# Cartes
npm test -- cards.test.js

# Commentaires
npm test -- comments.test.js

# Listes
npm test -- lists.test.js

# Uploads
npm test -- uploads.test.js
```

### Mode watch
```bash
npm test -- --watch
```

### Couverture de code
```bash
npm test -- --coverage
```

## Configuration

Les tests utilisent :
- **Jest** : Framework de test
- **Supertest** : Test des endpoints HTTP
- **Mocks** : Base de données mockée pour les tests

## Tests des commentaires

### Endpoints testés

#### GET /api/comments/card/:cardId
- ✅ Récupère tous les commentaires d'une carte
- ✅ Gère les erreurs de base de données

#### POST /api/comments
- ✅ Crée un nouveau commentaire avec utilisateur
- ✅ Crée un commentaire sans utilisateur (anonyme)
- ✅ Log automatique dans l'activité
- ✅ Gère les erreurs de création

#### PUT /api/comments/:id
- ✅ Met à jour un commentaire existant
- ✅ Retourne 404 si commentaire inexistant
- ✅ Gère les erreurs de mise à jour

#### DELETE /api/comments/:id
- ✅ Supprime un commentaire
- ✅ Retourne 204 en cas de succès
- ✅ Retourne 404 si commentaire inexistant

### Exemple de test

```javascript
describe('POST /api/comments', () => {
    it('should create a new comment', async () => {
        const newComment = {
            cardId: 1,
            userId: 1,
            content: 'Test comment'
        };

        const response = await request(app)
            .post('/api/comments')
            .send(newComment)
            .expect(201);

        expect(response.body).toMatchObject({
            card_id: 1,
            user_id: 1,
            content: 'Test comment'
        });
    });
});
```

## Ajouter de nouveaux tests

1. Créer un fichier `nom.test.js`
2. Importer les dépendances :
```javascript
const request = require('supertest');
const express = require('express');
const router = require('../nom');
```

3. Mocker la base de données :
```javascript
jest.mock('../../db', () => ({
    pool: {
        query: jest.fn()
    }
}));
```

4. Écrire les tests :
```javascript
describe('Route Name', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should do something', async () => {
        // Test code
    });
});
```

## Bonnes pratiques

- ✅ Nettoyer les mocks avant chaque test (`beforeEach`)
- ✅ Tester les cas de succès et d'erreur
- ✅ Vérifier les codes de statut HTTP
- ✅ Vérifier la structure des réponses
- ✅ Mocker toutes les dépendances externes
- ✅ Utiliser des données de test réalistes
- ✅ Tester les cas limites (null, undefined, etc.)

## Debugging

### Voir les logs pendant les tests
```bash
npm test -- --verbose
```

### Exécuter un seul test
```javascript
it.only('should do something', async () => {
    // Ce test sera le seul exécuté
});
```

### Ignorer un test
```javascript
it.skip('should do something', async () => {
    // Ce test sera ignoré
});
```

## CI/CD

Les tests sont automatiquement exécutés :
- Avant chaque commit (pre-commit hook)
- Dans la pipeline CI/CD
- Avant chaque déploiement

## Couverture actuelle

| Fichier | Couverture |
|---------|-----------|
| auth.js | ~85% |
| cards.js | ~80% |
| lists.js | ~75% |
| uploads.js | ~70% |
| comments.js | ~90% |
| activity.js | À faire |
| templates.js | À faire |
| search.js | À faire |

## Roadmap

- [ ] Tests pour activity.js
- [ ] Tests pour templates.js
- [ ] Tests pour search.js
- [ ] Tests d'intégration end-to-end
- [ ] Tests de performance
- [ ] Tests de sécurité

## Ressources

- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://testingjavascript.com/)
