import express, {IRouter} from 'express';

import { protect } from '../controller/authentication';
import { create, strategies, strategy, remove, duplicate, update, checkapi } from '../controller/strategies';

const router: IRouter = express.Router()

router.use(protect);
router.get('/', strategies);
router.get('/:id', strategy);
router.post('/', create);
router.patch('/', update);
router.post('/duplicate', duplicate);
router.delete('/:id', remove);
router.post('/check', checkapi);

export default router;

