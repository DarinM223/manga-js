import React from 'react'
import Slider from '@mui/material/Slider'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'

const styles: { slider: React.CSSProperties, pageNumberDisplay: React.CSSProperties, pageNumberEditing: React.CSSProperties } = {
  slider: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  pageNumberDisplay: {
    position: 'relative',
    height: '30px',
    color: 'white'
  },
  pageNumberEditing: {
    display: 'flex',
    width: '70px',
    height: '30px',
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-around',
    opacity: 1
  }
}

const CSSTextField = styled(TextField)({
  input: {
    color: 'white',
    textAlign: 'center',
    maxHeight: '10px'
  }
})

type Props = {
  currValue: number,
  totalPages: number,
  onSliderChanged: (value: number) => void,
}

export default class SliderComponent extends React.Component<Props> {
  state: { editing: boolean, pageText: string }

  constructor(props: Props) {
    super(props)

    this.state = {
      editing: false,
      pageText: ''
    }
  }

  render() {
    const editPages = () => this.setState({ editing: true, pageText: this.props.currValue + '' })
    const pageTextChanged: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
      const num = Number(event.target.value)
      if (event.target.value.length === 0 || (!Number.isNaN(num) && num <= this.props.totalPages && num > 0)) {
        this.setState({ pageText: event.target.value })
      }
    }
    const savePageText = () => {
      if (this.state.pageText.length === 0) {
        this.setState({ pageText: this.props.currValue })
      } else {
        this.props.onSliderChanged(Number(this.state.pageText))
      }

      this.setState({ editing: false })
    }
    const pageTextKeyPress: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
      if (event.key === 'Enter') {
        savePageText()
      }
    }
    const pageLabel = `${this.props.currValue}/${this.props.totalPages}`

    let currPageComponent = null
    if (this.state.editing) {
      currPageComponent = (
        <div style={styles.pageNumberEditing}>
          <CSSTextField
            size='small'
            value={this.state.pageText}
            onChange={pageTextChanged}
            onBlur={savePageText}
            onKeyDown={pageTextKeyPress}
            autoFocus
            style={{ marginRight: '3px' }}
          />
          <p style={{ color: 'white', fontFamily: 'Sans-Serif', marginTop: '6px' }}>
            /{this.props.totalPages}
          </p>
        </div>
      )
    } else {
      currPageComponent = (
        <Chip label={pageLabel} style={styles.pageNumberDisplay} onClick={editPages} />
      )
    }

    return (
      <div style={styles.slider}>
        <Slider
          style={{ width: '80%' }}
          min={1}
          max={this.props.totalPages}
          step={1}
          value={this.props.currValue}
          onChange={(_event, newValue) => this.props.onSliderChanged(newValue)}
        />
        {currPageComponent}
      </div>
    )
  }
}
