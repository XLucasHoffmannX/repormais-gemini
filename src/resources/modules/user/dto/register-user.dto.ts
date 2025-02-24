import { z } from 'zod';

const requiredError = 'Campo obrigatório';

export const registerSchema = z
  .object({
    name: z.string({ required_error: requiredError }),
    email: z.string({ required_error: requiredError }).email('Email inválido'),
    password: z
      .string({ required_error: requiredError })
      .min(6, { message: 'Senha muito pequena ou fraca!' }),
  })
  .required();

export type RegisterUserDto = z.infer<typeof registerSchema>;
