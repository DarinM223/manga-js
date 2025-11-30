import React from 'react'
import NoMangaComponent from './NoMangaComponent.jsx'
import SomeMangaComponent from './SomeMangaComponent.jsx'

/**
 * The main page of the manga reader.
 * Displays a large add manga button if there is no manga saved
 * or the list of manga and a smaller add manga button on the top
 * if there is manga saved.
 */
export default function MainComponent({ manga }) {
  if (Object.keys(manga).length === 0) {
    return <NoMangaComponent />
  } else {
    return <SomeMangaComponent manga={manga} />
  }
}
