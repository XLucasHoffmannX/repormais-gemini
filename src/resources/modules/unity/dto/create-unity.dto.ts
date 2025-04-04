import { z } from 'zod';

// DTO para criação de unidade
export const createUnitSchema = z.object({
  name: z.string().min(1, 'Nome da unidade é obrigatório'), // Nome da unidade
  address: z.string().optional(), // Endereço da unidade (obrigatório)
});

export type CreateUnitDto = z.infer<typeof createUnitSchema>;
