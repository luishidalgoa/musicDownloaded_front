export interface DownloadRequestDTO {
    id:           string;
    data:         Data;
    downloadSyze?: number;
    downloadType: string;
}

export interface Data {
    externalUrl:   string;
    directoryPath: string;
    totalFiles:    number;
}
