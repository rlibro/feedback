import React, { Component, PropTypes } from 'react'
import { updateLoginUserInfo } from '../actions'
import { connect } from 'react-redux'
import { pushPath as pushState } from 'redux-simple-router'
import { findDOMNode } from 'react-dom';
import _ from 'lodash';

class RlibriansPage extends Component {
  
  constructor(props){
    super(props);

    this.state = {
      origin: [],
      users: []
    }
  }

  componentWillMount() {
    Parse.Cloud.run('rlibrians').then(function(res) {
      this.setState({
        origin: res.users,
        users:  res.users
      });
    }.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    const { appState: { search }, entities:{ users } } = nextProps;
    let rlibrians = [];

    if( search.mode === 'user'  && 0 < search.result.length ) {

      search.result.forEach(function(id){
        let user = users[id];

        rlibrians.push({
          username: user.username, 
          picture: user.picture,
          facebookId: user.facebookId, 
          id: user.id
        })
      });

      this.setState({
        users: rlibrians
      })

    } else {
      this.setState({
        users: this.state.origin
      })
    }
  }

  render() {

    const { users } = this.state;

    return <div className="RlibriansPage">
      <ul>{users.map(function(user, i){
        return <li className="user" key={i}>
          <a target="_blank" href={`https://www.facebook.com/${user.facebookId}`}>
            <img src={user.picture} />
            <p className="username">{user.username}</p>
          </a>
        </li>
      })}</ul>
    </div>
  }

}

RlibriansPage.propTypes = {
  updateLoginUserInfo: PropTypes.func.isRequired
};


function mapStateToProps(state) {

  return {
    appState: state.appState,
    entities: state.entities,
    loginUser: state.login
  }
}

export default connect(mapStateToProps, {
  updateLoginUserInfo,
  pushState
})(RlibriansPage)