import { connect } from 'react-redux'
import HeaderComponent from '../components/HeaderComponent.jsx'
import { addManga, reloadManga } from '../actions/manga.ts'

const mapStateToProps = (state) => ({
  manga: state.manga
})

const mapDispatchToProps = (dispatch) => ({
  onAddManga (url, mangaList) {
    dispatch(addManga(url, mangaList))
  },

  onReload (mangaList) {
    for (const name of mangaList.keys()) {
      const manga = mangaList.get(name)
      dispatch(reloadManga(manga))
    }
  }
})

const headerContainer = connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)
export default headerContainer
