import React, { PropTypes } from 'react'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table'
import AppBar from 'material-ui/AppBar'
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog'

import ChapterCellContainer from '../containers/ChapterCellContainer.js'

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
    this.handleClose = () => this.setState({ open: false })
    this.handleOpen = () => this.setState({ open: true })
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
      chapterComponents.push(<ChapterCellContainer manga={specificManga} chapterNum={chapterNum} />)
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
  onDelete: PropTypes.func.isRequired
}
