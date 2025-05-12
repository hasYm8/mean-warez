export class TorrentDto {
    constructor(torrent, rate, avgRateScore, categories) {
        this.id = torrent._id;
        this.title = torrent.title;
        this.description = torrent.description;
        this.categories = categories;
        this.fileName = torrent.fileName;
        this.gridfsId = torrent.gridfsId;
        this.size = torrent.size;
        this.uploaderId = torrent.uploaderId;
        this.createdAt = torrent.createdAt;
        this.totalDownload = torrent.totalDownload;
        this.userRateScore = rate.score;
        this.avgRateScore = avgRateScore;
    }
}


export class CommentDto {
    constructor(comment, user) {
        this.id = comment._id;
        this.user = {
            id: user._id,
            username: user.username
        }
        this.torrentId = comment.torrentId;
        this.text = comment.text;
        this.date = comment.createdAt;
    }
}

export class CategoryDto {
    constructor(category) {
        this.id = category._id;
        this.userId = category.userId;
        this.name = category.name;
    }
}
