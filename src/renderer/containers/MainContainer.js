import { connect } from 'react-redux'
import MainComponent from '../components/MainComponent.jsx'
import { reloadManga } from '../actions/manga.js'

const mapStateToProps = (state) => ({
  manga: state.manga
})
const mapDispatchToProps = (dispatch) => ({
  onReloadManga(manga) {
    dispatch(reloadManga(manga))
  },
})

const MainContainer = connect(mapStateToProps, mapDispatchToProps)(MainComponent)
export default MainContainer
