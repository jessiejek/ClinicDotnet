import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
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
    return from(this.fetchServices());
  }

  getServiceById(id: string): Observable<ManagedService | undefined> {
    return from(this.fetchServiceById(id));
  }

  createService(dto: Partial<ManagedService>): Observable<ManagedService> {
    return from(this.create(dto));
  }

  updateService(id: string, dto: Partial<ManagedService>): Observable<ManagedService> {
    return from(this.update(id, dto));
  }

  toggleServiceStatus(service: ManagedService, isActive: boolean): Observable<ManagedService> {
    return from(this.api.put<any>('services/' + service.id, { isActive }).toPromise().then(r => ({ ...service, isActive })));
  }

  deleteService(id: string): Observable<unknown> {
    return from(this.api.delete(`services/${id}`).toPromise());
  }

  getDoctorServices(doctorId: string): Observable<Service[]> {
    return from(this.fetchDoctorServices(doctorId));
  }

  updateDoctorServices(doctorId: string, serviceIds: string[]): Observable<unknown> {
    return from(this.api.put(`doctors/${doctorId}/services`, { serviceIds }).toPromise());
  }

  private async fetchServices(): Promise<ManagedService[]> {
    const data = await this.api.get<any[]>('services').toPromise();
    this.cachedServices = (data ?? []).map(mapServiceRow);
    return this.cachedServices;
  }

  private async fetchServiceById(id: string): Promise<Service | undefined> {
    const data = await this.api.get<any>(`services/${id}`).toPromise();
    return data ? mapServiceRow(data) : undefined;
  }

  private async create(dto: Partial<Service>): Promise<Service> {
    const data = await this.api.post<any>('services', dto).toPromise();
    const svc = mapServiceRow(data ?? {});
    if (this.cachedServices) this.cachedServices.push(svc);
    return svc;
  }

  private async update(id: string, dto: Partial<Service>): Promise<Service> {
    const data = await this.api.put<any>(`services/${id}`, dto).toPromise();
    const svc = mapServiceRow(data ?? {});
    if (this.cachedServices) {
      const idx = this.cachedServices.findIndex((s) => s.id === id);
      if (idx >= 0) this.cachedServices[idx] = svc;
    }
    return svc;
  }

  private async fetchDoctorServices(doctorId: string): Promise<Service[]> {
    const data = await this.api.get<any[]>(`doctors/${doctorId}/services`).toPromise();
    return (data ?? []).map(mapServiceRow);
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
