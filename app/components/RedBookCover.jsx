import React, { Component, PropTypes } from 'react';

export default class RedBookCover extends Component {

  render(){

    const { loginUser, redBook } = this.props;
    var style = {
      color: 'white',
      backgroundSize: 'cover',
      backgroundImage: 'url(' + redBook.cityImage + ')',
      WebkitTransition: 'all', // note the capital 'W' here
      msTransition: 'all' // 'ms' is the only lowercase vendor prefix
    };

    return <div style={style} className="RedBookCover">
      <div className="shadow"></div>
      <div className="cover-title-header">
        <h2 className="city-name">{redBook.cityName}</h2>
        <h4 className="country-name">{redBook.countryName}</h4>
      </div>
      
{/*      <div className="controls">
        <button>체크인</button>
      </div>*/}
    </div>
  }
}

RedBookCover.propTypes = {
  loginUser: PropTypes.object.isRequired,
  redBook: PropTypes.object.isRequired
}
