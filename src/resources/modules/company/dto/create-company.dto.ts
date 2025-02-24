import { z } from 'zod';

const requiredError = 'Campo obrigatório';

export const createCompanySchema = z.object({
  name: z
    .string({ required_error: requiredError })
    .min(1, { message: 'Nome deve conter pelo menos 1 caractere' })
    .max(60, { message: 'Nome pode conter no máximo 60 caracteres' }),
});

export type CreateCompanyDto = z.infer<typeof createCompanySchema>;
