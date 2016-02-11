import React, { Component, PropTypes } from 'react';
import {default as update} from 'react-addons-update';
import {GoogleMapLoader, GoogleMap, Marker, InfoWindow, Circle, SearchBox} from 'react-google-maps';
import {triggerEvent} from 'react-google-maps/lib/utils';

/*
 * This is the modify version of:
 * https://developers.google.com/maps/documentation/javascript/examples/event-arguments
 *
 * Loaded using async loader.
 */
export default class DisplayMap extends Component {

  static version = Math.ceil(Math.random() * 22);

  constructor(props){
    super(props);

    this.state = {
      markers: props.markers.concat()
    };
  }

  render () {
    return <div className="DisplayMap Map">
      {this.renderMapButtons()}
      <GoogleMapLoader
        containerElement={ <div {...this.props} />}
        googleMapElement={this.renderGoogleMap()}
      />
    </div>
  };

  renderMapButtons = () => {
    const { isReadOnly, loginUser } = this.props;
    const { isExpanded } = this.state;
    if( isReadOnly ){
      return false;
    }

    return <div className="btn-groups">
      <div className="map-btn close">
        <i className="fa fa-times" onClick={this.handleClosePlaceMap}/>
      </div>  
 {/*     <div className="map-btn marker-add">
        <i className="fa icon-pin" onClick={this.handleToggleMarker}/>
      </div>*/}
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
    const { isReadOnly, loginUser, disableMoveCenter } = this.props;
    const { markers } = this.state;
    let { zoomLevel = 13, mapCenter } = this.props;

    const defaultOptions = {
      mapTypeControl: true,
      streetViewControl: true,
      scrollwheel: true,
      disableDoubleClickZoom: false
    };

    if( !isReadOnly ){
      defaultOptions.mapTypeControl = false;
    }

    let finalMapOptions = {
      ref: function (map){ this._googleMapComponent = map }.bind(this),
      defaultOptions: defaultOptions,
      defaultZoom: zoomLevel,
      defaultCenter: mapCenter,
      zoom: zoomLevel,
      center: mapCenter
    }

    if( disableMoveCenter ){
      delete finalMapOptions.zoom;
      delete finalMapOptions.center;   
    }

    return <GoogleMap { ...finalMapOptions}>
      {this.renderMarkers()}
    </GoogleMap>
  };

  renderMarkers = () => {

    const { isReadOnly } = this.props;
    const { markers } = this.state;
    //var bounds = new google.maps.LatLngBounds();
    var markerArray = [];

    markers.forEach((marker, index) => {
      const ref = `marker_${index}`;

      //bounds.extend(new google.maps.LatLng(marker.position));
      markerArray.push(<Marker key={ref} ref={ref}
        {...marker}
        title={(index+1).toString()}
        onClick={this.handleMarkerClick.bind(this, marker)} >
        {marker.showInfo ? this.renderInfoWindow(ref, marker) : null}
      </Marker>);
      
    });
    
    // FitBound 
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
    this.setState(this.state);
  };

  handleCloseclick = (marker) => {
    marker.showInfo = false;
    this.setState(this.state);
  };

  handleToggleMarker = () => {
    this.setState({
      isMarkerMode: !this.state.isMarkerMode,
      moveToCenter: false
    });
  };

  handleMoveCenterToCurrentUser = () => {
    const { loginUser } = this.props;
    const {usedUserLocation} = this.state;
    
    if( !usedUserLocation ) {
      this.setState({
        usedUserLocation: true,
        moveToCenter:  true
      });
    } else{
      this.setState({
        usedUserLocation: false,
        moveToCenter:  false
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