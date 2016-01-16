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

    return <div className="CityPeoplePage">

      <div className="headline">
        <h2>We are here!</h2>
      </div>

      { this.renderCheckIn() }

      <div className="button-close">
        <i className="fa fa-times" onClick={this.hanldeCloseRedBook}/>
      </div>

      <hr/>

      {this.renderPeoplesByState()}
    </div>
  }

  renderCheckIn = () =>{
    const { loginUser, redBook } = this.props;
    const { current_location, currentCity } = loginUser;

    if( current_location && current_location.countryName === redBook.countryName ){

      if( currentCity !== redBook.uname ){
        return <div className="join-us">
          <button onClick={this.handleJoinUs.bind(this, redBook.id, redBook.uname, current_location.latlng)}><i ref="join"/>join this city!</button>
        </div> 
      }
      return false;
     
    }else{
      return false;
    }
  };

  renderPeoplesByState =()=> {

    const {uname, peoples} = this.props;

    if( !peoples || peoples.isFetching ){
      return <div className="loading">
        <p><i className="fa fa-spinner fa-pulse"></i> Now loading peoples in this city, <br/>please wait a moment</p>
      </div>
    } else {
      return this.renderPeoples()
    }

  };

  renderPeoples = () => {

    const { peoples: {ids}, users } = this.props;

    if( ids.length === 0){

      return <div className="nobody-here">
        <p>Now nobody stay in here.</p>
        <p>if you wanna communicate others</p>
        <p>please make sure your GPS on and join this city</p>
        {this.renderCheckIn()}
      </div>

    }

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

        { this.renderCheckInStateByPerson(user, isNoState) }
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

  renderCheckInStateByPerson = (user, isNoState) => {

    let state = user.state;

    if( !state || isNoState) {
      
      return <div className="state">
        <div className="sign">Don't touch me!</div>
      </div>

    } else {
      return <div className="state">

        { _.map( state, function(value, key, user){
          let klassName = `fa fa-${key}`

          if( value ) {
            return <div className="sign" key={key}><i className={klassName}/></div>
          }

        })}

      </div>

    }
  
  };

  handleJoinUs = (redBookId, uname, latlng, e) => {
      
    const node = findDOMNode(this.refs.join);
    node.className = 'fa fa-spinner fa-pulse';

    this.props.checkInHere(redBookId, uname, latlng);
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