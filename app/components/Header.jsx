import React, { Component, PropTypes } from 'react'
import CurrentLocation from '../components/CurrentLocation'

export default class Header extends Component {
  
  render() {
    const { loginUser, onUpdateCurrentUserLocation } = this.props;

    return (
      <header className="Header">
      <div className="stack-menu">
        <i className="fa fa-bars"/>
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
                <img src={loginUser.picture}/>
              </div>
              <ul className="sub-menu">
                <li><a href="/mynote">MY NOTES</a></li>
                <li><a href="/" onClick={this.handleFacebookLogout}>Logout</a></li>
              </ul>
            </li>
            
          </ul>

        }else{

          return <ul className="account-menu">
            <li><a href="/" className="fb-login" onClick={this.handleFacebookLogin}>Login with Facebook</a></li>
          </ul>

        }

      }.bind(this)()}
      </header>

    );
  }

  handleFacebookLogin = (e) => {
    
    Parse.FacebookUtils.logIn('user_location,user_friends,email', {
      success: function(res){

        this.fetchUserInfo();

      }.bind(this),
      error: function(err){
        console.log(err);
      }
    });
    e.preventDefault()

  };

  handleFacebookLogout = (e) => {
    const {onLogOutUser} = this.props;
    onLogOutUser();
    e.preventDefault();
  };

  fetchUserInfo = () => {
    
    const { onUpdateLoginUser } = this.props;
    const loginUser = Parse.User.current();
    let loginInfo = loginUser.toJSON()
    loginInfo.id = loginUser.id;
    delete loginInfo.objectId;

    if( !loginInfo.location ) {

      FB.api('/me?fields=id,name,email,location,picture{url}', function(user) {

        if( user.error ){
          Parse.User.logOut();
          return;
        }

        FB.api(`/${user.location.id}/?fields=location`, function(res){
          user.location = res.location;
          onUpdateLoginUser(user);

        })
      });

    } else {
      onUpdateLoginUser(loginInfo);
    }    
  };
}

Header.propTypes = {
  loginUser: PropTypes.object.isRequired,
  onMoveHome: PropTypes.func.isRequired,
  onMoveMyNote: PropTypes.func.isRequired,
  onUpdateCurrentUserLocation: PropTypes.func.isRequired,
  onUpdateLoginUser: PropTypes.func.isRequired,
  onLogOutUser: PropTypes.func.isRequired
}

