import React, { Component, PropTypes } from 'react';

export default class NewRedBookCover extends Component {

  constructor(props){
    super(props);

    this.state = {
      isLoading: false,
      imageSrc: false
    };
  }

  // componentWillReceiveProps(nextProp){

 
  //   this.loadFlickImage(nextProp.newRedBook.cityName);

  // }

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
        <h2 className="city-name">{newRedBook.cityName|| 'Please Select City'}</h2>
        <h4 className="country-name">{newRedBook.countryName}</h4>
      </div>
    </div>
  }

  componentDidMount(){
    this.loadFlickImage();
  }

  loadFlickImage = (word) =>{
    
    const { newRedBook } = this.props;
    const flickr = 'http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?';

    let keyword = word || newRedBook.countryName; 

    this.setState({
      isLoading: true
    })

    $.getJSON(flickr,{
      tags: keyword,
      tagmode: 'any',
      format: 'json'
    }, function(data){

      var rnd = Math.floor(Math.random() * data.items.length);
      var image_src = data.items[rnd]['media']['m'].replace('_m', '_b');

      this.setState({
        isLoading: false,
        imageSrc: image_src
      })
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
  newRedBook: PropTypes.object.isRequired
}
