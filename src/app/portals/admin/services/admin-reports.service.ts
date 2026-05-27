export interface DailyBookingSummaryRow { date: string; totalBookings: number; completed: number; cancelled: number; noShow: number; revenue: number; }
export interface PendingFollowUpReportRow { bookingId: string; patient: string; doctor: string; followUpDate: string; reason: string; status: string; }
export interface UnpaidCompletedVisitReportRow { bookingId: string; patient: string; doctor: string; service: string; visitDate: string; amount: number; paymentStatus: string; }
