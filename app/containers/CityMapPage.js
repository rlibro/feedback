import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { pushPath as pushState, replacePath } from 'redux-simple-router'
import { fetchPlaces, updateDataForRedBook } from '../actions'
import { findDOMNode } from 'react-dom'
import _ from 'lodash'
import DisplayMap from '../components/DisplayMap'


function fetchPlacesFromServer(props){

  const { redBook } = props

  if( redBook ){
    props.fetchPlaces( {redBookId: redBook.id}) 
  }

}

class CityMapPage extends Component {

  constructor(props){
    super(props);

    this.state = {
      sharedPlaces : {isFetching:true, ids:[]}
    }
  }

  /**
   * 최소에 한번만 호출된다. 
   * 서버에서 현재 이곳에 있는 사람들 정보를 긁어와야한다.
   */ 
  componentWillMount(){
    fetchPlacesFromServer(this.props);
  }

  componentWillReceiveProps(nextProps) {

    const { redBook:{id}, pagingPlacesByRedBookId } = nextProps;

    this.setState({
      sharedPlaces: pagingPlacesByRedBookId[id]
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { appState:{loadedGoogleSDK} } = nextProps;

    return loadedGoogleSDK;
  }

  render() {

    const { appState:{loadedGoogleSDK}, loginUser, redBook, entities:{places} } = this.props;
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
          }
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
        markers = {markers}
        disableMoveCenter={true}
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
    pagingPlacesByRedBookId: placesByRedBookId,
  }
}

export default connect(mapStateToProps, {
  updateDataForRedBook,
  pushState,
  fetchPlaces
})(CityMapPage)