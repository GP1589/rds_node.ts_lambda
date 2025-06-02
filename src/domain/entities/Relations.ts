import { Prisma } from "@prisma/client";

// Tipos con relaciones incluidas
export type SystemWithRelations = Prisma.SystemGetPayload<{
  include: {
    subsystems: true;
    equipments: true;
  };
}>;

export type SubsystemWithRelations = Prisma.SubsystemGetPayload<{
  include: {
    system: true;
    equipments: true;
  };
}>;

export type EquipmentWithRelations = Prisma.EquipmentGetPayload<{
  include: {
    system: true;
    subsystem: true;
    equipmentReplacements: {
      include: {
        replacement: true;
      };
    };
  };
}>;

// Tipos para crear/actualizar
export type CreateSystemInput = Prisma.SystemCreateInput;
export type UpdateSystemInput = Prisma.SystemUpdateInput;
export type CreateSubsystemInput = Prisma.SubsystemCreateInput;
export type UpdateSubsystemInput = Prisma.SubsystemUpdateInput;
export type CreateEquipmentInput = Prisma.EquipmentCreateInput;
export type UpdateEquipmentInput = Prisma.EquipmentUpdateInput;
export type CreateReplacementInput = Prisma.ReplacementCreateInput;
export type UpdateReplacementInput = Prisma.ReplacementUpdateInput;
export type CreateFailureInput = Prisma.FailureCreateInput;
export type UpdateFailureInput = Prisma.FailureUpdateInput;
export type CreateStoreLocationInput = Prisma.StoreLocationCreateInput;
export type UpdateStoreLocationInput = Prisma.StoreLocationUpdateInput;

// Tipos para filtros/búsquedas
export type SystemWhereInput = Prisma.SystemWhereInput;
export type SubsystemWhereInput = Prisma.SubsystemWhereInput;
export type EquipmentWhereInput = Prisma.EquipmentWhereInput;
export type ReplacementWhereInput = Prisma.ReplacementWhereInput;
export type FailureWhereInput = Prisma.FailureWhereInput;
export type StoreLocationWhereInput = Prisma.StoreLocationWhereInput;
