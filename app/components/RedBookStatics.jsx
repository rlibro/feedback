import React, { Component, PropTypes } from 'react';

export default class RedBookStatics extends Component {

  render(){
    return <div className="RedBookStatics">
      <div className="StaticCard">
        <div><strong>29</strong> books of <strong>6</strong> countries</div>
        <div><strong>40</strong> notes & <strong>89</strong> places</div>
        <div><strong>16</strong> rlibrians</div>
        <div className="tagline">take this rlibro and travel all around world</div>
      </div>
    </div>
  }
}

RedBookStatics.propTypes = {
}
