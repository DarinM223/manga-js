import React, { PropTypes } from 'react'
import { List, ListItem } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import Header from './Header.js'

export default function SomeMangaComponent ({ manga }) {
  const mangaComponents = manga.map((m) => {
    const title = `${m.title} (${m.currentChapter}/${m.totalChapters}) ${m.new ? 'New!' : ''}`
    return (
      <div>
        <ListItem
          primaryText={title}
          secondaryText={m.description}
          leftAvatar={<Avatar src={m.image} />}
        />
      </div>
    )
  })

  return (
    <div>
      <Header />
      <List>
        {mangaComponents}
      </List>
    </div>
  )
}

SomeMangaComponent.propTypes = {
  manga: PropTypes.array.isRequired
}
