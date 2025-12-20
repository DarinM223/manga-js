import React, { useState, useEffect } from 'react'
import NoMangaComponent from './NoMangaComponent.tsx'
import SomeMangaComponent from './SomeMangaComponent.tsx'
import { useSelector, useDispatch } from 'react-redux'
import { Action, reloadManga } from '../actions/manga.ts'
import { ThunkDispatch } from 'redux-thunk'
import { State } from '../storage.ts'

/**
 * The main page of the manga reader.
 * Displays a large add manga button if there is no manga saved
 * or the list of manga and a smaller add manga button on the top
 * if there is manga saved.
 */

export default function MainComponent() {
  const manga = useSelector((state: State) => state.manga)
  const dispatch = useDispatch<ThunkDispatch<State, any, Action>>()
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
