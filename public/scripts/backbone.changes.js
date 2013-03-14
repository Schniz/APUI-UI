Backbone.Model.prototype.toJSON = function() {
    if (this._isSerializing) {
        return this.id || this.cid;
    }
    this._isSerializing = true;
    var json = _.clone(this.attributes);
    _.each(json, function(value, name) {
        (_.isFunction(value.toJSON) && (json[name] = value.toJSON())) ||
        (_.isArray(value) && _.each(value, function(value, name) {
          _.isFunction(value.toJSON) && (this[name] = value.toJSON());
        }, value))
    });
    this._isSerializing = false;
    return json;
};