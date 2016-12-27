import { connect } from 'react-redux'
import MainComponent from '../components/MainComponent.js'

const mapStateToProps = (state) => ({
  manga: state.manga.toJS()
})

const MainContainer = connect(mapStateToProps)(MainComponent)
export default MainContainer
