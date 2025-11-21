import { Component, ChangeDetectionStrategy, ViewEncapsulation, inject, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ItemsService } from '../../services/mock-generator.service';

@Component({
  standalone: true,
  selector: 'detail',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  imports: [IonicModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DetailsComponent {
  public appVersion = signal<string>('1.0.0');
}
