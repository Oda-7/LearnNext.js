// import bcrypt from 'bcrypt'
import * as argon2 from 'argon2'

// argon 2  cryptage de mot de passe
const pepper = 'chapeau-bas-apprend-moi'
// Fonction pour hacher un mot de passe
export async function hashPassword(password: string) {
	const hashedPassword = await argon2.hash(password, {
		secret: Buffer.from(pepper),
	})
	// Hachage du mot de passe avec le sel et le poivrage
	return hashedPassword
}

// Fonction pour vérifier si un mot de passe correspond à son hash
export async function verifyPassword(password: string, hashedPassword: string) {
	// console.log(password, hashedPassword)
	// Hachage du mot de passe avec le sel et le poivrage
	// Vérification du mot de passe avec le hash
	const isMatch = await argon2.verify(hashedPassword, password, {
		secret: Buffer.from(pepper),
	})
	// console.log(isMatch)
	return isMatch
}
