import { Router } from 'express'
import { verifyAuthorizationToken, getAccounts } from './handlers/account';
import { getUsersHandler  } from './handlers/user';

const router = Router();

router.get("/users", getUsersHandler)

// Account endpoints
router.post("/account/verify-authorization-token", verifyAuthorizationToken);
router.get("/accounts", getAccounts);


export default router;