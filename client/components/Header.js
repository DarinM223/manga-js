import React from 'react'
import AppBar from 'material-ui/AppBar'
import ActionNoteAdd from 'material-ui/svg-icons/action/note-add'
import IconButton from 'material-ui/IconButton'

export default function Header () {
  return (
    <AppBar
      title='Manga list'
      iconElementRight={<IconButton><ActionNoteAdd /></IconButton>}
    />
  )
}
