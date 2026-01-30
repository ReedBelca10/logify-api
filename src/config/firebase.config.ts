import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService {
    private app: admin.app.App;

    constructor(private configService: ConfigService) {
        this.initializeFirebase();
    }

    /**
     * Initialise Firebase Admin SDK
     */
    private initializeFirebase() {
        const serviceAccountPath = this.configService.get<string>(
            'FIREBASE_SERVICE_ACCOUNT_PATH',
        );

        if (!serviceAccountPath) {
            console.warn(
                '⚠️  Firebase: Chemin du fichier de credentials non configuré. L\'authentification sociale sera désactivée.',
            );
            return;
        }

        try {
            // Charger le fichier de service account
            const serviceAccount = require(`../../${serviceAccountPath}`);

            this.app = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });

            console.log('✅ Firebase Admin SDK initialisé avec succès');
        } catch (error) {
            console.error(
                '❌ Erreur lors de l\'initialisation de Firebase:',
                error.message,
            );
            console.warn(
                '⚠️  L\'authentification Firebase sera désactivée. Utilisez l\'authentification locale.',
            );
        }
    }

    /**
     * Vérifie un token ID Firebase
     * @param idToken Token ID Firebase fourni par le client
     * @returns Les informations de l'utilisateur décodées
     */
    async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
        if (!this.app) {
            throw new Error(
                'Firebase n\'est pas initialisé. Vérifiez votre configuration.',
            );
        }

        return admin.auth().verifyIdToken(idToken);
    }

    /**
     * Récupère un utilisateur Firebase par son UID
     * @param uid UID de l'utilisateur Firebase
     */
    async getUserByUid(uid: string): Promise<admin.auth.UserRecord> {
        if (!this.app) {
            throw new Error(
                'Firebase n\'est pas initialisé. Vérifiez votre configuration.',
            );
        }

        return admin.auth().getUser(uid);
    }
}
