import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DownloadComponent } from "./music/download/pages/download.component";
import { NavbarComponent } from "./shared/components/navbar/navbar.component";

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, DownloadComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'DownloadMusicClient';
}
