import React from 'react'
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton'
import GetAppIcon from '@mui/icons-material/GetApp';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress'
import { DownloadStateType } from '../../../utils/constants.js'

export default function ChapterCellComponent({ manga, chapterNum, onDoubleClick, onDownload, onCancelDownload, onDeleteDownload, ...rowProps }) {
  const mangaName = manga.get('name')
  const chapter = manga.get('chapters').get(chapterNum)
  const currentChapter = manga.get('currentChapter')
  const downloadState = chapter.get('download').get('state')

  const cellClicked = () => onDoubleClick(manga, chapterNum)
  const downloadClicked = () => onDownload(manga, chapterNum)
  const deleteDownloadClicked = () => {
    window.api.deleteChapter(mangaName, chapterNum)
  }

  let chapterName = chapter.get('name')
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
      const total = chapter.get('pages').count()
      const progress = chapter.get('download').get('progress')
      downloadComponent = <CircularProgress mode='determinate' value={progress} max={total} size={20} style={{ marginLeft: '15px' }} />
      break
    case DownloadStateType.DOWNLOADED:
      downloadComponent = <IconButton onClick={deleteDownloadClicked}><DeleteIcon /></IconButton>
      break
  }

  return (
    <TableRow {...rowProps} onDoubleClick={cellClicked}>
      <TableCell>{chapterName}</TableCell>
      <TableCell>{chapter.get('date')}</TableCell>
      <TableCell>{downloadComponent}</TableCell>
    </TableRow>
  )
}