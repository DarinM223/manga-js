import React, { PropTypes } from 'react'
import AppBar from 'material-ui/AppBar'
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import ContentUndo from 'material-ui/svg-icons/content/undo'
import IconButton from 'material-ui/IconButton'
import path from 'path'
import ImageComponent from './ImageComponent.js'

import { NOT_DOWNLOADED, DOWNLOADING, DOWNLOADED } from '../../utils/constants.js'

export default function ChapterViewComponent ({ manga, mangaName, chapterNum, back, onImageClicked, onPrevClicked }) {
  const specificManga = manga.get(mangaName)
  const chapter = specificManga.get('chapters').get(chapterNum)
  const type = `http://${specificManga.get('type')}`
  const title = `${specificManga.get('title')} - ${chapter.get('name')}`
  const currPage = chapter.get('currentPage')

  const onlineURL = chapter.get('pages').get(currPage)
  const downloadState = chapter.get('download').get('state')

  let imagePath = null
  let local = false
  switch (downloadState) {
    case DOWNLOADING:
    case NOT_DOWNLOADED:
      imagePath = onlineURL
      break
    case DOWNLOADED:
      local = true
      imagePath = 'manga://' + path.join(specificManga.get('name'), chapterNum + '', encodeURIComponent(onlineURL))
      break
  }

  const imageClicked = () => {
    onImageClicked(specificManga, chapterNum)
  }
  const prevClicked = () => {
    onPrevClicked(specificManga, chapterNum)
  }

  let imageComponent = null
  if (local) {
    imageComponent = <img src={imagePath} style={{ width: '100%' }} onClick={imageClicked} />
  } else {
    imageComponent = <ImageComponent src={imagePath} type={type} style={{ width: '100%' }} onClick={imageClicked} />
  }

  return (
    <div>
      <AppBar
        title={title}
        iconElementLeft={<IconButton onClick={back}><NavigationArrowBack /></IconButton>}
        iconElementRight={<IconButton onClick={prevClicked}><ContentUndo /></IconButton>}
        style={{ position: 'fixed' }}
      />
      <br /><br /><br /><br />
      {imageComponent}
    </div>
  )
}

ChapterViewComponent.propTypes = {
  manga: PropTypes.object.isRequired,
  mangaName: PropTypes.string.isRequired,
  chapterNum: PropTypes.number.isRequired,
  back: PropTypes.func.isRequired,
  onImageClicked: PropTypes.func.isRequired
}
