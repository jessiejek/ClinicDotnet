import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Service, ServiceCategory } from '../../../core/models';

export interface ServiceWriteDto extends Omit<Service, 'id'> {}
export interface ManagedService extends Service {
  isActive?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminServicesService {
  private readonly api = inject(ApiService);
  private cachedServices: Service[] | null = null;

  getServices(): Observable<ManagedService[]> {
    return this.api.get<any[]>('services').pipe(
      map((data) => {
        this.cachedServices = ((data ?? []) as Record<string, unknown>[]).map(mapServiceRow);
        return this.cachedServices;
      })
    );
  }

  getServiceById(id: string): Observable<ManagedService | undefined> {
    return this.api.get<any>('services/' + id).pipe(
      map((data) => data ? mapServiceRow(data as Record<string, unknown>) : undefined)
    );
  }

  createService(dto: Partial<ManagedService>): Observable<ManagedService> {
    return this.api.post<any>('services', dto).pipe(
      map((data) => {
        const svc = mapServiceRow((data ?? {}) as Record<string, unknown>);
        if (this.cachedServices) this.cachedServices.push(svc);
        return svc;
      })
    );
  }

  updateService(id: string, dto: Partial<ManagedService>): Observable<ManagedService> {
    return this.api.put<any>('services/' + id, dto).pipe(
      map((data) => {
        const svc = mapServiceRow((data ?? {}) as Record<string, unknown>);
        if (this.cachedServices) {
          const idx = this.cachedServices.findIndex((s) => s.id === id);
          if (idx >= 0) this.cachedServices[idx] = svc;
        }
        return svc;
      })
    );
  }

  toggleServiceStatus(service: ManagedService, isActive: boolean): Observable<ManagedService> {
    return this.api.put<any>('services/' + service.id, { isActive }).pipe(
      map(() => ({ ...service, isActive }))
    );
  }

  deleteService(id: string): Observable<unknown> {
    return this.api.delete('services/' + id);
  }

  getDoctorServices(doctorId: string): Observable<Service[]> {
    return this.api.get<any[]>('doctors/' + doctorId + '/services').pipe(
      map((data) => ((data ?? []) as Record<string, unknown>[]).map(mapServiceRow))
    );
  }

  updateDoctorServices(doctorId: string, serviceIds: string[]): Observable<unknown> {
    return this.api.put('doctors/' + doctorId + '/services', { serviceIds });
  }
}

const CATEGORY_MAP: Record<string, ServiceCategory> = {
  consultation: 'Consultation', procedure: 'Procedure', laboratory: 'Laboratory', diagnostic: 'Diagnostic',
};

function mapServiceRow(row: Record<string, unknown>): Service {
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
