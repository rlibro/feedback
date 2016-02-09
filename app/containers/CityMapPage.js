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
    props.fetchPlaces( redBook.id ) 
  }

}

class CityMapPage extends Component {

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

    const { appState:{loadedGoogleSDK}, loginUser, redBook } = this.props;
    
    if( !loadedGoogleSDK ){

      console.log('Google SDK need loaded.')
      return false;
    }

    let markers = [];

    return <div className="CityMapPage Page">

      <DisplayMap className="GoogleMap" 
        loginUser={loginUser}
        mapCenter={{
          lat: redBook.geo.latitude,
          lng: redBook.geo.longitude
        }}
        markers = {markers}
        disableMoveCenter={true}
        onUpdateDataForRedBook={this.hanldeCloseMap}
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
    pagingPlacesByRedBookId: placesByRedBookId,
  }
}

export default connect(mapStateToProps, {
  updateDataForRedBook,
  pushState,
  fetchPlaces
})(CityMapPage)