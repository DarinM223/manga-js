import React, { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import LoopIcon from '@mui/icons-material/Loop';
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { validHostname } from '../../../utils/url.ts'
import { DialogActions, DialogContent, DialogTitle, Toolbar, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { addManga, reloadManga } from '../actions/manga.js';

const EMPTY_TEXT = 'EMPTY_TEXT'
const INVALID_URL = 'INVALID_URL'
const NO_ERROR = 'NO_ERROR'

export default function HeaderComponent(_props) {
  const dispatch = useDispatch()
  const manga = useSelector((state) => state.manga)
  const [state, setState] = useState({
    open: false,
    text: '',
    error: NO_ERROR
  })

  const onAddManga = (url, mangaList) => {
    dispatch(addManga(url, mangaList))
  }
  const onReload = (mangaList) => {
    for (const name in mangaList) {
      const manga = mangaList[name]
      dispatch(reloadManga(manga))
    }
  }
  const handleClose = () => {
    setState({ open: false, text: '', error: NO_ERROR })
  }
  const handleOpen = () => {
    setState({ ...state, open: true, error: NO_ERROR })
  }
  const handleChange = (e) => {
    e.preventDefault()
    setState({ ...state, text: e.target.value })
  }
  const submit = () => {
    if (state.text.trim().length === 0) {
      setState({ ...state, error: EMPTY_TEXT })
      return
    }
    if (!validHostname(state.text)) {
      setState({ ...state, error: INVALID_URL })
      return
    }

    onAddManga(state.text, manga)
    handleClose()
  }
  const handleReload = () => { onReload(manga) }
  let errorText = null
  switch (state.error) {
    case EMPTY_TEXT:
      errorText = 'Please enter the url of the manga into the text field'
      break
    case INVALID_URL:
      errorText = 'Please enter a valid manga url into the text field'
      break
  }

  let textField = <TextField id='text-field-default' onChange={handleChange} />;
  if (errorText !== null) {
    textField = <TextField error id='text-field-default' helperText={errorText} onChange={handleChange} />;
  }

  return (
    <div>
      <AppBar position='static'>
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <IconButton onClick={handleOpen}><NoteAddIcon /></IconButton>
          <Typography variant="h6">Manga list</Typography>
          <IconButton onClick={handleClose}><LoopIcon /></IconButton>
        </Toolbar>
      </AppBar>
      <Dialog open={state.open} onClose={handleClose}>
        <DialogTitle>Enter the url of the manga to add</DialogTitle>
        <DialogContent>
          <div>Paste the url of the manga to add in the text field below:</div>
          {textField}
        </DialogContent>
        <DialogActions>
          <Button onClick={submit}>Add manga</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}