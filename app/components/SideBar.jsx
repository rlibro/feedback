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

  renderDimmed = (sidebar) => {
    if(sidebar){
     return <div className="dimmed" onClick={this.handleToggleSideBar}></div>  
    }
    return false;
  };

  render(){

    const { loginUser, appState:{sidebar} } = this.props;

    let klassName;
    if( sidebar ){
      klassName = 'SideBar opened'
    }else {
      klassName = 'SideBar'
    }

    let style = {
      height: $(window).height() - 54
    }

    return <div className="wrap-SideBar">
      <div className={klassName} style={style}>
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

      {this.renderDimmed(sidebar)}
      
    </div>
  }

  handleToggleSideBar = (e) => {
    this.props.onUpdateAppState({
      sidebar: false
    });
  };
}

SideBar.propTypes = {
  appState: PropTypes.object.isRequired,
  onUpdateAppState: PropTypes.func.isRequired,
  loginUser: PropTypes.object.isRequired
}
