enum MONO_EVENT {
    ACCOUNT_UPDATED = "mono.events.account_updated"
}

export function handleMonoWebhook (req, res, next) {
    const webhook = req.body;

    if (webhook.event === MONO_EVENT.ACCOUNT_UPDATED) {
        // do some shit her
    }

    return res.sendStatus(200);

}