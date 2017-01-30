import { connect } from 'react-redux'
import ChapterViewComponent from '../components/ChapterViewComponent.js'
import { goBack } from 'react-router-redux'
import { updatePage } from '../actions/manga.js'

const mapStateToProps = (state, ownProps) => ({
  manga: state.manga,
  mangaName: ownProps.params.mangaName,
  chapterNum: parseInt(ownProps.params.chapterNum, 10)
})

const mapDispatchToProps = (dispatch) => ({
  back () {
    dispatch(goBack())
  },

  onImageClicked (manga, chapterNum) {
    dispatch(updatePage(manga, chapterNum, 1))
  },

  onPrevClicked (manga, chapterNum) {
    dispatch(updatePage(manga, chapterNum, -1))
  }
})

const ChapterViewContainer = connect(mapStateToProps, mapDispatchToProps)(ChapterViewComponent)
export default ChapterViewContainer
