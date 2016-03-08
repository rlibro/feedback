import React, { Component, PropTypes } from 'react'

export default class Explore extends Component {

  constructor(props) {
    super(props);

    let mode = 'none';

    switch(props.routing.path){

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
    const { routing : { path } } = nextProps;
    let mode = 'none';

    switch(path){

      case '/':
      mode = 'book';
      break;

      case '/rlibrians':
      mode = 'user';
      break;
    }

    this.setState({mode: mode});

  }

  render() {
    const {routing, appState: { search: { query } }} = this.props;
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

    const { mode } = this.state;

    if( keyword ){
      this.props.onFindThisKeyWord(keyword, mode);
    } else {
      this.props.onUpdateAppState({
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
  onUpdateAppState: PropTypes.func.isRequired,
  onFindThisKeyWord: PropTypes.func.isRequired
}