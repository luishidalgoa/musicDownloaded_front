import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  constructor(private http: HttpClient) {}

  /**
   * Obtiene la información de un video o playlist de YouTube por su URL.
   * @param youtubeUrl Enlace del video o playlist de YouTube o YouTube Music
   * @returns Observable con el objeto YoutubeDTO
   */
  getVideoDetails(youtubeUrl: string): Observable<YoutubeDTO> {
    const id = this.extractId(youtubeUrl);
    if (!id) {
      throw new Error('El enlace proporcionado no es válido.');
    }

    const params = new HttpParams()
      .set('part', 'snippet')
      .set('id', id) // Siempre se utiliza 'id'
      .set('key', environment.youtube.key);
    const endpoint = `${environment.youtube.url}${youtubeUrl.includes('list')?'playlists':'videos'}`; // En YouTube API, 'videos' cubre ambos casos

    return this.http.get<YoutubeDTO>(endpoint, { params });
  }

  /**
   * Extrae el ID principal (video o playlist) de un enlace de YouTube o YouTube Music.
   * Si el enlace contiene `list=`, devuelve el ID de la lista.
   * @param youtubeUrl Enlace de YouTube o YouTube Music
   * @returns ID del video o playlist
   */
  private extractId(youtubeUrl: string): string | null {
    const regex =
      /(?:https?:\/\/)?(?:www\.|music\.)?youtube\.com\/.*(?:list=([a-zA-Z0-9_-]+)|v=([a-zA-Z0-9_-]+))|youtu\.be\/([a-zA-Z0-9_-]+)/;
    const match = youtubeUrl.match(regex);

    // Devuelve primero el `list=` si está presente, sino devuelve `v=` o el ID de YouTube corto
    return match ? match[1] || match[2] || match[3] : null;
  }
}



export interface YoutubeDTO {
  kind:     string;
  etag:     string;
  pageInfo: PageInfo;
  items:    Item[];
}

export interface Item {
  kind:    string;
  etag:    string;
  id:      string;
  snippet: Snippet;
}

export interface Snippet {
  publishedAt:  Date;
  channelId:    string;
  title:        string;
  description:  string;
  thumbnails:   Thumbnails;
  channelTitle: string;
  localized:    Localized;
}

export interface Localized {
  title:       string;
  description: string;
}

export interface Thumbnails {
  default:  Default;
  medium:   Default;
  high:     Default;
  standard: Default;
  maxres:   Default;
}

export interface Default {
  url:    string;
  width:  number;
  height: number;
}

export interface PageInfo {
  totalResults:   number;
  resultsPerPage: number;
}
