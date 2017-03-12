import React, { PropTypes } from 'react'
import Slider from 'material-ui/Slider'
import Chip from 'material-ui/Chip'
import TextField from 'material-ui/TextField'

const styles = {
  slider: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  pageNumberDisplay: {
    position: 'relative',
    top: '18px',
    height: '30px'
  },
  pageNumberEditing: {
    display: 'flex',
    width: '10%',
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
}

export default class SliderComponent extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      editing: false,
      pageText: ''
    }
  }

  render () {
    const editPages = () => this.setState({ editing: true, pageText: this.props.currValue + '' })
    const pageTextChanged = (event, newValue) => {
      const num = parseInt(newValue, 10)
      if (newValue.length === 0 || (!isNaN(num) && num <= this.props.totalPages && num > 0)) {
        this.setState({ pageText: newValue })
      }
    }
    const savePageText = () => {
      if (this.state.pageText.length === 0) {
        this.setState({ pageText: this.props.currValue })
      } else {
        this.props.onSliderChanged(parseInt(this.state.pageText, 10))
      }

      this.setState({ editing: false })
    }
    const pageTextKeyPress = (event) => {
      if (event.key === 'Enter') {
        savePageText()
      }
    }
    const pageLabel = `${this.props.currValue}/${this.props.totalPages}`

    let currPageComponent = null
    if (this.state.editing) {
      currPageComponent = (
        <div style={styles.pageNumberEditing}>
          <TextField
            value={this.state.pageText}
            onChange={pageTextChanged}
            onBlur={savePageText}
            onKeyPress={pageTextKeyPress}
            autoFocus
          />
          <p>/{this.props.totalPages}</p>
        </div>
      )
    } else {
      currPageComponent = (
        <Chip
          style={styles.pageNumberDisplay}
          onTouchTap={editPages}
        >
          {pageLabel}
        </Chip>
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
          onChange={(event, newValue) => this.props.onSliderChanged(newValue)}
        />
        {currPageComponent}
      </div>
    )
  }
}

SliderComponent.propTypes = {
  currValue: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onSliderChanged: PropTypes.func.isRequired
}
