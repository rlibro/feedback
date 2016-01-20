import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { pushPath as pushState, replacePath } from 'redux-simple-router'
import { updateDataForRedBook } from '../actions'
import { findDOMNode } from 'react-dom'
import RedMapPlace from '../components/RedMapPlace'
import _ from 'lodash'

class SingleNotePlacePage extends Component {

  render() {

    const {
      places, 
      loginUser, 
      appState, 
      note, 
      params : {placeLabel}
    } = this.props;

    if( !appState.loadedGoogleSDK ){
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
    login
  } = state

  return {
    appState,
    loginUser: login
  }
}

export default connect(mapStateToProps, {
  updateDataForRedBook

})(SingleNotePlacePage)