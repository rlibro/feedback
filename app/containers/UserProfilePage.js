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
      isEditingNote: false,
      isEditingName: false,
      message: '',
      checkinState: {}
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
      { this.renderCheckInSatae(loginUser) }
      { this.renderNoteInCity(loginUser) }

    </div>
  }

  // 이름 변경
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

  // 이메일 입력
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

  // GPS 정보
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

  // 체크인 상태
  renderCheckInSatae = (loginUser) => {

    console.log( this.state.checkinState, loginUser.state)

    const state = loginUser.state;
    let exchangeClass = state && state.exchange  ? 'on':'';
    let companionClass= state && state.companion ? 'on':'';
    let coffeeClass   = state && state.coffee    ? 'on':'';

    return <div className="check-in-city">
      <h4>Check-in State</h4>
      <p>{loginUser.currentCity}</p>

      <div className="check-in-with-options">
        <table className="sign-meaning">
          <tbody>
            <tr>
              <td className="sign"><i className="fa fa-exchange"/></td>
              <td className="meaning">I want exchange money</td>
            </tr>
            <tr>
              <td className="sign"><i className="fa fa-companion"/></td>
              <td className="meaning">I am looking for companions</td>
            </tr>
            <tr>
              <td className="sign"><i className="fa fa-coffee"/></td>
              <td className="meaning">I want to talk with somebody</td>
            </tr>
          </tbody>
        </table>
        <ul>
          <li className={exchangeClass}><button onClick={this.handleSelectState.bind(this, 'exchange')}><i className="fa fa-exchange"/></button></li>
          <li className={companionClass}><button onClick={this.handleSelectState.bind(this, 'companion')}><i className="fa fa-companion"/></button></li>
          <li className={coffeeClass}><button onClick={this.handleSelectState.bind(this, 'coffee')}><i className="fa fa-coffee"/></button></li>
        </ul>
      </div>
    </div>
  };

  // 체크인 도시에 한마디
  renderNoteInCity = (loginUser) => {

    if( this.state.isEditingNote ) {

      return <div className="note-in-a-city">
        <textarea className="note"
          defaultValue={loginUser.note}
          placeholder="you can say something to somebody when you check-in a city" 
          autoFocus="true" ref="note" 
          tabIndex="1"
          onKeyPress={this.handleCheckEnter.bind(this, 'note')}
        />
        <button tabIndex="3" className="edit-cancel" onClick={this.handleEditCancel}>Cancel</button>
        <button tabIndex="2" className="edit-done" onClick={this.handleComplete.bind(this, 'note')}>Done</button>
      </div>

    } else {

      return <div className="note-in-a-city">
        <textarea className="note" ref="note"
          value={loginUser.note}
          placeholder="you can say something to somebody when you check-in a city" 
          onFocus={this.handleEditNote}
          onChange={function(){}}
        />
      </div>

    }
    
  };

  handleSelectState = (type, e) => {
    const {loginUser, updateLoginUserInfo} = this.props;
    const parseUser = Parse.User.current();

    let state = loginUser.state || {};

    if( !state[type] ) {
      state[type] = true;
    } else {
      state[type] = false;
    }

    loginUser.state = state;
    parseUser.set('state', state);
    parseUser.save()
    .then(function(user){
      updateLoginUserInfo( loginUser )
    });

  };

  handleEditNote = (e) => {
   this.setState({
      isEditingNote: true 
    })
  };


  handleEditUserName = (e) => {
    this.setState({
      isEditingName: true
    })
  };

  handleCheckEnter = (type, e) => {
    if(e.key === 'Enter') {
      this.handleComplete(type, e);
    }
  };

  handleEditCancel = (e) => {
    this.setState({
      isEditingNote: false,
      isEditingName: false,
      message: ''
    })
  };

  handleComplete = (type, e) => {

    const { loginUser, updateLoginUserInfo} = this.props;
    const parseUser = Parse.User.current();
    const node = findDOMNode(this.refs[type]);
    const text = node.value;

    if( type !=='note' && text.length < 1 ) {
      alert('It can\'t be empty!');
      node.focus();
    
    } else {

      this.setState({
        isEditingNote: false,
        isEditingName: false
      });

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