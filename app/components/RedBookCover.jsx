import React, { Component, PropTypes } from 'react';

export default class RedBookCover extends Component {

  componetDidMount() {
    
  }  

  render = () => {
    return <div id="RedBookCover" className="border red">
      RedBookCover 컴포넌트

      <div className="controls">
        <button>체크인</button>
      </div>
    </div>
  }
}

RedBookCover.propTypes = {
}
