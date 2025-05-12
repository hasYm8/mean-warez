import { CategoryDto } from "./Category";

export interface TorrentDto {
    id: string;
    title: string;
    description: string;
    categories: CategoryDto[];
    fileName: string;
    gridfsId: string;
    size: number;
    uploaderId: string;
    createdAt: Date;
    totalDownload: number;
    userRateScore?: number;
    avgRateScore?: number;
}