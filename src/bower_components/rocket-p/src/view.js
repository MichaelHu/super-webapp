var View = (function(){

var viewOptions = [
        'model'
        , 'collection'
        , 'el'
        , 'id'
        , 'attributes'
        , 'className'
        , 'tagName'
        , 'events'
    ];

var delegateEventSplitter = /^(\S+)\s*(.*)$/;

var View = function(options){
    this.cid = Utils.uniqueId('view');
    options || (options = {});
    Utils.extend(this, Utils.pick(options, viewOptions));
    this._ensureElement();
    this.initialize.apply(this, arguments);
};


Utils.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div'

    , $: function(selector){
        return this.$el.find(selector);
    }

    , initialize: function(){}

    , render: function(){
        return this;
    }

    , remove: function(){
        this._removeElement();
        this.stopListening();
        return this;
    }

    , _removeElement: function(){
        this.$el.remove();
    }

    , setElement: function(element){
        this.undelegateEvents();
        this._setElement(element);
        this.delegateEvents();
        return this;
    }

    , _setElement: function(el){
        this.$el = el instanceof $ ? el : $(el);
        this.el = this.$el[0];
    }

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    , delegateEvents: function(events){
        if(!(events || (events = Utils.result(this, 'events')))) return this;
        this.undelegateEvents();
        for(var key in events){
            var method = events[key];
            if(!Utils.isFunction(method)) method = this[method];
            if(!method) continue;
            var match = key.match(delegateEventSplitter);
            var me = this;
            (function(){
                var _method = method;
                me.delegate(match[1], match[2], function(){_method.apply(me, arguments);});
            })();
        }
    }

    , delegate: function(eventName, selector, listener){
        // Namespace: delegateEvents + cid
        this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
    }

    , undelegateEvents: function(){
        if(this.$el) this.$el.off('.delegateEvents' + this.cid); 
        return this;
    }

    , undelegate: function(eventName, selector, listener){
        this.$el.off(eventName + '.delegateEvents' + this.cid, selector, listener);
    }

    , _createElement: function(tagName){
        return document.createElement(tagName);
    }

    , _ensureElement: function(){
        if(!this.el){
            var attrs = Utils.extend({}, Utils.result(this, 'attributes'));
            if(this.id) attrs.id = Utils.result(this, 'id');
            if(this.className) attrs['class'] = Utils.result(this, 'className');
            this.setElement(this._createElement(Utils.result(this, 'tagName')));
            this._setAttributes(attrs);
        }
        else{
            this.setElement(Utils.result(this, 'el'));
        }
    }

    , _setAttributes: function(attributes){
        this.$el.attr(attributes);
    }

});

View.extend = classExtend;

return View;


})();
