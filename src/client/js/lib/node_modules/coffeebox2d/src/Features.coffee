
exports.Features = Features = class Features
    

###
// We use contact ids to facilitate warm starting.
var Features = Class.create();
Features.prototype = 
{
	//
	set_referenceFace: function(value){
		this._referenceFace = value;
		this._m_id._key = (this._m_id._key & 0xffffff00) | (this._referenceFace & 0x000000ff)
	},
	get_referenceFace: function(){
		return this._referenceFace;
	},
	_referenceFace: 0,
	//
	set_incidentEdge: function(value){
		this._incidentEdge = value;
		this._m_id._key = (this._m_id._key & 0xffff00ff) | ((this._incidentEdge << 8) & 0x0000ff00)
	},
	get_incidentEdge: function(){
		return this._incidentEdge;
	},
	_incidentEdge: 0,
	//
	set_incidentVertex: function(value){
		this._incidentVertex = value;
		this._m_id._key = (this._m_id._key & 0xff00ffff) | ((this._incidentVertex << 16) & 0x00ff0000)
	},
	get_incidentVertex: function(){
		return this._incidentVertex;
	},
	_incidentVertex: 0,
	//
	set_flip: function(value){
		this._flip = value;
		this._m_id._key = (this._m_id._key & 0x00ffffff) | ((this._flip << 24) & 0xff000000)
	},
	get_flip: function(){
		return this._flip;
	},
	_flip: 0,
	_m_id: null,
	initialize: function() {}};
