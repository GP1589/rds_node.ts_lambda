// Tipos generados automáticamente por Prisma Client
// Ejecuta: npx prisma generate

import { Prisma } from "@prisma/client";

// Tipos de modelos principales
export type System = {
  id: string;
  storeCode: string;
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
  createdAt: Date;
  createdOn: string;
  modifiedAt: Date;
  modifiedOn: string;
};

// export type SystemCreate = {
//   storeCode: string;
//   name: string;
//   description: string | null;
//   codeFailure: string | null;
//   codeStoreLocation: string | null;
//   inChargeByDefault: string;
//   sapTechnicalCode: string;
//   companyCode: string;
//   costCenter: string;
//   priority: string;
//   code: string;
//   createdAt: Date;
//   createdOn: string;
//   modifiedAt: Date;
//   modifiedOn: string;
// };

// export type SystemUpdate = {
//   storeCode?: string;
//   name?: string;
//   description?: string | null;
//   codeFailure?: string | null;
//   codeStoreLocation?: string | null;
//   inChargeByDefault?: string;
//   sapTechnicalCode?: string;
//   companyCode?: string;
//   costCenter?: string;
//   priority?: string;
//   code?: string;
//   createdAt?: Date;
//   createdOn?: string;
//   modifiedAt?: Date;
//   modifiedOn?: string;
// };