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

function deleteDownload (args) {
  console.log('Received delete download')
  return new Promise((resolve, reject) => {
    resolve('Deleted :(')
  })
}

function retrievePage (args, queue) {
  console.log('Received retrieve page')
  return queue.getDownloadedImage(args.url)
}

module.exports = {
  downloadChapter,
  deleteDownload,
  retrievePage
}
