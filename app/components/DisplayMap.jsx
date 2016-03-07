import React, { Component, PropTypes } from 'react';
import {default as update} from 'react-addons-update';
import {GoogleMapLoader, GoogleMap, Marker, InfoWindow, Circle, SearchBox} from 'react-google-maps';


/**
 * 뷰 전용 맵
 *
 * @depends SingleNotePlacePage
 */
export default class DisplayMap extends Component {

  static version = Math.ceil(Math.random() * 22);

  constructor(props){
    super(props);

    this.state = {
      markers: props.markers.concat(),
      usedUserLocation: false,
      moveToCenter: true
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({moveToCenter: true})
  }

  render () {
    const { usedUserLocation } = this.state;
    let klassName = 'DisplayMap Map';

    if( usedUserLocation ){
      klassName += ' user-loaction-on'
    }

    return <div className={klassName}>
      {this.renderMapButtons()}
      <GoogleMapLoader
        containerElement={ <div {...this.props} />}
        googleMapElement={this.renderGoogleMap()}
      />
    </div>
  }

  /**
   * 읽기 전용맵 일경우 지도 닫기 버튼이 없다. 
   * 
   * SingleNotePlacePage의 경우가 readOnly
   */
  renderMapButtons = () => {
    const { isReadOnly, loginUser } = this.props;
   
    return <div className="btn-groups">
      {function(){
        if (!isReadOnly){
          return <div className="map-btn close">
            <i className="fa fa-times" onClick={this.handleClosePlaceMap}/>
          </div>  
        }
      }.bind(this)()}
      
      {function(){
        if( loginUser.current_location ){
          return <div className="map-btn current-location">
            <i className="fa icon-current" onClick={this.handleMoveCenterToCurrentUser}/>
          </div>
        } else{
          return false;
        }
      }.bind(this)()}

      
    </div>
  };

  renderGoogleMap = () => {
    const { isReadOnly, loginUser } = this.props;
    const { markers, usedUserLocation, moveToCenter } = this.state;
    let { zoomLevel = 13, mapCenter } = this.props;
    let userLocationMarkups = [];

    const defaultOptions = {
      mapTypeControl: true,
      streetViewControl: true,
      scrollwheel: true,
      disableDoubleClickZoom: false
    };

    if( !isReadOnly ){
      defaultOptions.mapTypeControl = false;
    }

    // 사용자 위치를 사용할 경우 사용자 위치로 중심을 이동시킨다. 
    if( usedUserLocation ){
      zoomLevel = 17;
      mapCenter = loginUser.current_location.latlng;
      userLocationMarkups = userLocationMarkups.concat([
        (<Circle key="circle" center={mapCenter} clickable={false} radius={50} 
          options={{
            fillColor: 'blue',
            fillOpacity: 0.2,
            strokeColor: 'blue',
            strokeOpacity: 0.8,
            strokeWeight: 0.5,
          }} />),
      ]);
  
    }

    let finalMapOptions = {
      ref: function (map){ this._googleMapComponent = map }.bind(this),
      defaultOptions: defaultOptions,
      defaultZoom: zoomLevel,
      defaultCenter: mapCenter,
      zoom: zoomLevel,
      center: mapCenter
    }

    if( !moveToCenter ){
      delete finalMapOptions.zoom;
      delete finalMapOptions.center;   
    }

    return <GoogleMap { ...finalMapOptions}>
      {this.renderMarkers()}
      {userLocationMarkups}
    </GoogleMap>
  };

  renderMarkers = () => {

    const { isReadOnly, centerMarkerId } = this.props;
    const { markers, moveToCenter } = this.state;
    var markerArray = [];

    markers.forEach((marker, index) => {
      const ref = `marker_${index}`;

      if( moveToCenter ){
        if( centerMarkerId === marker.key ) {
          marker.showInfo = true;
        } else {
          marker.showInfo = false;
        }
      }

      //bounds.extend(new google.maps.LatLng(marker.position));
      markerArray.push(<Marker key={ref} ref={ref}
        {...marker}
        title={(index+1).toString()}
        onClick={this.handleMarkerClick.bind(this, marker)} >
        {marker.showInfo ? this.renderInfoWindow(ref, marker) : null}
      </Marker>);
      
    });
    
    //FitBound 
    // var bounds = new google.maps.LatLngBounds();
    // console.log('bounds ==> ', bounds);
    // setTimeout(function(bounds){
    //   console.log('panToBounds', bounds, this._googleMapComponent.fitBounds);
    //   this._googleMapComponent.fitBounds(bounds);
    // }.bind(this, bounds), 1000)

    return markerArray;
  };

  renderInfoWindow = (ref, marker) => {

    const { isReadOnly } = this.props;
    
    let InfoContent = <div id={marker.key} className="infoWindow">
      <i className="fa fa-pencil-square-o" /> {marker.title}
    </div>;

    if( isReadOnly || !marker.canEdit ) {
      InfoContent = <div id={marker.key} className="infoWindow">{marker.title}</div>;
    }

    return (
      <InfoWindow key={`${ref}_info_window`}
        onCloseclick={this.handleCloseclick.bind(this, marker)}>{InfoContent}
      </InfoWindow>
    )    
  };

  handleMarkerClick = (marker) => {
    marker.showInfo = !marker.showInfo;
    this.setState({
      moveToCenter : false
    });
  };

  handleCloseclick = (marker) => {
    marker.showInfo = false;
  };

  handleToggleMarker = () => {
    this.setState({
      isMarkerMode: !this.state.isMarkerMode
    });
  };

  handleMoveCenterToCurrentUser = () => {
    const { loginUser } = this.props;
    const { usedUserLocation } = this.state;
    
    if( !usedUserLocation ) {
      this.setState({
        usedUserLocation: true,
        moveToCenter: true
      });
    } else{
      this.setState({
        usedUserLocation: false,
        moveToCenter: false
      });
    }
  };

  handleClosePlaceMap = () => {
    this.props.onUpdateNoteState({
      openMap: false
    })
  };
}

DisplayMap.propTypes = {
  loginUser: PropTypes.object.isRequired,
  mapCenter : PropTypes.shape({
    lat: React.PropTypes.number,
    lng: React.PropTypes.number
  }),
  onUpdateNoteState: PropTypes.func.isRequired
}