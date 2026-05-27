import { Service, ServiceCategory } from '../../../core/models';

export interface ServiceWriteDto extends Omit<Service, 'id'> {}
export interface ManagedService extends Service {
  isActive?: boolean;
}

const CATEGORY_MAP: Record<string, ServiceCategory> = {
  consultation: 'Consultation', procedure: 'Procedure', laboratory: 'Laboratory', diagnostic: 'Diagnostic',
};

export function mapServiceRow(row: Record<string, unknown>): Service {
  const rawCategory = (row['category'] ?? row['Category'] ?? row['service_category'] ?? '') as string;
  return {
    id: (row['id'] ?? row['Id'] ?? '') as string,
    name: (row['name'] ?? row['Name'] ?? row['service_name'] ?? '') as string,
    description: (row['description'] ?? row['Description'] ?? undefined) as string | undefined,
    estimatedDurationMinutes: (row['estimatedDurationMinutes'] ?? row['estimated_duration_minutes'] ?? row['duration'] ?? 30) as number,
    price: (row['price'] ?? row['Price'] ?? 0) as number,
    category: CATEGORY_MAP[rawCategory.toLowerCase()] ?? 'Consultation',
    doctorIds: (row['doctorIds'] ?? row['doctor_ids'] ?? []) as string[],
  };
}
