import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { pushPath as pushState } from 'redux-simple-router'
import { updateDataForRedBook, fetchPlaces } from '../actions'
import { findDOMNode } from 'react-dom'
import RedMapPlace from '../components/RedMapPlace'
import _ from 'lodash'

function fetchPlacesFromServer(noteId, props){
  props.fetchPlaces( noteId );
}


class SingleNotePlacePage extends Component {

  /** 
   * 최초 렌더링시 한번 호출됨.
   */
  componentWillMount(){

    const {note : {places}, entitiyPlaces, params:{noteId}} = this.props;
    let i=0;

    for(; i<places.length; ++i){
      if( !entitiyPlaces[places[i]] ){
        fetchPlacesFromServer(noteId, this.props);
        break;
      }
    } 
  }


  render() {

    const { loginUser, appState, note, entitiyPlaces, 
      params : {placeLabel, noteId}
    } = this.props;


    if( !appState.loadedGoogleSDK ){
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

      <RedMapPlace className="RedMapPlace" 
        loginUser={loginUser}
        mapCenter={mapCenter}
        zoomLevel={16}
        markers={markers}
        isReadOnly={true}
        onUpdateDataForRedBook={this.props.updateDataForRedBook}
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