import React, { Component, PropTypes } from 'react'
import CurrentLocation from '../components/CurrentLocation'

export default class Header extends Component {

  render() {
    const { loginUser, onUpdateCurrentUserLocation } = this.props;

    return (
      <header className="Header">
      <div className="stack-menu">
        <img src="/assets/images/stack-menu.png" />
      </div>
      <h1 className="logo">  
        <a href="/" onClick={this.props.onMoveHome}>
          <span>RedBook</span>
        </a>
      </h1>
      {function(){

        if ( loginUser.id ) {

          return <ul className="account-menu">
            <li>
              <CurrentLocation 
                onUpdateCurrentUserLocation={onUpdateCurrentUserLocation}
                loginUser={loginUser} />
            </li>
            <li>
              <div className="photo">
                <img src={loginUser.picture.data.url}/>
              </div>
              <ul className="sub-menu">
                <li><a href="/mynote">MY NOTES</a></li>
                <li><a href="/logout">Logout</a></li>
              </ul>
            </li>
            
          </ul>

        }else{

          return <ul className="account-menu">
            <li><a href="#" className="fb-login" onClick={this.handleFacebookLogin}>Login with Facebook</a></li>
          </ul>

        }

      }.bind(this)()}
      </header>

    );
  }

  handleFacebookLogin = (e) => {
    window.open('/facebook/login', '', 'width=600, height=550');
  };

}

Header.propTypes = {
  loginUser: PropTypes.object.isRequired,
  onMoveHome: PropTypes.func.isRequired,
  onMoveMyNote: PropTypes.func.isRequired,
  onUpdateCurrentUserLocation: PropTypes.func.isRequired
}

