import React, { Component, PropTypes } from 'react'

export default class Header extends Component {

  render() {
    const { loginUser } = this.props;

    return (
      <header className="Header">
      <h1 className="logo">
        
        <a href="/" onClick={this.props.onMoveHome}>
          <span>RedBook</span>
        </a>

      </h1>
      {function(){

        if ( loginUser.id ) {

          return <ul className="account-menu">
            <li><a href="#" onClick={this.props.onMoveMyNote}>내 노트</a></li>
            <li><img src={loginUser.picture.data.url}/></li>
            <li><a href="/logout">로그아웃</a></li>
          </ul>

        }else{

          return <ul className="account-menu">
            <li><a href="#" onClick={this.handleFacebookLogin}>페이스북으로 로그인</a></li>
          </ul>

        }

      }.bind(this)()}
      </header>

    );
  }

  handleFacebookLogin = (e) => {
    window.open('/facebook/login', '', 'width=600, height=550');
  }

}

Header.propTypes = {
  loginUser: PropTypes.object.isRequired,
  onMoveHome: PropTypes.func.isRequired,
  onMoveMyNote: PropTypes.func.isRequired
}

