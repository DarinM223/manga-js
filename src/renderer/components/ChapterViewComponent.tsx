import React, { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import IconButton from '@mui/material/IconButton'
import ImageComponent from './ImageComponent.tsx'
import SliderComponent from './SliderComponent.tsx'
import { DownloadStateType } from '../../../utils/constants.ts'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { updatePage } from '../actions/manga.ts'
import { Toolbar, Typography } from '@mui/material'
import * as location from '../../../utils/location.ts'
import { State } from '../storage.ts'
import { Manga } from '../../../utils/manga.ts'
import { Dimensions } from './utils.ts'

const styles: {
  appBar: React.CSSProperties
  transparent: React.CSSProperties
} = {
  appBar: {
    position: 'fixed',
    width: '100%',
    margin: 0,
  },
  transparent: {
    backgroundColor: 'rgba(50, 50, 50, 0.7)',
  },
}

export default function ChapterViewComponent() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const manga = useSelector((state: State) => state.manga)
  const { mangaName, chapterNum } = useParams()
  const chapterNum2 = Number(chapterNum)
  if (mangaName === undefined || Number.isNaN(chapterNum2)) {
    return <h1>Invalid manga name or chapter number for chapter</h1>
  }
  const specificManga = manga[mangaName]
  const chapter = specificManga.chapters[chapterNum2]
  const type = `http://${specificManga.type}`
  const title = `${specificManga.title} - ${chapter.name}`
  const currPage = chapter.currentPage
  const [slider, setSlider] = useState(currPage + 1)
  const [navigationVisible, setNavigationVisible] = useState(false)

  const updateSlider = (updatedValue: number, totalPages: number) => {
    if (updatedValue >= 1 && updatedValue <= totalPages) {
      setSlider(updatedValue)
    }
  }
  const update = (manga: Manga, chapterNum: number, amount: number) => {
    dispatch(updatePage(manga, chapterNum, amount))
  }

  const onlineURL = chapter.pages[currPage]
  const totalPages = chapter.pages.length
  const downloadState = chapter.download.state

  const imageClicked = (
    xOffset: number,
    _yOffset: number,
    dimensions: Dimensions
  ) => {
    if (dimensions.width === null) {
      return
    }
    // If click was on the right half of the image then go to the next page,
    // otherwise go to the previous page.
    if (xOffset > dimensions.width / 2) {
      updateSlider(slider + 1, totalPages)
      update(specificManga, chapterNum2, 1)
    } else {
      updateSlider(slider - 1, totalPages)
      update(specificManga, chapterNum2, -1)
    }
  }

  const dropDownClicked = () => setNavigationVisible(!navigationVisible)

  const sliderChanged = (value: number) => {
    updateSlider(value, totalPages)
    const diff = value - currPage - 1

    if (diff !== 0) {
      update(specificManga, chapterNum2, diff)
    }
  }

  let imagePath = null
  let downloaded = false
  if (
    downloadState === DownloadStateType.DOWNLOADING ||
    downloadState === DownloadStateType.NOT_DOWNLOADED
  ) {
    imagePath = onlineURL
  } else if (downloadState === DownloadStateType.DOWNLOADED) {
    imagePath =
      'manga://' +
      location.imagePath('', specificManga.name, chapterNum2, onlineURL)
    downloaded = true
  } else {
    throw new Error('Invalid download state')
  }

  const scrollTop = true

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
        <AppBar position="static">
          <Toolbar style={{ justifyContent: 'space-between' }}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6">{title}</Typography>
            <IconButton onClick={dropDownClicked}>
              <ArrowDropDownIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        {sliderComponent}
      </div>
      <br />
      <br />
      <br />
      <br />
      <ImageComponent
        src={imagePath}
        type={type}
        style={{ width: '100%' }}
        downloaded={downloaded}
        onImageClick={imageClicked}
        scrollTop={scrollTop}
      />
    </div>
  )
}
