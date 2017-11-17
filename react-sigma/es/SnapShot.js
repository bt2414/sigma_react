import React from 'react';
import "../sigma/sigma.renderers.snapshot";

class SnapShot extends React.Component {
  constructor(props) {
		super(props);
   		const s = this.props.sigma;
		this.render = () => null;
		if( this.props.download ){
			s.renderers[0].snapshot({download: true});
		}

	}
}

SnapShot.propTypes = {
	sigma: typeof sigma === 'function' ? require('prop-types').instanceOf(sigma) : require('prop-types').any
	download: require('prop-types').bool
};

export default SnapShot;
