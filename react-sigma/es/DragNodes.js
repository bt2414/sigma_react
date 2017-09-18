import React from 'react';
import "../sigma/sigma.plugins.dragNodes";

class DragNodes extends React.Component {
  constructor(props) {
		super(props);
    const s = this.props.sigma;
		this.render = () => null;
    const dragListener = new sigma.plugins.dragNodes(s, s.renderers[0]);
	}
}
DragNodes.propTypes = {
	sigma: typeof sigma === 'function' ? require('prop-types').instanceOf(sigma) : require('prop-types').any
};

export default DragNodes;
