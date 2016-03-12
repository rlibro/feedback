import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { updateAppState, findThisKeyWord } from '../actions'
import { findDOMNode } from 'react-dom';

class Explore extends Component {

  constructor(props) {
    super(props);

    let mode = 'none';
    const { routing:{ pathname } } = props;

    switch(pathname){

      case '/':
      mode = 'book';
      break;

      case '/rlibrians':
      mode = 'user';
      break;
    }

    this.state = {
      isKeepTyping: false,
      checkTimer: null,
      mode: mode
    }
  }

  componentWillReceiveProps(nextProps) {
    const { 
      appState: {search: {query}}, 
      routing:{ pathname },      
    } = nextProps;

    let mode = 'none';

    switch(pathname){

      case '/':
      mode = 'book';
      break;

      case '/rlibrians':
      mode = 'user';
      break;
    }

    this.setState({mode: mode});

    if( this.props.appState.search.mode !== mode && query ){
      this.handleFind(query);
    } 
  }

  render() {
    const { appState: { search: { query } }} = this.props;
    const { mode } = this.state;

    if( mode === 'none' ){
      
      return false

    } else {
      
      let placeholder = 'Search Cities or Countries';
      if ( mode === 'user' ) {
        placeholder = 'Search Username or Nationality';
      }

      return <div className="Explore">
        <div className="search-bar">
          <i className="fa icon-search"></i>
          <input ref="input" className="ip-search"
                 placeholder={placeholder}
                 defaultValue={query}
                 onKeyUp={this.handleKeyUp.bind(this)} />
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

  handleFind = (query) => {
    let keyword = query;
    const node = findDOMNode(this.refs.input);
    const { mode } = this.state;

    if( !keyword ) {
      keyword = node.value;
    }

    if( keyword ){
      this.props.findThisKeyWord(keyword, mode);
    } else {
      this.props.updateAppState({
        search: {
          mode: mode,
          query: '',
          result: []
        }
      });
    }

  };
}

Explore.propTypes = {
  appState: PropTypes.object.isRequired,
  routing: PropTypes.object.isRequired,
  updateAppState: PropTypes.func.isRequired,
  findThisKeyWord: PropTypes.func.isRequired
}

function mapStateToProps(state, ownProps) {
  return {
    routing: state.routing.locationBeforeTransitions,
    appState: state.appState
  }
}

export default connect(mapStateToProps, {
  updateAppState, findThisKeyWord
})(Explore)
