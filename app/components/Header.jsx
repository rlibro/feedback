import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { updateAppState } from '../actions'
import { findDOMNode } from 'react-dom';


class Header extends Component {
  
  constructor(props){
    super(props);

    this.state = {
      tringLogin: false
    }
  }

  componentWillReceiveProps(nextProps){

    const { loginUser, appState:{ tringLogin }} = nextProps;

    if( loginUser.id || !tringLogin ){
      this.setState({
        tringLogin: false
      })
    }

  }

  render() {
    const { appState:{sidebar} } = this.props;

    let klassName;
    if( sidebar ){
      klassName = 'stack-menu opened'
    }else {
      klassName = 'stack-menu'
    }

    return <header className="Header">
    
      <div className={klassName} onClick={this.handleToggleSideBar}>
        <i className="fa fa-book"/>
      </div>
      <h1 className="logo" ref="logo">  
        <a href="/" onClick={this.handleHome}>
          <span className="service-name">rlibro</span>
        </a>
        <span className="tagline">social travel guide</span>
      </h1>

      { this.renderLoginUserInfo() }
      { this.renderFaceBookLogin() }
    
    </header>
  }

  renderFaceBookLogin = () => {
    const { loginUser, appState:{ loadedFacebookSDK } } = this.props;
    const { tringLogin } = this.state;

    if( !loadedFacebookSDK || loginUser.id ) {
      return false;
    }

    if( tringLogin ){
      return <ul className="account-menu">
        <li><span className="fb-trying"><i className="fa fa-spinner fa-pulse"/> Login with Facebook</span></li>
      </ul>
    } else {
      return <ul className="account-menu">
        <li><a href="#" className="fb-login" onClick={this.handleFacebookLogin}><i className="fa fa-facebook"/> Login with Facebook</a></li>
      </ul>
    }

  };

  renderLoginUserInfo = () => {

    const { loginUser } = this.props;

    if( !loginUser.id ) {
      return false;
    }

    return <ul className="account-menu">
      
      {/*<li>
        <div className="menu bookmark" onClick={this.handleProfile}>
          <i className="fa icon-bookmark"/> bookmark</div>
      </li>

      <li>
        <div className="menu alert" onClick={this.handleProfile}>
          <i className="fa icon-alert"/> message</div>
      </li>*/}

      <li>
        <div className="photo" onClick={this.handleProfile}>
          <img src={loginUser.picture}/>
        </div>
        <ul className="sub-menu">
          <li><a href="#" onClick={this.handleFacebookLogout}><i className="fa fa-sign-out"></i> Logout</a></li>
        </ul>
      </li>
      
    </ul>
  };

  handleToggleSideBar = (e) => {
    this.props.updateAppState({
      sidebar: !this.props.appState.sidebar
    });

    const node = findDOMNode(this.refs.logo);
    node.focus();
  };


  handleFacebookLogin = (e) => {
    e.preventDefault();

    this.setState({
      tringLogin: true
    });
    this.props.updateAppState({
      tringLogin: true
    });

    this.props.onLogin();
  };

  handleFacebookLogout = (e) => {
    this.props.onLogOut();
    e.preventDefault();
  };

  handleHome = (e) => {
    this.props.updateAppState({
      sidebar: false
    });
    browserHistory.push('/');
    e.preventDefault();
  };

  handleProfile = (e) => {
    this.props.updateAppState({
      sidebar: false
    });
    browserHistory.push('/profile');
    e.preventDefault();
  };
}

Header.propTypes = {
  appState: PropTypes.object.isRequired,
  loginUser: PropTypes.object.isRequired,
  updateAppState: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  onLogOut: PropTypes.func.isRequired
}

function mapStateToProps(state, ownProps) {
  return {
    appState: state.appState,
    loginUser: state.login,
    routing: state.routing.locationBeforeTransitions
  }
}

export default connect(mapStateToProps, {
  updateAppState
})(Header)
