import { connect } from 'react-redux'
import ChapterCellComponent from '../components/ChapterCellComponent.js'

import {
  cancelDownloadChapter,
  deleteDownloadedChapter,
  downloadChapter,
  loadChapter
} from '../actions/manga.js'

const mapStateToProps = () => ({})
const mapDispatchToProps = (dispatch) => ({
  onDoubleClick (manga, chapterNum) {
    dispatch(loadChapter(manga, chapterNum))
  },

  onDownload (mangaName, chapterNum) {
    dispatch(downloadChapter(mangaName, chapterNum))
  },

  onCancelDownload (mangaName, chapterNum) {
    dispatch(cancelDownloadChapter(mangaName, chapterNum))
  },

  onDeleteDownload (mangaName, chapterNum) {
    dispatch(deleteDownloadedChapter(mangaName, chapterNum))
  }
})

const ChapterCellContainer = connect(mapStateToProps, mapDispatchToProps)(ChapterCellComponent)
export default ChapterCellContainer
