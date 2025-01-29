import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { DownloadRequestDTO } from '../models/dto/download-request-dto';
import { DownloadBodyDTO } from '../models/dto/download-response-dto';
import { DownloadType } from '../models/enum/download-type';
import { environment } from '../../../../environments/environment';

export interface DownloadDTO {
  downloadRequestDTO?: DownloadRequestDTO;
  progress?: DownloadProgressDTO;
}
export interface DownloadProgressDTO { progress?: number, index?: number, total?: number }

@Injectable({
  providedIn: 'root'
})
export class DownloadSessionService {
  private url: string = environment.LevelCloud.musicUrl + '/music/download';
  private downloadDTOSession!: DownloadDTO;

  constructor(private http: HttpClient, private ngZone: NgZone) { }

  downloadRequest(requestDTO: DownloadBodyDTO): Observable<DownloadDTO> {
    let result: DownloadDTO = { downloadRequestDTO: undefined, progress: {} };

    const params = new HttpParams().set('DownloadType', requestDTO.downloadType);

    const url = `${this.url}/request`;

    return new Observable<DownloadDTO>((observer) => {
      this.http
        .post<DownloadRequestDTO>(url, requestDTO, {
          params,
          responseType: 'json',
        })
        .subscribe((data: DownloadRequestDTO) => {
          result.downloadRequestDTO = data;
          this.downloadProgress(data, result).subscribe((progress: DownloadProgressDTO) => {
            result.progress = progress;
            observer.next({ downloadRequestDTO: data, progress });
          });
        });
    });
  }

  downloadProgress(requestDTO: DownloadRequestDTO, result: DownloadDTO): Observable<DownloadProgressDTO> {
    const params = new HttpParams().set('DownloadType', requestDTO.downloadType);
    const url = `${this.url}/progress/${requestDTO.id}`;

    return new Observable<DownloadProgressDTO>((observer: Observer<DownloadProgressDTO>) => {
      let eventSource: EventSource;

      const connectToSSE = () => {
        // Iniciar la conexión SSE
        eventSource = new EventSource(`${url}?${params.toString()}`);

        eventSource.addEventListener('progress', (event: MessageEvent) => {
          this.ngZone.run(() => {
            try {
              // Parsear el mensaje recibido como DownloadProgressDTO
              const data: any = JSON.parse(event.data);
              result.progress!.progress = data;
              if(data >= 100)
                result.progress!.index = result.progress?.total;

              observer.next(result.progress!);

              // Si el progreso es 100%, cerrar la conexión y completar
              if (data >= 100 ) {
                eventSource.close();
                observer.complete();
              }
            } catch (error) {
              observer.error(`Error procesando el mensaje: ${error}`);
            }
          });
        });

        eventSource.addEventListener('total', (event: MessageEvent) => {
          this.ngZone.run(() => {
            try {
              const regex = /(\d+) \/ (\d+)/;
              const match = event.data.match(regex);
              if (match) {
                result.progress!.index = parseInt(match[1], 10);
                result.progress!.total = parseInt(match[2], 10);
              }
              observer.next(result.progress!);
            } catch (error) {
              observer.error(`Error procesando el mensaje: ${error}`);
            }
          });
        });

        eventSource.onerror = () => {
          this.ngZone.run(() => {
            console.warn('Conexión SSE cerrada. Reintentando...');
            eventSource.close();
            setTimeout(connectToSSE, 2000); // Reintentar en 2 segundos
          });
        };
      };

      // Iniciar conexión
      connectToSSE();

      // Cerrar la conexión al cancelar el Observable
      return () => {
        if (eventSource) {
          eventSource.close();
        }
      };
    });
  }

  // Descargar el archivo
  download(downloadId: string, downloadType: string, authHeader: string | null = null): Observable<{ blob: Blob; fileName: string }> {
    const url = `${this.url}/${downloadId}`;
    const headers = new HttpHeaders({
      'DownloadType': downloadType,
      ...(authHeader && { 'Authorization': authHeader })
    });

    return new Observable(observer => {
      this.http
        .get(url, { headers, observe: 'response', responseType: 'blob' })
        .subscribe({
          next: response => {
            console.log('Descarga completada:', response);

            let fileName = 'downloaded_file'; // Nombre predeterminado
            const contentDispositionHeader = response.headers.get('content-disposition');

            if (contentDispositionHeader) {
              // Manejar Map con Array
              const contentDisposition = Array.isArray(contentDispositionHeader)
                ? contentDispositionHeader[0] // Tomar el primer valor si es un Array
                : contentDispositionHeader;

              if (contentDisposition.includes('attachment')) {
                const matches = contentDisposition.match(/filename\*?="?(.+?)"?$/); // Maneja posibles codificaciones como UTF-8
                if (matches && matches[1]) {
                  fileName = decodeURIComponent(matches[1].replace(/\\\"/g, '')); // Decodifica caracteres especiales
                }
              }
            }

            observer.next({ blob: response.body!, fileName });
            observer.complete();
          },
          error: err => {
            observer.error(err);
          }
        });
    });
  }
}