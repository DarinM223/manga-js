import React, { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import { adapterFromURL, fileExtFromURL } from '../../../utils/url.js'
import { useMeasure } from './utils.ts'
import { types } from 'mime-types'

export default function ImageComponent({ src, type, onImageClick, avatar = false, downloaded = false, scrollTop = false, ...imgProps }) {
  const adapter = adapterFromURL(type)
  const [state, setState] = useState({ src: null })
  const scrollToTop = () => {
    if (scrollTop && !avatar) {
      window.scrollTo(0, 0)
    }
  }
  const retrieveImage = (src) => {
    adapter.sendRequest(src, true).then((buffer) => {
      const fileExt = fileExtFromURL(src)
      const fileType = types[fileExt] || 'application/octet-stream'
      const blob = new Blob([buffer], { type: fileType })
      const url = URL.createObjectURL(blob)

      scrollToTop()
      setState({ src: url })
    })
  }
  useEffect(() => {
    if (!downloaded) {
      retrieveImage(src)
    } else {
      setState({ src })
      scrollToTop()
    }
  }, [src])
  const [ref, dimensions] = useMeasure()
  const imageClicked = (event) => {
    const offsetX = event.nativeEvent.offsetX
    const offsetY = event.nativeEvent.offsetY

    onImageClick(offsetX, offsetY, dimensions)
  }

  if (downloaded) {
    return (
      <img {...imgProps} ref={ref} src={state.src} onClick={imageClicked} />
    )
  } else if (state.src !== null) {
    if (avatar) {
      return <Avatar {...imgProps} ref={ref} src={state.src} />
    }
    return (
      <img {...imgProps} ref={ref} src={state.src} onClick={imageClicked} />
    )
  } else {
    if (avatar) {
      return <Avatar {...imgProps} ref={ref} />
    }
    return <div {...imgProps} ref={ref} />
  }
}