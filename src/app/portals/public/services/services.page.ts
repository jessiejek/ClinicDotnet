import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonSpinner, ToastController } from '@ionic/angular/standalone';
import { catchError, finalize, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Service, ServiceCategory } from '../../../core/models';
import { ApiService } from '../../../core/services/api.service';
import { ServiceCategoryCardComponent } from '../components/service-category-card/service-category-card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PesoPipe } from '../../../shared/pipes/peso.pipe';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, IonSpinner, ServiceCategoryCardComponent, EmptyStateComponent, PesoPipe],
  templateUrl: './services.page.html',
  styleUrl: './services.page.scss'
})
export class ServicesPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly toastCtrl = inject(ToastController);
  private readonly destroyRef = inject(DestroyRef);

  services: Service[] = [];
  isLoading = true;
  selectedCategory: ServiceCategory | 'All' = 'All';

  readonly allOrder: ServiceCategory[] = ['Consultation', 'Procedure', 'Laboratory', 'Diagnostic'];

  get categories(): (ServiceCategory | 'All')[] {
    return ['All', ...this.allOrder];
  }

  get categoryBlocks(): { key: ServiceCategory; services: Service[] }[] {
    const byCat = (c: ServiceCategory) => this.filteredServices.filter((s) => s.category === c);
    if (this.selectedCategory !== 'All') {
      const list = byCat(this.selectedCategory);
      return list.length ? [{ key: this.selectedCategory, services: list }] : [];
    }
    return this.allOrder
      .map((key) => ({ key, services: byCat(key) }))
      .filter((b) => b.services.length > 0);
  }

  get filteredServices(): Service[] {
    if (this.selectedCategory === 'All') {
      return this.services;
    }
    return this.services.filter((s) => s.category === this.selectedCategory);
  }

  categoryDescription(key: ServiceCategory): string {
    const map: Record<ServiceCategory, string> = {
      Consultation: 'Primary care visits and professional medical advice.',
      Procedure: 'In-clinic procedures performed by qualified clinicians.',
      Laboratory: 'Trusted lab tests and health screenings.',
      Diagnostic: 'Imaging and studies that support your diagnosis.'
    };
    return map[key];
  }

  badgeClass(cat: ServiceCategory): string {
    const kebab = cat.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    return `badge--${kebab} badge--category`;
  }

  ngOnInit(): void {
    const qp = this.route.snapshot.queryParamMap.get('category');
    if (qp && this.allOrder.includes(qp as ServiceCategory)) {
      this.selectedCategory = qp as ServiceCategory;
    }

    this.apiService
      .get<any[]>('services')
      .pipe(
        catchError((error: unknown) => {
          void this.presentToast(extractApiErrorMessage(error, 'Failed to load services.'));
          return of([] as Service[]);
        }),
        finalize(() => {
          this.isLoading = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((list: Service[]) => {
        this.services = list;
      });
  }

  private async presentToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2400,
      color: 'danger',
      position: 'top'
    });
    await toast.present();
  }
}

function extractApiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null && 'error' in error) {
    const body = (error as { error?: unknown }).error;
    if (typeof body === 'string' && body.trim()) {
      return body;
    }
    if (typeof body === 'object' && body !== null && 'message' in body) {
      const message = (body as { message?: unknown }).message;
      if (typeof message === 'string' && message.trim()) {
        return message;
      }
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}
