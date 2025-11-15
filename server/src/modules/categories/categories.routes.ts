import { Router } from 'express';
import { asyncHandler } from '../shared/asyncHandler.js';
import { categoriesController } from './categories.controller.js';

const router = Router();

router.post('/', asyncHandler(categoriesController.create.bind(categoriesController)));
router.get('/', asyncHandler(categoriesController.getAll.bind(categoriesController)));
router.get('/:id', asyncHandler(categoriesController.getById.bind(categoriesController)));
router.put('/:id', asyncHandler(categoriesController.update.bind(categoriesController)));
router.delete('/:id', asyncHandler(categoriesController.delete.bind(categoriesController)));

export default router;