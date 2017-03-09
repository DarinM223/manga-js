import React, { PropTypes } from 'react'
import Slider from 'material-ui/Slider'

const styles = {
  slider: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  sliderText: {
    position: 'relative',
    top: '5px'
  }
}

export default function SliderComponent ({ currValue, totalPages, onSliderChanged }) {
  return (
    <div style={styles.slider}>
      <Slider
        style={{ width: '80%' }}
        min={1}
        max={totalPages}
        step={1}
        value={currValue}
        onChange={(event, newValue) => onSliderChanged(newValue)}
      />
      <p style={styles.sliderText}>{currValue}/{totalPages}</p>
    </div>
  )
}

SliderComponent.propTypes = {
  currValue: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onSliderChanged: PropTypes.func.isRequired
}
