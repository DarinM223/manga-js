import { connect } from 'react-redux'
import MangaViewComponent from '../components/MangaViewComponent.js'
import { goBack } from 'react-router-redux'
import { ipcRenderer } from 'electron'

import { removeManga } from '../actions/manga.js'

const mapStateToProps = (state, ownProps) => ({
  manga: state.manga,
  name: ownProps.params.name
})

const mapDispatchToProps = (dispatch) => ({
  back () {
    dispatch(goBack())
  },

  onDelete (mangaName) {
    ipcRenderer.send('delete-manga', { mangaName })
    dispatch(removeManga(mangaName))
  }
})

const MangaViewContainer = connect(mapStateToProps, mapDispatchToProps)(MangaViewComponent)
export default MangaViewContainer
