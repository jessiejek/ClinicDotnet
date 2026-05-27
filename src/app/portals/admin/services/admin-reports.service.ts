import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

export interface UnpaidCompletedVisitReportRow {
  bookingId: string;
  patient: string;
  doctor: string;
  service: string;
  visitDate: string;
  amount: number;
  status: string;
  paymentStatus: string;
}

export interface PendingFollowUpReportRow {
  patient: string;
  doctor: string;
  followUpDate: string;
  reason: string;
  status: string;
}

export interface DailyBookingSummaryRow {
  date: string;
  totalBookings: number;
  completed: number;
  cancelled: number;
  noShow: number;
  revenue: number;
}

@Injectable({ providedIn: 'root' })
export class AdminReportsService {
  private readonly api = inject(ApiService);

  getUnpaidCompletedVisits(): Observable<UnpaidCompletedVisitReportRow[]> {
    return from(this.fetchAllBookings().then((rows) =>
      rows
        .filter((r) => r.status === 'Completed' && r.paymentStatus === 'Unpaid')
        .sort((a, b) => (b.visitDate || '').localeCompare(a.visitDate || ''))
    ));
  }

  getPendingFollowUps(): Observable<PendingFollowUpReportRow[]> {
    return from(this.fetchFollowUps());
  }

  getDailyBookingSummary(): Observable<DailyBookingSummaryRow[]> {
    return from(this.fetchAllBookings().then(buildDailySummaryFromRows));
  }

  private async fetchAllBookings(): Promise<UnpaidCompletedVisitReportRow[]> {
    const data = await this.api.get<any[]>('bookings?pageSize=1000').toPromise();
    return (data ?? []).map(mapVisitRow);
  }

  private async fetchFollowUps(): Promise<PendingFollowUpReportRow[]> {
    const data = await this.api.get<any[]>('bookings?pageSize=500').toPromise();
    const rows: PendingFollowUpReportRow[] = [];
    for (const row of (data ?? [])) {
      const followUps = extractFollowUpArray(row['followUps'] ?? row['follow_ups'] ?? []);
      for (const fu of followUps) {
        const followUpDate = trimOrNull(fu['followUpDate'] ?? fu['follow_up_date']);
        if (!followUpDate) continue;
        rows.push({
          patient: trimOrNull(row['patientName'] ?? row['patient_name']) ?? 'Patient',
          doctor: trimOrNull(row['doctorName'] ?? row['doctor_name']) ?? 'Doctor',
          followUpDate,
          reason: trimOrNull(fu['reason'] ?? fu['instructions']) ?? 'Follow-up',
          status: 'Pending',
        });
      }
    }
    rows.sort((a, b) => a.followUpDate.localeCompare(b.followUpDate));
    return rows;
  }
}

function mapVisitRow(row: Record<string, unknown>): UnpaidCompletedVisitReportRow {
  const status = trimOrNull(row['status'] ?? row['Status'] ?? row['booking_status'] ?? row['BookingStatus']);
  const payStatus = trimOrNull(row['paymentStatus'] ?? row['PaymentStatus'] ?? row['payment_status'] ?? row['PaymentStatus']);
  const services = extractServiceNames(row['services'] ?? row['serviceNames'] ?? row['service_names'] ?? []);
  return {
    bookingId: trimOrNull(row['id'] ?? row['Id'] ?? row['booking_id'] ?? row['BookingId']) ?? '',
    patient: trimOrNull(row['patientName'] ?? row['PatientName'] ?? row['patient_name']) ?? 'Patient',
    doctor: trimOrNull(row['doctorName'] ?? row['DoctorName'] ?? row['doctor_name']) ?? 'Doctor',
    service: services[0] ?? trimOrNull(row['serviceName'] ?? row['ServiceName'] ?? row['primary_service_name']) ?? 'Consultation',
    visitDate: normalizeDateOnly(row['appointmentDate'] ?? row['AppointmentDate'] ?? row['appointment_date']),
    amount: normalizeNumber(row['finalAmount'] ?? row['FinalAmount'] ?? row['final_amount']) || normalizeNumber(row['totalFee'] ?? row['TotalFee'] ?? row['total_fee'], 0),
    status: status ?? '',
    paymentStatus: normalizePaymentStatusLabel(payStatus ?? ''),
  };
}

function buildDailySummaryFromRows(rows: UnpaidCompletedVisitReportRow[]): DailyBookingSummaryRow[] {
  const dayMap = new Map<string, { total: number; completed: number; cancelled: number; noShow: number; revenue: number; }>();
  for (const row of rows) {
    const date = row.visitDate;
    if (!date) continue;
    let entry = dayMap.get(date);
    if (!entry) { entry = { total: 0, completed: 0, cancelled: 0, noShow: 0, revenue: 0 }; dayMap.set(date, entry); }
    entry.total++;
    if (row.status === 'Completed') { entry.completed++; entry.revenue += row.amount; }
    else if (row.status === 'Cancelled') entry.cancelled++;
    else if (row.status === 'NoShow') entry.noShow++;
  }
  return Array.from(dayMap.entries())
    .map(([date, counts]): DailyBookingSummaryRow => ({
      date,
      totalBookings: counts.total,
      completed: counts.completed,
      cancelled: counts.cancelled,
      noShow: counts.noShow,
      revenue: counts.revenue,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

function extractServiceNames(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string') return value.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
}

function extractFollowUpArray(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) return value as Record<string, unknown>[];
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    if (Array.isArray(parsed)) return parsed;
  } catch { /* ignore */ }
  return [];
}

function trimOrNull(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const t = value.trim();
  return t || null;
}

function normalizeDateOnly(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.slice(0, 10);
}

function normalizeNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') { const p = parseFloat(value); if (!isNaN(p)) return p; }
  return fallback;
}

function normalizePaymentStatusLabel(value: unknown): string {
  const s = trimOrNull(value);
  if (!s) return 'Unpaid';
  const lower = s.toLowerCase();
  if (lower === 'unpaid') return 'Unpaid';
  if (lower === 'paid') return 'Paid';
  if (lower === 'waived') return 'Waived';
  if (lower === 'refunded') return 'Refunded';
  return 'Unpaid';
}
