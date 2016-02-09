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

  renderGoogleMap = () => {
    const { isReadOnly, loginUser } = this.props;
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
      zoom: zoomLevel,
      center: mapCenter
    }

    return <GoogleMap { ...finalMapOptions}>
      {this.renderMarkers()}
    </GoogleMap>
  };

  renderMarkers = () => {

    const { isReadOnly } = this.props;
    const { markers } = this.state;
    var bounds = new google.maps.LatLngBounds();
    var markerArray = [];

    markers.forEach((marker, index) => {
      const ref = `marker_${index}`;

      bounds.extend(new google.maps.LatLng(marker.position));
      markerArray.push(<Marker key={ref} ref={ref}
        {...marker}
        title={(index+1).toString()}
        onClick={this.handleMarkerClick.bind(this, marker)}
        onRightclick={this.handleMarkerRightclick.bind(this, index)} >
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

    if( e.target.value.length === 0){
      alert('palce name is empty!');
      return;
    }

    marker.title = e.target.value;
    marker.isEditing = false;
    marker.canEdit = true;

    var {markers} = this.state;

    update(markers, { $set: [marker] });
    this.setState({ markers });
    this.props.onUpdateDataForRedBook({
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

    this.props.onUpdateDataForRedBook({
      places: markers
    })


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

DisplayMap.propTypes = {
  loginUser: PropTypes.object.isRequired,
  mapCenter : PropTypes.shape({
    lat: React.PropTypes.number,
    lng: React.PropTypes.number
  }),
  onUpdateDataForRedBook: PropTypes.func.isRequired
}