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

      return <li key={i} className="redbook">
        <a href={`/${redBook.uid}`} onClick={this.handleOpenRedBook.bind(this,redBook)}>
          <h3>{redBook.cityName}<span>({redBook.noteCount})</span></h3>
          in <span>{redBook.countryName}</span>
        </a>
      </li>

    }) }</ul>
  
  }

  render() {
    const { children, inputValue, login, countries, redBooks } = this.props
    
    return (
      <div id="app">
        <Header 
          onLogin={this.handleFacebookLogin} 
          onMoveHome={this.handleMove.bind(this, '/')} 
          onMoveMyNote={this.handleMove.bind(this, 'note')} 
          loginUser={login} />

        {this.renderErrorMessage()}

        {/*<Explore value={inputValue}
                 onChange={this.handleChange} />*/}

        <hr />
        {this.renderListOfRedBooks()}

        <hr />
        {children}
      </div>
    )
  }

  handleDismissClick = (e) => { 
    this.props.resetErrorMessage()
    e.preventDefault()
  }

  handleMove = (path, e) => {
    this.props.pushState(path);
    e.preventDefault()
  }

  // 새로운 위치로 이동하는게 아니라 필터 처리하거나 DB에서 검색 해야한다. 
  handleChange = (nextValue) => {

    // pushState(path, state)
    //this.props.pushState(`/guide/${nextValue}`, nextValue);
  }

  handleOpenRedBook = (redBook, e) => {
    this.props.pushState(`/${redBook.uid}`, { redBookId:redBook.id, redBookName: redBook.cityName});
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