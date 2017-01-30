import React, { PropTypes } from 'react'
import { List, ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import HeaderContainer from '../containers/HeaderContainer.js'
import { Link } from 'react-router'
import ImageComponent from './ImageComponent.js'

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
        <Subheader>Manga</Subheader>
        {oldMangaComponents}
      </List>
    )
  } else {
    mangaList = (
      <div>
        <List>
          <Subheader>Recently updated manga</Subheader>
          {newMangaComponents}
        </List>
        <Divider />
        <List>
          <Subheader>Manga</Subheader>
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
