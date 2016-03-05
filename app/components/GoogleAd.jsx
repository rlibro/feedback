import React, { Component, PropTypes } from 'react';

export default class GoogleAd extends Component {
	render() {
		return (
			<ins className="adsbygoogle" 
				style={{
					display: 'block', 
					height: this.props.height, 
					width: this.props.width
				}} 
				data-ad-client={this.props.client} 
				data-ad-slot={this.props.slot} 
				data-ad-format={this.props.format}></ins>
		)
	}

	componentDidMount () {
		if(typeof window !== 'undefined') {
      try {
  			(window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch(e){
        console.log(e);
      }
		}
	}
}

GoogleAd.propTypes = {
	height: React.PropTypes.string,
	width: React.PropTypes.string,
	client: React.PropTypes.string.isRequired,
	slot: React.PropTypes.string.isRequired,
	format: React.PropTypes.string.isRequired
}

GoogleAd.defaultProps = {
  height: '100%',
  width: '100%'
};