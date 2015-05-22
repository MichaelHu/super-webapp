function classExtend(protoProps, staticProps){

    var parentClass = this;
    var subClass;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if(protoProps && Utils.has(protoProps, 'constructor')){
        subClass = protoProps.constructor;
    }
    else{
        subClass = function(){ return parentClass.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    Utils.extend(subClass, parentClass, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = subClass; };
    Surrogate.prototype = parentClass.prototype;
    subClass.prototype = new Surrogate;

    function _superFactory(name, fn) {
        return function() {
            var tmp = this._super;

            /* Add a new ._super() method that is the same method */
            /* but on the super-class */
            this._super = parentClass.prototype[name] || function(){};

            /* The method only need to be bound temporarily, so we */
            /* remove it when we're done executing */
            var ret = fn.apply(this, arguments);
            this._super = tmp;

            return ret;
        };
    }

    if(protoProps){
        // Note: Does not take effect when name is `"constructor"`
        for(var name in protoProps){
            subClass.prototype[name] = 
                typeof protoProps[name] === 'function'
                    && typeof parentClass.prototype[name] === 'function'
                ? _superFactory(name, protoProps[name])
                : protoProps[name];
        }
    } 

    subClass._superClass = parentClass; 
    
    return subClass;
}
