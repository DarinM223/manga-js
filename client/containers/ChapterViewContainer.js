import { connect } from 'react-redux'
import ChapterViewComponent from '../components/ChapterViewComponent.js'
import { goBack } from 'react-router-redux'

const mapStateToProps = (state, ownProps) => ({
  manga: state.manga,
  mangaName: ownProps.params.mangaName,
  chapterNum: ownProps.params.chapterNum
})

const mapDispatchToProps = (dispatch) => ({
  back () {
    dispatch(goBack())
  }
})

const ChapterViewContainer = connect(mapStateToProps, mapDispatchToProps)(ChapterViewComponent)
export default ChapterViewContainer
