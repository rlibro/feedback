import React, { Component, PropTypes } from 'react';

export default class Footer extends Component {

  render(){
    return <div className="Footer">
      <p className="copyright"><i className="fa fa-book" /> <a href="mailto:miconblog@gmail.com">rlibro.com</a> &copy;<span>2016</span></p>
      <p className="facebook"><a href="http://facebook.com/wearemooving" target="blank"><i className="fa fa-facebook-official" /> wearemooving</a></p>
    </div>
  }
}

Footer.propTypes = {}
