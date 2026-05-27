import { Component, OnDestroy, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastController } from '@ionic/angular/standalone';

@Component({ template: '' })
export class BaseComponent implements OnDestroy {
  protected ngUnsubscribe = new Subject<void>();
  protected toastCtrl = inject(ToastController);

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  protected async showToast(message: string, color: 'success' | 'danger' = 'danger'): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1800,
      color,
      position: 'top',
    });
    await toast.present();
  }
}
