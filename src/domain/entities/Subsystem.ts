// Tipos generados automáticamente por Prisma Client
// Ejecuta: npx prisma generate

import { Prisma } from "@prisma/client";

export type Subsystem = {
  id: string;
  name: string;
  description: string;
  codeFailure: string | null;
  codeStoreLocation: string | null;
  inChargeByDefault: string;
  sapTechnicalCode: string;
  companyCode: string;
  costCenter: string;
  priority: string;
  code: string;
  systemId: string;
  createdAt: Date;
  createdOn: string;
  modifiedAt: Date;
  modifiedOn: string;
};
