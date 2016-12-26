import { connect } from 'react-redux'
import HeaderComponent from '../components/HeaderComponent.js'
import { addManga } from '../actions/manga.js'

const mapStateToProps = (state) => ({})
const mapDispatchToProps = (dispatch) => ({
  onAddManga (url) {
    dispatch(addManga(url))
  }
})

const headerContainer = connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)
export default headerContainer
