function downloadChapter (event, args, queue) {
  console.log('Received: ', args)
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

function cancelDownload (args) {
  console.log('Received cancel download')
  return new Promise((resolve, reject) => {
    resolve('Canceled XD')
  })
}

function deleteDownload (args) {
  console.log('Received delete download')
  return new Promise((resolve, reject) => {
    resolve('Deleted :(')
  })
}

function retrieveChapter (args) {
  console.log('Received retrieve chapter')
  return new Promise((resolve, reject) => {
    resolve('Retrieved >:)')
  })
}

module.exports = {
  downloadChapter,
  cancelDownload,
  deleteDownload,
  retrieveChapter
}
