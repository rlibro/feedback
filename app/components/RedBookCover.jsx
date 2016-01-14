import React, { Component, PropTypes } from 'react';

export default class RedBookCover extends Component {

  /**
   * 사용자 위치 정보가 확인된 경우에만 다시 그림
   */
  shouldComponentUpdate(nextProps, nextState) {
    const { redBook, loginUser } = nextProps;

    if( loginUser && loginUser.current_location ) {
      return true;
    }
    return false;
  }

  render(){

    const { loginUser, redBook, onCloseRedBook } = this.props;
    const style = {
      color: 'white',
      backgroundSize: 'cover',
      backgroundImage: 'url(' + redBook.coverImage + ')',
      WebkitTransition: 'all', // note the capital 'W' here
      msTransition: 'all' // 'ms' is the only lowercase vendor prefix
    };

    return <div style={style} className="RedBookCover">
      <div className="shadow"></div>
      <div className="cover-title-header">  
        <h2 className="city-name">{redBook.cityName}</h2>
        <h4 className="country-name">{redBook.countryName}</h4>        
      </div>
      <div className="button-close">
        <i className="fa fa-times" onClick={onCloseRedBook}/>
      </div>
      <div className="controls">
        <button onClick={this.handleCityPeople}><i className="fa fa-users" /> Peoples</button>
      </div>
    </div>
  }

  handleCityPeople = (e) => {
    const {redBook} = this.props;
    this.props.onPushState(`/guide/${redBook.uname}/people`);
  };
}

RedBookCover.propTypes = {
  loginUser: PropTypes.object.isRequired,
  redBook: PropTypes.object.isRequired,
  onPushState: PropTypes.func.isRequired,
  onCloseRedBook: PropTypes.func.isRequired
}
