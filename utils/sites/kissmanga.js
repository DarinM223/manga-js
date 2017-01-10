import cheerio from 'cheerio'
import { NOT_LOADED, NOT_DOWNLOADED } from '../constants.js'

export function mangaURL (mangaName, chapterNum = null, pageNum = null) {

}

export function parseMangaData (mangaName, body) {

}

export function parsePageLinks (body) {

}

export function parsePageImage (body) {
    const $ = cheerio.load(body)
    return $('.barContent', '#rightSide').find('#img').attr('src')
}