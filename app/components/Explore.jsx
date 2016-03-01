import React, { Component, PropTypes } from 'react'

export default class Explore extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isKeepTyping: false,
      checkTimer: null
    }
  }

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
               placeholder="Search Cites & Countries"
               defaultValue={this.props.value}
               onKeyUp={this.handleKeyUp} />
        <button onClick={this.handleFind}><i className="fa icon-search"></i>
        </button>
      </div>
    </div>
    
  }

  handleKeyUp = (e) => {

    if( this.state.checkTimer ){
      clearTimeout(this.state.checkTimer);
    }

    let timer = setTimeout(function(){
      this.handleFind()
    }.bind(this), 500);
    this.setState({checkTimer: timer});

        
  };

  handleFind = () => {
    var keyword = this.refs.input.value;

    if( keyword ){
      this.props.onFindThisKeyWord(keyword);
    } else {
      this.props.onUpdateAppState({
        search: {result: []}
      });
    }

  };
}

Explore.propTypes = {
  onUpdateAppState: PropTypes.func.isRequired,
  onFindThisKeyWord: PropTypes.func.isRequired
}