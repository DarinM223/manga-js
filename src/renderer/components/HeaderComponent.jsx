import React from 'react'
import AppBar from '@mui/material/AppBar'
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import LoopIcon from '@mui/icons-material/Loop';
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { validHostname } from '../../../utils/url.js'
import { DialogActions, DialogContent, DialogTitle, Toolbar, Typography } from '@mui/material';

const EMPTY_TEXT = 'EMPTY_TEXT'
const INVALID_URL = 'INVALID_URL'
const NO_ERROR = 'NO_ERROR'

export default class HeaderComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      text: '',
      error: NO_ERROR
    }

    this.handleClose = () => {
      this.setState({ open: false, text: '', error: NO_ERROR })
    }
    this.handleOpen = () => {
      this.setState({ open: true, error: NO_ERROR })
    }
    this.handleChange = (e) => {
      e.preventDefault()
      this.setState({ text: e.target.value })
    }
    this.submit = () => {
      if (this.state.text.trim().length === 0) {
        this.setState({ error: EMPTY_TEXT })
        return
      }
      if (!validHostname(this.state.text)) {
        this.setState({ error: INVALID_URL })
        return
      }

      this.props.onAddManga(this.state.text, this.props.manga)
      this.handleClose()
    }
    this.handleReload = () => {
      this.props.onReload(this.props.manga)
    }
  }

  render() {
    let errorText = null
    switch (this.state.error) {
      case EMPTY_TEXT:
        errorText = 'Please enter the url of the manga into the text field'
        break
      case INVALID_URL:
        errorText = 'Please enter a valid manga url into the text field'
        break
    }

    let textField = <TextField id='text-field-default' onChange={this.handleChange} />;
    if (errorText !== null) {
      textField = <TextField error id='text-field-default' helperText={errorText} onChange={this.handleChange} />;
    }

    return (
      <div>
        <AppBar position='static'>
          <Toolbar style={{ justifyContent: 'space-between' }}>
            <IconButton onClick={this.handleOpen}><NoteAddIcon /></IconButton>
            <Typography variant="h6">Manga list</Typography>
            <IconButton onClick={this.handleClose}><LoopIcon /></IconButton>
          </Toolbar>
        </AppBar>
        <Dialog open={this.state.open} onClose={this.handleClose}>
          <DialogTitle>Enter the url of the manga to add</DialogTitle>
          <DialogContent>
            <div>Paste the url of the manga to add in the text field below:</div>
            {textField}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.submit}>Add manga</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}