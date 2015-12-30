import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadAllCounties, loadAllRedBooks } from '../actions'
import { pushPath as pushState } from 'redux-simple-router'
import Explore from '../components/Explore'
import Header from '../components/Header'
import { resetErrorMessage } from '../actions'

function loadData(props) {
  const { login } = props    
  //props.loadAllCounties()
  props.loadAllRedBooks()
}

class App extends Component {

  componentWillMount() {
    loadData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.fullName !== this.props.fullName) {
      loadData(nextProps)
    }
  }

  handleDismissClick = (e) => { 
    this.props.resetErrorMessage()
    e.preventDefault()
  }

  handleFacebookLogin = (e) => {
    window.open('/facebook/login', '', 'width=600, height=550');
  }

  handleMoveMyNote = (e) => {
    this.props.pushState('/guide/note')
  }

  handleChange = (nextValue) => {
    this.props.pushState(`/guide/${nextValue}`, nextValue);
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

  renderListOfCountries = () => {

    const { countries, entities } = this.props;
    const { isFetching } = countries;
    const ids = countries.ids || [];
  
    if( isFetching ){
      return <h2>레드북이 등록된 나라를 로드중입니다...</h2>
    } 

    return <ul>{ ids.map((id, i) => {

      const country = entities.countries[id];

      return <li key={i}>
        <a href={'/' + country.iso3}>
          <img src={country.flagImage} /><span>{country.name}({country.readBookCount})</span>
        </a>
      </li>

    }) }</ul>
  

  }

  renderListOfRedBooks = () => {

    const { redBooks, entities } = this.props;
    const { isFetching } = redBooks;
    const ids = redBooks.ids || [];
   
    if( isFetching ){
      return <h2>레드북이 등록된 나라를 로드중입니다...</h2>
    } 

    return <ul>{ ids.map((id, i) => {

      const redBook = entities.redBooks[id];

      return <li key={i}>
        <a href={'#/guide/'+ redBook.id} onClick={this.openRedBook.bind(this,redBook)}>
          <h3>{redBook.cityName}<span>({redBook.noteCount})</span></h3>
          in <span>{redBook.countryName}</span>
        </a>
      </li>

    }) }</ul>
  
  }

  openRedBook = (redBook, e) => {
    this.props.pushState(`/guide/${redBook.id}`, {redBookId:redBook.id, redBookName: redBook.cityName});
    e.preventDefault()
  }

  render() {
    const { children, inputValue, login, countries, redBooks } = this.props
    
    return (
      <div id="app">
        <Header 
          onLogin={this.handleFacebookLogin} 
          onMoveMyNote={this.handleMoveMyNote} 
          login={login} />

        <Explore value={inputValue}
                 onChange={this.handleChange} />
        <hr />
        {this.renderListOfCountries()}

        <hr />
        {this.renderListOfRedBooks()}

        <hr />
        {this.renderErrorMessage()}
        {children}
      </div>
    )
  }
}

App.propTypes = {
  // Injected by React Redux
  errorMessage: PropTypes.string,
  resetErrorMessage: PropTypes.func.isRequired,
  pushState: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
  // Injected by React Router

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
  loadAllRedBooks
})(App)