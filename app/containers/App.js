import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadAllCounties, loadAllRedBooks, updateCurrentUserLocation, updateLoginUser, findingKeyWord } from '../actions'
import { pushPath as pushState } from 'redux-simple-router'
import Explore from '../components/Explore'
import Header from '../components/Header'
import RedBookList from '../components/RedBookList'
import { resetErrorMessage } from '../actions'

function loadData(props) {
  props.loadAllRedBooks()
}

class App extends Component {

  componentWillMount() {

    loadData(this.props)
  }

  renderErrorMessage() {
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
  }

  render() {
    const { children, login, countries, redBooks, entities} = this.props
    
    return (
      <div id="app">
        <Header 
          onLogin={this.handleFacebookLogin}
          onMoveHome={this.handleChangePath.bind(this, '/')} 
          onMoveMyNote={this.handleChangePath.bind(this, 'note')} 
          onUpdateCurrentUserLocation={this.props.updateCurrentUserLocation}
          onUpdateLoginUser={this.props.updateLoginUser}
          loginUser={login} />

        {this.renderErrorMessage()}

        {<Explore 
          onFindThisKeyWord={this.props.findingKeyWord}
          />}

        <RedBookList 
          loginUser={login}
          redBooks={redBooks} 
          entities={entities} 
          onOpenRedBook={this.handleOpenRedBook}
          onCreateRedBook={this.handleCreateRedBook}
          />

        {children}
      </div>
    )
  }

  handleDismissClick = (e) => { 
    this.props.resetErrorMessage()
    e.preventDefault()
  };

  handleChangePath = (path, e) => {
    this.props.pushState(path);
    e.preventDefault()
  };

  handleOpenRedBook = (redBook, e) => {
    this.props.pushState(`/${redBook.uname}`)
    e.preventDefault()
  };

  handleCreateRedBook = (loc, e) => {

    const { cityName, countryName } = loc;

    location.href=`/redbooks/${cityName.replace(/\s/g,'_')},${countryName.replace(/\s/g,'_')}`;

    /**
     * 조건, 로그인 되어 있고 로그인 정보에 current Location이 있어야 한다. 
     * 
     * 1. 아직 생성 가능한 도시 목록을 보여준다. (현재 위치에 있는 나라중에 하나를 고른다. )
     * 어떤  
     */

    console.log('TODO: create RedBook', loc);
    //e.preventDefault();
  };
}

App.propTypes = {
  errorMessage: PropTypes.string,
  resetErrorMessage: PropTypes.func.isRequired,
  pushState: PropTypes.func.isRequired,
  updateCurrentUserLocation: PropTypes.func.isRequired,
  loadAllCounties: PropTypes.func.isRequired,
  children: PropTypes.node
}

function mapStateToProps(state) {

  return {
    errorMessage: state.errorMessage,
    login: state.login,
    countries: state.pagination.countries,
    redBooks: state.pagination.redBooks,
    entities: state.entities
  }
}

export default connect(mapStateToProps, {
  resetErrorMessage,
  pushState,
  findingKeyWord,
  loadAllCounties,
  loadAllRedBooks,
  updateCurrentUserLocation,
  updateLoginUser
})(App)