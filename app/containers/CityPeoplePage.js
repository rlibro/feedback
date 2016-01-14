import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { pushPath as pushState, replacePath } from 'redux-simple-router'
import { checkInHere, checkOutHere } from '../actions'
import { fetchCityPeoples } from '../actions'

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
        <p>if you need my help, contact me!</p>
      </div>

      <div className="button-close">
        <i className="fa fa-times" onClick={this.hanldeCloseRedBook}/>
      </div>

      {this.renderCheckIn()}

      <hr/>

      {this.renderPeoplesByState()}
    </div>
  }

  renderCheckIn = () =>{
    const { loginUser, redBook } = this.props;
    const { current_location, currentCity } = loginUser;

    if( current_location && current_location.countryName === redBook.countryName ){

      if( currentCity === redBook.uname ){
        return <div className="check-in">
          <button onClick={this.props.checkOutHere.bind(null, redBook.uname)}>Check-Out</button>
        </div>       
      } else {
        return <div className="check-in">
          <button onClick={this.props.checkInHere.bind(null, redBook.id, redBook.uname, current_location.latlng)}>Check-In</button>
        </div> 
      }
     
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
        <p>현재 이곳에 머물고 있는 사람이 없습니다.</p>
        <p>이곳에서 다른 사람과 교류해보세요.</p>
        {this.renderCheckIn()}
      </div>

    }

    return ids.map(function(id, i){
      const user = users[id];

      return <div key={i}>
        <div className="photo">
          <img src={user.picture}/>
        </div>
        <a href={`http://facebook.com/${user.facebookId}`} target="blank">{user.username}</a>
      </div>

    })

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