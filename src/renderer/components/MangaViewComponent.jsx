import React, { useState, useEffect } from 'react';
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
import ImageComponent from './ImageComponent.jsx'
import ChapterCellContainer from '../containers/ChapterCellContainer.js'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { removeManga, visitManga } from '../actions/manga.js';
// import { ScrollContainer } from 'react-router-scroll'

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

export default function MangaViewComponent(_props) {
  const { name } = useParams()
  const manga = useSelector((state) => state.manga)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => { dispatch(visitManga(name)) })

  const specificManga = manga[name]
  const imageURL = specificManga.image
  const description = specificManga.description
  const type = `http://${specificManga.type}`
  const handleDelete = (mangaName) => {
    window.api.deleteManga(mangaName)
    dispatch(removeManga(mangaName))
    setOpen(false)
  }
  const actions = [
    <Button
      label='Yes, delete manga'
      keyboardFocused={false}
      onTouchTap={() => handleDelete(name)}
    />
  ]

  let chapterComponents = []
  for (let chapterNum = 0; chapterNum < specificManga.chapters.length; chapterNum++) {
    chapterComponents.push(<ChapterCellContainer key={chapterNum} manga={specificManga} chapterNum={chapterNum} />)
  }

  const confirmText = `Are you sure you want to delete ${specificManga.title}?`
  return (
    <div>
      <AppBar
        title={specificManga.title}
        iconElementLeft={<IconButton onClick={() => navigate(-1)}><ArrowBackIcon /></IconButton>}
      />
      <Dialog
        title={confirmText}
        actions={actions}
        modal={false}
        open={open}
        onRequestClose={() => setOpen(false)}
      />

      {titleComponent(type, description, imageURL, () => setOpen(true))}

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
