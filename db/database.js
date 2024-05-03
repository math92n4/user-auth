import mysql from 'mysql2'
import "dotenv/config";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_NAME,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD
}).promise()

export async function getUserByEmail(email) {
    const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
    return rows[0];
}

export async function createUser(email, password) {
    const [result] =  await pool.query(`INSERT INTO users (email, password) 
                    VALUES (?, ?)`,
                    [email, password]);
    return getUserByEmail(email)
}

/*
const user4 = {
    email: 'mail7@mail.com',
    password: '1234'
}

const result = await createUser(user4)
console.log(result)
*/
