import React, { Component, PropTypes } from 'react';

export default class AttachedPlaces extends Component {

  constructor(props){
    super(props);
    this.state = {
      isOpenedPlaceList: false
    }
  }

  render(){
    const { isEditMode, appState: { loadedGoogleSDK } } = this.props;
    let { noteState: { places } } = this.props;

    if( !loadedGoogleSDK ) {
      return false;
    }

    return <div className="AttachedPlaces">
      <div className="title header-box" onClick={this.handleTogglePlace}>{`Places (${places.length})`}</div>
      <div className="button header-box" onClick={this.handleOpenMap}><i className="fa icon-plus"></i> Map</div>
      {this.renderPlaces()}
    </div>
  }

  renderPlaces = () => {

    const { isOpenedPlaceList } = this.state;
    let { isEditMode, noteState: { places } } = this.props;

    if( !isOpenedPlaceList ) { return false }

    if( isEditMode ){
      places = this.props.places;
    }

    if( places.length ){
      return <ul className="PlaceList">
        {places.map(function(place, i){
          return <li className="item" key={i} onClick={this.handleInsertPlace.bind(this, place)}>
            <div className="label"><i className="fa icon-up"></i> {place.label}</div>
            <div className="title" title={place.title}>{place.title} [{place.key}]</div>
            <div className="btn-delete" onClick={this.handleDeletePlace.bind(this, place)}><i className="fa icon-trash-o"></i></div>
          </li>
        }.bind(this))}
      </ul>
    } else {
      return <ul className="PlaceList no-data">
        click +Map if you wanna add a place
      </ul>
    }
  };

  handleTogglePlace = () => {
    this.setState({isOpenedPlaceList: !this.state.isOpenedPlaceList})
  };

  handleInsertPlace = (place) => {

    let { noteState:{formText} } = this.props;
    let str = `[${place.title}][${place.key}]`;

    this.setState({isOpenedPlaceList: false})
    this.props.onInsertPlace(str);
  };

  handleDeletePlace = (place, e) => {
    const { noteState: { places } } = this.props;

    let yes = confirm('Are you sure delete this place?');

    if( yes ){
      this.props.onUpdateNoteState({
        places: _.without(places, place)
      });
    }

    e.stopPropagation();
  };

  handleOpenMap = (e) => {

    this.props.onUpdateNoteState({
      openMap: true
    });
    this.setState({
      isOpenedPlaceList: true
    })
  };
}

AttachedPlaces.propTypes = {
  appState: PropTypes.object.isRequired,
  noteState: PropTypes.object.isRequired,
  onUpdateNoteState: PropTypes.func.isRequired,
  onInsertPlace: PropTypes.func.isRequired
}
