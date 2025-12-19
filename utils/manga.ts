import { DownloadStateType, LoadStateType } from "./constants"

export type Chapter = {
  name: string,
  url: string,
  date: string,
  loadState: LoadStateType,
  download: {
    state: DownloadStateType,
    progress: number,
  },
  currentPage: number,
  pages: string[]
}

export type Manga = {
  type: string,
  title: string,
  name: string,
  description: string
  new: boolean,
  image: string,
  chapters: Chapter[],
  currentChapter: number,
}

export interface Adapter {
  mangaURL: (mangaName: string) => string,
  sendRequest: <B extends boolean, >(url: string, buffer: B) => Promise<B extends true ? Buffer : string>,
  parseMangaData: (mangaName: string, body: string | Buffer) => Manga,
  parsePageLinks: (url: string, body: string | Buffer) => string[],
  parsePageImage: (pageUrl: string, body: string | Buffer) => string,
}