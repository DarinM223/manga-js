import { connect } from 'react-redux'
import MangaViewComponent from '../components/MangaViewComponent.jsx'
import { useNavigate } from "react-router-dom";
import { removeManga } from '../actions/manga.ts'

const mapStateToProps = (state, ownProps) => ({
  manga: state.manga,
  name: ownProps.params.name
})

const mapDispatchToProps = (dispatch) => ({
  back() {
    const navigate = useNavigate()
    navigate(-1)
  },

  onDelete(mangaName) {
    window.api.deleteManga(mangaName)
    dispatch(removeManga(mangaName))
  }
})

const MangaViewContainer = connect(mapStateToProps, mapDispatchToProps)(MangaViewComponent)
export default MangaViewContainer
