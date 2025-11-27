import path from 'path'

export function mangaPath (basePath, mangaName) {
  return path.join(basePath, mangaName)
}

export function chapterPath (basePath, mangaName, chapterNum) {
  return path.join(mangaPath(basePath, mangaName), chapterNum + '')
}

export function imagePath (basePath, mangaName, chapterNum, url) {
  const encodedURL = encodeURIComponent(url)
  return path.join(chapterPath(basePath, mangaName, chapterNum), encodedURL)
}