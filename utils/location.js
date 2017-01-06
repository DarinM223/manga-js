const path = require('path')

function mangaPath (basePath, mangaName) {
  return path.join(basePath, mangaName)
}

function chapterPath (basePath, mangaName, chapterNum) {
  return path.join(mangaPath(basePath, mangaName), chapterNum + '')
}

function imagePath (basePath, mangaName, chapterNum, url) {
  const encodedURL = encodeURIComponent(url)
  return path.join(chapterPath(basePath, mangaName, chapterNum), encodedURL)
}

module.exports = {
  mangaPath,
  chapterPath,
  imagePath
}
