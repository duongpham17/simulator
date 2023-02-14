import express, {IRouter} from 'express';

import { protect } from '../controller/authentication';
import { simulators, simulator, simulate, remove } from '../controller/simulators';

const router: IRouter = express.Router();

router.use(protect);
router.get('/', simulators)
router.get('/:id', simulator)
router.post('/simulate', simulate)
router.delete('/:id', remove)

export default router;