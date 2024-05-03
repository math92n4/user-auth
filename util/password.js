import bcrypt from "bcrypt"

const salt = 12

export async function hashPassword(password) {
    return await bcrypt.hash(password, salt)
}

export async function checkPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

