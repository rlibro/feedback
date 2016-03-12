import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

class RedBook extends Component {

  render() {

    const { redBook, klassName } = this.props
    const style = {
      color: 'white',
      backgroundSize: 'cover',
      backgroundImage: 'url(' + redBook.coverImage + ')',
      WebkitTransition: 'all', // note the capital 'W' here
      msTransition: 'all' // 'ms' is the only lowercase vendor prefix
    };

    return <li style={style} className={klassName} onClick={this.handleOpenRedBook.bind(this,redBook)}>
      <a href={`/${redBook.uname}`}>
        <h3>{redBook.cityName}</h3>
        <h4>{redBook.countryName}</h4>
      </a>
      {this.renderYouAreHere()}
    </li>
  }

  renderYouAreHere = () => {

    if( !this.props.loginUser.id ) { return false}

    const { loginUser:{currentCity}, redBook:{uname} } = this.props;

    if( currentCity === uname) {
      return <div className="youarehere">
        <i className="fa fa-map-signs"/> You are here!
      </div>
    }
  };

  handleOpenRedBook = (redBook, e) => {
    browserHistory.push({
      pathname: `/guide/${redBook.uname}`,
      state: {referer: '/'}
    });
    e.preventDefault()
  };
}

RedBook.propTypes = {
  loginUser: PropTypes.object.isRequired,

  // 외부 주입
  klassName: PropTypes.string.isRequired,
  redBook : PropTypes.object.isRequired
}

function mapStateToProps(state, ownProps) {
  return {
    loginUser: state.login
  }
}

export default connect(mapStateToProps, {
})(RedBook)

