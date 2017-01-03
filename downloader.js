function downloadChapter (args) {
  console.log('Received download chapter')
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve('Downloaded :)'), 2000)
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
