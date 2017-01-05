function downloadChapter (event, args, queue) {
  event.sender.send('recv-download-chapter', Object.assign({}, args, { err: null }))

  const [mangaName, chapterNum] = [args.mangaName, args.chapterNum]

  // Enqueue download tasks for each image.
  args.pages.forEach((url, i) => {
    queue.enqueue({
      mangaName,
      chapterNum,
      url,
      total: args.pages.length,
      curr: i
    })
  })
}

function deleteDownload (args) {
  console.log('Received delete download')
  return new Promise((resolve, reject) => {
    resolve('Deleted :(')
  })
}

module.exports = {
  downloadChapter,
  deleteDownload
}
