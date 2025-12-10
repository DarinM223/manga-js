import React from 'react'
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton'
import GetAppIcon from '@mui/icons-material/GetApp';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress'
import { DownloadStateType } from '../../../utils/constants.js'
import { useDispatch } from 'react-redux';
import { downloadChapter, loadChapter } from '../actions/manga.js';
import { useNavigate } from 'react-router-dom';

export default function ChapterCellComponent({ manga, chapterNum, ...rowProps }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const mangaName = manga.name
  const chapter = manga.chapters[chapterNum]
  const currentChapter = manga.currentChapter
  const downloadState = chapter.download.state

  const onDoubleClick = (manga, chapterNum) => {
    dispatch(loadChapter(manga, chapterNum, navigate))
  }
  const onDownload = (manga, chapterNum) => {
    dispatch(loadChapter(manga, chapterNum, navigate, true))
      .then(() => dispatch(downloadChapter(manga.name, chapterNum)))
  }
  const cellClicked = () => onDoubleClick(manga, chapterNum)
  const downloadClicked = () => onDownload(manga, chapterNum)
  const deleteDownloadClicked = () => {
    window.api.deleteChapter(mangaName, chapterNum)
  }

  let chapterName = chapter.name
  // Add star to chapter name if it's the current chapter.
  if (currentChapter === chapterNum) {
    chapterName += ' '
    chapterName += String.fromCharCode('9734')
  }

  let downloadComponent = null
  switch (downloadState) {
    case DownloadStateType.NOT_DOWNLOADED:
      downloadComponent = <IconButton onClick={downloadClicked}><GetAppIcon /></IconButton>
      break
    case DownloadStateType.DOWNLOADING:
      const total = chapter.pages.length
      const progress = chapter.download.progress
      downloadComponent = <CircularProgress mode='determinate' value={progress} max={total} size={20} style={{ marginLeft: '15px' }} />
      break
    case DownloadStateType.DOWNLOADED:
      downloadComponent = <IconButton onClick={deleteDownloadClicked}><DeleteIcon /></IconButton>
      break
  }

  return (
    <TableRow {...rowProps} onDoubleClick={cellClicked}>
      <TableCell>{chapterName}</TableCell>
      <TableCell>{chapter.date}</TableCell>
      <TableCell>{downloadComponent}</TableCell>
    </TableRow>
  )
}