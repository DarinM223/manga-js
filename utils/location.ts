import path from 'path'

export function mangaPath(basePath: string, mangaName: string): string {
  return path.join(basePath, mangaName)
}

export function chapterPath(
  basePath: string,
  mangaName: string,
  chapterNum: number
): string {
  return path.join(mangaPath(basePath, mangaName), String(chapterNum))
}

export function imagePath(
  basePath: string,
  mangaName: string,
  chapterNum: number,
  url: string
): string {
  const encodedURL = encodeURIComponent(url)
  return path.join(chapterPath(basePath, mangaName, chapterNum), encodedURL)
}
