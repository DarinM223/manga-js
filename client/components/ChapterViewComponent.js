import React, { PropTypes } from 'react'
import AppBar from 'material-ui/AppBar'
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import NavigationArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down'
import IconButton from 'material-ui/IconButton'
import path from 'path'
import ImageComponent from './ImageComponent.js'
import SliderComponent from './SliderComponent.js'

import { NOT_DOWNLOADED, DOWNLOADING, DOWNLOADED } from '../../utils/constants.js'

export default class ChapterViewComponent extends React.Component {
  constructor (props) {
    super(props)

    const specificManga = props.manga.get(props.mangaName)
    const chapter = specificManga.get('chapters').get(props.chapterNum)
    const currPage = chapter.get('currentPage')
    this.state = {
      slider: currPage + 1,
      navigationVisible: false
    }
  }

  updateSlider (updatedValue, totalPages) {
    if (updatedValue >= 1 && updatedValue <= totalPages) {
      this.setState({ slider: updatedValue })
    }
  }

  render () {
    const specificManga = this.props.manga.get(this.props.mangaName)
    const chapter = specificManga.get('chapters').get(this.props.chapterNum)
    const type = `http://${specificManga.get('type')}`
    const title = `${specificManga.get('title')} - ${chapter.get('name')}`
    const currPage = chapter.get('currentPage')

    const onlineURL = chapter.get('pages').get(currPage)
    const totalPages = chapter.get('pages').count()
    const downloadState = chapter.get('download').get('state')

    const imageClicked = (xOffset, yOffset, dimensions) => {
      // If click was on the right half of the image then go to the next page,
      // otherwise go to the previous page.
      if (xOffset > dimensions.width / 2) {
        this.updateSlider(this.state.slider + 1, totalPages)
        this.props.update(specificManga, this.props.chapterNum, 1)
      } else {
        this.updateSlider(this.state.slider - 1, totalPages)
        this.props.update(specificManga, this.props.chapterNum, -1)
      }
    }

    const dropDownClicked = () => this.setState({ navigationVisible: !this.state.navigationVisible })

    const sliderChanged = (value) => {
      this.updateSlider(value, totalPages)
      const diff = value - currPage - 1

      if (diff !== 0) {
        this.props.update(specificManga, this.props.chapterNum, diff)
      }
    }

    let imagePath = null
    let downloaded = false
    if (downloadState === DOWNLOADING || downloadState === NOT_DOWNLOADED) {
      imagePath = onlineURL
    } else if (downloadState === DOWNLOADED) {
      imagePath = 'manga://' + path.join(
        specificManga.get('name'),
        this.props.chapterNum + '',
        encodeURIComponent(onlineURL)
      )
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
    if (this.state.navigationVisible) {
      sliderComponent = (
        <SliderComponent
          currValue={this.state.slider}
          totalPages={totalPages}
          onSliderChanged={sliderChanged}
        />
      )
    }

    return (
      <div>
        <AppBar
          title={title}
          iconElementLeft={<IconButton onClick={this.props.back}><NavigationArrowBack /></IconButton>}
          iconElementRight={<IconButton onClick={dropDownClicked}><NavigationArrowDropDown /></IconButton>}
          style={{ position: 'fixed' }}
        />
        <br /><br /><br /><br />
        {sliderComponent}
        {imageComponent}
      </div>
    )
  }
}

ChapterViewComponent.propTypes = {
  manga: PropTypes.object.isRequired,
  mangaName: PropTypes.string.isRequired,
  chapterNum: PropTypes.number.isRequired,
  back: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired
}
