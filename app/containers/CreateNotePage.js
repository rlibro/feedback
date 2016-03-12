import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import _ from 'lodash'
import ControlMap from '../components/ControlMap'
import RedBookNoteForm from '../components/RedBookNoteForm'

class CreateNotePage extends Component {

  render() {

    const { noteState, loginUser, redBook } = this.props;
    
    return <div className="CreateNotePage Page">
      <div className="button-close">
        <i className="fa icon-cancel" onClick={this.hanldeClose}/>
      </div>

      <RedBookNoteForm 
        redBookId={redBook.id}
        onClose={this.hanldeClose}
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
        mapCenter={{
          lat: redBook.geo.latitude,
          lng: redBook.geo.longitude
        }}
        markers = {markers}
        disableMoveCenter={true}
      />
    } else {
      return false;
    }
  };

  hanldeClose = () => {
    browserHistory.push(`/guide/${this.props.params.uname}`)
  };
}

CreateNotePage.propTypes = {
  loginUser: PropTypes.object.isRequired,
  noteState: PropTypes.object.isRequired,
  redBook: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    loginUser: state.login,
    noteState: state.noteState
  }
}

export default connect(mapStateToProps, {
})(CreateNotePage)