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

export async function getAccountTransactions (req, res) {
    try {
        const account = await db.account.findUnique({ where: { id: req.params.id } });

        if (!account) return res.status(400).json({ message: 'Account not linked' });

        const { data: accountTransactionsData } = await monoAPI.get(`/accounts/${req.params.id}/transactions`);

        res.json({ message: "Transactions fetched", data: accountTransactionsData.data });
    } catch (error) {
        res.status(500).json({ message: "Could not fetch transactions" });
    }
}