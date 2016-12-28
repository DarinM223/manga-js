import React, { PropTypes } from 'react'
import AppBar from 'material-ui/AppBar'
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import IconButton from 'material-ui/IconButton'

export default function ChapterViewComponent ({ manga, mangaName, chapterNum, back }) {
  const specificManga = manga.get(mangaName)
  const chapter = specificManga.get('chapters').get(chapterNum)
  const title = `${specificManga.get('title')} - ${chapter.get('name')}`
  return (
    <div>
      <AppBar
        title={title}
        iconElementLeft={<IconButton onClick={back}><NavigationArrowBack /></IconButton>}
      />
    </div>
  )
}

ChapterViewComponent.propTypes = {
  manga: PropTypes.object.isRequired,
  mangaName: PropTypes.string.isRequired,
  chapterNum: PropTypes.number.isRequired,
  back: PropTypes.func.isRequired
}
