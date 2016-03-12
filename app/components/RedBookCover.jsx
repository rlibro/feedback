import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { updateNoteState } from '../actions'

class RedBookCover extends Component {

  /**
   * 사용자 위치 정보가 확인된 경우에만 다시 그림
   */
  shouldComponentUpdate(nextProps, nextState) {
    const { redBook, loginUser } = nextProps;

    if( loginUser && loginUser.current_location ) {
      return true;
    }
    return false;
  }

  render(){

    const { redBook } = this.props;
    const style = {
      color: 'white',
      backgroundSize: 'cover',
      backgroundImage: 'url(' + redBook.coverImage + ')',
      WebkitTransition: 'all', // note the capital 'W' here
      msTransition: 'all' // 'ms' is the only lowercase vendor prefix
    };

    return <div style={style} className="RedBookCover">
      <div className="shadow"></div>
      <div className="cover-title-header">  
        <h2 className="city-name">{redBook.cityName}</h2>
        <h4 className="country-name">{redBook.countryName}</h4>        
      </div>
      <div className="button-close">
        <i className="fa fa-times" onClick={this.handleCloseRedBook}/>
      </div>
      {this.renderButtons()}
    </div>
  }

  renderButtons = () => {

    const { loginUser } = this.props;

    if( loginUser && loginUser.id ) {
    
      return <div className="controls">
        <button onClick={this.handleCityMap}><i className="fa icon-map" /> Map</button>
        <button onClick={this.handleCityPeople}><i className="fa icon-people" /> People</button>
        <button onClick={this.handleNewNote}><i className="fa icon-add-note" /> Note</button>
      </div>
    
    } else {

      return <div className="controls">
        <button onClick={this.handleCityMap}><i className="fa icon-map" /> Map</button>
        <button className="disabled"><i className="fa icon-people" /> People</button>
        <button className="disabled"><i className="fa icon-add-note" /> Note</button>
      </div>

    }

  };

  handleCityMap = (e) => {
    const {redBook} = this.props;
    browserHistory.push(`/guide/${redBook.uname}/map`);
  };

  handleCityPeople = (e) => {
    const {redBook} = this.props;
    browserHistory.push(`/guide/${redBook.uname}/people`);
  };

  handleNewNote = (e) => {
    const {redBook, noteState:{editingId}} = this.props;

    if( editingId ) {
      alert('please complete your editing note');

    } else {
      browserHistory.push(`/guide/${redBook.uname}/create`);
    }
  };

  handleCloseRedBook = (e) => {
    const { noteState } = this.props;

    if( noteState.editingId ) {
      return alert('you are editing a note!');
    }

    this.props.updateNoteState({ places: [] });
    browserHistory.replace('/');
  };

}

RedBookCover.propTypes = {
  loginUser: PropTypes.object.isRequired,
  noteState: PropTypes.object.isRequired,

  // 외부 주입
  redBook: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    loginUser: state.login,
    noteState: state.noteState,
  }
}

export default connect(mapStateToProps, {
  updateNoteState
})(RedBookCover)
