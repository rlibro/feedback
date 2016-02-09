import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { pushPath as pushState, replacePath } from 'redux-simple-router'
import { checkInHere, checkOutHere } from '../actions'
import { fetchCityPeoples } from '../actions'
import { findDOMNode } from 'react-dom'
import _ from 'lodash'

function fetchPeoplesFromServer(props){

  props.fetchCityPeoples(props.uname);

}

class CityPeoplePage extends Component {

  /**
   * 최소에 한번만 호출된다. 
   * 서버에서 현재 이곳에 있는 사람들 정보를 긁어와야한다.
   */ 
  componentWillMount(){
    fetchPeoplesFromServer(this.props);
  }

  shouldComponentUpdate(nextProps, nextState) {

    const { peoples, loginUser} = nextProps;
    const propPeoples = this.props.peoples;
    const propLocation = this.props.loginUser.current_location;


    if( loginUser.id && (loginUser.current_location !== propLocation) ) {
      return true;
    }
  
    if( propPeoples && (peoples.isFetching !== propPeoples.isFetching) ) {
      return true;
    }

    return false;
  }


  render() {

    return <div className="CityPeoplePage Page">

      <div className="headline">
        <h2>We are here!</h2>
      </div>

      <div className="button-close">
        <i className="fa icon-cancel" onClick={this.hanldeCloseRedBook}/>
      </div>

      <hr/>
      { this.renderPeoplesByState() }
    </div>
  }

  renderPeoplesByState =()=> {

    const {uname, peoples, redBook} = this.props;

    if( !peoples || peoples.isFetching ){
      return <div className="loading">
        <p><i className="fa fa-spinner fa-pulse"></i> Now loading peoples in this city, <br/>please wait a moment</p>
      </div>
    } else {

      if( peoples.ids.length === 0){

        return <div>
          <div className="nobody-here">
            <p>Now nobody stay in here.</p>
            <p>if you wanna communicate with people in here</p>
            <p>please make sure your GPS on and move to {redBook.countryName}</p>
          </div>
          { this.renderJoinThisCity(true) }
        </div>

      } else {
        return <div>
          { this.renderJoinThisCity(false) }
          { this.renderPeoples() }
        </div>
      }      
    }

  };

  renderJoinThisCity = (isNobody) =>{
    const { loginUser, redBook } = this.props;
    const { current_location, currentCity } = loginUser;
    let klassName = 'people'
    if( isNobody ){
      klassName = 'people nobody'
    }

    if( current_location && current_location.countryName === redBook.countryName ){

      if( currentCity !== redBook.uname ){
        return <div className={klassName}>
          <div className="proflie">
            <div className="photo">
              <img src={loginUser.picture}/>
            </div>
            <div className="name">
              {loginUser.username}
            </div>

            <div className="note">You are in {loginUser.current_location.countryName}. <br/> if you join this city, you can communicate others</div>
          </div>

          <div className="state">
            <button className="sign join" onClick={this.handleJoinUs.bind(this, redBook.id, redBook.uname, current_location.latlng)}>
              <i className="fa fa-map-signs" ref="join"/> join this city!</button>
          </div> 
        </div>
      }
      return false;
     
    }else{
      return false;
    }
  };

  renderPeoples = () => {

    const { peoples: {ids}, users } = this.props;

    return ids.map(function(id, i){
      let user = users[id];
      let isNoState = _.every(user.state, function(value){
        return !value
      });

      let klassName = 'people';
      if( i % 2 === 1 ) {
        klassName = 'people alt';
      }

      return <div key={i} className={klassName}>
        <div className="proflie">
          <div className="photo">
            <img src={user.picture}/>
          </div>
          {this.renderUserProfile(user, isNoState)}
          <div className="note">{user.note}</div>
        </div>

        { this.renderJoinThisCityStateByPerson(user, isNoState) }
      </div>
        
    }.bind(this))

  };

  renderUserProfile = (user, isNoState) => {
    let state = user.state;
    if( !state || isNoState ){
      return <div className="name">
        {user.username}
      </div>

    }else{
      return <div className="name">
        <a href={`http://facebook.com/${user.facebookId}`} target="blank">
        <i className="fa fa-facebook" /> {user.username}
        </a>
      </div>
    }


  };

  renderJoinThisCityStateByPerson = (user, isNoState) => {

    let state = user.state;

    if( !state || isNoState) {
      
      return <div className="state">
        <div className="sign">Don't touch me!</div>
      </div>

    } else {
      return <div className="state">

        { _.map( state, function(value, key, user){
          let klassName = `fa icon-${key}`

          if( value ) {
            return <div className="sign" key={key}><i className={klassName}/></div>
          }

        })}
        <div className="sign leave" alt="leave out here!" onClick={this.handleLeaveOut} key={'checkOut'}><i ref="leave" className="fa fa-sign-out"/></div>
      </div>

    }
  
  };

  handleJoinUs = (redBookId, uname, latlng, e) => {
    
    const {loginUser} = this.props;
    const node = findDOMNode(this.refs.join);
    node.className = 'fa fa-spinner fa-pulse';

    if( loginUser.currentCity ){
      this.props.checkOutHere(loginUser.currentCity);  
    }

    this.props.checkInHere(redBookId, uname, latlng);
  };

  handleLeaveOut = (e) => {
    const {loginUser} = this.props;
    const node = findDOMNode(this.refs.leave);
    node.className = 'fa fa-spinner fa-pulse';

    this.props.checkOutHere(loginUser.currentCity); 
  };


  hanldeCloseRedBook = () => {
    this.props.pushState(`/guide/${this.props.uname}`)
  };
}

CityPeoplePage.propTypes = {
  pushState: PropTypes.func.isRequired,
}


function mapStateToProps(state) {

  const {
    entities : { users, redBooks },
    pagination: { peoplesByUname },
    routing: { path }
  } = state

  let uname = /\/guide\/(.*)\/people/.exec(path)[1];  
  let redBookId = null;
  for ( let id in redBooks ){
    if( redBooks[id].uname === uname ){
      redBookId = id;
      break;
    }
  }


  return {
    loginUser: state.login,
    redBook: redBooks[redBookId],
    users: users,
    peoples: peoplesByUname[uname],
    uname: uname
  }
}

export default connect(mapStateToProps, {
  checkInHere,
  checkOutHere,
  
  pushState,
  fetchCityPeoples
})(CityPeoplePage)