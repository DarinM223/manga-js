import React, { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import LoopIcon from '@mui/icons-material/Loop'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { validHostname } from '../../utils/url.ts'
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Toolbar,
  Typography,
} from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { Action, addManga, Error, reloadManga } from '../actions/manga.ts'
import { State as MangaState } from '../reducers/manga.ts'
import { State } from '../storage.ts'

export default function HeaderComponent() {
  const dispatch = useDispatch<ThunkDispatch<State, any, Action>>()
  const manga = useSelector((state: State) => state.manga)
  const [state, setState] = useState<{
    open: boolean
    text: string
    error: 'EMPTY_TEXT' | 'INVALID_URL' | 'NO_ERROR' | Error
  }>({
    open: false,
    text: '',
    error: 'NO_ERROR',
  })

  const onAddManga = async (url: string, mangaList: MangaState) => {
    const action: Action = await dispatch(addManga(url, mangaList))
    if (action.type === 'ERROR') {
      setState({ ...state, error: action.error })
    }
  }
  const onReload = (mangaList: MangaState) => {
    for (const name in mangaList) {
      const manga = mangaList[name]
      dispatch(reloadManga(manga))
    }
  }
  const handleClose = () => {
    setState({ open: false, text: '', error: 'NO_ERROR' })
  }
  const handleOpen = () => {
    setState({ ...state, open: true, error: 'NO_ERROR' })
  }
  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    e.preventDefault()
    setState({ ...state, text: e.target.value })
  }
  const submit = () => {
    if (state.text.trim().length === 0) {
      setState({ ...state, error: 'EMPTY_TEXT' })
      return
    }
    if (!validHostname(state.text)) {
      setState({ ...state, error: 'INVALID_URL' })
      return
    }

    onAddManga(state.text, manga)
    handleClose()
  }
  const handleReload = () => {
    onReload(manga)
  }
  let errorText: string | undefined = undefined
  switch (state.error) {
    case 'EMPTY_TEXT':
      errorText = 'Please enter the url of the manga into the text field'
      break
    case 'INVALID_URL':
      errorText = 'Please enter a valid manga url into the text field'
      break
    case 'ALREADY_EXISTS':
      errorText = 'Manga with name already exists'
      break
    case 'EMPTY_CHAPTER':
      errorText = 'Empty chapter (this should not happen in this component)'
      break
    case 'NO_ERROR':
      break
    default:
      throw state.error satisfies never
  }

  let textField = <TextField id="text-field-default" onChange={handleChange} />
  if (errorText !== null) {
    textField = (
      <TextField
        error
        id="text-field-default"
        helperText={errorText}
        onChange={handleChange}
      />
    )
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <IconButton onClick={handleOpen}>
            <NoteAddIcon />
          </IconButton>
          <Typography variant="h6">Manga list</Typography>
          <IconButton onClick={handleReload}>
            <LoopIcon />
          </IconButton>
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
