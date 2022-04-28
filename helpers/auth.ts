import bcrypt from 'bcrypt'

export const verifyPassword = async (password: string, hashedPassword: string = ''): Promise<boolean> => {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid
}