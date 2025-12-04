import mangareader from './sites/mangareader.js'
import mangafreak from './sites/mangafreak.js'
import preloaded from './sites/preloaded.ts'

function hostnameFromURL(url) {
  const elem = document.createElement('a')
  elem.href = url
  return elem.hostname
}

const hostnameAdapterMap = {
  'www.mangareader.net': mangareader,
  'www.mangafreak.net': mangafreak,
  'www3.mangafreak.net': mangafreak,
  'preloaded':preloaded,
}

export function adapterFromURL(url) {
  const hostname = hostnameFromURL(url)
  return adapterFromHostname(hostname)
}

export function adapterFromHostname(hostname) {
  return hostnameAdapterMap[hostname]
}

export function validHostname(url) {
  const hostname = hostnameFromURL(url)
  return hostname in hostnameAdapterMap
}

export function fileExtFromURL(url) {
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