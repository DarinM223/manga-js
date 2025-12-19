export enum LoadStateType {
  NOT_LOADED = 'NOT_LOADED',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export enum DownloadStateType {
  NOT_DOWNLOADED = 'NOT_DOWNLOADED',
  DOWNLOADING = 'DOWNLOADING',
  DOWNLOADED = 'DOWNLOADED',
}

export enum MessageType {
  DOWNLOAD_CHAPTER_MSG = 'download-chapter',
  DOWNLOAD_CHAPTER_RECV = 'recv-download-chapter',
  DOWNLOADED_RECV = 'recv-downloaded',
  DELETE_CHAPTER_MSG = 'delete-chapter',
  DELETE_CHAPTER_RECV = 'recv-delete-chapter',
  DELETE_MANGA_MSG = 'delete-manga',
}
