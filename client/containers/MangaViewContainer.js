import { connect } from 'react-redux'
import MangaViewComponent from '../components/MangaViewComponent.js'
import { goBack } from 'react-router-redux'

import {
  cancelDownloadChapter,
  deleteDownloadedChapter,
  downloadChapter,
  loadChapter,
  removeManga
} from '../actions/manga.js'

const mapStateToProps = (state, ownProps) => ({
  manga: state.manga,
  name: ownProps.params.name
})

const mapDispatchToProps = (dispatch) => ({
  back () {
    dispatch(goBack())
  },

  onCellClicked (manga, chapterNum) {
    dispatch(loadChapter(manga, chapterNum))
  },

  onDownloadClicked (mangaName, chapterNum) {
    dispatch(downloadChapter(mangaName, chapterNum))
  },

  onCancelDownloadClicked (mangaName, chapterNum) {
    dispatch(cancelDownloadChapter(mangaName, chapterNum))
  },

  onDeleteDownloadClicked (mangaName, chapterNum) {
    dispatch(deleteDownloadedChapter(mangaName, chapterNum))
  },

  onDelete (mangaName) {
    dispatch(removeManga(mangaName))
  }
})

const MangaViewContainer = connect(mapStateToProps, mapDispatchToProps)(MangaViewComponent)
export default MangaViewContainer
