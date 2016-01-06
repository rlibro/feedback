import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadAllCounties, loadAllRedBooks, updateCurrentUserLocation } from '../actions'
import { pushPath as pushState } from 'redux-simple-router'
import Explore from '../components/Explore'
import Header from '../components/Header'
import RedBookList from '../components/RedBookList'
import { resetErrorMessage } from '../actions'

function loadData(props) {
  props.loadAllRedBooks()
}

class App extends Component {

  constructor(props){
    super(props)

    this.state = {
      checkCount: 2,
      isLoadedGoogle: false,
      message: ''
    }
  }

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
            onClick={this.handleDismissClick}>
          Dismiss
        </a>)
      </p>
    )
  }

  render() {
    const { children, inputValue, login, countries, redBooks, entities} = this.props
    
    return (
      <div id="app">
        <Header 
          onLogin={this.handleFacebookLogin}
          onMoveHome={this.handleChangePath.bind(this, '/')} 
          onMoveMyNote={this.handleChangePath.bind(this, 'note')} 
          onUpdateCurrentUserLocation={this.handleUpdateCurrentUserLocation}
          loginUser={login}
          message={this.state.message} />

        {this.renderErrorMessage()}

        {<Explore value={inputValue} />}

        <RedBookList 
          loginUser={login}
          redBooks={redBooks} 
          entities={entities} 
          onOpenRedBook={this.handleOpenRedBook}/>

        {children}
      </div>
    )
  }

  handleUpdateCurrentUserLocation = (location) => {
    this.props.updateCurrentUserLocation(location)
  }

  handleDismissClick = (e) => { 
    this.props.resetErrorMessage()
    e.preventDefault()
  }

  handleChangePath = (path, e) => {
    this.props.pushState(path);
    e.preventDefault()
  }

  handleOpenRedBook = (redBook, e) => {
    this.props.pushState(`/${redBook.uname}`) //, { redBookId:redBook.id, cityName: redBook.cityName, countryName: redBook.countryName});
    e.preventDefault()
  }
}

App.propTypes = {
  // Injected by React Redux
  errorMessage: PropTypes.string,
  resetErrorMessage: PropTypes.func.isRequired,
  pushState: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
  // Injected by React Router

  updateCurrentUserLocation: PropTypes.func.isRequired,
  loadAllCounties: PropTypes.func.isRequired,
  children: PropTypes.node
}

function mapStateToProps(state) {

  return {

    errorMessage: state.errorMessage,
    inputValue: state.searchKeyword,
    login: state.login,
    countries: state.pagination.countries,
    redBooks: state.pagination.redBooks,
    entities: state.entities
  }
}

export default connect(mapStateToProps, {
  resetErrorMessage,
  pushState,
  loadAllCounties,
  loadAllRedBooks,
  updateCurrentUserLocation
})(App)