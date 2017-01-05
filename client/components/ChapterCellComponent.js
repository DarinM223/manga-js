import React, { PropTypes } from 'react'
import { TableRow, TableRowColumn } from 'material-ui/Table'
import IconButton from 'material-ui/IconButton'
import ActionGetApp from 'material-ui/svg-icons/action/get-app'
import ActionDelete from 'material-ui/svg-icons/action/delete'
import { ipcRenderer } from 'electron'

import { NOT_DOWNLOADED, DOWNLOADING, DOWNLOADED } from '../../utils/constants.js'

export default function ChapterCellComponent ({ manga, chapterNum, onDoubleClick, onDownload, onCancelDownload, onDeleteDownload, ...rowProps }) {
  const mangaName = manga.get('name')
  const chapter = manga.get('chapters').get(chapterNum)
  const currentChapter = manga.get('currentChapter')
  const downloadState = chapter.get('download').get('state')

  const cellClicked = () => onDoubleClick(manga, chapterNum)
  const downloadClicked = () => onDownload(manga, chapterNum)
  const deleteDownloadClicked = () => {
    ipcRenderer.send('delete-chapter', { mangaName, chapterNum })
  }

  let chapterName = chapter.get('name')
  // Add star to chapter name if it's the current chapter.
  if (currentChapter === chapterNum) {
    chapterName += ' '
    chapterName += String.fromCharCode('9734')
  }

  let downloadComponent = null
  switch (downloadState) {
    case NOT_DOWNLOADED:
      downloadComponent = <IconButton onClick={downloadClicked}><ActionGetApp /></IconButton>
      break
    case DOWNLOADING:
      const total = chapter.get('pages').count()
      const progress = chapter.get('download').get('progress')
      downloadComponent = <p>Downloaded {progress + 1}/{total}</p>
      break
    case DOWNLOADED:
      downloadComponent = <IconButton onClick={deleteDownloadClicked}><ActionDelete /></IconButton>
      break
  }

  return (
    <TableRow {...rowProps} onDoubleClick={cellClicked}>
      <TableRowColumn>{chapterName}</TableRowColumn>
      <TableRowColumn>{chapter.get('date')}</TableRowColumn>
      <TableRowColumn>{downloadComponent}</TableRowColumn>
    </TableRow>
  )
}

ChapterCellComponent.propTypes = {
  manga: PropTypes.object.isRequired,
  chapterNum: PropTypes.number.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired
}
