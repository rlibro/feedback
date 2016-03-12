import React, { Component, PropTypes } from 'react'
import { updateLoginUserInfo } from '../actions'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { findDOMNode } from 'react-dom';
import _ from 'lodash';

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

  componentWillMount() {
    const {loginUser} = this.props;

    if( loginUser && !loginUser.id ){
      browserHistory.push('/');
    }
  }

  render() {

    const {loginUser} = this.props;

    return <div className="UserProfilePage">
      
      <div className="propfile">
        <div className="photo">
          <img src={loginUser.picture}/>
        </div>
        { this.renderUserNationality() }
      
        { this.renderEditingUserName() }
        { this.renderEditingUserEmail() }
      </div>

      { this.renderGPSLocation(loginUser) }
      { this.renderCheckInSatae(loginUser) }
      { this.renderNoteInCity(loginUser) }

    </div>
  }

  renderUserNationality = () => {
    const { loginUser } = this.props;
    
    if( loginUser.nationality ) {
      return <div className="country">
        <img src={`http://www.theodora.com/flags/new4/${loginUser.nationality.replace(/\s/g,'_').toLowerCase()}-t.gif`}/>
      </div>
    }
  };

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

    const state = loginUser.state;
    let exchangeClass = state && state.exchange  ? 'on':'';
    let companionClass= state && state.companion ? 'on':'';
    let coffeeClass   = state && state.coffee    ? 'on':'';
    let eatClass      = state && state.eat       ? 'on':'';
    let beerClass     = state && state.beer      ? 'on':'';
    let bedClass      = state && state.bed       ? 'on':'';
    let carClass      = state && state.car       ? 'on':'';


    return <div className="check-in-city">
      <h4>Check-in State</h4>
      <p>{loginUser.currentCity}</p>

      <div className="check-in-with-options">
        <table className="sign-meaning">
          <tbody>
            <tr>
              <td className="sign"><i className="fa icon-exchange"/></td>
              <td className="meaning">I can exchange money</td>
            </tr>
            <tr>
              <td className="sign"><i className="fa icon-companion"/></td>
              <td className="meaning">I am looking for companions</td>
            </tr>
            <tr>
              <td className="sign"><i className="fa icon-coffee"/></td>
              <td className="meaning">I have a time to drink a cup of coffee</td>
            </tr>
            <tr>
              <td className="sign"><i className="fa icon-eat"/></td>
              <td className="meaning">I have a time to eat something</td>
            </tr>
            <tr>
              <td className="sign"><i className="fa icon-beer"/></td>
              <td className="meaning">I have a time to drink a beer</td>
            </tr>
            <tr>
              <td className="sign"><i className="fa icon-bed"/></td>
              <td className="meaning">I can share my room</td>
            </tr>
            <tr>
              <td className="sign"><i className="fa icon-car"/></td>
              <td className="meaning">I can share my car</td>
            </tr>
          </tbody>
        </table>
        <ul>
          <li className={exchangeClass}><button onClick={this.handleSelectState.bind(this, 'exchange')}><i className="fa icon-exchange"/></button></li>
          <li className={companionClass}><button onClick={this.handleSelectState.bind(this, 'companion')}><i className="fa icon-companion"/></button></li>
          <li className={coffeeClass}><button onClick={this.handleSelectState.bind(this, 'coffee')}><i className="fa icon-coffee"/></button></li>
          <li className={eatClass}><button onClick={this.handleSelectState.bind(this, 'eat')}><i className="fa icon-eat"/></button></li>
          <li className={beerClass}><button onClick={this.handleSelectState.bind(this, 'beer')}><i className="fa icon-beer"/></button></li>
          <li className={bedClass}><button onClick={this.handleSelectState.bind(this, 'bed')}><i className="fa icon-bed"/></button></li>
          <li className={carClass}><button onClick={this.handleSelectState.bind(this, 'car')}><i className="fa icon-car"/></button></li>
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

      // 4이상이면 안돼!! 
      let length = _.filter(state, function(o, key){ return o }).length
      if( length >= 4 ){
        alert('too many state, the max state is 4');
        return;
      }

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