import React, { PropTypes } from 'react'
import { List, ListItem } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import HeaderContainer from '../containers/HeaderContainer.js'

function mangaComponent (manga) {
  const title = manga.get('title')

  return (
    <div>
      <ListItem
        primaryText={title}
        secondaryText={manga.get('description')}
        leftAvatar={<Avatar src={manga.get('image')} />}
      />
    </div>
  )
}

export default function SomeMangaComponent ({ manga }) {
  let newMangaComponents = []
  let oldMangaComponents = []
  let mangaList = null

  // TODO(DarinM223): make this cleaner ;-;

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
