# Configuration du Backend de Livraison

## Prérequis

- **Node.js** v18 ou supérieur
- **MongoDB** installé et en cours d'exécution localement
- **Compte Firebase** (pour l'authentification sociale - optionnel)

## Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer MongoDB

Assurez-vous que MongoDB est installé et lancé :

```bash
# Vérifier si MongoDB est en cours d'exécution
# Windows : Vérifier dans les services
# ou lancer mongod directement
mongod
```

Par défaut, l'application se connectera à `mongodb://127.0.0.1:27017/food_delivery`.

### 3. Configuration de Firebase Admin SDK (Optionnel)

Si vous souhaitez activer l'authentification via les réseaux sociaux (Google, Facebook, etc.) :

#### a. Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Créez un nouveau projet
3. Activez l'authentification dans Authentication > Sign-in method
4. Activez les fournisseurs souhaités (Google, Facebook, etc.)

#### b. Générer les credentials

1. Allez dans **Paramètres du projet** > **Comptes de service**
2. Cliquez sur **Générer une nouvelle clé privée**
3. Enregistrez le fichier JSON téléchargé à la racine du projet en tant que `firebase-service-account.json`

**IMPORTANT** : Ajoutez `firebase-service-account.json` à votre `.gitignore` pour ne pas le commit !

### 4. Configurer les variables d'environnement

Copiez le fichier `.env.example` vers `.env` :

```bash
copy .env.example .env
```

Puis modifiez `.env` avec vos propres valeurs :

```env
# Base de données MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/food_delivery

# Sécurité JWT
JWT_SECRET=changez_ce_secret_par_une_valeur_sécurisée
JWT_EXPIRATION=7d

# Port de l'application
PORT=3000

# Firebase (Optionnel - commentez si vous n'utilisez pas Firebase)
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
```

**Note** : Si vous n'utilisez pas Firebase, commentez ou supprimez la ligne `FIREBASE_SERVICE_ACCOUNT_PATH`.

## Démarrage

### Mode développement

```bash
npm run start:dev
```

L'application démarrera sur `http://localhost:3000`.

### Mode production

```bash
# Build
npm run build

# Lancer
npm run start:prod
```

## Créer le premier SUPERADMIN

Par défaut, tous les nouveaux utilisateurs sont créés avec le rôle `CLIENT`. Pour créer un SUPERADMIN :

### Méthode 1 : Via MongoDB directement

```bash
# Connectez-vous à MongoDB
mongosh

# Utilisez la base de données
use food_delivery

# Mettez à jour un utilisateur existant
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "SUPERADMIN" } }
)
```

### Méthode 2 : Via l'API (après avoir créé un compte normal)

1. Inscrivez-vous via POST `/auth/register` avec un email
2. Changez le rôle via MongoDB comme ci-dessus
3. Reconnectez-vous

Une fois SUPERADMIN, vous pourrez gérer les rôles des autres utilisateurs.

## Structure des Rôles

- **CLIENT** : Peut créer des commandes et voir ses propres livraisons
- **LIVREUR** : Peut voir et mettre à jour le statut de ses livraisons assignées
- **SUPERADMIN** : Accès complet, peut gérer tous les utilisateurs et toutes les livraisons

## Vérification

Pour vérifier que tout fonctionne :

```bash
# Tester l'inscription
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# La réponse devrait contenir un accessToken
```

## Dépannage

### MongoDB ne démarre pas

- **Windows** : Vérifiez que le service MongoDB est démarré dans les services Windows
- Assurez-vous que le port 27017 n'est pas utilisé par une autre application

### Firebase ne fonctionne pas

- Vérifiez que le fichier `firebase-service-account.json` existe et est au bon endroit
- Vérifiez les logs au démarrage pour voir si Firebase est initialisé
- Si vous n'utilisez pas Firebase, commentez `FIREBASE_SERVICE_ACCOUNT_PATH` dans `.env`

### Erreurs de compilation

```bash
# Nettoyer et réinstaller
rm -rf node_modules dist
npm install
npm run build
```

## Prochaines Étapes

Une fois le backend fonctionnel, consultez le fichier `API.md` pour voir la documentation complète des endpoints disponibles.
