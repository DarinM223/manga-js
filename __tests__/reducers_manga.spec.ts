import configureStore, { AppStore } from '../src/renderer/configureStore.ts'
import { LoadStateType, DownloadStateType } from '../utils/constants.ts'
import {
  addManga,
  removeManga,
  updatePage,
  loadChapter,
  VISIT_MANGA,
  DIFF_CHANGES
} from '../src/renderer/actions/manga.ts'
import { test, expect, beforeAll, afterAll, vi } from 'vitest'
import { app as preloadedServer } from '../preload-server.ts'
import * as http from 'http'
import { produce } from 'immer'
import * as url from '../utils/url.ts'
import * as preloaded from '../utils/sites/preloaded.ts'

const port = 3000
let server: http.Server | null = null

function hostnameFromURL(urlPath: string): string {
  console.log(urlPath)
  if (urlPath.startsWith('/preloaded')) {
    const url2 = `localhost:${port}/${urlPath.slice('/preloaded'.length)}`
    console.log(url2)
    const url = new URL(url2)
    return url.hostname
  }

  const url = new URL(urlPath)
  return url.hostname
}

async function sendRequest<B extends boolean>(urlPath: string, buffer: B): Promise<B extends true ? Buffer : string> {
  const url = urlPath.startsWith('/preloaded')
    ? `http://localhost:${port}${urlPath.slice('/preloaded'.length)}`
    : urlPath
  const res = await fetch(url)
  if (buffer) {
    // @ts-ignore
    return await res.arrayBuffer()
  } else {
    // @ts-ignore
    return await res.text()
  }
}

beforeAll(() => {
  server = preloadedServer.listen(port)
  vi.spyOn(preloaded, 'sendRequest').mockImplementation(sendRequest)
  vi.spyOn(url, 'adapterFromURL').mockImplementation((url2: string) => {
    const hostname = hostnameFromURL(url2)
    return url.adapterFromHostname(hostname)
  })
  vi.spyOn(url, 'validHostname').mockImplementation((url2: string) => {
    const hostname = hostnameFromURL(url2)
    return hostname in url.hostnameAdapterMap
  })
})
afterAll(() => {
  if (server) {
    server.close()
  }
  vi.clearAllMocks()
})

test('manga reducer', async () => {
  const store = configureStore(false)
  const mangaName = 'ubunchu'
  const getManga = (store: AppStore) => store.getState().manga[mangaName]
  // @ts-ignore
  await store.dispatch(addManga(`/preloaded/manga/${mangaName}`, store.getState().manga))
  expect(mangaName in store.getState().manga).toEqual(true)

  // Test if visiting the manga sets the 'new' property to false.
  expect(getManga(store).new).toEqual(true)
  store.dispatch({ type: VISIT_MANGA, mangaName })
  expect(getManga(store).new).toEqual(false)

  // Test loading a chapter.
  // @ts-ignore
  await store.dispatch(loadChapter(store.getState().manga[mangaName], 0, () => { }, true))
  // Test that chapter was loaded.
  expect(getManga(store).chapters[0].loadState).toEqual(LoadStateType.LOADED)

  // Test updating a page.
  const pages = getManga(store).chapters[0].pages.length
  store.dispatch(updatePage(getManga(store), 0, pages - 1))
  expect(getManga(store).chapters[0].currentPage).toEqual(pages - 1)
  store.dispatch(updatePage(store.getState().manga[mangaName], 0, -(pages - 1)))
  expect(getManga(store).chapters[0].currentPage).toEqual(0)

  // Test that attempting to update a page out of bounds won't update the page.
  store.dispatch(updatePage(getManga(store), 0, 100))
  expect(getManga(store).chapters[0].currentPage).toEqual(0)
  store.dispatch(updatePage(getManga(store), 0, -200))
  expect(getManga(store).chapters[0].currentPage).toEqual(0)

  // Test diffing manga changes.
  const oldManga = getManga(store)
  const newManga = produce(oldManga, (draft) => {
    draft.chapters.push({
      name: 'A new chapter!',
      url: 'www.google.com',
      date: '1/1/1',
      loadState: LoadStateType.NOT_LOADED,
      download: {
        state: DownloadStateType.NOT_DOWNLOADED,
        progress: 0
      },
      currentPage: 0,
      pages: []
    })
  })

  store.dispatch({ type: DIFF_CHANGES, manga: newManga })
  // Check if all of the old chapters are still the same.
  for (let i = 0; i < oldManga.chapters.length; i++) {
    const oldChapter = oldManga.chapters[i]
    const newChapter = getManga(store).chapters[i]
    expect(oldChapter).toEqual(newChapter)
  }
  // Check if there is a new chapter added.
  expect(getManga(store).chapters.length).toEqual(newManga.chapters.length)

  // Test removing the manga.
  // @ts-ignore
  await store.dispatch(removeManga(mangaName, () => { }))
  expect(mangaName in store.getState().manga).toEqual(false)
})
