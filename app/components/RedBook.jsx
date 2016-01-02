import React, { Component, PropTypes } from 'react';

export default class RedBook extends Component {

  render() {

    const { redBook, onOpenRedBook, klassName } = this.props
    const style = {
      color: 'white',
      backgroundSize: 'cover',
      backgroundImage: 'url(' + redBook.cityImage + ')',
      WebkitTransition: 'all', // note the capital 'W' here
      msTransition: 'all' // 'ms' is the only lowercase vendor prefix
    };

    return <li style={style} className={'RedBook ' + klassName} onClick={onOpenRedBook.bind(this,redBook)}>
      <a href={`/${redBook.uname}`}>
        <h3>{redBook.cityName}</h3>
        <h4>{redBook.countryName}</h4>
      </a>
    </li>
  }
}

RedBook.propTypes = {
  klassName: PropTypes.string.isRequired,
  redBook : PropTypes.object.isRequired,
  onOpenRedBook : PropTypes.func.isRequired
}
