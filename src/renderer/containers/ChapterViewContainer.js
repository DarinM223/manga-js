import { connect } from 'react-redux'
import ChapterViewComponent from '../components/ChapterViewComponent.jsx'
// import { goBack } from 'react-router-redux'
import { updatePage } from '../actions/manga.js'

const mapStateToProps = (state, ownProps) => ({
  manga: state.manga,
  mangaName: ownProps.params.mangaName,
  chapterNum: parseInt(ownProps.params.chapterNum, 10)
})

const mapDispatchToProps = (dispatch) => ({
  back () {
    console.log('TODO: go back')
    // dispatch(goBack())
  },

  update (manga, chapterNum, amount) {
    dispatch(updatePage(manga, chapterNum, amount))
  }
})

const ChapterViewContainer = connect(mapStateToProps, mapDispatchToProps)(ChapterViewComponent)
export default ChapterViewContainer
