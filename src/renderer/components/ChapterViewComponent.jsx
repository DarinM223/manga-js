import React, { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import IconButton from '@mui/material/IconButton'
import ImageComponent from './ImageComponent.jsx'
import SliderComponent from './SliderComponent.jsx'
import { DownloadStateType } from '../../../utils/constants.js'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updatePage } from '../actions/manga.js';

const styles = {
  appBar: {
    position: 'fixed',
    width: '100%',
    margin: 0
  },
  transparent: {
    backgroundColor: 'rgba(50, 50, 50, 0.7)'
  }
}

export default function ChapterViewComponent(_props) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const manga = useSelector((state) => state.manga)
  const { mangaName, chapterNum } = useParams()
  const specificManga = manga[mangaName]
  const chapter = specificManga.chapters[chapterNum]
  const type = `http://${specificManga.type}`
  const title = `${specificManga.title} - ${chapter.name}`
  const currPage = chapter.currentPage
  const [slider, setSlider] = useState(currPage + 1)
  const [navigationVisible, setNavigationVisible] = useState(false)

  const updateSlider = (updatedValue, totalPages) => {
    if (updatedValue >= 1 && updatedValue <= totalPages) {
      setSlider(updatedValue)
    }
  }
  const update = (manga, chapterNum, amount) => {
    dispatch(updatePage(manga, chapterNum, amount))
  }

  const onlineURL = chapter.pages[currPage]
  const totalPages = chapter.pages.length
  const downloadState = chapter.downloadState.type

  const imageClicked = (xOffset, _yOffset, dimensions) => {
    // If click was on the right half of the image then go to the next page,
    // otherwise go to the previous page.
    if (xOffset > dimensions.width / 2) {
      updateSlider(slider + 1, totalPages)
      update(specificManga, chapterNum, 1)
    } else {
      updateSlider(slider - 1, totalPages)
      update(specificManga, chapterNum, -1)
    }
  }

  const dropDownClicked = () => setNavigationVisible(!navigationVisible)

  const sliderChanged = (value) => {
    updateSlider(value, totalPages)
    const diff = value - currPage - 1

    if (diff !== 0) {
      update(specificManga, chapterNum, diff)
    }
  }

  let imagePath = null
  let downloaded = false
  if (downloadState === DownloadStateType.DOWNLOADING ||
    downloadState === DownloadStateType.NOT_DOWNLOADED) {
    imagePath = onlineURL
  } else if (downloadState === DownloadStateType.DOWNLOADED) {
    imagePath = 'manga://' + [
      specificManga.name,
      chapterNum + '',
      encodeURIComponent(onlineURL)
    ].join('/')
    downloaded = true
  } else {
    throw new Error('Invalid download state')
  }

  const scrollTop = true
  const imageComponent = (
    <ImageComponent
      src={imagePath}
      type={type}
      style={{ width: '100%' }}
      downloaded={downloaded}
      onImageClick={imageClicked}
      scrollTop={scrollTop}
    />
  )

  let sliderComponent = <div />
  if (navigationVisible) {
    sliderComponent = (
      <div style={styles.transparent}>
        <SliderComponent
          currValue={slider}
          totalPages={totalPages}
          onSliderChanged={sliderChanged}
        />
      </div>
    )
  }

  return (
    <div>
      <div style={styles.appBar}>
        <AppBar
          title={title}
          iconElementLeft={<IconButton onClick={() => navigate(-1)}><ArrowBackIcon /></IconButton>}
          iconElementRight={<IconButton onClick={dropDownClicked}><ArrowDropDownIcon /></IconButton>}
        />
        {sliderComponent}
      </div>
      <br /><br /><br /><br />
      {imageComponent}
    </div>
  )
}
