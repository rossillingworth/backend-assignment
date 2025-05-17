import { Request, Response } from 'express';
import { Policy, policySchema, PolicyWithProduct, Product, ResponseOrError } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

import policies from '../../data/policies.json';
import products from '../../data/products.json';

/**
 * Get product by id, utility function
 * @param id
 */
const getProductById = (id: string): ResponseOrError<Product> => {
  const p: Product | undefined = products.find(product => product.id === id);
  if (p) return [p, null];
  return [ null, new Error(`Product not found: id[${id}]`)];
}

/**
 * Populate product in policy, utility function
 * @param policy
 */
const populateProduct = (policy: Policy):PolicyWithProduct  => {
  const [product, err] = getProductById(policy.productId);
  if (err) throw new Error(`Error populating product[${policy.id}]: ${err.message}`)
  return { ...policy, product };
}

/**
 * Handler: Get policy by id
 *
 * @param req
 * @param res
 */
export const getPolicyById = (req: Request, res: Response) => {
  const policy = policies.find(p => p.id === req.params.id);
  if (!policy) return res.status(404).json({ message: 'Policy not found' });
  res.json(populateProduct(policy));
};

/**
 * Handler: Get policies by customer name,
 * allows partial match on customer name
 * e.g. /policies?customerName=Alice
 *
 * @param req
 * @param res
 */
export const getPoliciesByCustomerName = (req: Request, res: Response) => {
  const name = req.query.customerName as string;
  if (!name) return res.status(400).json({ message: 'customerName is required' });
  const customerPolicies = policies
    .filter(p => p.customerName.toLowerCase().includes(name.toLowerCase()))
    .map(p => (populateProduct(p)));
  res.status(200).json(customerPolicies);
};

/**
 * Handler: Create policy
 * validates policy against schema
 * validates product exists
 *
 * @param req
 * @param res
 */
export const createPolicy = (req: Request, res: Response) => {
  const [, err] = getProductById(req.body.productId);
  if (err) return res.status(400).json({ message: `Unable to create Policy, caused by: ${err.message}` });
  const newPolicy: Policy = { ...req.body, id: uuidv4(), createdAt: new Date().toISOString() };
  const validatedPolicy = policySchema.parse(newPolicy);
  policies.push(validatedPolicy);
  res.status(201).json(validatedPolicy);
};

/**
 * Handler: Update policy
 * validates the merged result against schema
 *
 * @param req
 * @param res
 */
export const updatePolicy = (req: Request, res: Response) => {
  const index = policies.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: `Policy not found [${req.params.id}]` });
  const updatedPolicy = { ...policies[index], ...req.body };
  policies[index] = policySchema.parse(updatedPolicy);
  res.status(200).json(updatedPolicy);
};

/**
 * Handler: Delete policy
 *
 * @param req
 * @param res
 */
export const deletePolicy = (req: Request, res: Response) => {
  const index = policies.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Policy not found' });
  policies.splice(index, 1);
  res.status(204).send();
};
