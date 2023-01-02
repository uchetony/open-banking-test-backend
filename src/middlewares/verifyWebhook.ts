export function verifyMonoWebhook (req, res, next) {
    const secret = process.env.MONO_WEBHOOK_SEC;

    if (req.headers['mono-webhook-secret'] !== secret) {
        return res.status(401).json({ message: "Unauthorized request" })
    }
    next();
}