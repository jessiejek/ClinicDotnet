import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoFacebook, logoInstagram } from 'ionicons/icons';
import { ApiService } from '../../../../core/services/api.service';
import { ClinicSettingsService } from '../../../../core/services/clinic-settings.service';
import { formatClinicOperatingLines } from '../../utils/time-format';

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, IonIcon, AsyncPipe],
  templateUrl: './public-footer.component.html',
  styleUrl: './public-footer.component.scss'
})
export class PublicFooterComponent {
  private readonly clinicSettings = inject(ClinicSettingsService);
  private readonly apiService = inject(ApiService);

  readonly settings = this.clinicSettings.load();
  doctors$ = this.apiService.get<any[]>('doctors');

  readonly hoursSummary: string;

  constructor() {
    const [mf, sat] = formatClinicOperatingLines(this.settings);
    this.hoursSummary = `${mf} · ${sat}`;
    addIcons({ logoFacebook, logoInstagram });
  }
}
