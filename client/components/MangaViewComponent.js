import React, { PropTypes } from 'react'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import AppBar from 'material-ui/AppBar'
import ActionGetApp from 'material-ui/svg-icons/action/get-app'
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import IconButton from 'material-ui/IconButton'

function chapterComponent (chapter) {
  return (
    <TableRow>
      <TableRowColumn>{chapter.get('name')}</TableRowColumn>
      <TableRowColumn>{chapter.get('date')}</TableRowColumn>
      <TableRowColumn><IconButton><ActionGetApp /></IconButton></TableRowColumn>
    </TableRow>
  )
}

export default function MangaViewComponent ({ manga, name, back }) {
  const specificManga = manga.get(name)

  let chapterComponents = []
  specificManga.get('chapters').forEach((chapter) => {
    chapterComponents.push(chapterComponent(chapter))
  })

  return (
    <div>
      <AppBar
        title={specificManga.get('title')}
        iconElementLeft={<IconButton onClick={back}><NavigationArrowBack /></IconButton>}
      />
      <Table>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Chapter</TableHeaderColumn>
            <TableHeaderColumn>Date</TableHeaderColumn>
            <TableHeaderColumn>Download</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {chapterComponents}
        </TableBody>
      </Table>
    </div>
  )
}

MangaViewComponent.propTypes = {
  manga: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  back: PropTypes.func.isRequired
}
