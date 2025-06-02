// Tipos generados automáticamente por Prisma Client
// Ejecuta: npx prisma generate

import { Prisma } from "@prisma/client";

export type Equipment = {
  id: string;
  name: string;
  description: string | null;
  codeFailure: string | null;
  codeStoreLocation: string | null;
  inChargeByDefault: string;
  sapTechnicalCode: string;
  companyCode: string;
  costCenter: string;
  priority: string;
  code: string;
  typeSource: string | null;
  category: string | null;
  inventoryNumber: string | null;
  brand: string | null;
  model: string | null;
  serialNumber: string | null;
  planingGroup: string | null;
  catalogProfile: string | null;
  assemblyType: string | null;
  emplacementCode: string | null;
  planningGroupDescription: string | null;
  systemId: string | null;
  subsystemId: string | null;
  createdAt: Date;
  createdOn: string;
  modifiedAt: Date;
  modifiedOn: string;
};
