import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import _ from 'lodash';

export default class RedBookNoteForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      lineCount: 0,
      isOpenedPlaceList: false
    }
  }

  componentWillReceiveProps(nextProps){

    const { pageForRedBook: { isFetching } } = nextProps;

    if( isFetching.addNote === 'DONE' ) {
      this.setState({
        lineCount: 0
      });
      
      this.props.onUpdateDataForRedBook({
        formText: ''
      });

      this.props.onAddNoteDone();
    }
  }

  render() {

    const { loginUser } = this.props;
    const { lineCount } = this.state;
    const { pageForRedBook: {formMode} } = this.props;
    const { appState, pageForRedBook:{formText} } = this.props;

    let klassName = 'text';
    let style = {height:'54px'}

    if( 1 < lineCount ) {
      style = {
        height: `${18 + (18 * lineCount)}px`
      }
    }

    if( formText.length > 0){
      klassName += ' data-edits';
    }

    return <div className="RedBookNoteForm">
      <div className="note-form-header">
        <p className="markdown-help">
          <a href="https://guides.github.com/features/mastering-markdown/" target="_blank" data-ga-click="Markdown Toolbar, click, help">
            <svg aria-hidden="true" height="16" role="img" version="1.1" viewBox="0 0 16 16" width="16">
              <path d="M14.85 3H1.15C0.52 3 0 3.52 0 4.15v7.69C0 12.48 0.52 13 1.15 13h13.69c0.64 0 1.15-0.52 1.15-1.15V4.15C16 3.52 15.48 3 14.85 3zM9 11L7 11V8l-1.5 1.92L4 8v3H2V5h2l1.5 2 1.5-2 2 0V11zM11.99 11.5L9.5 8h1.5V5h2v3h1.5L11.99 11.5z"></path>
            </svg>
            Styling with Markdown is supported
          </a>
        </p>
      </div>

      <div className="textarea-placeholder">
        <textarea ref="textarea" className={klassName} style={style}
                  onKeyUp={this.handleFormKeyUp}
                  defaultValue={formText}>
        </textarea>
        <div>
          # TITLE
          <br /> ## SUB TITLE
          <br /> contents here
          <br /> 
          <br /> 
          <br /> also, you can make a link like this:
          <br /> [ LINK NAME ][ MARKER NUMBER ]
          <br /> ex) [Rlibro][1] is everywhere!
        </div>
      </div>


      <div className="note-form-footer">
        {this.renderAttachPlaces()}
        {this.renderPostButton()}
      </div>

    </div>
  };

  renderAddPlaceButton = () => {

    const { appState: { loadedGoogleSDK } } = this.props;

    if( loadedGoogleSDK ) {
      return <button className="btn-add-place" onClick={this.handleOpenMap}>
        <i className="fa icon-plus"></i> Map
      </button>
    } 
  };


  renderAttachPlaces = () => {

    const { pageForRedBook: { places }, appState: { loadedGoogleSDK } } = this.props;

    if( !loadedGoogleSDK ) {
      return false;
    }

    var options = places.map(function(place){
      return {
        key: place.key,
        value: place.title,
        label: place.label
      }
    });


    return <div className="AttachedPlaces">
      <div className="title header-box" onClick={this.handleTogglePlace}>{`Places (${places.length})`}</div>
      <div className="button header-box" onClick={this.handleOpenMap}><i className="fa icon-plus"></i> Map</div>
      {this.renderPlaces()}
    </div>
  };

  renderPlaces = () => {

    const { isOpenedPlaceList } = this.state;
    const { pageForRedBook: { places } } = this.props;

    if( !isOpenedPlaceList ) { return false }


    if( places.length ){
      return <ul className="PlaceList">
        {places.map(function(place, i){
          return <li className="item" key={i} onClick={this.handleInsertPlace.bind(this, place)}>
            <div className="label"><i className="fa icon-up"></i> {place.label}</div>
            <div className="title" title={place.title}>{place.title}</div>
            <div className="btn-delete" onClick={this.handleDeletePlace.bind(this, place)}><i className="fa icon-trash-o"></i></div>
          </li>
        }.bind(this))}
      </ul>
    } else {
      return <ul className="PlaceList no-data">
        click +Map if you wanna add a place
      </ul>
    }


  };

  renderPostButton = () => {
    const { pageForRedBook: { isFetching } } = this.props;

    if( isFetching.addNote === 'READY' ) {
      return <button onClick={this.handlePostNote}>Post</button>
    } 

    if( isFetching.addNote === 'REQUESTING') {
      return <button disabled>
        <i className="fa fa-spinner fa-pulse"></i>
      </button>
    }
  };

  handleTogglePlace = () => {
    this.setState({isOpenedPlaceList: !this.state.isOpenedPlaceList})
  };

  handleInsertPlace = (place) => {

    let { pageForRedBook:{formText} } = this.props;
    let str = `[${place.title}][${place.label}]`;


    const node = findDOMNode(this.refs.textarea);
    node.value += '\n' + str;

    this.setState({isOpenedPlaceList: false})
    this.props.onUpdateDataForRedBook({
      formText: node.value
    });    

  };

  handleDeletePlace = (place, e) => {
    const { pageForRedBook: { places } } = this.props;

    let yes = confirm('Are you sure delete this place?');

    if( yes ){
       this.props.onUpdateDataForRedBook({
        places: _.without(places, place)
      });
    }

    e.stopPropagation();
  };

  handlePostNote = (e) => {

    const { pageForRedBook: {formMode, places} } = this.props; 
    const node = findDOMNode(this.refs.textarea);
    const text = node.value.trim();

    if( text.length === 0){
      return alert('the content is empty');
    }

    this.props.onAddNote(formMode, text, places);    
    node.value = '';
    e.preventDefault()
  };

  handleOpenMap = (e) => {

    this.props.onUpdateDataForRedBook({
      formMode: 'PLACE'
    });
    this.setState({
      isOpenedPlaceList: true
    })
  };

  handleFormKeyUp = (e) => {

    var length = e.target.value.length;
    if( length > 0) {
      e.target.className = 'text on data-edits';
    } else {
      e.target.className = 'text on';
    }

    if(e.key === 'Enter' || e.key === 'Backspace') {

      const node = findDOMNode(this.refs.textarea);
      const text = node.value;

      var lineCount = text.split('\n').length;

      if( e.key === 'Backspace' ) {
        lineCount--;
      }

      this.setState({
        lineCount: lineCount
      });
    }

  };

}

RedBookNoteForm.propTypes = {
  appState: PropTypes.object.isRequired,
  loginUser: PropTypes.object.isRequired,
  pageForRedBook: PropTypes.object.isRequired,
  onUpdateDataForRedBook: PropTypes.func.isRequired,
  onAddNote: PropTypes.func.isRequired,
  onAddNoteDone: PropTypes.func.isRequired
}
