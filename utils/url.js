function hostnameFromURL (url) {
  const elem = document.createElement('a')
  elem.href = url
  return elem.hostname
}

const hostnameAdapterMap = {
  'www.mangareader.net': require('./sites/mangareader.js'),
  'www.mangafreak.net': require('./sites/mangafreak.js'),
  'www3.mangafreak.net': require('./sites/mangafreak.js')
}

function adapterFromURL (url) {
  const hostname = hostnameFromURL(url)
  return adapterFromHostname(hostname)
}

function adapterFromHostname (hostname) {
  return hostnameAdapterMap[hostname]
}

function validHostname (url) {
  const hostname = hostnameFromURL(url)
  return hostname in hostnameAdapterMap
}

function fileExtFromURL (url) {
  let lastDotIdx = -1
  for (let i = url.length - 1; i >= 0; i--) {
    if (url[i] === '.') {
      lastDotIdx = i
      break
    }
  }

  if (lastDotIdx === -1) {
    return null
  }

  let fileExt = ''
  for (let i = lastDotIdx + 1; i < url.length; i++) {
    const ch = url[i].toLowerCase()
    if (ch < 'a' || ch > 'z') {
      break
    }
    fileExt += url[i]
  }

  return fileExt
}

module.exports = {
  adapterFromURL,
  adapterFromHostname,
  validHostname,
  fileExtFromURL
}
