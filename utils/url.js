function hostnameFromURL (url) {
  const elem = document.createElement('a')
  elem.href = url
  return elem.hostname
}

const hostnameAdapterMap = {
  'www.mangareader.net': require('./sites/mangareader.js')
}

export function adapterFromURL (url) {
  const hostname = hostnameFromURL(url)
  return hostnameAdapterMap[hostname]
}

export function validHostname (url) {
  const hostname = hostnameFromURL(url)
  return hostname in hostnameAdapterMap
}
