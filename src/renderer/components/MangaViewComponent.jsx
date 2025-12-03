import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import AppBar from '@mui/material/AppBar'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
// import { ScrollContainer } from 'react-router-scroll'

import ImageComponent from './ImageComponent.jsx'
import ChapterCellContainer from '../containers/ChapterCellContainer.js'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    maxHeight: '40%',
    overflow: 'auto'
  },
  image: {
    flex: 1,
    margin: '10px',
    objectFit: 'contain',
    maxHeight: '25%',
    width: 'auto',
    flexGrow: 0,
    flexShrink: 0
  },
  div: {
    flex: 1,
    fontFamily: 'Arial',
    marginRight: '10px'
  }
}

function titleComponent(type, description, imageURL, openDialog) {
  // Dummy variable that is always true to trick eslint >:)
  const isSecondary = true
  const deleteText = 'Delete manga'

  let textDescription = description
  if (description === null || description.length <= 0) {
    textDescription = 'No description available'
  }

  return (
    <div style={styles.container}>
      <ImageComponent src={imageURL} type={type} style={styles.image} />
      <div style={styles.div}>
        <h3>Description:</h3>
        <p>{textDescription}</p>
        <Button variant="contained" label={deleteText} secondary={isSecondary} onClick={openDialog} />
      </div>
    </div>
  )
}

export default class MangaViewComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = { open: false }
    this.handleClose = () => this.setState({ open: false })
    this.handleOpen = () => this.setState({ open: true })
    this.handleDelete = () => {
      this.props.onDelete(this.props.name)
      this.handleClose()
    }
  }

  componentDidMount() {
    this.props.onVisitManga(this.props.name)
  }

  render() {
    const specificManga = this.props.manga.get(this.props.name)
    const imageURL = specificManga.get('image')
    const description = specificManga.get('description')
    const type = `http://${specificManga.get('type')}`
    const actions = [
      <Button
        label='Yes, delete manga'
        keyboardFocused={false}
        onTouchTap={this.handleDelete}
      />
    ]

    let chapterComponents = []
    for (let chapterNum = 0; chapterNum < specificManga.get('chapters').count(); chapterNum++) {
      chapterComponents.push(<ChapterCellContainer manga={specificManga} chapterNum={chapterNum} />)
    }

    const confirmText = `Are you sure you want to delete ${specificManga.get('title')}?`
    return (
      <div>
        <AppBar
          title={specificManga.get('title')}
          iconElementLeft={<IconButton onClick={this.props.back}><ArrowBackIcon /></IconButton>}
        />
        <Dialog
          title={confirmText}
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        />

        {titleComponent(type, description, imageURL, this.handleOpen)}

        {/* <ScrollContainer scrollKey={this.props.name}> */}
        <div style={{ maxHeight: '60%', overflow: 'scroll' }}>
          <Table selectable={false}>
            <TableHead displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableCell>Chapter</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Download</TableCell>
              </TableRow>
            </TableHead>
            <TableBody displayRowCheckbox={false}>
              {chapterComponents}
            </TableBody>
          </Table>
        </div>
        {/* </ScrollContainer> */}
      </div>
    )
  }
}
