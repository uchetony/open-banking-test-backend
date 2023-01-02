
import { User } from '@prisma/client';
import db from '../db';
import { hashPassword, createJWT, comparePasswords } from '../modules/auth';
import exclude from '../utilities/exclude';

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await db.user.findUnique({ where: { email } });

    if (!user) return res.status(400).json({ message: 'Invalid login details' });

    const passwordIsCorrect = await comparePasswords(password, user.password);

    if (!passwordIsCorrect) return res.status(400).json({ message: 'Invalid login details' });

    const { password: userPassword, ...otherUserDetails } = user;

    const token = createJWT(otherUserDetails);

    res.json({ message: 'Login successful', data: { token, user: otherUserDetails } });
}

export async function createNewUser (req, res) {
    const { email, password } = req.body;

    const existingUser = await db.user.findUnique({ where: { email } });

    if (existingUser) return res.status(400).json({ message: 'User already exist' });

    const newUser = await db.user.create({
        data: {
            email,
            password: await hashPassword(password)
        }
    })

    const token = createJWT(newUser);

    res.json({ message: "User created successfully", data: { token } })
}

export async function getUsersHandler (req, res) {
    const allUsers = await db.user.findMany({
        include: {
            accounts: {
                select: { id: true }
            }
        }
    });

    if (!allUsers) return res.json({ message: "Cannot find users" });

    const userWithoutPassword = allUsers.reduce((acc, el) => {
        acc.push(exclude(el, ['password']))
        return acc;
    }, [])

    res.json({ users: userWithoutPassword })
}