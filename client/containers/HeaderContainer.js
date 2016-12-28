import { connect } from 'react-redux'
import HeaderComponent from '../components/HeaderComponent.js'
import { addManga } from '../actions/manga.js'

const mapStateToProps = (state) => ({
  manga: state.manga
})

const mapDispatchToProps = (dispatch) => ({
  onAddManga (url, mangaList) {
    dispatch(addManga(url, mangaList))
  }
})

const headerContainer = connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)
export default headerContainer
