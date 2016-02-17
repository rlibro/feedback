import React, { Component, PropTypes } from 'react';
import {default as update} from 'react-addons-update';
import {GoogleMapLoader, GoogleMap, Marker, InfoWindow, Circle, SearchBox} from 'react-google-maps';
import {triggerEvent} from 'react-google-maps/lib/utils';
import _ from 'lodash'

/*
 * This is the modify version of:
 * https://developers.google.com/maps/documentation/javascript/examples/event-arguments
 *
 * Loaded using async loader.
 */
export default class ControlMap extends Component {

  static version = Math.ceil(Math.random() * 22);

  constructor(props){
    super(props);

    this.state = {
      moveToCenter: false,
      usedUserLocation: false,
      isMarkerMode: false,
      markers: props.markers.concat()
    };
  }

  componentWillReceiveProps(nextProps) {

    this.setState({
      markers: nextProps.markers.concat()
    });
  }


  render () {
    const { isExpanded, isMarkerMode, usedUserLocation } = this.state;
    let klassName = 'AddPlace2Note Map';
    let style = {}

    if( isMarkerMode ){
      klassName += ' add-marker-on';
    }

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

  };

  renderGoogleMap = () => {
    const { isReadOnly, loginUser } = this.props;
    const { markers, usedUserLocation, moveToCenter, isMarkerMode } = this.state;
    let { zoomLevel = 13, disableMoveCenter, mapCenter } = this.props;

    const defaultOptions = {
      mapTypeControl: false,
      streetViewControl: false,
      scrollwheel: false,
      disableDoubleClickZoom: false
    };

    let contents = [];

    // 사용자 위치를 사용하고 moveToCenter 옵션을 사용할 경우 사용자 위치로 중심을 이동시킨다. 
    if( usedUserLocation ){
      zoomLevel = 17;
      mapCenter = loginUser.current_location.latlng;
      contents = contents.concat([
        (<InfoWindow key="info" position={mapCenter} content={'you are here!'} />),
        (<Circle key="circle" center={mapCenter} clickable={false} radius={50} options={{
            fillColor: 'blue',
            fillOpacity: 0.2,
            strokeColor: 'red',
            strokeOpacity: 1,
            strokeWeight: 2,
          }} />),
      ]);
      
      if( moveToCenter ){
        disableMoveCenter = false;
      } else{
        disableMoveCenter = true;
      }   
    }


    let finalMapOptions = {
      ref: function (map){ this._googleMapComponent = map }.bind(this),
      defaultOptions: defaultOptions,
      defaultZoom: zoomLevel,
      defaultCenter: mapCenter,
      onClick: this.handleMapClick
    }

    if( !disableMoveCenter ){
      finalMapOptions.center = mapCenter;
      finalMapOptions.zoom = zoomLevel;   
    }

    return <GoogleMap { ...finalMapOptions}>
      <SearchBox
        classes="markerSearchBox"
        bounds={this.state.bounds}
        controlPosition={google.maps.ControlPosition.TOP_LEFT}
        onPlacesChanged={this.handlePlacesChanged}
        ref="searchBox"
        placeholder="search location" />
      {this.renderMarkers()}
      {contents}
    </GoogleMap>
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
      <div className="map-btn marker-add">
        <i className="fa icon-pin" onClick={this.handleToggleMarker}/>
      </div>
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
    
    let InfoContent = <div id={marker.key} 
      className="infoWindow" 
      onClick={this.handleEditInfoWindowTitle.bind(this, marker)}>
      <i className="fa fa-pencil-square-o" /> {marker.title}
    </div>;

    if( isReadOnly || !marker.canEdit ) {
      InfoContent = <div id={marker.key} className="infoWindow">{marker.title}</div>;
    }

    if( marker.isEditing ){
      InfoContent = <div id={marker.key} className="infoWindow">
        <input type="text" 
          defaultValue={marker.title}
          placeholder={'Input your place name'}
          autoFocus={true}
          onKeyDown={this.handleKeyDownInfoWindow.bind(this, marker)}
          onBlur={this.handleEditDoneInfoWindowTitle.bind(this, marker)}/>
        <button>OK</button>
      </div>;
    }

    return (
      <InfoWindow key={`${ref}_info_window`}
        onClick={this.handleInfoWindow}        
        onCloseclick={this.handleCloseclick.bind(this, marker)}>{InfoContent}
      </InfoWindow>
    )    
  };

  handleBoundsChanged =()=> {
    this.setState({
      bounds: this.refs.map.getBounds(),
      center: this.refs.map.getCenter()
    });
  };

  handlePlacesChanged = () => {
    const places = this.refs.searchBox.getPlaces();
    let { markers } = this.state;
    let uniqLabelName = this.findUniqLabel();

    // 검색창에서 검색한 마커를 지도에 꼽는다.
    places.forEach(function (place) {
      markers.push({
        position: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        },
        defaultAnimation: 5,
        title: place.name,
        label: uniqLabelName,
        key: Date.now(),
        showInfo: true,
        isEditing: true,
        canEdit: true
      });
    });

    // Set markers; set map center to first search result
    const mapCenter = markers.length > 0 ? markers[0].position : this.state.center;

    this.setState({
      moveToCenter:  true,
      center: mapCenter,
      markers: markers
    });

    return;
  };

  handleEditInfoWindowTitle = (marker) => {
    marker.isEditing = true;

    var { markers } = this.state;
    update(markers, { $set: [marker] });
    this.setState({ markers });

  };

  handleKeyDownInfoWindow = (marker, e) => {
    if(e.key === 'Enter') {
      this.handleEditDoneInfoWindowTitle(marker, e);
    }
  };


  // 이게 사실상 저장!
  handleEditDoneInfoWindowTitle = (marker, e) => {

    if( e.target.value.length === 0){
      alert('palce name is empty!');
      return;
    }

    marker.title = e.target.value;
    marker.isEditing = false;
    marker.canEdit = true;

    this.props.onAddPlace(marker);

    var {markers} = this.state;

    update(markers, { $set: [marker] });
    this.setState({ markers });
    this.props.onUpdateNoteState({
      places: markers
    });

  };

  findUniqLabel = () => {
    let {markers} = this.state;

    if( markers.length === 0 ){
      return '1';
    }

    markers.sort(function(m1, m2){
      return m1.label - m2.label;
    });


    let i=0;
    for(; i<markers.length; ++i) {

      if( markers[i].label != i+1 ){
        return (i+1)+'';
      }
    }
    return (markers.length + 1) +'';

  };

  handleMapClick =(event) =>{

    const { isReadOnly } = this.props;
    const { isMarkerMode } = this.state;

    if( isReadOnly ) {
      return false;
    }

    if( !isMarkerMode ) { return false; }

    let {markers} = this.state;
    let uniqLabelName = this.findUniqLabel();
    let self = this;
    let marker = {
      position: event.latLng,
      defaultAnimation: 5,
      title: '',
      label: uniqLabelName,
      key: Date.now(),
      showInfo: true,
      isEditing: true 
    };

    markers = update(markers, { $push: [marker] });
    this.setState({ markers });
    this.setState({
      isMarkerMode: false
    });

    this.props.onUpdateNoteState({
      places: markers
    })


  };

  handleMarkerClick = (marker) => {
    marker.showInfo = !marker.showInfo;
    this.setState(this.state);
  };

  handleCloseclick = (marker) => {
    let {markers} = this.state;
    markers = _.without(markers, marker);
    this.setState({ markers });
    this.props.onUpdateNoteState({
      places: markers
    })
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

    let {markers} = this.state;
    let i=0; 

    for(; i<markers.length; ++i ){
      let marker = markers[i];
      if( marker.title.length === 0){
        return alert('make sure place name!');
      }
    }

    this.props.onUpdateNoteState({
      openMap: false
    })
  };
}

ControlMap.propTypes = {
  loginUser: PropTypes.object.isRequired,
  mapCenter : PropTypes.shape({
    lat: React.PropTypes.number,
    lng: React.PropTypes.number
  }),
  onAddPlace: PropTypes.func.isRequired,
  onUpdateNoteState: PropTypes.func.isRequired
}