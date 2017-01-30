/* global Blob, URL */

import React, { PropTypes } from 'react'
import Avatar from 'material-ui/Avatar'
import { adapterFromURL, fileExtFromURL } from '../../utils/url.js'
import mimetype from 'mimetype'

export default class ImageComponent extends React.Component {
  constructor (props) {
    super(props)

    const { src, type, avatar, ...imgProps } = props // eslint-disable-line
    const adapter = adapterFromURL(type)

    this.adapter = adapter
    this.imgProps = imgProps
    this.avatar = avatar
    this.state = { src: null }
  }

  retrieveImage (src) {
    this.adapter.sendRequest(src, true).then((buffer) => {
      const fileExt = fileExtFromURL(src)
      const fileType = mimetype.lookup(`sample.${fileExt}`)
      const blob = new Blob([buffer], { type: fileType })
      const url = URL.createObjectURL(blob)
      this.setState({ src: url })
    })
  }

  componentDidMount () {
    this.retrieveImage(this.props.src)
  }

  componentWillUpdate (nextProps, nextState) {
    if (nextProps.src !== this.props.src) {
      this.retrieveImage(nextProps.src)
    }
  }

  render () {
    if (this.state.src !== null) {
      if (this.avatar) {
        return <Avatar {...this.imgProps} src={this.state.src} />
      }
      return <img {...this.imgProps} src={this.state.src} />
    } else {
      if (this.avatar) {
        return <Avatar {...this.imgProps} />
      }
      return <div />
    }
  }
}

ImageComponent.propTypes = {
  src: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  avatar: PropTypes.bool
}

ImageComponent.defaultProps = { avatar: false }
