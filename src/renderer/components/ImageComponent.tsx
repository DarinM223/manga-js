import React, { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import { adapterFromURL } from '../../utils/url.ts'
import { Dimensions, useMeasure } from './utils.ts'
import mime from 'mime-types'

type Props = {
  src: string
  type: string
  onImageClick: (
    offsetX: number,
    offsetY: number,
    dimensions: Dimensions
  ) => void
  avatar?: boolean
  downloaded?: boolean
  scrollTop?: boolean
  [key: string]: any
}

export default function ImageComponent({
  src,
  type,
  onImageClick,
  avatar = false,
  downloaded = false,
  scrollTop = false,
  ...imgProps
}: Props) {
  const adapter = adapterFromURL(type)
  const [state, setState] = useState<{ src: string | null }>({ src: null })
  const scrollToTop = () => {
    if (scrollTop && !avatar) {
      window.scrollTo(0, 0)
    }
  }
  const retrieveImage = async (src: string) => {
    const buffer = await adapter.sendRequest(src, true)
    const fileType = mime.lookup(src)
    const blob = new Blob([new Uint8Array(buffer).buffer], {
      type: fileType === false ? undefined : fileType,
    })
    const url = URL.createObjectURL(blob)

    scrollToTop()
    setState({ src: url })
  }
  useEffect(() => {
    if (!downloaded) {
      retrieveImage(src)
    } else {
      scrollToTop()
    }
  }, [src])
  const [ref, dimensions] = useMeasure()
  const imageClicked: React.MouseEventHandler<HTMLImageElement> = (event) => {
    const offsetX = event.nativeEvent.offsetX
    const offsetY = event.nativeEvent.offsetY

    onImageClick(offsetX, offsetY, dimensions)
  }

  if (downloaded) {
    return <img {...imgProps} ref={ref} src={src} onClick={imageClicked} />
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
