function downloadChapter (event, args) {
  console.log('Received: ', args)
  event.sender.send('recv-download-chapter', Object.assign({}, args, { err: null }))

  setTimeout(() => {
    event.sender.send(
      'recv-downloaded',
      Object.assign({}, args, { err: null, result: 'Downloaded :)' })
    )
  }, 2000)
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
