import React from 'react';
import { embedProps } from './tools';
import '../sigma/main';

/**
 *
 * Sigma - React.JS flow-typed interface for Sigma js library - fastest opensource rendering engine for network graphs.
 * Sigma makes it easy to publish networks on Web pages, and allows developers to integrate network exploration in
 * rich Web applications.
 *
 * Parameter types
 * ```
 * type Sigma$Graph$Data = {
 *   nodes: [Sigma$Node],
 *   edges: [Sigma$Edge]
 * };
 *
 * type Sigma$Node = {
 *   id: string,
 *   label?: string,
 *   x?: number,
 *   y?: number,
 *   size?: number,
 *   color?: color
 * };
 *
 * type Sigma$Edge = {
 *   id: string,
 *   source: string,
 *   target: string,
 *   label?: string,
 *   color?: color
 * };
 * ```
 *
 *
 * @signature `<Sigma graph={graph} settings={settings} onClickNode={func}.../>`
 *
 * @param {CSS} style   CSS style description for main div holding graph, should be specified in React format
 * @param {Sigma$Settings} settings     js object with sigma initialization options, for full list see [sigma settings page](https://github.com/jacomyal/sigma.js/wiki/Settings)
 * @param {string} renderer     can be "webgl" or "canvas"
 * @param {Sigma$Graph$Data} graph   js object with array of nodes and edges used to initialize sigma
 * @param {Sigma$ErrorHandler} onSigmaException      set sigma callback for sigma exceptions / errors
 * @param {Sigma$EventHandler} onClickNode      set sigma callback for "clickNode" event (see below)
 * @param {Sigma$EventHandler} onOverNode      set sigma callback for "overNode" event
 * @param {Sigma$EventHandler} onOutNode      set sigma callback for "outNode" event
 * @param {Sigma$EventHandler} onClickEdge     set sigma callback for "clickEdge" event
 * @param {Sigma$EventHandler} onOverEdge      set sigma callback for "overEdge" event
 * @param {Sigma$EventHandler} onOutEdge      set sigma callback for "outEdge" event
 *
 * @example
 * Can be composed with sigma sub-components using JSX syntax
 * <Sigma renderer="webgl" style={{maxWidth:"inherit", height:"400px"}}
 *        settings={{drawEdges:false}}
 *        onOverNode={e => console.log("Mouse over node: " + e.data.node.label)}>
 *        graph={{nodes:["id0", "id1"], edges:[{id:"e0",source:"id0",target:"id1"}]}}>
 *   <RelativeSize initialSize={8}/>
 * </Sigma>
 *
 */

class Sigma extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = { renderer: false };
    let settings = this.props.settings ? this.props.settings : {};
    this.sigma = new sigma({ settings });
    this.initRenderer = this.initRenderer.bind(this);
    Sigma.bindHandlers(this.props, this.sigma);
    if (this.props.graph) {
      try {
        this.sigma.graph.read(this.props.graph);
      } catch (e) {
        if (this.props.onSigmaException) this.props.onSigmaException(e);
      }
    }
  }

  initRenderer(container) {
    if (container) {
      let options = { container };
      if (this.props.renderer) options.type = this.props.renderer;
      this.sigmaRenderer = this.sigma.addRenderer(options);
      this.sigma.refresh();
      this.setState({ renderer: true });
    } else if (this.sigmaRenderer) {
      this.sigma.killRenderer(this.sigmaRenderer);
      this.sigmaRenderer = null;
      this.setState({ renderer: false });
    }
  }

  componentWillUnmount() {
    this.sigma.kill();
    this.sigmaRenderer = null;
  }

  render() {
    let children = this.state.renderer ? embedProps(this.props.children, { sigma: this.sigma }) : null;
    return React.createElement(
      'div',
      { ref: this.initRenderer, style: this.props.style },
      children
    );
  }

  /**
  Initialize event handlers with sigma.
  
  Event handler function receives [Sigma Event](https://github.com/jacomyal/sigma.js/wiki/Events-API)
  with the structure of following type:
  ```
  type Sigma$Event = {
    data: {
      node?: Neo4j$Node, //for node events is sigma node data
      edge?: Neo4j$Edge, //for edge events is sigma edge data
      captor: {   // information about event handler, for instance position on the page {clientX, clientY}
        clientX: number,
        clientY: number
  }}}
  
  type Sigma$EventHandler = (node:Sigma$Event) => void
  
  ```
  **/

  static bindHandlers(handlers, sigma) {
    ["clickNode", "overNode", "outNode", "clickEdge", "overEdge", "outEdge", "clickStage"].forEach(event => {
      let handler = "on" + event[0].toUpperCase() + event.substr(1);
      if (handlers[handler]) {
        sigma.bind(event, handlers[handler]);
      }
    });
  }
}

Sigma.defaultProps = {
  settings: {
    defaultNodeColor: "#3388AA",
    defaultLabelSize: 8,
    defaultLabelColor: "#777",
    labelThreshold: 12,
    hoverFontStyle: "text-size: 11",
    batchEdgesDrawing: true,
    drawEdges: true,
    drawEdgeLabels: false
  },
  style: {
    maxWidth: "inherit",
    height: "400px"
  }
};
Sigma.propTypes = {
  settings: typeof Sigma$Settings === 'function' ? require('prop-types').instanceOf(Sigma$Settings).isRequired : require('prop-types').any.isRequired,
  renderer: require('prop-types').oneOf(['webgl', 'canvas', 'svg']),
  style: require('prop-types').object,
  children: require('prop-types').any,
  graph: typeof Sigma$Graph$Data === 'function' ? require('prop-types').instanceOf(Sigma$Graph$Data) : require('prop-types').any,
  onSigmaException: require('prop-types').func,
  onClickNode: require('prop-types').func,
  onClickEdge: require('prop-types').func,
  onOverNode: require('prop-types').func,
  onOutNode: require('prop-types').func,
  onOverEdge: require('prop-types').func,
  onOutEdge: require('prop-types').func,
  onClickStage: require('prop-types').func
};
export default Sigma;