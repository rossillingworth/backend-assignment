import express from 'express';
import {
  getPolicyById,
  getPoliciesByCustomerName,
  createPolicy,
  updatePolicy,
  deletePolicy
} from '../controllers/policyController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/:id', getPolicyById);
router.get('/', getPoliciesByCustomerName);
router.post('/', authenticate, createPolicy);
router.put('/:id', authenticate, updatePolicy);
router.delete('/:id', authenticate, deletePolicy);

export default router;
