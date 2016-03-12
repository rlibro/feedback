import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { updateAppState } from '../actions'

import Footer from '../components/Footer'

class SideBar extends Component {

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
          { this.renderFaceBookLogin() }  
          { this.renderUserProfileInfo(loginUser) }
          { this.renderCurrentLocation(loginUser) } 
          <li className="separator"></li>
          { this.renderLogOut(loginUser) }
        </ul>
        <Footer />
      </div>

      {this.renderDimmed(sidebar)}
      
    </div>
  }

  renderFaceBookLogin = () => {
    const { loginUser, appState:{ loadedFacebookSDK } } = this.props;

    if( !loadedFacebookSDK || loginUser.id ) {
      return false;
    }

    return <li>
      <button className="fb-login" onClick={this.handleFacebookLogin}>
        <i className="fa fa-facebook"/> Login with Facebook
      </button>
    </li>
  };


  renderUserProfileInfo = (loginUser) => {

    if( !loginUser.id ){ return false }

    return <li className="profile">
      <div className="photo" onClick={this.handleProfile}>
        <img src={loginUser.picture}/>
      </div>
      <div>
        {loginUser.username}
      </div>
    </li>

  };

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

  renderLogOut = (loginUser) => {

    if( !loginUser.id ) {
      return false;
    }

    return<li>
      <button onClick={this.handleFacebookLogout}>
        <i className="fa fa-sign-out"></i> Logout
      </button>
    </li>
  };

  renderDimmed = (sidebar) => {
    if(sidebar){
     return <div className="dimmed" onClick={this.handleToggleSideBar}></div>  
    }
    return false;
  };

  handleToggleSideBar = (e) => {
    this.props.updateAppState({
      sidebar: false
    });
  };

  handleProfile = (e) => {
    browserHistory.push('/profile');
    this.props.updateAppState({
      sidebar: false
    });

  };

  handleFacebookLogin = (e) => {
    this.props.onLogin();
    this.props.updateAppState({
      sidebar: false
    });

  };

  handleFacebookLogout = (e) => {
    this.props.onLogOut();
    e.preventDefault();
    this.props.updateAppState({
      sidebar: false
    });
  };

}

SideBar.propTypes = {
  appState: PropTypes.object.isRequired,
  loginUser: PropTypes.object.isRequired,
  onLogin: PropTypes.func.isRequired,
  onLogOut: PropTypes.func.isRequired,
  updateAppState: PropTypes.func.isRequired
}


function mapStateToProps(state, ownProps) {
  return {
    appState: state.appState,
    loginUser: state.login
  }
}

export default connect(mapStateToProps, {
  updateAppState
})(SideBar)

