import React, { useState, useEffect } from 'react'
import NoMangaComponent from './NoMangaComponent.jsx'
import SomeMangaComponent from './SomeMangaComponent.jsx'
import { useSelector, useDispatch } from 'react-redux'
import { reloadManga } from '../actions/manga.js'

/**
 * The main page of the manga reader.
 * Displays a large add manga button if there is no manga saved
 * or the list of manga and a smaller add manga button on the top
 * if there is manga saved.
 */

export default function MainComponent(_props) {
  const manga = useSelector((state) => state.manga)
  const dispatch = useDispatch()
  const [reloaded, setReloaded] = useState(false)
  useEffect(() => {
    // Only automatically reload manga list when you first open the application.
    // Reloading after the fact will have to be done manually using the refresh button.
    if (!reloaded) {
      for (const mangaName in manga) {
        const specificManga = manga[mangaName]
        dispatch(reloadManga(specificManga))
      }
      setReloaded(true)
    }
  })
  if (Object.keys(manga).length === 0) {
    return <NoMangaComponent />
  } else {
    return <SomeMangaComponent manga={manga} />
  }
}