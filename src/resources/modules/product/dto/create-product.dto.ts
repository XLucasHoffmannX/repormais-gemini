import { z } from 'zod';

const requiredError = 'Campo obrigatório';

export const createProductSchema = z.object({
  unitEntityId: z.string({ required_error: requiredError }).uuid(),
  name: z.string({ required_error: requiredError }).max(100),
  description: z.string().optional(),
  barcode: z.string().max(50).optional(),
  category: z.string().max(50).optional(),
  brand: z.string().max(50).optional(),
  supplier: z.string().max(100).optional(),
  costPrice: z.number({ required_error: requiredError }).positive(),
  salePrice: z.number({ required_error: requiredError }).positive().optional(),
  stockQuantity: z.number().int().default(0),
  minimumStock: z.number().int().default(0),
  unit: z.string({ required_error: requiredError }).max(20),
  location: z.string().max(100).optional(),
  expirationDate: z.string().optional(),
  batch: z.string().max(50).optional(),
  createdBy: z.string({ required_error: requiredError }).uuid(),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
