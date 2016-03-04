import React, { Component, PropTypes } from 'react'

export default class Explore extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isKeepTyping: false,
      checkTimer: null
    }
  }

  render() {
    const {path, appState: { search: { query } }} = this.props;

    if( path.indexOf('/notes/') > -1){
      
      return false

    } else {
      
      return <div className="Explore">
        <div className="search-bar">
          <i className="fa icon-search"></i>
          <input ref="input" className="ip-search"
                 placeholder="Search Cities or Countries"
                 defaultValue={query}
                 onKeyUp={this.handleKeyUp} />
        </div>
      </div>
    }
    
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
        search: {
          query: '',
          result: []
        }
      });
    }

  };
}

Explore.propTypes = {
  appState: PropTypes.object.isRequired,
  onUpdateAppState: PropTypes.func.isRequired,
  onFindThisKeyWord: PropTypes.func.isRequired
}