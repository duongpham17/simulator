import express, {IRouter} from 'express';

import { protect } from '../controller/authentication';
import { price, trades, trade, close, load } from '../controller/trades';

const router: IRouter = express.Router();

router.use(protect);

router.get('/load/:id', load)
router.get('/:id', trades)
router.post('/price', price)
router.post('/trade', trade)
router.post('/close', close)

export default router;