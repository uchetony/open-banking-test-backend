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

    if (!accounts) return res.status(404).json({ message: "No accounts linked" });

    try {
        const accountsFromMono = await Promise.all(accounts.map(({ id }) => monoAPI.get(`/accounts/${id}`)));

        const sanitizedAccountsFromMono = accountsFromMono.map(({ data }) => {
            const { _id, bvn, ...otherAccountDetails } = data.account;
            return {
                id: _id,
                ...otherAccountDetails,
                meta: data.meta
            }
        });

        res.json({ message: "Accounts retrieved successfully", data: sanitizedAccountsFromMono });
    } catch (error) {
        res.status(500).json({ message: "Could not fetch accounts" });
    }
}

export async function unlinkAccount (req, res) {
    const account = await db.account.findUnique({ where: { id: req.params.id } });

    if (!account) return res.status(404).json({ message: 'Account does not exist' });

    try {
        await monoAPI.post(`/accounts/${req.params.id}/unlink`);
        await db.account.delete({ where: { id: req.params.id } });

        res.json({ message: 'Account unlinked' });
    } catch (error) {
        res.status(500).json({ message: "could not unlink account" })
    }
}