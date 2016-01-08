import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import Select from 'react-select';


export default class NewRedBookForm extends Component {

  renderFormWrite = () => {

    const { loginUser, newRedBook, onChangeCityName, onCloseRedBook, onSubmitRedBook } = this.props;

    // 기본 도시는 현재도시를 선택하고
    // 이미 있는 도시는 라벨에 선택 못하도록 설정이 필요
    var options = newRedBook.cities.map((city, i)=>{
      return {
        value: i,
        label: city
      }
    });

    return <div className="RedBookNoteForm">
      <div className="note-form-header">
        <Select name="form-field-name" className="city-select"
        placeholder="Plases, select the city!"
        value={newRedBook.cityName}
        options={options} onChange={onChangeCityName.bind(this)} />
      </div>
  
      <textarea ref="textarea" className="text" autoFocus={true} placeholder="Share your useful experiences of this city!"></textarea>
        
      <div className="note-form-footer">
        <button className="cancel" onClick={onCloseRedBook}>Cancel</button>
        <button className="create" onClick={onSubmitRedBook}>Create</button>
      </div>
    </div>
  };

  renderFormReady = () => {
    const { loginUser } = this.props;

    return <div className="RedBookNoteForm">
      <div className="note-form-header">
        <button>정보</button>
        <button>사진</button>
        <button>마커</button>
      </div>
  
      <textarea className="text" placeholder="이 도시에서 경험한 유용한 정보를 공유하세요!"></textarea>
    </div>
  };

  render() {

    const { loginUser } = this.props;
    return loginUser.id ? this.renderFormWrite() : false;
    
  }

  handleSubmitNote = (e) => {

    const node = findDOMNode(this.refs.textarea);
    const text = node.value.trim();
    this.props.onSubmitNote(text);
    node.value = '';
    e.preventDefault()
  };

}

NewRedBookForm.propTypes = {
  loginUser: PropTypes.object.isRequired,
  onSubmitRedBook: PropTypes.func.isRequired,
  onChangeCityName: PropTypes.func.isRequired,
  onCloseRedBook: PropTypes.func.isRequired
}