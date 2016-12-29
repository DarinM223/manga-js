import { connect } from 'react-redux'
import ChapterViewComponent from '../components/ChapterViewComponent.js'
import { goBack } from 'react-router-redux'
import { updatePage } from '../actions/manga.js'

const mapStateToProps = (state, ownProps) => ({
  manga: state.manga,
  mangaName: ownProps.params.mangaName,
  chapterNum: ownProps.params.chapterNum
})

const mapDispatchToProps = (dispatch) => ({
  back () {
    dispatch(goBack())
  },

  onImageClicked (mangaName, chapterNum) {
    dispatch(updatePage(mangaName, chapterNum, 1))
  },

  onPrevClicked (mangaName, chapterNum) {
    dispatch(updatePage(mangaName, chapterNum, -1))
  }
})

const ChapterViewContainer = connect(mapStateToProps, mapDispatchToProps)(ChapterViewComponent)
export default ChapterViewContainer
