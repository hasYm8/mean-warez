export interface TorrentDto {
    id: string;
    title: string;
    description: string;
    categories: string[];
    fileName: string;
    gridfsId: string;
    size: number;
    uploaderId: string;
    createdAt: Date;
    userRateScore?: number;
    avgRateScore?: number;
}