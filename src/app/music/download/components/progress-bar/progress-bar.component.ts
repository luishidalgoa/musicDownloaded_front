import { ChangeDetectorRef, Component, Input, NgZone } from '@angular/core';
import { DownloadDTO } from '../../services/download-session.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css'
})
export class ProgressBarComponent {
  @Input({ required: true }) item!: DownloadDTO;

}