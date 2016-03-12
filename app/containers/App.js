import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { fetchRedBooks } from '../actions'
import { updateLoginUserInfo, logOutUser } from '../actions'
import { resetErrorMessage, facebookLogin, updateAppState } from '../actions'

import Header from '../components/Header'
import SideBar from '../components/SideBar'
import CurrentLocation from '../components/CurrentLocation'
import Explore from '../components/Explore'

import RedBookListByCountry from '../components/RedBookListByCountry';
import RedBookStatics from '../components/RedBookStatistics';

import RedBookList from '../components/RedBookList'
import Footer from '../components/Footer'

function fetchRedBooksFromServer(props) {
  props.fetchRedBooks()
}

function getRedBoodCardClassName(index, className){

  switch( index % 3 ){
    case 0:
      className += ' left';
      break;
    case 1:
      className += ' middle';
      break;
    case 2:
      className += ' right';
      break;
  }

  if( index % 2 === 0 ){
    className += ' odd'
  } else {
    className += ' even'
  }

  return className;
}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      redBookId: null
    }
  }

  /**
   * 처음에 무조건 레드북을 가져온다.
   * 새로 업데이트된 레드북은 새로 고침한다. 
   */   
  componentWillMount() {
    fetchRedBooksFromServer(this.props);

    Parse.Cloud.run('statCounts').then(function(count) {
      this.props.updateAppState({statCounts:count});
    }.bind(this));
  }

  /**
   * 레드북 목록을 가져왔는데 실제 필요한 레드북이 없으면 초기화면으로 보내야한다.
   * 로그인 했는데, Email 주소가 없으면 프로필 페이지로 이동시켜야한다. 
   */
  componentWillReceiveProps(nextProps) {

    const { noteState:{ isFetching }, 
            appState: {isValidCreate},
            params:{uname}, 
            routing:{ pathname },
            loginUser,
            entities:{ redBooks } 
    } = nextProps;

    let redBookId = null; 
    let isGuidePage = pathname.indexOf('/guide') > -1;
    let isCreatePage = pathname.indexOf('/create/') > -1;

    // 가이드 페이지일 경우엔, 레드북 아이디를 뽑아내서 넣어준다. 
    if( isGuidePage && uname && isFetching.redbooks === 'DONE' ) {

      for ( let id in redBooks ){
        if( redBooks[id].uname === uname ){
          redBookId = id;
          break;
        }
      }

      if( redBookId ){
        this.setState({
          redBookId : redBookId
        });
      } else {
        browserHistory.push('/');    
      }
    }

    // 레드북 생성 페이지일 경우, 
    if( isCreatePage && ( !isValidCreate || !loginUser.id ) ) {
      browserHistory.push('/');
    }

    // 로그인 했는데, 이메일이 없으면 제대로 가입된게 아니야!!
    if( loginUser.id && (!loginUser.nationality||!loginUser.email) && pathname !== '/register' ){
      browserHistory.push(`/register`); 
    }
  }  

  render() {
    const { loginUser, redBooks, entities, routing:{pathname}, appState} = this.props;
    let klass = (pathname !== '/') ? 'sub':''

    return (
      <div id="app" className={klass}>
        <Header 
          onLogin={this.handleFacebookLogin}
          onLogOut={this.handleLogOut}
          />

        <CurrentLocation />
        <SideBar 
          onLogin={this.handleFacebookLogin}
          onLogOut={this.handleLogOut}
        />

        {this.renderErrorMessage()}

        <Explore  />
        
        {this.renderLoadingRedBooks()}
        {this.renderSearchBooks()}
        {this.renderRedBookList()}
        {this.renderChildPage()}

        <Footer />
      </div>
    )
  }

  componentDidMount() {

    window.fbAsyncInit = function() {

      Parse.FacebookUtils.init({
        appId      : window.__FaceBookAppID,  
        cookie     : true,
        xfbml      : true,
        version    : 'v2.4'
      });
      delete window.__FaceBookAppID;

      this.props.updateAppState({loadedFacebookSDK: true});
      
      const sessionUser = Parse.User.current();
      if( sessionUser ){
        this.props.updateLoginUserInfo(sessionUser.toJSON());

        if( typeof ga === 'function'){
          ga('set', 'userId', sessionUser.id); // 로그인한 User-ID를 사용하여 User-ID를 설정합니다.
        }


      } else {
        //console.log('세션 유저 없으면 아무일도 없어 그냥 로그인해!!!')
      }

    }.bind(this);

    // Load the SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

  }

  renderLoadingRedBooks = () =>{
    const { noteState:{isFetching} } = this.props;
 
    if( isFetching.redbooks === 'REQUESTING' ){ 
      return <div className="LoadingState">
        <div className="loading">
          <h2> <i className="fa fa-circle-o-notch fa-spin" /> loading...</h2>
        </div>
        <div className="dimmed"></div>
      </div>
    } else {
      return <div className="LoadingState hide">
      </div>;
    }

  };

  renderErrorMessage = () => {
    const { errorMessage } = this.props
    if (!errorMessage) {
      return null
    }

    return (
      <p style={{ backgroundColor: '#e99', padding: 10 }}>
        <b>{errorMessage}</b>
        {' '}
        (<a href="#"
            onClick={this.handleDismissClick.bind(this)}>
          Dismiss
        </a>)
      </p>
    )
  };

  renderSearchBooks = () => {

    const { loginUser, entities, 
      routing:{ pathname }, 
      appState: {search} } = this.props

    let serchResult = {
      isFetching: false, isSearchResult: true, ids: search.result
    }

    let klassName = 'wrap-SearchList';

    if( pathname !== '/' ) {  // 루트에서만 검색이 가능하다.
      klassName += ' hide'
    }

    if( search.mode === 'book' && 0 < search.result.length ) {
      return <div className={klassName}>
        <h4>{`Search Results: ${search.result.length}`}</h4>
        <RedBookList
          redBooks={serchResult} 
          onGetRedBoodCardClassName={getRedBoodCardClassName}
          />
      </div>

    } else {
      return <div className="wrap-SearchList hide"></div>;
    }

  };

  renderRedBookList = () => {

    const { loginUser,redBooks, entities,  
      routing:{ pathname },
      appState } = this.props
    let klassName = 'wrap-RedBookList'

    if( 0 < appState.search.result.length ) { 
      klassName += ' hide';
    }
    
    return <div className={klassName}>

      <RedBookListByCountry {...this.props} 
        onGetRedBoodCardClassName={getRedBoodCardClassName} />
      
      <RedBookStatics />

      <RedBookList 
        redBooks={redBooks} 
        onGetRedBoodCardClassName={getRedBoodCardClassName}
        />
    </div>

  };

   renderChildPage = () => {

    const { 
      routing:{ pathname }, 
      params:{uname}, entities:{ redBooks } } = this.props;
    const { redBookId } = this.state;
    let klassName = 'detail';
    let cityName = null, countryName = null, redBook=null;

    let route = pathname.split('/')[1];

    switch( route ){
      case 'guide':
        [ cityName, countryName ] = uname.split(',');  
        cityName = cityName.replace('_', ' ');
        countryName = countryName.replace('_', ' ');

        if( !redBookId ) { return false }

        redBook = redBooks[redBookId];
        return <div className={klassName}>
          {this.props.children && 
            React.cloneElement(this.props.children, {
              redBook: redBook,
              cityName: cityName,
              countryName: countryName
            })
          }
        </div>
 

      case 'notes':
      case 'profile':
      case 'register':
      case 'create':
      case 'rlibrians':
      return <div className={klassName}>
        {this.props.children}
      </div> 

      default:
      klassName = 'detail hide';
      return <div className={klassName}>
        {this.props.children}
      </div> 

    }

  };

  handleFacebookLogin = () => {
    this.props.facebookLogin(function(result){

      this.props.updateAppState({
        tringLogin: false
      })

      if( result.success ){
        const userInfo = result.success.parseUser.toJSON();
        this.props.updateLoginUserInfo(userInfo);
      } else {

        Parse.FacebookUtils.unlink(
          Parse.User.current(), 
          function success(a){
            console.log('unlink success', a)
          }, 
          function error(b){
            console.log('unlink error', b)
          }
        );
        Parse.User.logOut();


        console.log(result.error);
        if( result.error.code === 190){
          this.handleLogOut();
        }

      }
      
    
    }.bind(this));    
  };

  handleLogOut = (e) => {
    const { loginUser } = this.props;
    Parse.User.logOut();
    this.props.logOutUser();
    browserHistory.push('/');
  };

  handleDismissClick = (e) => { 
    this.props.resetErrorMessage()
    e.preventDefault()
  };

}

App.propTypes = {
  errorMessage: PropTypes.string,
  resetErrorMessage: PropTypes.func.isRequired,
  facebookLogin: PropTypes.func.isRequired,
  updateLoginUserInfo: PropTypes.func.isRequired,
  children: PropTypes.node
}

function mapStateToProps(state, ownProps) {

  return {
    routing: state.routing.locationBeforeTransitions,
    appState: state.appState,
    noteState: state.noteState,
    errorMessage: state.errorMessage,
    loginUser: state.login,
    redBooks: state.pagination.redBooks,
    entities: state.entities
  }
}

export default connect(mapStateToProps, {
  facebookLogin,
  resetErrorMessage,
  fetchRedBooks,
  updateAppState,
  updateLoginUserInfo,
  logOutUser
})(App)