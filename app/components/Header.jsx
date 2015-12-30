import React, { Component, PropTypes } from 'react'

export default class Header extends Component {

  render() {
    const user = this.props.login;

    return (
      <header id="header" className="clearfix">
      <h1 className="logo">
        
        <a href="#">

          <span>RedBook</span>

        </a>

      </h1>
      {function(){

        if (user) {

          return <ul className="account-menu">
            <li><a href="#" onClick={this.props.onMoveMyNote}>내 노트</a></li>
            <li><img src={user.picture.data.url}/></li>
            <li><a href="/logout">로그아웃</a></li>
          </ul>

        }else{

          return <ul className="account-menu">
            <li><a href="#" onClick={this.props.onLogin}>페이스북으로 로그인</a></li>
          </ul>

        }

      }.bind(this)()}
      </header>

    );
  }
}

Header.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onMoveMyNote: PropTypes.func.isRequired
}

