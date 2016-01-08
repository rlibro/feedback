import React, { Component, PropTypes } from 'react'

export default class Explore extends Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setInputValue(nextProps.value)
    }
  }

  setInputValue(val) {
    this.refs.input.value = val
  }

  render() {
    return <div className="Explore">
      <div className="search-bar">
        <input ref="input"
               placeholder="Countries, Cites, Friends "
               defaultValue={this.props.value}
               onKeyUp={this.handleKeyUp} />
        <button onClick={this.handleFind}>
          Find!
        </button>
      </div>
    </div>
    
  }

  handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      this.handleFind()
    }
  };

  handleFind = () => {
    var keyword = this.refs.input.value;

    this.props.onFindThisKeyWord(keyword);

    console.log('TODO: Serach with Keyword - ', keyword);
  };
}

Explore.propTypes = {
  onFindThisKeyWord: PropTypes.func.isRequired
}