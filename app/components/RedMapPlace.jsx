import React, { Component, PropTypes } from 'react';
import {default as update} from 'react-addons-update';
import {GoogleMapLoader, GoogleMap, Marker, InfoWindow} from 'react-google-maps';

/*
 * This is the modify version of:
 * https://developers.google.com/maps/documentation/javascript/examples/event-arguments
 *
 * Loaded using async loader.
 */
export default class RedMapPlace extends Component {

  static version = Math.ceil(Math.random() * 22);

  state = {
    markers: []
  };

  render () {

    const mapLocation = {
      lat : this.props.geo.latitude,
      lng : this.props.geo.longitude
    };

    return <div className="RedBookCover place">
    <div className="button-close">
      <i className="fa fa-times" onClick={this.handleClosePlaceMap}/>
    </div>
    <GoogleMapLoader
      containerElement={
        <div
          {...this.props}
          style={{
            height: '360px',
          }}
        />
      }
      googleMapElement={
        <GoogleMap
          ref={(map) => console.log(map)}
          defaultOptions={{
            mapTypeControl: false,
            streetViewControl: false,
            scrollwheel: false,
            disableDoubleClickZoom: true
          }}
          defaultZoom={13}
          defaultCenter={mapLocation}
          onClick={this.handleMapClick}>
          {this.state.markers.map((marker, index) => {
            const ref = `marker_${index}`;
            return (
              <Marker key={ref} ref={ref}
                {...marker}
                title={(index+1).toString()}
                onClick={this.handleMarkerClick.bind(this, marker)}
                onRightclick={this.handleMarkerRightclick.bind(this, index)} >

                {marker.showInfo ? this.renderInfoWindow(ref, marker) : null}
              </Marker>
            );
          })}
        </GoogleMap>
      }
    />
    </div>

  };

  renderInfoWindow = (ref, marker) => {
    let InfoContent = <div id={marker.key} 
      className="infoWindow" 
      onClick={this.handleEditInfoWindowTitle.bind(this, marker)}>
      <i className="fa fa-pencil-square-o" /> {marker.title}
    </div>;


    if( marker.isEditing ){
      InfoContent = <div id={marker.key} 
      className="infoWindow">
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

    var {markers} = this.state;
    markers = update(markers, { $set: [marker] });
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
    markers = update(markers, { $set: [marker] });
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
    self.setState({ markers });

    this.getAddress(event.latLng, function(address){

      marker.title = address;

      self.props.onUpdateDataForRedBook({
        places: markers
      })

    });
  };

  handleMarkerRightclick = (index, event) => {
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

  handleClosePlaceMap = () => {
    this.props.onUpdateDataForRedBook({
      formMode: 'NOTE'
    })
  };
}

RedMapPlace.propTypes = {
  geo : PropTypes.object.isRequired,
  onUpdateDataForRedBook: PropTypes.func.isRequired
}