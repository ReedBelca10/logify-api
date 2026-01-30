import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    /**
     * Crée un nouvel utilisateur avec hashage du mot de passe
     */
    async create(createUserDto: CreateUserDto): Promise<User> {
        const { email, password, role, ...rest } = createUserDto;

        // Vérifier si l'email existe déjà
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new ConflictException('Un utilisateur avec cet email existe déjà');
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new this.userModel({
            ...rest,
            email,
            password: hashedPassword,
            role: role || 'CLIENT', // Par défaut CLIENT
            authProvider: 'local',
        });

        return newUser.save();
    }

    /**
     * Trouve tous les utilisateurs
     */
    async findAll(): Promise<User[]> {
        return this.userModel.find().select('-password').exec();
    }

    /**
     * Trouve un utilisateur par son ID
     */
    async findOne(id: string): Promise<User> {
        const user = await this.userModel.findById(id).select('-password').exec();
        if (!user) {
            throw new NotFoundException('Utilisateur non trouvé');
        }
        return user;
    }

    /**
     * Trouve un utilisateur par email
     */
    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }

    /**
     * Trouve un utilisateur par son Firebase UID
     */
    async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
        return this.userModel.findOne({ firebaseUid }).exec();
    }

    /**
     * Met à jour un utilisateur
     */
    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const { password, ...rest } = updateUserDto;
        const updateData: any = { ...rest };

        // Si le mot de passe est fourni, le hasher
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await this.userModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .select('-password')
            .exec();

        if (!updatedUser) {
            throw new NotFoundException('Utilisateur non trouvé');
        }

        return updatedUser;
    }

    /**
     * Change le rôle d'un utilisateur (réservé au SUPERADMIN)
     */
    async updateRole(id: string, newRole: UserRole): Promise<User> {
        const updatedUser = await this.userModel
            .findByIdAndUpdate(id, { role: newRole }, { new: true })
            .select('-password')
            .exec();

        if (!updatedUser) {
            throw new NotFoundException('Utilisateur non trouvé');
        }

        return updatedUser;
    }

    /**
     * Supprime un utilisateur (soft delete - désactivation)
     */
    async remove(id: string): Promise<void> {
        const result = await this.userModel.findByIdAndUpdate(id, {
            isActive: false,
        });

        if (!result) {
            throw new NotFoundException('Utilisateur non trouvé');
        }
    }

    /**
     * Crée ou met à jour un utilisateur Firebase
     */
    async createOrUpdateFirebaseUser(
        firebaseUid: string,
        email: string,
        name: string,
        photoURL?: string,
        provider: string = 'google',
    ): Promise<User> {
        // Chercher d'abord par firebaseUid
        let user = await this.findByFirebaseUid(firebaseUid);

        if (user) {
            // Mettre à jour la date de dernière connexion
            user.lastLogin = new Date();
            if (photoURL) user.photoURL = photoURL;
            return user.save();
        }

        // Sinon, chercher par email (cas où l'utilisateur existe déjà en local)
        user = await this.findByEmail(email);

        if (user) {
            // Lier le compte existant avec Firebase
            user.firebaseUid = firebaseUid;
            user.authProvider = provider as any;
            user.lastLogin = new Date();
            if (photoURL) user.photoURL = photoURL;
            return user.save();
        }

        // Créer un nouvel utilisateur
        const newUser = new this.userModel({
            email,
            name,
            firebaseUid,
            authProvider: provider,
            role: 'CLIENT',
            isActive: true,
            lastLogin: new Date(),
            photoURL,
        });

        return newUser.save();
    }

    /**
     * Vérifie un mot de passe
     */
    async validatePassword(user: User, password: string): Promise<boolean> {
        if (!user.password) {
            return false; // Utilisateur sans mot de passe (authentification sociale uniquement)
        }
        return bcrypt.compare(password, user.password);
    }
}
