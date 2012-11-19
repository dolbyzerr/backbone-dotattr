(function(_, Backbone, undefined) {
    var oldSet = Backbone.Model.prototype.set;
    _.extend(Backbone.Model.prototype, {
        get: function(key) {
            try {
                return _.reduce(key.split('.'), function(attr, key) {
                    if (attr instanceof Backbone.Model)
                        return attr.attributes[key];

                    return attr[key];
                }, this.attributes);
            } catch (e) {
                return undefined;
            }
        },
        set: function(key, value, options){
            if(_.isString(key)){
                if(key.split(".").length > 1){
                    key = key.split(".");
                    setProperty = _.last(key);
                    po = this;
                    key.splice(-1, 1);
                    _.each(key, function(key, index){
                        po = po.get(key);
                    });
                    if(po instanceof Backbone.Model){
                        po.on("change", function(){
                            var args = ["change:" + key.join(":") +":"+ setProperty].concat(_.toArray(arguments));
                            this.trigger.apply(this, args);
                        }, this)
                        return po.set(setProperty, value, options);    
                    }else{
                        return po[setProperty] = value;
                    }
                    
                }else{
                    return oldSet.apply(this, arguments);
                }
            }
            return oldSet.apply(this, arguments);
        }
    });
})(window._, window.Backbone);
