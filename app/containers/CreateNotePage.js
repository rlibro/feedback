import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { pushPath as pushState } from 'redux-simple-router'
import { addNote, resetAddNote, updateDataForRedBook } from '../actions'
import { findDOMNode } from 'react-dom'
import _ from 'lodash'
import ControlMap from '../components/ControlMap'
import RedBookNoteForm from '../components/RedBookNoteForm'

class CreateNotePage extends Component {

  render() {

    const { appState, pageForRedBook, loginUser, redBook } = this.props;
    
    return <div className="CreateNotePage Page">
      <div className="button-close">
        <i className="fa icon-cancel" onClick={this.hanldeClose}/>
      </div>

      <RedBookNoteForm 
        appState={appState}
        loginUser={loginUser}
        pageForRedBook={pageForRedBook}
        onUpdateDataForRedBook={this.props.updateDataForRedBook}
        onAddNote={this.handleAddNote.bind(null, redBook.id)} 
        onAddNoteDone={this.handleAddNoteDone}
      />

      {this.renderCoverOrMap()}
    </div>
  }

  renderCoverOrMap = () => {
    const { loginUser, redBook, pageForRedBook, entities } = this.props;
    const { formMode, places } = pageForRedBook;
  
    if( formMode === 'NOTE') {
      return false
    }

    if( formMode === 'PLACE') {

      let markers = [];
      _.each(places, function(place){

        markers.push({
          key: place.key,
          canEdit: true,
          label: place.label,
          title: place.title,
          position: place.position
        })
      });

      return <ControlMap className="GoogleMap" 
        loginUser={loginUser}
        mapCenter={{
          lat: redBook.geo.latitude,
          lng: redBook.geo.longitude
        }}
        markers = {markers}
        disableMoveCenter={true}
        onUpdateDataForRedBook={this.props.updateDataForRedBook}

      />
    }

  };

  handleAddNote = (redBookId, formMode, noteText, places) => {
    this.props.addNote(redBookId, noteText, places);

    if( formMode === 'PLACE') {
      this.props.updateDataForRedBook({
        places: []
      });
    }  
  };

  handleAddNoteDone = () => {
    this.props.resetAddNote();
    this.hanldeClose();
  };

  hanldeClose = () => {
    this.props.pushState(`/guide/${this.props.params.uname}`)
  };
}

CreateNotePage.propTypes = {
  pushState: PropTypes.func.isRequired,
}


function mapStateToProps(state) {
  const {
    pagination: { placesByRedBookId },
  } = state


  return {
    appState: state.appState,
    pageForRedBook: state.pageForRedBook,
    loginUser: state.login,
    pagingPlacesByRedBookId: placesByRedBookId,
  }
}

export default connect(mapStateToProps, {
  updateDataForRedBook,
  pushState,
  addNote,
  resetAddNote
})(CreateNotePage)