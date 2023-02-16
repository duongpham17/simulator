import express, {IRouter} from 'express';

import { protect } from '../controller/authentication';
import { orders } from '../controller/orders';

const router: IRouter = express.Router();

router.use(protect);
router.get('/:environment', orders);

export default router;