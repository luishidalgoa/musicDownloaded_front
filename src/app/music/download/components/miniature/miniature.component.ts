import { Component, Input } from '@angular/core';
import { YoutubeService } from '../../services/youtube.service';

@Component({
  selector: 'app-miniature',
  imports: [],
  templateUrl: './miniature.component.html',
  styleUrl: './miniature.component.css'
})
export class MiniatureComponent {
  @Input({required:true}) url!: string;
}
