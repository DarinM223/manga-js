import React, { PropTypes } from 'react'
import AppBar from 'material-ui/AppBar'
import ActionNoteAdd from 'material-ui/svg-icons/action/note-add'
import IconButton from 'material-ui/IconButton'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import { validHostname } from '../../utils/url.js'

const EMPTY_TEXT = 'EMPTY_TEXT'
const INVALID_URL = 'INVALID_URL'
const NO_ERROR = 'NO_ERROR'

export default class HeaderComponent extends React.Component {
  constructor (props) {
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
  }

  render () {
    const actions = [
      <FlatButton
        label='Add manga'
        keyboardFocused={false}
        onTouchTap={this.submit}
      />
    ]

    let errorText = null
    switch (this.state.error) {
      case NO_ERROR:
        errorText = ''
        break
      case EMPTY_TEXT:
        errorText = 'Please enter the url of the manga into the text field'
        break
      case INVALID_URL:
        errorText = 'Please enter a valid manga url into the text field'
        break
    }

    return (
      <div>
        <AppBar
          title='Manga list'
          iconElementRight={<IconButton><ActionNoteAdd /></IconButton>}
          onRightIconButtonTouchTap={this.handleOpen}
        />
        <Dialog
          title='Enter the url of the manga to add'
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div>Paste the url of the manga to add in the text field below:</div>
          <TextField
            id='text-field-default'
            errorText={errorText}
            onChange={this.handleChange}
          />
        </Dialog>
      </div>
    )
  }
}

HeaderComponent.propTypes = {
  manga: PropTypes.object.isRequired,
  onAddManga: PropTypes.func.isRequired
}
