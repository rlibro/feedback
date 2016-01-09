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
                <li><a href="#logout" onClick={this.handleFacebookLogout}>Logout</a></li>
              </ul>
            </li>
            
          </ul>

        }else{

          return <ul className="account-menu">
            <li><a href="#loginWithFaceBook" className="fb-login" onClick={this.handleFacebookLogin}>Login with Facebook</a></li>
          </ul>

        }

      }.bind(this)()}
      </header>

    );
  }

  componentDidMount() {

    window.fbAsyncInit = function() {

      Parse.FacebookUtils.init({
        appId      : '1155091951184116',
        cookie     : true,
        xfbml      : true,
        version    : 'v2.4'
      });

      if( Parse.User.current() ){
        this.fetchUserInfo();
      }

    }.bind(this);

    // Load the SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
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
    const {onUpdateLoginUser} = this.props;

    Parse.User.logOut();
    
    onUpdateLoginUser(null);
    e.preventDefault()

  };

  fetchUserInfo = () => {
    
    const {onUpdateLoginUser} = this.props;

    FB.api('/me?fields=id,name,email,location,picture{url}', function(user) {
     
      FB.api(`/${user.location.id}/?fields=location`, function(res){
       
        user.location = res.location;

        onUpdateLoginUser(user);

      })
    });
  };
}

Header.propTypes = {
  loginUser: PropTypes.object.isRequired,
  onMoveHome: PropTypes.func.isRequired,
  onMoveMyNote: PropTypes.func.isRequired,
  onUpdateCurrentUserLocation: PropTypes.func.isRequired,
  onUpdateLoginUser: PropTypes.func.isRequired
}

