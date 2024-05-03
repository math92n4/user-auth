import { Router } from "express";
import { getUserByEmail, createUser } from "../db/database.js";
import { hashPassword, checkPassword } from "../util/password.js"
import { generateAccessToken, authenticateToken } from "../util/jwt.js";
import { sendWelcome } from "../util/mail.js";

const router = Router();

router.get('/api/user/:email', async (req, res) => {
    const email = req.params.email;
    const result = await getUserByEmail(email);
    res.send({ data: result })
})

router.post('/api/user', async (req, res) => {
    const { email, password } = req.body;
    
    if(!email) {
        return res.status(400).send({ data: "Email is missing" })
    }

    if(!password) {
        return res.status(400).send({ data: "Password is missing" })
    }

    const encryptedPassword = await hashPassword(password)
    const result = await createUser(email, encryptedPassword)
    const sentEmail = await sendWelcome(email);
    res.send({ data: result.id })
})

router.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await getUserByEmail(email)
    if(!user) return res.status(404).send({ message: "User not found" })

    const passwordCheck = await checkPassword(password, user.password)
    if(!passwordCheck) {
        res.status(400).send({ message: "Bad credentials" })
    }

    const token = generateAccessToken(email)
    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 30000
    })

    res.send('You are logged on')
})

router.get('/api/user', async (req, res) => {
    try {
        const cookie = req.cookies['jwt'];
        const claims = authenticateToken(cookie)
        if(!claims) {
            return res.status(401).send({ message: "Unauthenticated" })
        }

        const { id, email } = await getUserByEmail(claims)

        const user = {
            id: id,
            email: email
        }

        res.send(user)
         
    } catch(e) {
        return res.status(401).send({ message: "Unauthenticated" })
    }
    
})

router.post('/api/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 0 })
    res.send({ message: 'Logged out' })
})

export default router;