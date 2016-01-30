import React, { Component, PropTypes } from 'react';
import {default as update} from 'react-addons-update';
import {GoogleMapLoader, GoogleMap, Marker, InfoWindow, Circle} from 'react-google-maps';
import {triggerEvent} from 'react-google-maps/lib/utils';

/*
 * This is the modify version of:
 * https://developers.google.com/maps/documentation/javascript/examples/event-arguments
 *
 * Loaded using async loader.
 */
export default class RedMapPlace extends Component {

  static version = Math.ceil(Math.random() * 22);

  constructor(props){
    super(props);

    this.state = {
      moveToCenter: false,
      usedUserLocation: false,
      isMarkerMode: false,
      isExpanded: false,
      markers: props.markers.concat()
    };
  }

  render () {
    const { isExpanded, isMarkerMode, usedUserLocation } = this.state;
    let klassName = 'RedBookCover place';
    let style = {}

    if( isExpanded ){
      klassName += ' expand';
    }

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
    const { markers, usedUserLocation, moveToCenter } = this.state;
    let { zoomLevel = 13, disableMoveCenter, mapCenter } = this.props;

    const defaultOptions = {
      mapTypeControl: false,
      streetViewControl: false,
      scrollwheel: false,
      disableDoubleClickZoom: false
    }
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
      ref: function (it){ this._googleMapComponent = it}.bind(this),
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
      {function(){
        if( !isExpanded ){
          return <div className="map-btn expand">
            <i className="fa icon-expand" onClick={this.handleExpandMap}/>
          </div>
        } else {
          return <div className="map-btn expand">
            <i className="fa icon-minimize" onClick={this.handleMinimizeMap}/>
          </div>
        }
      }.bind(this)()}      
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

    return markers.map((marker, index) => {
      const ref = `marker_${index}`;
      
      return <Marker key={ref} ref={ref}
        {...marker}
        title={(index+1).toString()}
        onClick={this.handleMarkerClick.bind(this, marker)}
        onRightclick={this.handleMarkerRightclick.bind(this, index)} >
        {marker.showInfo ? this.renderInfoWindow(ref, marker) : null}
      </Marker>
      
    })
  };

  renderInfoWindow = (ref, marker) => {

    const { isReadOnly } = this.props;
    
    let InfoContent = <div id={marker.key} 
      className="infoWindow" 
      onClick={this.handleEditInfoWindowTitle.bind(this, marker)}>
      <i className="fa fa-pencil-square-o" /> {marker.title}
    </div>;

    if( isReadOnly ) {
      InfoContent = <div id={marker.key} className="infoWindow">{marker.title}</div>;
    }

    if( marker.isEditing ){
      InfoContent = <div id={marker.key} className="infoWindow">
        <input type="text" 
          defaultValue={marker.title}
          onKeyDown={this.handleKeyDownInfoWindow.bind(this, marker)}
          onBlur={this.handleEditDoneInfoWindowTitle.bind(this, marker)}/>
      </div>;
    }

    return (
      <InfoWindow key={`${ref}_info_window`}
        onClick={this.handleInfoWindow}        
        onCloseclick={this.handleCloseclick.bind(this, marker)}>{InfoContent}
      </InfoWindow>
    )    
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

  handleEditDoneInfoWindowTitle = (marker, e) => {
    marker.title = e.target.value;
    marker.isEditing = false;

    var {markers} = this.state;

    update(markers, { $set: [marker] });
    this.setState({ markers });
    this.props.onUpdateDataForRedBook({
      places: markers
    });

  };

  getAddress = (latLng, callback) => {
    const geocoder = new google.maps.Geocoder;
    const self = this;

    geocoder.geocode({'location': latLng}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        callback(results[0].formatted_address);
      }
    })
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
      title: `place #${uniqLabelName}`,
      label: uniqLabelName,
      key: Date.now(),
      isEditing: false 
    };

    markers = update(markers, { $push: [marker] });
    this.setState({ markers });
    this.setState({
      isMarkerMode: false
    })

    this.getAddress(event.latLng, function(address){

      marker.title = address;

      self.props.onUpdateDataForRedBook({
        places: markers
      })

    });
  };

  handleMarkerRightclick = (index, event) => {
    const { isReadOnly } = this.props;
    if( isReadOnly ) {
      return false;
    }


    var {markers} = this.state;
    markers = update(markers, {
      $splice: [
        [index, 1]
      ],
    });
    this.setState({ markers });
    this.props.onUpdateDataForRedBook({
      places: markers
    })
  };

  handleMarkerClick = (marker) => {
    marker.showInfo = true;
    this.setState(this.state);
  };

  handleCloseclick = (marker) => {
    marker.showInfo = false;
    this.setState(this.state);
  };

  handleExpandMap = () => {
    this.setState({isExpanded: true});

    setTimeout(function(){
      triggerEvent(this._googleMapComponent, 'resize');
    }.bind(this), 10)
  };

  handleMinimizeMap = () => {
    this.setState({isExpanded: false});

    setTimeout(function(){
      triggerEvent(this._googleMapComponent, 'resize');
    }.bind(this), 10)
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
    this.props.onUpdateDataForRedBook({
      formMode: 'NOTE'
    })
  };
}

RedMapPlace.propTypes = {
  loginUser: PropTypes.object.isRequired,
  mapCenter : PropTypes.shape({
    lat: React.PropTypes.number,
    lng: React.PropTypes.number
  }),
  onUpdateDataForRedBook: PropTypes.func.isRequired
}