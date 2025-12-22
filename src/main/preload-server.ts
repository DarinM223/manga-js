import express from 'express'
import initJson from '../../init.json'
import { Manga } from '../utils/manga'

export const app = express()

app.use(express.static('resources'))

const manga = initJson.manga as { [mangaName: string]: Manga }

// api:
// manga -> JSON for manga
// chapter -> JSON with image link and page links
app.get('/manga/:mangaName', (req, res) => {
  res.json(manga[req.params.mangaName])
})
app.get('/manga/:mangaName/:chapterNum', (req, res) => {
  res.json(manga[req.params.mangaName].chapters[+req.params.chapterNum])
})
