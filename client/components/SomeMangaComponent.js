import React, { PropTypes } from 'react'
import { List, ListItem } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import Header from './Header.js'

function mangaComponent (manga) {
  const title = `${manga.title} (${manga.currentChapter}/${manga.totalChapters})`
  return (
    <div>
      <ListItem
        primaryText={title}
        secondaryText={manga.description}
        leftAvatar={<Avatar src={manga.image} />}
      />
    </div>
  )
}

export default function SomeMangaComponent ({ manga }) {
  let newMangaComponents = []
  let oldMangaComponents = []
  let mangaList = null

  // TODO(DarinM223): make this cleaner ;-;

  for (const m of manga) {
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
      <Header />
      {mangaList}
    </div>
  )
}

SomeMangaComponent.propTypes = {
  manga: PropTypes.array.isRequired
}
