import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { updateNoteState } from '../actions'

class RedBookCover extends Component {

  constructor(props){
    super(props);

    this.state = {
      showLoginLayer : false
    }
  }

  /**
   * 사용자 위치 정보가 확인된 경우에만 다시 그림
   */
  shouldComponentUpdate(nextProps, nextState) {
    const { redBook, loginUser } = nextProps;
    const { showLoginLayer } = nextState;

    // 로그인한 경우에 업데이트
    if( loginUser && ( loginUser.id !== this.props.loginUser.id ) ) {
      return true;
    }

    // 위치를 로드하면 업데이트
    if( loginUser && ( loginUser.current_location !== this.props.loginUser.id ) ) {
      return true;
    }

    if( showLoginLayer !== this.state.showLoginLayer ){
      return true;
    }


    return false;
  }

  render(){

    const { redBook } = this.props;
    const style = {
      color: 'white',
      backgroundSize: 'cover',
      backgroundImage: 'url(' + redBook.coverImage + ')',
      WebkitTransition: 'all', // note the capital 'W' here
      msTransition: 'all' // 'ms' is the only lowercase vendor prefix
    };

    return <div style={style} className="RedBookCover">
      <div className="shadow"></div>
      <div className="cover-title-header">  
        <h2 className="city-name">{redBook.cityName}</h2>
        <h4 className="country-name">{redBook.countryName}</h4>        
      </div>
      <div className="button-close">
        <i className="fa fa-times" onClick={this.handleCloseRedBook}/>
      </div>
      {this.renderLoginLayer()}
      {this.renderButtons()}
    </div>
  }

  renderLoginLayer = () => {

    const { loginUser, appState:{ loadedFacebookSDK, tringLogin } } = this.props;
    const { showLoginLayer } = this.state;

    if( !loadedFacebookSDK || loginUser.id || !showLoginLayer) {
      return false;
    }

    return <div className="login-layer">

      {function(){
        if( tringLogin ){
          return <button className="fb-login">
            <i className="fa fa-spinner fa-pulse"/> Login with Facebook
          </button>
        } else {
          return <button className="fb-login" onClick={this.props.onLogin}>
            If you want to leave note,<br/> please <span className="btn"><i className="fa fa-facebook"/> Login with Facebook</span>
          </button>
        }
      }.bind(this)()}

    </div>
  };

  renderButtons = () => {

    const { loginUser } = this.props;    
    return <div className="controls">
      <button onClick={this.handleCityMap}><i className="fa icon-map" /> Map</button>
      {function(){
        if( loginUser && loginUser.id && loginUser.current_location ){
          return <button onClick={this.handleCityPeople}><i className="fa icon-people" /> People</button>
        } else {
          return <button className="disabled"><i className="fa icon-people" /> People</button>
        }
      }.bind(this)()}

      {function(){
        if( loginUser && loginUser.id ){
          return <button onClick={this.handleNewNote}><i className="fa icon-add-note" /> Note</button>
        } else {
          return <button onClick={this.handleLoginLayer}><i className="fa icon-add-note" /> Note</button>
        }
      }.bind(this)()}
    </div>
  };

  handleCityMap = (e) => {
    const {redBook} = this.props;
    browserHistory.push(`/guide/${redBook.uname}/map`);
  };

  handleCityPeople = (e) => {
    const {redBook} = this.props;
    browserHistory.push(`/guide/${redBook.uname}/people`);
  };

  handleNewNote = (e) => {
    const {redBook, noteState:{editingId}} = this.props;

    if( editingId ) {
      alert('please complete your editing note');

    } else {
      browserHistory.push(`/guide/${redBook.uname}/create`);
    }
  };

  handleCloseRedBook = (e) => {
    const { noteState } = this.props;

    if( noteState.editingId ) {
      return alert('you are editing a note!');
    }

    this.props.updateNoteState({ places: [] });
    browserHistory.replace('/');
  };

  handleLoginLayer = (e) => {
    this.setState({
      showLoginLayer: !this.state.showLoginLayer
    })
  }

}

RedBookCover.propTypes = {
  loginUser: PropTypes.object.isRequired,
  noteState: PropTypes.object.isRequired,

  // 외부 주입
  redBook: PropTypes.object.isRequired,
  onLogin: PropTypes.func.isRequired,
  onLogOut: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    appState: state.appState,
    loginUser: state.login,
    noteState: state.noteState,
  }
}

export default connect(mapStateToProps, {
  updateNoteState
})(RedBookCover)
