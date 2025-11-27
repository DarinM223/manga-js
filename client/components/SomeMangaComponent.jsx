import React, { PropTypes } from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader'
import Divider from '@mui/material/Divider'
import HeaderContainer from '../containers/HeaderContainer.js'
import { Link } from 'react-router-dom'
import ImageComponent from './ImageComponent.jsx'

function mangaComponent (manga) {
  const title = manga.get('title')
  const type = `http://${manga.get('type')}`
  const avatar = true

  return (
    <Link to={'/manga/' + manga.get('name')} style={{ textDecoration: 'none' }}>
      <ListItem
        primaryText={title}
        secondaryText={manga.get('description')}
        leftAvatar={<ImageComponent src={manga.get('image')} type={type} avatar={avatar} />}
      />
    </Link>
  )
}

export default function SomeMangaComponent ({ manga }) {
  let newMangaComponents = []
  let oldMangaComponents = []
  let mangaList = null

  for (const name of manga.keys()) {
    const m = manga.get(name)
    const component = mangaComponent(m)
    if (m.get('new')) {
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
      <HeaderContainer />
      {mangaList}
    </div>
  )
}

SomeMangaComponent.propTypes = {
  manga: PropTypes.object.isRequired
}
