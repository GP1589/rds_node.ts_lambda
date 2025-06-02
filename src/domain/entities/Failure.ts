// Tipos generados automáticamente por Prisma Client
// Ejecuta: npx prisma generate

import { Prisma } from "@prisma/client";

export type Failure = {
  id: string;
  type: string;
  name: string;
  description: string;
  sapCode: string;
  sapDescription: string;
  code: string;
  createdAt: Date;
  createdOn: string;
  modifiedAt: Date;
  modifiedOn: string;
};