import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ClinicSettings } from '../../../../core/models';
import { formatClinicOperatingLines } from '../../utils/time-format';

@Component({
  selector: 'app-operating-hours-bar',
  standalone: true,
  imports: [NgIf],
  templateUrl: './operating-hours-bar.component.html',
  styleUrl: './operating-hours-bar.component.scss'
})
export class OperatingHoursBarComponent {
  @Input() settings?: ClinicSettings;

  get lines(): [string, string, string] {
    if (!this.settings) {
      return ['', '', ''];
    }
    return formatClinicOperatingLines(this.settings);
  }
}
