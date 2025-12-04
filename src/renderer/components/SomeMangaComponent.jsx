import React from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader'
import Divider from '@mui/material/Divider'
import HeaderComponent from './HeaderComponent.jsx'
import { Link } from 'react-router-dom'
import ImageComponent from './ImageComponent.jsx'

function mangaComponent(manga) {
  const type = `http://${manga.type}`
  const avatar = true

  return (
    <Link key={manga.type + manga.name} to={'/manga/' + manga.name} style={{ textDecoration: 'none' }}>
      <ListItem>
        <ListItemAvatar>
          <ImageComponent src={manga.image} type={type} avatar={avatar} />
        </ListItemAvatar>
        <ListItemText primary={manga.title} secondary={manga.description} />
      </ListItem>
    </Link>
  )
}

export default function SomeMangaComponent({ manga }) {
  let newMangaComponents = []
  let oldMangaComponents = []
  let mangaList = null

  for (const name in manga) {
    const m = manga[name]
    const component = mangaComponent(m)
    if (m.new) {
      newMangaComponents.push(component)
    } else {
      oldMangaComponents.push(component)
    }
  }

  if (newMangaComponents.length === 0) {
    mangaList = (
      <List>
        <ListSubheader>Manga</ListSubheader>
        {oldMangaComponents}
      </List>
    )
  } else {
    mangaList = (
      <div>
        <List>
          <ListSubheader>Recently updated manga</ListSubheader>
          {newMangaComponents}
        </List>
        <Divider />
        <List>
          <ListSubheader>Manga</ListSubheader>
          {oldMangaComponents}
        </List>
      </div>
    )
  }

  return (
    <div>
      <HeaderComponent />
      {mangaList}
    </div>
  )
}