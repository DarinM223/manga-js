import { connect } from 'react-redux'
import MangaViewComponent from '../components/MangaViewComponent.js'
import { loadChapter, removeManga } from '../actions/manga.js'
import { goBack } from 'react-router-redux'

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

  onDelete (mangaName) {
    dispatch(removeManga(mangaName))
  }
})

const MangaViewContainer = connect(mapStateToProps, mapDispatchToProps)(MangaViewComponent)
export default MangaViewContainer
