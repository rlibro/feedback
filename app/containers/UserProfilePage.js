import React, { Component, PropTypes } from 'react'
import { updateLoginUserInfo } from '../actions'
import { connect } from 'react-redux'
import { findDOMNode } from 'react-dom';

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
class UserProfilePage extends Component {
  
  constructor(props){
    super(props);

    this.state = {
      isEditingName: false,
      message: ''
    }
  }

  render() {

    const {loginUser} = this.props;

    return <div className="UserProfilePage">
      
      <div className="propfile">
        <div className="photo">
          <img src={loginUser.picture}/>
        </div>
        { this.renderEditingUserName() }
        { this.renderEditingUserEmail() }
      </div>

      { this.renderGPSLocation(loginUser) }
      { this.renderCurrentCity(loginUser) }

    </div>
  }

  renderEditingUserName = () => {

    const { loginUser } = this.props;
    if( !loginUser.id ) { return false }

    if( this.state.isEditingName ) {

      return <div className="user-field">
        <input type="text" defaultValue={loginUser.username} 
          autoFocus="true" ref="username" 
          onKeyPress={this.handleCheckEnter.bind(this, 'username')}
          />
        <button className="edit-done" onClick={this.handleComplete.bind(this, 'username')}>Done</button>
      </div>

    } else {

      return <div className="user-field">
        <button onClick={this.handleEditUserName}><i className="fa fa-pencil-square-o" /> {loginUser.username}</button>
      </div>

    }

  };

  renderEditingUserEmail = () => {

    const { loginUser } = this.props;
    if( !loginUser.id ) { return false }

    if( !loginUser.email ) {

      return <div className="user-field">
        <input type="text" defaultValue="" placeholder="input your eamil!" 
          autoFocus="true" ref="email" 
          onKeyPress={this.handleCheckEnter.bind(this, 'email')}
          />
        <button className="edit-done" onClick={this.handleComplete.bind(this, 'email')}>Done</button>
        <p className="warning">{this.state.message}</p>
      </div>

    } else {

      return <div className="user-field">
        <span>{loginUser.email}</span>
      </div>

    }

  };

  renderGPSLocation = (loginUser) => {

    if( !loginUser.current_location ) {
      return false;
    }

    return <div className="gps-location">
      <h4> GPS Location </h4>
      <div>
        {loginUser.current_location.cityName}
      </div>
    </div>

  };

  renderCurrentCity = (loginUser) => {

    return <div className="check-in-city">
      <h4>Check-In City</h4>
      <p>{loginUser.currentCity}</p>

      <div className="check-in-state">

      <ul>
        <li>Exchange</li>
        <li>Accompany</li>
      </ul>
      </div>
    </div>
  };

  handleEditUserName = (e) => {
    this.setState({
      isEditingName: !this.state.isEditingName
    })
  };

  handleCheckEnter = (type, e) => {
    if(e.key === 'Enter') {
      this.handleComplete(type, e);
    }
  };

  handleComplete = (type, e) => {

    const { loginUser, updateLoginUserInfo} = this.props;
    const parseUser = Parse.User.current();
    const node = findDOMNode(this.refs[type]);
    const text = node.value;

    if( text.length < 1 ) {
      alert('Can\'t empty name!');
      node.focus();
    
    } else {

      this.setState({
        isEditingName: false
      });

      console.log(validateEmail(text));

      if( type === 'email' && !validateEmail(text) ) {
        this.setState({
          message: 'invalid email format!'
        });
        return;
      }

      loginUser[type] = text;
      parseUser.set(type, text);
      parseUser.save()
      .then(function(user){
        updateLoginUserInfo( loginUser )
      });
    }

  };

}

UserProfilePage.propTypes = {
  updateLoginUserInfo: PropTypes.func.isRequired
};


function mapStateToProps(state) {

  return {
    loginUser: state.login
  }
}

export default connect(mapStateToProps, {
  updateLoginUserInfo

})(UserProfilePage)