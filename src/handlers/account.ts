import axios from 'axios';
import db from '../db';

const monoAPI = axios.create({
    baseURL: process.env.MONO_API_URL,
    headers: {
        accept: 'application/json',
        'mono-sec-key': process.env.MONO_SECRET_KEY,
        'Content-Type': 'application/json'
    }
})

export async function verifyAuthorizationToken (req, res) {
    if (!req.body.code) return res.status(400).json({ message: "Authorization token is required" })

    try {
        const { data: account} = await monoAPI.post('/account/auth', { code: req.body.code });

        await db.account.create({
            data: { id: account.id, userId: req.user.id }
        })

        res.json({ message: "Account linked" });
    } catch (error) {
        res.status(500).json({ message: "Could not verify account" });
    }
}

export async function getAccounts (req, res) {
    const accounts = await db.account.findMany({ where: { userId: req.user.id }, select: { id: true } });

    if (!accounts) return res.json({ message: "No accounts linked" });

    try {
        const accountsFromMono = await Promise.all(accounts.map(({ id }) => monoAPI.get(`/accounts/${id}`)));
        const sanitizedAccountsFromMono = accountsFromMono.map(({ data }) => {
            const { _id, bvn, ...otherAccountDetails } = data.account;
            return {
                ...otherAccountDetails,
                meta: data.meta
            }
        });
        res.json({ message: "Accounts retrieved successfully", data: sanitizedAccountsFromMono });
    } catch (error) {
        res.status(500).json({ message: "Could not fetch accounts" });
    }
}