import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { pushPath as pushState, replacePath } from 'redux-simple-router'
import { fetchPlaces, updateDataForRedBook } from '../actions'
import { findDOMNode } from 'react-dom'
import _ from 'lodash'
import DisplayMap from '../components/DisplayMap'

class CityMapPage extends Component {

  constructor(props){
    super(props);

    const { redBook:{id}, pagingPlacesByRedBookId } = props;

    this.state = {
      sharedPlaces : pagingPlacesByRedBookId[id]
    }
  }

  componentWillReceiveProps(nextProps) {

    const { redBook:{id}, pagingPlacesByRedBookId } = nextProps;

    this.setState({
      sharedPlaces: pagingPlacesByRedBookId[id]
    });
  }


  render() {

    const { appState:{loadedGoogleSDK}, 
            loginUser, redBook, routing,
            entities:{places} } = this.props;
    const { sharedPlaces } = this.state;
    
    if( !loadedGoogleSDK ){

      console.log('Google SDK need loaded.')
      return false;
    }

    if( sharedPlaces.isFetching  ) {
      return false;
    }

    let markers = [];

    if( sharedPlaces.ids.length ) {
      sharedPlaces.ids.forEach(function(id){
        let place = places[id];

        markers.push({
          key:place.id,
          title: place.title,
          position: {
            lat: place.geo.latitude,
            lng: place.geo.longitude
          },
          note: place.note
        })
      });
    }

    return <div className="CityMapPage Page">

      <DisplayMap className="GoogleMap" 
        loginUser={loginUser}
        mapCenter={{
          lat: redBook.geo.latitude,
          lng: redBook.geo.longitude
        }}
        referer= {routing.path}
        markers = {markers}
        onPushState={this.props.pushState}
        onUpdateNoteState={this.hanldeCloseMap}
      />
    </div>
  }

  hanldeCloseMap = () => {
    this.props.pushState(`/guide/${this.props.params.uname}`)
  };
}

CityMapPage.propTypes = {
  pushState: PropTypes.func.isRequired,
}


function mapStateToProps(state) {
  const {
    pagination: { placesByRedBookId },
  } = state


  return {
    appState: state.appState,
    loginUser: state.login,
    entities: state.entities,
    routing: state.routing,
    pagingPlacesByRedBookId: placesByRedBookId,
  }
}

export default connect(mapStateToProps, {
  updateDataForRedBook,
  pushState,
  fetchPlaces
})(CityMapPage)