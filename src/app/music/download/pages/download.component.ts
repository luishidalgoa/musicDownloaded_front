import { Component } from '@angular/core';
import { DownloadInputComponent } from "../../../shared/components/download-input/download-input.component";
import { ProgressBarComponent } from "../components/progress-bar/progress-bar.component";
import { DownloadDTO, DownloadSessionService } from '../services/download-session.service';

@Component({
  selector: 'app-download',
  imports: [DownloadInputComponent, ProgressBarComponent],
  templateUrl: './download.component.html',
  styleUrl: './download.component.css'
})
export class DownloadComponent {
  item!: DownloadDTO // = {progress:0,message:"Descargando en el servidor"};


  constructor(private downloadSessionS:DownloadSessionService) { }
  ngOnInit() {
    // const simulado=setInterval(() => {
    //   if(this.item.progress + 4 < 100){
    //     this.item.progress += 4;
    //   }else{
    //     this.item.progress = 100;
    //   }
    //   if (this.item.progress >= 100) {
    //     this.item.message = "Descarga completada";
    //   }

    //   if (this.item.progress >= 100) {
    //     clearInterval(simulado);
    //   }
    // }, 1000);
    
  }

  progressHandler(event:DownloadDTO){
    this.item = event;
  }

}
