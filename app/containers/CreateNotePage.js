import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { pushPath as pushState } from 'redux-simple-router'
import { addNote, resetAddNote, addPlace, updatePlace, deletePlace, updateNoteState } from '../actions'
import { findDOMNode } from 'react-dom'
import _ from 'lodash'
import ControlMap from '../components/ControlMap'
import RedBookNoteForm from '../components/RedBookNoteForm'

class CreateNotePage extends Component {

  render() {

    const { appState, noteState, loginUser, redBook } = this.props;
    
    return <div className="CreateNotePage Page">
      <div className="button-close">
        <i className="fa icon-cancel" onClick={this.hanldeClose}/>
      </div>

      <RedBookNoteForm 
        appState={appState}
        loginUser={loginUser}
        noteState={noteState}
        onUpdateNoteState={this.props.updateNoteState}
        onAddNote={this.handleAddNote.bind(null, redBook.id)} 
        onAddNoteDone={this.handleAddNoteDone}
      />

      {this.renderControlMap()}
    </div>
  }

  renderControlMap = () => {
    const { loginUser, redBook, noteState: {openMap, places} } = this.props;
    
  
    if( openMap ) {

      let markers = [];
      _.each(places, function(place){
        let marker = {
          key: place.key,
          canEdit: true,
          label: place.label,
          title: place.title,
          position: place.position
        };

        if( place.showInfo ){
          marker.showInfo = place.showInfo;
        }

        if( place.isEditing ) {
          marker.isEditing = place.isEditing;
        }

        markers.push(marker)
      });

      return <ControlMap className="GoogleMap" 
        loginUser={loginUser}
        mapCenter={{
          lat: redBook.geo.latitude,
          lng: redBook.geo.longitude
        }}
        markers = {markers}
        disableMoveCenter={true}
        onAddPlace={this.handleAddPlace}
        onUpdateNoteState={this.props.updateNoteState}

      />
    } else {
      return false;
    }
  };

  handleAddNote = (redBookId, noteText, places) => {
    
    let placeIds = [];

     // 첨부된 최종 위치를 확인해서 새로운 것은 추가하고, 삭제된 녀석을 뽑아낸다. 
    _.each(places, function(place){
      placeIds.push(place.key);
    }.bind(this));

    this.props.addNote(redBookId, noteText, placeIds, places); 
  };

  handleAddNoteDone = () => {
    this.props.resetAddNote();
    this.hanldeClose();
  };

  handleAddPlace = (marker) => {
    const {loginUser, noteState: {editingId}} = this.props;
    this.props.addPlace(marker.key, loginUser.id, editingId, marker.title, marker.label, {lat: marker.position.lat, lng: marker.position.lng});
  };

  hanldeClose = () => {
    this.props.pushState(`/guide/${this.props.params.uname}`)
  };
}

CreateNotePage.propTypes = {
  noteState: PropTypes.object.isRequired,
  pushState: PropTypes.func.isRequired,
  addPlace: PropTypes.func.isRequired
}


function mapStateToProps(state) {
  const {
    pagination: { placesByRedBookId },
  } = state


  return {
    appState: state.appState,
    noteState: state.noteState,
    loginUser: state.login,
    pagingPlacesByRedBookId: placesByRedBookId,
  }
}

export default connect(mapStateToProps, {
  updateNoteState,
  pushState,
  addNote,
  addPlace,
  updatePlace,
  deletePlace,
  resetAddNote
})(CreateNotePage)