import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { pushPath as pushState } from 'redux-simple-router'
import { updateNoteState, fetchPlaces } from '../actions'
import { findDOMNode } from 'react-dom'
import DisplayMap from '../components/DisplayMap'
import _ from 'lodash'

class SingleNotePlacePage extends Component {

  render() {

    const { loginUser, appState, note, entitiyPlaces, 
      params : {placeId, noteId}, routing
    } = this.props;


    if( !appState.loadedGoogleSDK ){
      
      return <div className="map-loading">
        <div className="loading">
          <p><i className="fa fa-spinner fa-pulse"></i> Now loading map, <br/>please wait a moment</p>
        </div>
      </div>;
    }


    let places = [], isValidPlaces = true, i=0;

    for(; i<note.places.length; ++i){

      const place = entitiyPlaces[note.places[i]];
      if( place ){
        places.push( place );               
      } else {
        isValidPlaces = false;
        break;
      }
    }

    if( !isValidPlaces ){
      return false;
    }


    let markers = [], mapCenter, centerMarkerId;
    _.each(places, function(place){
      if( place.id === placeId ) {
        mapCenter = {
          lat: place.geo.latitude,
          lng: place.geo.longitude
        }
        centerMarkerId = placeId
      }

      markers.push({
        key:place.id,
        label: place.label,
        title: place.title,
        position: {
          lat: place.geo.latitude,
          lng: place.geo.longitude
        },
        note: place.note
      })
    });

    return <div className="SingleNotePlacePage">

      <DisplayMap className="GoogleMap" 
        loginUser={loginUser}
        mapCenter={mapCenter}
        zoomLevel={16}
        markers={markers}
        centerMarkerId={centerMarkerId}
        isReadOnly={true}
        hideMarkerNoteLink={true}
        referer= {routing.path}
        onPushState={this.props.pushState}
        onUpdateNoteState={this.props.updateNoteState}
      />

    </div>
  }
}

SingleNotePlacePage.propTypes = {
}


function mapStateToProps(state) {
  const {
    appState,
    login,
    entities: { places }
  } = state

  return {
    appState,
    routing: state.routing,
    entitiyPlaces: places,
    loginUser: login
  }
}

export default connect(mapStateToProps, {
  updateNoteState,
  fetchPlaces,
  pushState
})(SingleNotePlacePage)