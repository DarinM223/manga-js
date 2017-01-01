import React, { PropTypes } from 'react'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import AppBar from 'material-ui/AppBar'
import ActionGetApp from 'material-ui/svg-icons/action/get-app'
import ActionDelete from 'material-ui/svg-icons/action/delete'
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import NavigationCancel from 'material-ui/svg-icons/navigation/cancel'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog'

import { NOT_DOWNLOADED, DOWNLOADING, DOWNLOADED } from '../../utils/constants.js'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row'
  },
  image: {
    flex: 1,
    margin: '10px',
    objectFit: 'contain',
    flexGrow: 0,
    flexShrink: 0
  },
  div: {
    flex: 1,
    fontFamily: 'Arial',
    marginRight: '10px'
  }
}

function chapterComponent (manga, chapterNum, props) {
  const mangaName = manga.get('name')
  const chapter = manga.get('chapters').get(chapterNum)
  const currentChapter = manga.get('currentChapter')
  const downloadState = chapter.get('downloadState')
  const cellClicked = () => {
    props.onCellClicked(manga, chapterNum)
  }
  const downloadClicked = () => {
    props.onDownloadClicked(mangaName, chapterNum)
  }
  const cancelDownloadClicked = () => {
    props.onCancelDownloadClicked(mangaName, chapterNum)
  }
  const deleteDownloadClicked = () => {
    props.onDeleteDownloadClicked(mangaName, chapterNum)
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
      downloadComponent = <IconButton onClick={cancelDownloadClicked}><NavigationCancel /></IconButton>
      break
    case DOWNLOADED:
      downloadComponent = <IconButton onClick={deleteDownloadClicked}><ActionDelete /></IconButton>
      break
  }

  return (
    <TableRow onDoubleClick={cellClicked}>
      <TableRowColumn>{chapterName}</TableRowColumn>
      <TableRowColumn>{chapter.get('date')}</TableRowColumn>
      <TableRowColumn>{downloadComponent}</TableRowColumn>
    </TableRow>
  )
}

function titleComponent (description, imageURL, openDialog) {
  // Dummy variable that is always true to trick eslint >:)
  const isSecondary = true
  const deleteText = 'Delete manga'

  let textDescription = description
  if (description === null || description.length <= 0) {
    textDescription = 'No description available'
  }

  return (
    <div style={styles.container}>
      <img src={imageURL} style={styles.image} />
      <div style={styles.div}>
        <h3>Description:</h3>
        <p>{textDescription}</p>
        <RaisedButton label={deleteText} secondary={isSecondary} onClick={openDialog} />
      </div>
    </div>
  )
}

export default class MangaViewComponent extends React.Component {
  constructor (props) {
    super(props)

    this.state = { open: false }
    this.handleClose = () => {
      this.setState({ open: false })
    }
    this.handleOpen = () => {
      this.setState({ open: true })
    }
    this.handleDelete = () => {
      this.props.onDelete(this.props.name)
      this.handleClose()
    }
  }

  render () {
    const specificManga = this.props.manga.get(this.props.name)
    const imageURL = specificManga.get('image')
    const description = specificManga.get('description')
    const actions = [
      <FlatButton
        label='Yes, delete manga'
        keyboardFocused={false}
        onTouchTap={this.handleDelete}
      />
    ]

    let chapterComponents = []
    for (let chapterNum = 0; chapterNum < specificManga.get('chapters').count(); chapterNum++) {
      chapterComponents.push(chapterComponent(specificManga, chapterNum, this.props))
    }

    const confirmText = `Are you sure you want to delete ${specificManga.get('title')}?`
    return (
      <div>
        <AppBar
          title={specificManga.get('title')}
          iconElementLeft={<IconButton onClick={this.props.back}><NavigationArrowBack /></IconButton>}
          style={{ position: 'fixed' }}
        />
        <br /><br /><br /><br />
        <Dialog
          title={confirmText}
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        />

        {titleComponent(description, imageURL, this.handleOpen)}

        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>Chapter</TableHeaderColumn>
              <TableHeaderColumn>Date</TableHeaderColumn>
              <TableHeaderColumn>Download</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {chapterComponents}
          </TableBody>
        </Table>
      </div>
    )
  }
}

MangaViewComponent.propTypes = {
  manga: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  back: PropTypes.func.isRequired,
  onCellClicked: PropTypes.func.isRequired,
  onDownloadClicked: PropTypes.func.isRequired,
  onCancelDownloadClicked: PropTypes.func.isRequired,
  onDeleteDownloadClicked: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
}
