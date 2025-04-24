import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MiniatureComponent } from '../../../music/download/components/miniature/miniature.component';
import { YoutubeDTO, YoutubeService } from '../../../music/download/services/youtube.service';
import { DownloadDTO, DownloadSessionService } from '../../../music/download/services/download-session.service';
import { DownloadBodyDTO } from '../../../music/download/models/dto/download-response-dto';
import { DownloadType } from '../../../music/download/models/enum/download-type';

@Component({
  selector: 'app-download-input',
  imports: [MiniatureComponent],
  templateUrl: './download-input.component.html',
  styleUrl: './download-input.component.css'
})
export class DownloadInputComponent {
  miniature:YoutubeDTO | null = null;
  toggle: boolean = false;
  imageUrl: string = '';

  @ViewChild('Iurl') input!: ElementRef<HTMLInputElement>;
  @ViewChild('Toggle') InputToggle!: ElementRef<HTMLInputElement>;

  constructor(private youtubeS:YoutubeService,private downloadSessionS:DownloadSessionService) { }

  toggleHandler(){
    this.toggle = this.InputToggle.nativeElement.checked;
  }
  
  search(){
    this.youtubeS.getVideoDetails(this.input.nativeElement.value).subscribe((data:YoutubeDTO)=>{
      this.miniature = data;
      this.imageUrl = data.items[0].snippet.thumbnails.standard ? this.miniature.items[0].snippet.thumbnails.standard.url : this.miniature.items[0].snippet.thumbnails.default.url ;
    });
  }


  @Output() downloadDTO: EventEmitter<DownloadDTO> = new EventEmitter<DownloadDTO>();
  download(){
    const requestDTO:DownloadBodyDTO = {
      downloadType: this.InputToggle.nativeElement.checked ? DownloadType.LEVELCLOUD : DownloadType.LOCAL,
      data:{externalUrl:this.input.nativeElement.value}
    }
    this.downloadSessionS.downloadRequest(requestDTO).subscribe((data:DownloadDTO)=>{
      this.downloadDTO.emit(data);
      if(data.progress?.progress == 100){
        this.downloadSessionS.download(data.downloadRequestDTO!.id,data.downloadRequestDTO!.downloadType).subscribe((data:{ blob: Blob; fileName: string })=>{
          const url = window.URL.createObjectURL(data.blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = data.fileName;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      }
    });
  }
}
