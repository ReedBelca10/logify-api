# API Documentation - Backend de Livraison

URL de base : `http://localhost:3000`

## Table des matières

1. [Authentification](#authentification)
2. [Utilisateurs](#utilisateurs)
3. [Livraisons](#livraisons)

---

## Authentification

### Inscription locale

Créer un nouvel utilisateur avec email et mot de passe.

- **URL** : `/auth/register`
- **Méthode** : `POST`
- **Accès** : Public

**Corps de la requête** :
```json
{
  "name": "Jean Dupont",
  "email": "jean.dupont@example.com",
  "password": "motdepasse123",
  "phoneNumber": "+33612345678" // Optionnel
}
```

**Réponse réussie** (201) :
```json
{
  "message": "Inscription réussie",
  "user": {
    "id": "64abc123...",
    "name": "Jean Dupont",
    "email": "jean.dupont@example.com",
    "role": "CLIENT"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

---

### Connexion locale

Connexion avec email et mot de passe.

- **URL** : `/auth/login`
- **Méthode** : `POST`
- **Accès** : Public

**Corps de la requête** :
```json
{
  "email": "jean.dupont@example.com",
  "password": "motdepasse123"
}
```

**Réponse réussie** (200) :
```json
{
  "message": "Connexion réussie",
  "user": {
    "id": "64abc123...",
    "name": "Jean Dupont",
    "email": "jean.dupont@example.com",
    "role": "CLIENT",
    "photoURL": null
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

**Erreurs possibles** :
- 401 : Email ou mot de passe incorrect
- 401 : Compte désactivé

---

### Authentification Firebase

Connexion via Google, Facebook, etc. en utilisant le token Firebase.

- **URL** : `/auth/firebase`
- **Méthode** : `POST`
- **Accès** : Public

**Corps de la requête** :
```json
{
  "firebaseToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
}
```

**Réponse réussie** (200) :
```json
{
  "message": "Connexion Firebase réussie",
  "user": {
    "id": "64abc456...",
    "name": "Marie Martin",
    "email": "marie.martin@gmail.com",
    "role": "CLIENT",
    "photoURL": "https://lh3.googleusercontent.com/...",
    "authProvider": "google"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

**Note** : Si l'utilisateur n'existe pas, il sera créé automatiquement avec le rôle CLIENT.

---

### Obtenir le profil

Récupère les informations de l'utilisateur connecté.

- **URL** : `/auth/profile`
- **Méthode** : `GET`
- **Accès** : Authentifié (JWT requis)
- **Header** : `Authorization: Bearer <accessToken>`

**Réponse réussie** (200) :
```json
{
  "id": "64abc123...",
  "name": "Jean Dupont",
  "email": "jean.dupont@example.com",
  "role": "CLIENT",
  "phoneNumber": "+33612345678",
  "photoURL": null,
  "authProvider": "local",
  "isActive": true
}
```

---

## Utilisateurs

**Note** : Pour toutes les routes utilisateurs ci-dessous, vous devez inclure le token JWT dans le header :
```
Authorization: Bearer <votre_token>
```

---

## Livraisons

Documentation à venir pour les endpoints de livraisons.

---

## Gestion des Erreurs

L'API utilise des codes de statut HTTP standards :

- **200 OK** : Requête réussie
- **201 Created** : Ressource créée avec succès
- **400 Bad Request** : Données invalides
- **401 Unauthorized** : Non authentifié ou token invalide
- **403 Forbidden** : Accès refusé (rôle insuffisant)
- **404 Not Found** : Ressource non trouvée
- **409 Conflict** : Conflit (ex: email déjà utilisé)
- **500 Internal Server Error** : Erreur serveur

**Format des erreurs** :
```json
{
  "statusCode": 401,
  "message": "Non autorisé",
  "error": "Unauthorized"
}
```

ou pour les erreurs de validation :
```json
{
  "statusCode": 400,
  "message": [
    "Le nom est requis",
    "Email invalide",
    "Le mot de passe doit avoir au moins 6 caractères"
  ],
  "error": "Bad Request"
}
```

---

## Authentification des Requêtes

### Inclure le Token JWT

Pour toutes les routes protégées, incluez le token JWT dans le header :

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6..." \
  http://localhost:3000/auth/profile
```

### Obtenir le Frontend

Le token est retourné lors de l'inscription ou de la connexion. Sauvegardez-le localement (localStorage, sessionStorage, ou cookies sécurisés).

```javascript
// Exemple en JavaScript
const response = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'jean@example.com',
    password: 'password123'
  })
});

const data = await response.json();
// Sauvegarder le token
localStorage.setItem('accessToken', data.accessToken);

// Utiliser le token pour les requêtes suivantes
const profileResponse = await fetch('http://localhost:3000/auth/profile', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
});
```

---

## Exemples de Requêtes cURL

### Inscription

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Connexion

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Profil (avec token)

```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

---

## Permissions par Rôle

| Endpoint | CLIENT | LIVREUR | SUPERADMIN |
|----------|--------|---------|------------|
| POST /auth/register | ✅ | ✅ | ✅ |
| POST /auth/login | ✅ | ✅ | ✅ |
| POST /auth/firebase | ✅ | ✅ | ✅ |
| GET /auth/profile | ✅ | ✅ | ✅ |

*Plus d'endpoints seront ajoutés pour la gestion des utilisateurs et des livraisons.*
