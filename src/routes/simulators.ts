import express, {IRouter} from 'express';

import { protect } from '../controller/authentication';
import { simulators, simulator, simulate, remove, resync } from '../controller/simulators';

const router: IRouter = express.Router();

router.use(protect);
router.get('/', simulators)
router.get('/:id', simulator)
router.post('/simulate', simulate)
router.delete('/:id', remove)
router.get('/resync/:id', resync)

export default router;