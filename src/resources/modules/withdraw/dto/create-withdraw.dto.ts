import { z } from 'zod';
import { WithdrawType } from '../entities/withdraw.entity';

const requiredError = 'Campo obrigatório';

export const withdrawSchema = z.object({
  productId: z.string({ required_error: requiredError }).uuid(),
  unitId: z.string({ required_error: requiredError }).uuid(),
  userId: z.string({ required_error: requiredError }).uuid(),
  quantity: z
    .number({ required_error: requiredError })
    .int()
    .min(1, 'A quantidade deve ser pelo menos 1'),
  type: z.enum([WithdrawType.ENTRY, WithdrawType.REMOVE], {
    required_error: 'Tipo de movimentação obrigatório (entry ou remove)',
  }),
  reason: z.string().optional(),
});

export type WithdrawDto = z.infer<typeof withdrawSchema>;
