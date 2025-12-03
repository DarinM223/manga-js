import React from 'react'
import NoMangaComponent from './NoMangaComponent.jsx'
import SomeMangaComponent from './SomeMangaComponent.jsx'

/**
 * The main page of the manga reader.
 * Displays a large add manga button if there is no manga saved
 * or the list of manga and a smaller add manga button on the top
 * if there is manga saved.
 */

export default class MainComponent extends React.Component {
  constructor(props) {
    super(props)
    this.reloaded = false
  }

  reloadMangaList() {
    // Only automatically reload manga list when you first open the application.
    // Reloading after the fact will have to be done manually using the refresh button.
    if (!this.reloaded) {
      for (const mangaName in this.props.manga) {
        const manga = this.props.manga[mangaName]
        this.props.onReloadManga(manga)
      }

      this.reloaded = true
    }
  }

  componentDidMount() {
    this.reloadMangaList()
  }

  render() {
    if (Object.keys(this.props.manga).length === 0) {
      return <NoMangaComponent />
    } else {
      return <SomeMangaComponent manga={this.props.manga} />
    }
  }
}