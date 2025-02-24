import { z } from 'zod';

const requiredError = 'Campo obrigatório';

export const loginSchema = z
  .object({
    email: z.string({ required_error: requiredError }).email('Email inválido'),
    password: z.string({ required_error: 'Campo obrigatório' }),
  })
  .required();

export type LoginUserDto = z.infer<typeof loginSchema>;
