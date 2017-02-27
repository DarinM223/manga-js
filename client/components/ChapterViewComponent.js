import React, { PropTypes } from 'react'
import AppBar from 'material-ui/AppBar'
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import ContentUndo from 'material-ui/svg-icons/content/undo'
import IconButton from 'material-ui/IconButton'
import Slider from 'material-ui/Slider'
import path from 'path'
import ImageComponent from './ImageComponent.js'

import { NOT_DOWNLOADED, DOWNLOADING, DOWNLOADED } from '../../utils/constants.js'

const styles = {
  slider: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  sliderText: {
    position: 'relative',
    top: '5px'
  }
}

export default class ChapterViewComponent extends React.Component {
  constructor (props) {
    super(props)

    const specificManga = props.manga.get(props.mangaName)
    const chapter = specificManga.get('chapters').get(props.chapterNum)
    const currPage = chapter.get('currentPage')
    this.state = { slider: currPage + 1 }
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

    const imageClicked = () => {
      this.updateSlider(this.state.slider + 1, totalPages)
      this.props.update(specificManga, this.props.chapterNum, 1)
    }
    const prevClicked = () => {
      this.updateSlider(this.state.slider - 1, totalPages)
      this.props.update(specificManga, this.props.chapterNum, -1)
    }
    const sliderChanged = (event, newValue) => {
      this.updateSlider(newValue, totalPages)
      const diff = newValue - currPage - 1

      if (diff !== 0) {
        this.props.update(specificManga, this.props.chapterNum, diff)
      }
    }
    const imageProps = {
      style: { width: '100%' },
      onClick: imageClicked
    }

    let imageComponent = null
    switch (downloadState) {
      case DOWNLOADING:
      case NOT_DOWNLOADED:
        imageComponent = <ImageComponent src={onlineURL} type={type} {...imageProps} />
        break
      case DOWNLOADED:
        const imagePath = 'manga://' + path.join(
          specificManga.get('name'),
          this.props.chapterNum + '',
          encodeURIComponent(onlineURL)
        )
        imageComponent = <img src={imagePath} {...imageProps} />
        break
    }

    return (
      <div>
        <AppBar
          title={title}
          iconElementLeft={<IconButton onClick={this.props.back}><NavigationArrowBack /></IconButton>}
          iconElementRight={<IconButton onClick={prevClicked}><ContentUndo /></IconButton>}
          style={{ position: 'fixed' }}
        />
        <br /><br /><br /><br />
        <div style={styles.slider}>
          <Slider
            style={{ width: '80%' }}
            min={1}
            max={totalPages}
            step={1}
            value={this.state.slider}
            onChange={sliderChanged}
          />
          <p style={styles.sliderText}>{this.state.slider}/{totalPages}</p>
        </div>
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
