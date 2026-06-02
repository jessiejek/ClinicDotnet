import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss'
})
export class ColorPickerComponent implements OnChanges {
  @Input() label = '';
  @Input() value = '#1A6B4A';
  @Output() valueChange = new EventEmitter<string>();

  draftValue = this.value;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.draftValue = this.value;
    }
  }

  get resolvedValue(): string {
    return this.isValidHex(this.draftValue) ? this.normalizeHex(this.draftValue) : this.normalizeHex(this.value);
  }

  onTextChange(value: string): void {
    this.draftValue = value;
    if (this.isValidHex(value)) {
      const normalized = this.normalizeHex(value);
      this.value = normalized;
      this.valueChange.emit(normalized);
    }
  }

  onColorChange(value: string): void {
    this.draftValue = value;
    this.value = value;
    this.valueChange.emit(value);
  }

  isValidHex(value: string): boolean {
    return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
  }

  private normalizeHex(value: string): string {
    const trimmed = value.trim();
    if (trimmed.length === 4) {
      const [hash, r, g, b] = trimmed;
      return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
    }
    return trimmed.toUpperCase();
  }
}
