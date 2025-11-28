import { connect } from 'react-redux'
import MangaViewComponent from '../components/MangaViewComponent.jsx'
// import { goBack } from 'react-router-redux'

import { removeManga } from '../actions/manga.js'

const mapStateToProps = (state, ownProps) => ({
  manga: state.manga,
  name: ownProps.params.name
})

const mapDispatchToProps = (dispatch) => ({
  back() {
    console.log('TODO: go back')
    // dispatch(goBack())
  },

  onDelete(mangaName) {
    window.api.deleteManga(mangaName)
    dispatch(removeManga(mangaName))
  }
})

const MangaViewContainer = connect(mapStateToProps, mapDispatchToProps)(MangaViewComponent)
export default MangaViewContainer
