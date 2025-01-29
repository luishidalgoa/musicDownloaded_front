export interface DownloadBodyDTO {
    downloadType: string;
    data:         Data;
}

interface Data {
    externalUrl: string;
}
