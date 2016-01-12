import React, { Component, PropTypes } from 'react';
import Footer from '../components/Footer'

export default class SideBar extends Component {

  renderCurrentLocation = (loginUser) => {

    if( !loginUser.current_location ) {
      return false;
    }

    return <li>
      <div>
        {loginUser.current_location.cityName}
      </div>
      <div>
        {loginUser.current_location.countryName}
      </div>
    </li>


  };

  render(){

    const { loginUser, appState:{sidebar} } = this.props;

    let klassName;
    if( sidebar ){
      klassName = 'SideBar opened'
    }else {
      klassName = 'SideBar'
    }

    return <div className={klassName}>
      <ul className="account-menu">
        <li>
          <div className="photo">
            <img src={loginUser.picture}/>
          </div>
          <div>
            {loginUser.username}
          </div>
        </li>
        { this.renderCurrentLocation(loginUser) }
        <li className="separator"></li>
        <li>
          <a href="#" onClick={this.handleFacebookLogout}>
            <i className="fa fa-sign-out"></i> Logout
          </a>
        </li>
        
      </ul>
      <Footer />
    </div>
  }
}

SideBar.propTypes = {
  appState: PropTypes.object.isRequired,
  loginUser: PropTypes.object.isRequired
}
