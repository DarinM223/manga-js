declare global {
  interface Window {
    api: {
      start: () => void,
      loadState: () => string,
      saveState: (state: string) => void,
      downloadChapter: (mangaName: string, chapterNum: number, pages: string[], type: string) => void,
      deleteChapter: (mangaName: string, chapterNum: number) => void,
      deleteManga: (mangaName: string) => void,
    }
  }
}

export default {}