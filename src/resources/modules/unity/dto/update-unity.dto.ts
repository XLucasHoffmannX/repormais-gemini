import { z } from 'zod';

export const updateUnitSchema = z.object({
  name: z.string().min(1, 'Nome da unidade é obrigatório').optional(), // Nome da unidade
  address: z.string().optional(), // Endereço da unidade (agora opcional)
  companyId: z.string().uuid('ID da empresa inválido').optional(), // ID da empresa relacionada (opcional)
});

export type UpdateUnitDto = z.infer<typeof updateUnitSchema>;
