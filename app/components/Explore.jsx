import React, { Component, PropTypes } from 'react'

export default class Explore extends Component {

  constructor(props){
    super(props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setInputValue(nextProps.value)
    }
  }

  getInputValue() {
    return this.refs.input.value
  }

  setInputValue(val) {
    // Generally mutating DOM is a bad idea in React components,
    // but doing this for a single uncontrolled field is less fuss
    // than making it controlled and maintaining a state for it.
    this.refs.input.value = val
  }

  render() {
    return (
      <div className="Explore">
        <div className="search-bar">
          <input ref="input"
                 placeholder="Countries, Cites, Friends "
                 defaultValue={this.props.value}
                 onKeyUp={this.handleKeyUp} />
          <button onClick={this.handleGoClick}>
            Find!
          </button>
        </div>
      </div>
    )
  }

  handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      this.handleGoClick()
    }
  }

  handleGoClick = () => {
    this.props.onChange(this.getInputValue())
  }
}

Explore.propTypes = {
  value: PropTypes.string.isRequired
}