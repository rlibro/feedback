import React, { Component, PropTypes } from 'react';

export default class AttachedPlaces extends Component {

  constructor(props){
    super(props);
    this.state = {
      isOpenedPlaceList: false
    }
  }

  render(){
    const { pageForRedBook: { places }, appState: { loadedGoogleSDK } } = this.props;

    if( !loadedGoogleSDK ) {
      return false;
    }

    var options = places.map(function(place){
      return {
        key: place.key,
        value: place.title,
        label: place.label
      }
    });


    return <div className="AttachedPlaces">
      <div className="title header-box" onClick={this.handleTogglePlace}>{`Places (${places.length})`}</div>
      <div className="button header-box" onClick={this.handleOpenMap}><i className="fa icon-plus"></i> Map</div>
      {this.renderPlaces()}
    </div>
  }

  renderPlaces = () => {

    const { isOpenedPlaceList } = this.state;
    const { pageForRedBook: { places } } = this.props;

    if( !isOpenedPlaceList ) { return false }


    if( places.length ){
      return <ul className="PlaceList">
        {places.map(function(place, i){
          return <li className="item" key={i} onClick={this.handleInsertPlace.bind(this, place)}>
            <div className="label"><i className="fa icon-up"></i> {place.label}</div>
            <div className="title" title={place.title}>{place.title}</div>
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

    console.log( place );

    let { pageForRedBook:{formText} } = this.props;
    let str = `[${place.title}][${place.label}]`;
    
    console.log( str );

    this.setState({isOpenedPlaceList: false})
    // this.props.onUpdateDataForRedBook({
    //   formText: formText + str
    // });   
    this.props.onInsertPlace(str);

  };

  handleDeletePlace = (place, e) => {
    const { pageForRedBook: { places } } = this.props;

    let yes = confirm('Are you sure delete this place?');

    if( yes ){
       this.props.onUpdateDataForRedBook({
        places: _.without(places, place)
      });
    }

    e.stopPropagation();
  };

  handleOpenMap = (e) => {

    this.props.onUpdateDataForRedBook({
      formMode: 'PLACE'
    });
    this.setState({
      isOpenedPlaceList: true
    })
  };
}

AttachedPlaces.propTypes = {
  appState: PropTypes.object.isRequired,
  pageForRedBook: PropTypes.object.isRequired,
  onUpdateDataForRedBook: PropTypes.func.isRequired,
  onInsertPlace: PropTypes.func.isRequired
}
