/* global Blob, URL */

import React, { PropTypes } from 'react'
import { adapterFromURL, fileExtFromURL } from '../../utils/url.js'
import mimetype from 'mimetype'

export default class ImageComponent extends React.Component {
  constructor (props) {
    super(props)

    const { src, type, ...imgProps } = props // eslint-disable-line
    const adapter = adapterFromURL(type)

    this.adapter = adapter
    this.imgProps = imgProps
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
      return <img {...this.imgProps} src={this.state.src} />
    } else {
      return <div />
    }
  }
}

ImageComponent.propTypes = {
  src: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
}
