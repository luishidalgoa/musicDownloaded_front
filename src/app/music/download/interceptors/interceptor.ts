import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DownloadBodyDTO } from "../models/dto/download-response-dto";
import { DownloadType } from "../models/enum/download-type";

@Injectable()
export class DownloadInterceptor implements HttpInterceptor {


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        throw new Error("Method not implemented.");

        const downloadType: DownloadType = DownloadType.LOCAL;
        if (req.body.downloadType || req.headers.get('DownloadType')) {
            if (req.body.downloadType) {
                const downloadType = req.body.downloadType;
            } else if (req.headers.get('DownloadType')) {
                const downloadType = req.headers.get('DownloadType');
            }
        }

        switch (downloadType) {
            case 'Local':
                break;
            case 'LevelCloud':
                break;
            default:
                break;
        }
    }
}
