var Events = (function(){


var slice = [].slice;
var eventSplitter = /\s+/;

// Implement fancy features of the Events API such as multiple event
// names `"change blur"` and jQuery-style event maps `{change: action}`
// in terms of the existing API.
function eventsApi(obj, action, name, rest){
    if(!name) return true;

    // Handle event maps.
    if(typeof name === 'object'){
        for(var key in name){
            obj[action].apply(obj, [key, name[key]].concat(rest));
        }
        return false;
    }

    // Handle space separated event names.
    if(eventSplitter.test(name)){
        var names = name.split(eventSplitter);
        for(var i=0, length = names.length; i<length; i++){
            obj[action].apply(obj, [names[i]].concat(rest));
        }
        return false;
    }

    return true;
}

function triggerEvents(events, args){
    var ev, i=-1, l=events.length, a1=args[0], a2=args[1], a3=args[2];

    switch(args.length){
        case 0: while(++i < l) (ev = events[i]).callback.call(ev.ctx); return;
        case 1: while(++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
        case 2: while(++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
        case 3: while(++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
        default: while(++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
    }
}


var Events = {

    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context){
        if(!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
        this._events || (this._events = {});
        var events = this._events[name] || (this._events[name] = []);
        events.push({callback: callback, context: context, ctx: context || this});
        return this;
    }


    , once: function(name, callback, context){
        if(!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
        var self = this;
        // Note: todo
        var once = function(){
            self.off(name, once); 
            callback.apply(this, arguments);
        };
        once._callback = callback;
        return this.on(name, once, context);
    }


    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    , off: function(name, callback, context){
        if(!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
    
        // Remove all callbacks for all events.
        if(!name && !callback && !context){
            this._events = void 0;
            return this;
        }
        
        var names = name ? [name] : Utils.keys(this._events);
        for(var i=0, length = names.length; i<length; i++){
            name = names[i];
            
            var events = this._events[name];            
            if(!events) continue;

            if(!callback && !context){
                delete this._events[name];
                continue;
            }


            var remaining = [];
            for(var j=0, k=events.length; j<k; j++){
                var event = events[j];
                if(
                    callback && callback !== event.callback
                        && callback !== event.callback._callback
                    || context && context !== event.context
                ){
                    remaining.push(event);
                }
            }

            if(remaining.length){
                this._events[name] = remaining;
            }
            else{
                delete this._events[name];
            }

        }

        return this;
    }


    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    , trigger: function(name){
        if(!this._events) return this; 
        var args = slice.call(arguments, 1);
        if(!eventsApi(this, 'trigger', name, args)) return this;
        var events = this._events[name];
        var allEvents = this._events.all;
        if(events) triggerEvents(events, args);
        if(allEvents) triggerEvents(allEvents, arguments);
        return this;
    }


    // Inversion-of-control versions of `on` and `once`. Tell *this* object to
    // listen to an event in another object ... keeping track of what it's
    // listening to. 
    , listenTo: function(obj, name, callback){
        var listeningTo = this._listeningTo || (this._listeningTo = {});
        var id = obj._listenId || (obj._listenId = Utils.uniqueId('l'));
        listeningTo[id] = obj;
        if(!callback && typeof name === 'object') callback = this;
        obj.on(name, callback, this);
    }


    , listenToOnce: function(obj, name, callback){
        if(typeof name === 'object'){
            for(var event in name) this.listenToOnce(obj, event, name[event]);
            return this;
        }
        var cb = function(){
            this.stopListening(obj, name, cb);
            callback.apply(this, arguments);
        };
        cb._callback = callback;
        return this.listenTo(obj, name, cb);
    }


    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    , stopListening: function(obj, name, callback){
        var listeningTo = this._listeningTo;
        if(!listeningTo) return this;
        var remove = !name && !callback;
        if(!callback && typeof name === 'object') callback = this;
        if(obj) (listeningTo = {})[obj._listenId] = obj;
        for(var id in listeningTo){
            obj = listeningTo[id];
            obj.off(name, callback, this);
            if(remove || Utils.isEmpty(obj._events)) delete this._listeningTo[id];
        }
        return this;
    }



};


Events.bind = Events.on;
Events.unbind = Events.off;

return Events;


})();

