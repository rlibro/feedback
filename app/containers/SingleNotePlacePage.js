import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { pushPath as pushState } from 'redux-simple-router'
import { updateDataForRedBook, fetchPlaces } from '../actions'
import { findDOMNode } from 'react-dom'
import DisplayMap from '../components/DisplayMap'
import _ from 'lodash'

class SingleNotePlacePage extends Component {

  render() {

    const { loginUser, appState, note, entitiyPlaces, 
      params : {placeLabel, noteId}
    } = this.props;


    if( !appState.loadedGoogleSDK ){
      console.log('지도를 로드중입니다...');

      return false;
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


    let markers = [], mapCenter;
    _.each(places, function(place){

      if( place.label === placeLabel ) {
        mapCenter = {
          lat: place.geo.latitude,
          lng: place.geo.longitude
        }
      }

      markers.push({
        key:place.id,
        label: place.label,
        title: place.title,
        position: {
          lat: place.geo.latitude,
          lng: place.geo.longitude
        }
      })
    });

    return <div className="SingleNotePlacePage">

      <DisplayMap className="GoogleMap" 
        loginUser={loginUser}
        mapCenter={mapCenter}
        zoomLevel={16}
        markers={markers}
        isReadOnly={true}
        onUpdateNoteState={this.props.updateDataForRedBook}
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
    entitiyPlaces: places,
    loginUser: login
  }
}

export default connect(mapStateToProps, {
  updateDataForRedBook,
  fetchPlaces
})(SingleNotePlacePage)