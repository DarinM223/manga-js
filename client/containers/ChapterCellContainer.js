import { connect } from 'react-redux'
import ChapterCellComponent from '../components/ChapterCellComponent.js'

import { downloadChapter, loadChapter } from '../actions/manga.js'

const mapStateToProps = () => ({})
const mapDispatchToProps = (dispatch) => ({
  onDoubleClick (manga, chapterNum) {
    dispatch(loadChapter(manga, chapterNum))
  },

  onDownload (mangaName, chapterNum) {
    dispatch(downloadChapter(mangaName, chapterNum))
  }
})

const ChapterCellContainer = connect(mapStateToProps, mapDispatchToProps)(ChapterCellComponent)
export default ChapterCellContainer
