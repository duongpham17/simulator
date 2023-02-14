import express, {IRouter} from 'express';

import { protect } from '../controller/authentication';
import { price, trades, live, test, close, reload } from '../controller/trades';

const router: IRouter = express.Router();

router.use(protect);

router.get('/load/:id', reload)
router.get('/:id', trades)
router.post('/price', price)
router.post('/live', live)
router.post('/test', test)
router.post('/close', close)

export default router;