// src/interfaces/EquipmentInterface.ts

import type { CategoryColumns } from "./CategoryInterface";
import type { Area } from "./SharedInterfaces";

export interface EquipmentColumns {
  equipment_id: number;
  equipment_code: string;
  equipment_name: string;
  brand: string | null;
  model: string | null;
  serial_number: string | null;
  description: string | null;
  category_id: number;
  area_id: number;
  quantity: number;
  available_quantity: number;
  unit: "pcs" | "set" | "unit";
  purchase_date: string | null;
  purchase_cost: number | null;
  condition: "new" | "good" | "fair" | "damaged";
  status:
    | "available"
    | "in_use"
    | "borrowed"
    | "maintenance"
    | "lost"
    | "returned";
  image: string | null;
  remarks: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  category: CategoryColumns;
  area: Area;
}

export interface EquipmentFieldErrors {
  equipment_code?: string[];
  equipment_name?: string[];
  brand?: string[];
  model?: string[];
  serial_number?: string[];
  description?: string[];
  category_id?: string[];
  area_id?: string[];
  quantity?: string[];
  available_quantity?: string[];
  unit?: string[];
  purchase_date?: string[];
  purchase_cost?: string[];
  condition?: string[];
  status?: string[];
  image?: string[];
  remarks?: string[];
}

export interface StoreEquipmentPayload {
  equipment_code: string;
  equipment_name: string;
  brand?: string | null;
  model?: string | null;
  serial_number?: string | null;
  description?: string | null;
  category_id: number;
  area_id: number;
  quantity: number;
  available_quantity: number;
  unit: "pcs" | "set" | "unit";
  purchase_date?: string | null;
  purchase_cost?: number | null;
  condition: "new" | "good" | "fair" | "damaged";
  status:
    | "available"
    | "in_use"
    | "borrowed"
    | "maintenance"
    | "lost"
    | "returned";
  image?: File | null;
  remarks?: string | null;
}

export interface UpdateEquipmentPayload {
  equipment_code: string;
  equipment_name: string;
  brand?: string | null;
  model?: string | null;
  serial_number?: string | null;
  description?: string | null;
  category_id: number;
  area_id: number;
  quantity: number;
  available_quantity: number;
  unit: "pcs" | "set" | "unit";
  purchase_date?: string | null;
  purchase_cost?: number | null;
  condition: "new" | "good" | "fair" | "damaged";
  status:
    | "available"
    | "in_use"
    | "borrowed"
    | "maintenance"
    | "lost"
    | "returned";
  image?: File | null;
  remove_image?: "0" | "1";
  remarks?: string | null;
}
