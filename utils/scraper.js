import fetch from 'node-fetch'

export function scrape (url, parseBody) {
  return fetch(url).then(function (res) {
    return res.text()
  }).then(function (body) {
    return parseBody(body)
  })
}
