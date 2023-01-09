import { Router } from 'express'
import { verifyAuthorizationToken, getAccounts } from './handlers/account';
import { getAccountTransactions } from './handlers/transaction';
import { getUsersHandler  } from './handlers/user';

const router = Router();

router.get("/users", getUsersHandler)

// Account endpoints
router.post("/account/verify-authorization-token", verifyAuthorizationToken);
router.get("/accounts", getAccounts);

// Transaction endpoints
router.get("/accounts/:id/transactions", getAccountTransactions);


export default router;