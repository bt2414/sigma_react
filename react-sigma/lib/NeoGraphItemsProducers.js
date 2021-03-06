"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var palette = ["#5DA5DA", "#60BD68", "#B2912F", "#F15854", "#DECF3F", "#FAA43A", "#B276B2", "#F17CB0", "#4D4D4D"];

/*
	Default node and edge transformation for NeoCypher,
	class has 2 functions: node() and edge() which transform data from Neo4j format into Sigma.

	Also it iterates colors assignments from palette based on node.label and edge.type.
*/

var NeoGraphItemsProducers = function () {
	function NeoGraphItemsProducers() {
		_classCallCheck(this, NeoGraphItemsProducers);

		this._currentColor = 0;
		this._colorsMap = {};
	}

	_createClass(NeoGraphItemsProducers, [{
		key: "node",
		value: function node(_node) {
			return {
				id: _node.id,
				label: _node.properties.name,
				x: Math.random(),
				y: Math.random(),
				size: 1,
				color: this.colorsMap(_node.labels[0]),
				neo4j_labels: _node.labels,
				neo4j_data: _node.properties
			};
		}
	}, {
		key: "edge",
		value: function edge(_edge) {
			return {
				id: _edge.id,
				label: _edge.type,
				source: _edge.startNode,
				target: _edge.endNode,
				color: this.colorsMap(_edge.type),
				neo4j_type: _edge.type,
				neo4j_data: _edge.properties
			};
		}
	}, {
		key: "colorsMap",
		value: function colorsMap(label) {
			var color = this._colorsMap[label];
			if (!color) {
				color = palette[this._currentColor++ % palette.length];
				this._colorsMap[label] = color;
			}
			return color;
		}
	}]);

	return NeoGraphItemsProducers;
}();

exports.default = NeoGraphItemsProducers;