import { z } from 'zod';

export const uuidSchema = z
  .string()
  .uuid({ message: 'ID inválido, deve ser um UUID válido' });
