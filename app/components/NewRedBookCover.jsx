import React, { Component, PropTypes } from 'react';

export default class NewRedBookCover extends Component {

  constructor(props){
    super(props);

    this.state = {
      imageSrc: false
    };
  }

  render(){
    const { newRedBook } = this.props;
    const style = {
      color: 'white',
      backgroundSize: 'cover',
      backgroundImage: 'url(' + this.state.imageSrc + ')',
      WebkitTransition: 'all', // note the capital 'W' here
      msTransition: 'all' // 'ms' is the only lowercase vendor prefix
    };

    return <div style={style} className="NewRedBookCover RedBookCover">
      <div className="shadow"></div>
      <div className="cover-title-header">
        <h2 className="city-name">{newRedBook.cityName}</h2>
        <h4 className="country-name">{newRedBook.countryName}</h4>
      </div>
    </div>
  }

  componentDidMount(){
    const { newRedBook: {countryName, cityName} } = this.props;
     
    this.loadFlickImage(cityName,countryName);
  }

  loadFlickImage = (cityName,countryName) =>{
        
    const flickr = 'http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?';

    $.getJSON(flickr,{
      tags: `${cityName},${countryName}`,
      tagmode: 'all',
      format: 'json'
    }, function(data){

      var rnd = Math.floor(Math.random() * data.items.length);
      var imageSrc = data.items[rnd]['media']['m'].replace('_m', '_b');

      this.setState({
        imageSrc: imageSrc
      });

      this.props.setCoverImageForNewRedBook({coverImage:imageSrc});

    }.bind(this));
    
  };

  renderSampleImage = () => {

    if( this.state.imageSrc ){
      return <img src={this.state.imageSrc} />
    }

  };
}

NewRedBookCover.propTypes = {
  loginUser: PropTypes.object.isRequired,
  setCoverImageForNewRedBook: PropTypes.func.isRequired,
  newRedBook: PropTypes.object.isRequired
}
