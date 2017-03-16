/* global Blob, URL */

import React, { PropTypes } from 'react'
import Avatar from 'material-ui/Avatar'
import { adapterFromURL, fileExtFromURL } from '../../utils/url.js'
import mime from 'mime-types'
import Measure from 'react-measure'

export default class ImageComponent extends React.Component {
  constructor (props) {
    super(props)

    const { src, type, avatar, downloaded, onImageClick, ...imgProps } = props // eslint-disable-line
    const adapter = adapterFromURL(type)

    this.adapter = adapter
    this.imgProps = imgProps
    this.state = {
      src: null,
      dimensions: {
        width: -1,
        height: -1
      }
    }
  }

  scrollTop () {
    if (this.props.scrollTop && !this.props.avatar) {
      window.scrollTo(0, 0)
    }
  }

  retrieveImage (src) {
    this.adapter.sendRequest(src, true).then((buffer) => {
      const fileExt = fileExtFromURL(src)
      const fileType = mime.lookup(`.${fileExt}`)
      const blob = new Blob([buffer], { type: fileType })
      const url = URL.createObjectURL(blob)

      this.scrollTop()
      this.setState({ src: url })
    })
  }

  componentDidMount () {
    if (!this.props.downloaded) {
      this.retrieveImage(this.props.src)
    }
  }

  componentWillUpdate (nextProps, nextState) {
    if (nextProps.src !== this.props.src) {
      if (!nextProps.downloaded) {
        this.retrieveImage(nextProps.src)
      } else {
        this.scrollTop()
      }
    }
  }

  render () {
    const imageClicked = (event) => {
      const offsetX = event.nativeEvent.offsetX
      const offsetY = event.nativeEvent.offsetY

      this.props.onImageClick(offsetX, offsetY, this.state.dimensions)
    }
    const dimensionsChanged = (dim) => this.setState({ dimensions: dim })

    if (this.props.downloaded) {
      return (
        <Measure onMeasure={dimensionsChanged}>
          <img {...this.imgProps} src={this.props.src} onClick={imageClicked} />
        </Measure>
      )
    } else if (this.state.src !== null) {
      if (this.props.avatar) {
        return <Avatar {...this.imgProps} src={this.state.src} />
      }
      return (
        <Measure onMeasure={dimensionsChanged}>
          <img {...this.imgProps} src={this.state.src} onClick={imageClicked} />
        </Measure>
      )
    } else {
      if (this.props.avatar) {
        return <Avatar {...this.imgProps} />
      }
      return <div {...this.imgProps} />
    }
  }
}

ImageComponent.propTypes = {
  src: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  avatar: PropTypes.bool,
  downloaded: PropTypes.bool,
  scrollTop: PropTypes.bool,
  onImageClick: PropTypes.func.isRequired
}

ImageComponent.defaultProps = {
  avatar: false,
  downloaded: false,
  scrollTop: false
}
