import React, { Component, PropTypes } from 'react';

export default class RedBookCover extends Component {

  render(){
    return <div className="RedBookCover">
      RedBookCover 컴포넌트

      <div className="controls">
        <button>체크인</button>
      </div>
    </div>
  }
}

RedBookCover.propTypes = {
  loginUser: PropTypes.object.isRequired
}
