var _Utils = (function(){

var toString = Object.prototype.toString;

function isObject(obj){
    var type = typeof obj;
    return type === 'function'
        || type === 'object'
            // typeof null == 'object'
            && !!obj;
}

function isArray(obj){
    if(Array.isArray){
        return Array.isArray(obj);
    }
    return toString.call(obj) === '[object Array]';
}


function isFunction(obj){
    return toString.call(obj) === '[object Function]';
}

function isString(obj){
    return toString.call(obj) === '[object String]';
}

function isArguments(obj){
    return toString.call(obj) === '[object Arguments]';
}

function isRegExp(obj){
    return toString.call(obj) === '[object RegExp]';
}

function isNumber(obj){
    return toString.call(obj) === '[object Number]';
}

function isDate(obj){
    return toString.call(obj) === '[object Date]';
}

function isError(obj){
    return toString.call(obj) === '[object Error]';
}

// Is a given array, string, or object empty?
// An "empty" object has no enumerable own-properties.
function isEmpty(obj){
    if(obj == null) return true;
    if(isArray(obj) || isString(obj) || isArguments(obj)) return obj.length === 0;
    for(var key in obj) if(has(obj, key)) return false;
    return true;
}


// Internal recursive comparison function for `isEqual`.
function eq(a, b, aStack, bStack) {
  // Identical objects are equal. `0 === -0`, but they aren't identical.
  // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
  if (a === b) return a !== 0 || 1 / a === 1 / b;
  // A strict comparison is necessary because `null == undefined`.
  if (a == null || b == null) return a === b;
  // Unwrap any wrapped objects.
  // if (a instanceof _) a = a._wrapped;
  // if (b instanceof _) b = b._wrapped;
  // Compare `[[Class]]` names.
  var className = toString.call(a);
  if (className !== toString.call(b)) return false;
  switch (className) {
    // Strings, numbers, regular expressions, dates, and booleans are compared by value.
    case '[object RegExp]':
    // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
    case '[object String]':
      // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
      // equivalent to `new String("5")`.
      return '' + a === '' + b;
    case '[object Number]':
      // `NaN`s are equivalent, but non-reflexive.
      // Object(NaN) is equivalent to NaN
      if (+a !== +a) return +b !== +b;
      // An `egal` comparison is performed for other numeric values.
      return +a === 0 ? 1 / +a === 1 / b : +a === +b;
    case '[object Date]':
    case '[object Boolean]':
      // Coerce dates and booleans to numeric primitive values. Dates are compared by their
      // millisecond representations. Note that invalid dates with millisecond representations
      // of `NaN` are not equivalent.
      return +a === +b;
  }

  var areArrays = className === '[object Array]';
  if (!areArrays) {
    if (typeof a != 'object' || typeof b != 'object') return false;

    // Objects with different constructors are not equivalent, but `Object`s or `Array`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor &&
                             isFunction(bCtor) && bCtor instanceof bCtor)
                        && ('constructor' in a && 'constructor' in b)) {
      return false;
    }
  }
  // Assume equality for cyclic structures. The algorithm for detecting cyclic
  // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
  var length = aStack.length;
  while (length--) {
    // Linear search. Performance is inversely proportional to the number of
    // unique nested structures.
    if (aStack[length] === a) return bStack[length] === b;
  }

  // Add the first object to the stack of traversed objects.
  aStack.push(a);
  bStack.push(b);

  // Recursively compare objects and arrays.
  if (areArrays) {
    // Compare array lengths to determine if a deep comparison is necessary.
    length = a.length;
    if (length !== b.length) return false;
    // Deep compare the contents, ignoring non-numeric properties.
    while (length--) {
      if (!(eq(a[length], b[length], aStack, bStack))) return false;
    }
  } else {
    // Deep compare objects.
    var keys = _keys(a), key;
    length = keys.length;
    // Ensure that both objects contain the same number of properties before comparing deep equality.
    if (_keys(b).length !== length) return false;
    while (length--) {
      // Deep compare each member
      key = keys[length];
      if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
    }
  }
  // Remove the first object from the stack of traversed objects.
  aStack.pop();
  bStack.pop();
  return true;
};


function isEqual(a, b){
    return eq(a, b, [], []);
}




function pick(obj, iteratee, context){
    var result = {}, key;

    if(obj == null) return result;
    if(isFunction(iteratee)){
        iteratee = optimizeCb(iteratee, context);
        for(key in obj){
            var value = obj[key];
            if(iteratee(value, key, obj)) result[key] = value;
        }
    }
    else{
        var keys = _flatten(arguments, false, false, 1);
        obj = new Object(obj);
        for(var i=0, length = keys.length; i<length; i++){
            key = keys[i];
            if(key in obj) result[key] = obj[key];
        }
    }
    return result;
}

// Internal implementation of a recursive `flatten` function.
function _flatten(input, shallow, strict, startIndex) {
    var output = [], idx = 0, value;
    for (var i = startIndex || 0, length = input && input.length; i < length; i++) {
        value = input[i];
        if (value && value.length >= 0 && (isArray(value) || isArguments(value))) {
            //flatten current level of array or arguments object
            if (!shallow) value = _flatten(value, shallow, strict);
            var j = 0, len = value.length;
            output.length += len;
            while (j < len) {
                output[idx++] = value[j++];
            }
        } else if (!strict) {
            output[idx++] = value;
        }
    }
    return output;
};

function flatten(array, shallow){
    return _flatten(array, shallow, false);
}






function each(obj, iteratee, context){
    if(obj == null) return obj;
    iteratee = optimizeCb(iteratee, context);
    var i, length = obj.length;
    if(length === +length){
        for(i=0; i<length; i++){
            iteratee(obj[i], i, obj);
        }
    }
    else{
        var keys = _keys(obj);
        for(i=0, length=keys.length; i<length; i++){
            iteratee(obj[keys[i]], keys[i], obj);
        }
    }
    return obj;
}


// Convert an object into a list of `[key, value]` pairs.
function _pairs(obj) {
    var keys = _keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
        pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
};


var _identity = function(value) {return value};
var _matches = function(attrs){
    var pairs = _pairs(attrs), length = pairs.length;
    return function(obj) {
        if (obj == null) return !length;
        obj = new Object(obj);
        for (var i = 0; i < length; i++) {
            var pair = pairs[i], key = pair[0];
            if (pair[1] !== obj[key] || !(key in obj)) return false;
        }
        return true;
    };
};
var _property = function(key){
    return function(obj){
        return obj == null ? void 0 : obj[key];
    };
};


function _cb(value, context, argCount){
    if(value == null) return _identity;
    if(isFunction(value)) return optimizeCb(value, context, argCount);
    if(isObject(value)) return _matches(value);
    return _property(value);
}


function map(obj, iteratee, context){
    if(obj == null) return [];
    iteratee = _cb(iteratee, context);
    var keys = obj.length !== +obj.length && _keys(obj),
        length = (keys || obj).length,
        results = Array(length),
        currentKey;

    for(var index=0; index<length; index++){
        currentKey = keys ? keys[index] : index;
        results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
}


function any(obj, predicate, context) {
    if (obj == null) return false;
    predicate = _cb(predicate, context);
    var keys = obj.length !== +obj.length && _keys(obj),
        length = (keys || obj).length,
        index, currentKey;
    for (index = 0; index < length; index++) {
        currentKey = keys ? keys[index] : index;
        if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
}




// Internal function that returns an efficient (for current engines) version
// of the passed-in callback, to be repeatedly applied in other Underscore
// functions.
var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
        case 1: return function(value) {
            return func.call(context, value);
        };
        case 2: return function(value, other) {
            return func.call(context, value, other);
        };
        case 3: return function(value, index, collection) {
            return func.call(context, value, index, collection);
        };
        case 4: return function(accumulator, value, index, collection) {
            return func.call(context, accumulator, value, index, collection);
        };
    }
    return function() {
        return func.apply(context, arguments);
    };
};


// create a (shallow-cloned) duplicate of an object.
function clone(obj){
    if(!isObject(obj)) return obj;
    return isArray(obj) ? obj.slice() : extend({}, obj);
}


function defaults(obj){
    if (!isObject(obj)) return obj;
    for (var i = 1, length = arguments.length; i < length; i++) {
      var source = arguments[i];
      for (var prop in source) {
        if (obj[prop] === void 0) obj[prop] = source[prop];
      }
    }
    return obj;
}

function has(obj, key){
    return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
}

function _keys(obj){
    if(!isObject(obj)) return [];
    if(Object.keys) return Object.keys(obj);
    var keys = [];
    for(var key in obj) {
        if(has(obj, key)){
            keys.push(key);
        }
    }
    return keys;
}

function keysIn(obj){
    if (!isObject(obj)) return [];
    var keys = [];
    for(var key in obj) keys.push(key);
    return keys;
}

function createAssigner(keysFunc){
    return function(obj){
        var length = arguments.length;
        if(length < 2 || obj == null) return obj;
        for(var index = 0; index < length; index++){
            var source = arguments[index],
                keys = keysFunc(source),
                len = keys.length;
            for(var i=0; i<len; i++){
                var key = keys[i];
                obj[key] = source[key];
            }
        }
        return obj;
    };
}

var extend = createAssigner(keysIn);




// If the value of the named `property` is a function then invoke it with the
// `object` as context; otherwise, return it.
function result(object, property, fallback){
    var value = object == null ? void 0 : object[property];
    if(value === void 0){
        value = fallback;
    }

    return isFunction(value) ? value.call(object) : value;
}


var idCounter = 0;
function uniqueId(prefix){
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
}



var methodMap = {
    'create': 'POST'
    , 'update': 'PUT'
    , 'patch': 'PATCH'
    , 'delete': 'DELETE'
    , 'read': 'GET'
};

function ajax(){
    return $.ajax.apply($, arguments);
}

var syncArgs = {};

function sync(method, model, options){
    var type = methodMap[method];

    syncArgs.method = method;
    syncArgs.model = model;
    syncArgs.options = options;

    Utils.defaults(
        options || (options = {})
        , {
            emulateHTTP: false
            , emulateJSON: false
        }
    );

    var params = {type: type, dataType: 'json'};

    if(!options.url){
        params.url = result(model, 'url') || urlError();
    }

    if(options.data == null
        && model
        && (
            method === 'create'
            || method === 'update'
            || method === 'patch'
        )
    ){
        params.contentType = 'application/json';
        params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    if(options.emulateJSON){
        params.contentType = 'application/x-www-form-urlencoded';
        params.data = params.data ? {model: params.data} : {};
    }

    if(options.emulateHTTP
        && (
            type === 'PUT'
            || type === 'DELETE'
            || type === 'PATCH'
        )
    ){
        params.type = 'POST';
        if(options.emulateJSON) params.data._method = type;
        var beforeSend = options.beforeSend;
        options.beforeSend = function(xhr){
            xhr.setRequestHeader('X-HTTP-Method-Override', type);
            if(beforeSend) return beforeSend.apply(this, arguments);
        };
    }

    if(params.type !== 'GET'){
        params.processData = false;
    }

    var error = options.error;
    options.error = function(xhr, textStatus, errorThrown){
        options.textStatus = textStatus;
        options.errorThrown = errorThrown;
        if(error) error.apply(this, arguments);
    };

    syncArgs.ajaxData = params.data;

    var xhr = options.xhr
        = Utils.ajax(extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
}

function urlError(){
    throw new Error('A "url" property or function must be specified');
}


function getRealDisplayInfo(el){
    var $el = $(el), el = $el.get(0);
    if($el.css('display') == 'none'){
        return 'none';
    }

    var c = el, p = c.parentNode;
    while(p && p.nodeType == 1){
        if(p.style.display == 'none'){
            return 'none';
        }
        c = p;
        p = c.parentNode;
    }
    return $el.css('display');
}

function isReallyDisplay(el){
    return getRealDisplayInfo(el) != 'none';
}




var tip = (function(){

    var tipTimer, tipBusy;

    /**
     * @param {string} text
     * @param {0=2} xpos: 0-center, 1-left, 2-right 
     * @param {0=2} ypos: 0-middle, 1-top, 2-bottom 
     * @param {number} duration: time(ms) to show
     */
    function _tip(text, xpos, ypos, duration/*ms*/){

        var $tip = $(".global-tip"),
            contHeight = $(window).height();

        duration = duration || 1500;
        xpos || ( xpos = 0 );
        ypos || ( ypos = 0 );
        
        if($tip.length == 0){
            $tip = $('<div class="global-tip"><span></span></div>');
            $('body').prepend($tip);
        }

        // New tip is always processed
        if(tipBusy){
            if(tipTimer){
                clearTimeout(tipTimer);
            }
        }

        tipBusy = true;

        $tip.find("span").text(text);

        switch(xpos){
            case 0:
                $tip.css('text-align', 'center');
                break;
            case 1:
                $tip.css('text-align', 'left');
                break;
            case 2:
                $tip.css('text-align', 'right');
                break;
        }

        switch(ypos){
            case 0:
                $tip.css('top', contHeight / 2 + 'px');
                break;
            case 1:
                $tip.css('top', '10px');
                break;
            case 2:
                $tip.css('bottom', '10px');
                break;
        }

        // Stop the animation and restore to the initial state
        $tip.css({"-webkit-transition": "none", "opacity":1});
        $tip.show();

        tipTimer = setTimeout(function(){
            /**
             * When several tips need to show at almost the same time,  
             * the previous animation will be stopped and a new one be started,
             * then the animation callback may not be invoked to restore to initial
             * state.     
             */
            $tip.animate({"opacity":0}, 300, "", function(){
                $tip.hide();
                $tip.css({"-webkit-transition": "none", "opacity":1});
                tipBusy = false;
            });
        }, duration);

    }

    return _tip;

})();





return {
    isObject: isObject
    , isFunction: isFunction
    , isArray: isArray
    , isEqual: isEqual
    , isEmpty: isEmpty
    , isRegExp: isRegExp

    , keys: _keys
    , defaults: defaults
    , extend: extend
    , result: result
    , pick: pick
    , flatten: flatten
    , each: each
    , map: map
    , any: any
    , clone: clone
    , has: has
    , uniqueId: uniqueId

    , ajax: ajax
    , sync: sync
    , syncArgs: syncArgs

    , tip: tip
    , isReallyDisplay: isReallyDisplay
};


})();

Utils = _Utils.extend(_, _Utils);
