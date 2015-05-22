var Router = (function(){


var Router = function(options){
    options || (options = {});
    this.routes = options.routes || Utils.result(this, 'routes') || Router.routes;

    this.history = options.history || this.history || History;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
};

/**
 * 'named/optional/(y:z)'
 * 'optional(/:item)'
 */
var optionalParam = /\((.*?)\)/g;

/**
 * 'named/:param1/:param2'
 * 'named(/:param1)'
 */
var namedParam = /(\(\?)?:\w+/g;

/**
 * '*first/complex-*part/*rest'
 * '*anything'
 */
var splatParam = /\*\w+/g;
var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

var rParamName = /[:*](\w+)/g;
var rDefaultHandler = /^(_defaultHandler):(\w+)$/;

Utils.extend(Router, {

    viewClasses: {}

    , registerViewClass: function (action, viewClass){
        if(Utils.isEmpty(action) || !Utils.isFunction(viewClass)) return;
        Router.viewClasses[action] = viewClass;
    }

    , clearViewClasses: function () {
        Router.viewClasses = {};
    }

    , routes: {}

    , clearRoutes: function () {
        Router.routes = {};
    }

});

Utils.extend(Router.prototype, Events, {

    initialize: function(){
        // References to instances of Pageview
        this.views = {};

        // Trace pageviews involved in page switch
        this.currentView = null;
        this.previousView = null;

        this.pageOrder = Utils.result(this, 'pageOrder');
    }

    , getHistory: function(){
        return Utils.result(this, 'history');
    }

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    , route: function(route, name, callback){
        if(!Utils.isRegExp(route)) route = this._routeToRegExp(route);
        if(Utils.isFunction(name)){
            callback = name;
            name = '';
        }
        var special = this._parseSpecialHandler(name);
        if(!callback) callback = this[special.handler || name];
        var router = this, history = router.getHistory();
        history.route(route, function(fragment){
            var args = router._extractParameters(route, fragment);
            var action = special.action || name;
            if(router.execute(callback, args, action) !== false){
                router.trigger.apply(router, ['route:' + action].concat(args));
                router.trigger('route', action, args);
                history.trigger('route', router, action, args);
            }
        });
        return this;
    } 

    /**
     * Add a new route into the existed routes config as belows:
     *   route.addRoute('index/:type', 'index');
     */
    , addRoute: function(route, name){
        var me = this, opt = {};
        if(!me.routes || !Utils.isString(route)) return;
        /**
         * 1. this.routes is a JSON object or undefined after invoking this._bindRoutes
         * 2. new route item is prepended to the existed this.routes
         */
        if(!me.routes[route]){
            opt[route] = name;
            me.routes = Utils.extend(opt, me.routes);
        }
        else{
            me.routes[route] = name;
        }
        me._resetRoutes();
        me._bindRoutes();

        return me;
    } 

    /**
     * Remove an existed route from the existed routes config as belows:
     *   route.removeRoute('index/:type');
     */
    , removeRoute: function(route){
        var me = this, opt = {};
        if(!me.routes || !Utils.isString(route) || !me.routes[route]) return;
        delete me.routes[route];
        me._resetRoutes();
        me._bindRoutes();

        return me;
    } 

    // Execute a route handler with the provided parameters.  This is an
    // excellent place to do pre-route setup or post-route cleanup.
    , execute: function(callback, args, action){
        if(callback) callback.apply(this, [ action ].concat(args));
    }

    , navigate: function(fragment, options){
        this.getHistory()
            .navigate(fragment, options);
        return this;
    }

    , start: function(){
        var history = this.getHistory();
        history.start.apply(history, arguments);
        return this;
    }

    /**
     * Parse route config as below:
     *   routes: {
     *       "index/:type" : "_defaultHandler:index"
     *   }
     *
     * Returns: { handler: "_defaultHandler", action: "index" }
     */
    , _parseSpecialHandler: function(handler){
        var a, b;
        if(!Utils.isFunction(handler) 
            && rDefaultHandler.test(handler)){
            a = RegExp.$1; 
            b = RegExp.$2; 
        }

        return {
            handler: a
            , action: b
        };
    }

    , _bindRoutes: function(){
        if(!this.routes) return;
        this.routes = Utils.result(this, 'routes');
        this.paramNames = {};
        var route, routes = Utils.keys(this.routes);
        while((route = routes.pop()) != null){
            var names = [];
            route.replace(rParamName, function($0, $1){
                names.push($1); 
            });
            var action = this.routes[route];
            if(Utils.isFunction(action)) action = '';

            var special = this._parseSpecialHandler(action);
            action = special.action || action;
            /**
             * Invalid handlers:
             * {
             *     'index':            '_defaultHandler'
             *     'index/:type':      '_defaultHandler:'
             * }
             */
            if(/^_defaultHandler[:]?$/.test(action)) continue;

            // There may be more than one routes mapping to the same action
            this.paramNames[action] || (this.paramNames[action] = []);
            this.paramNames[action].push(names);
            this.route(route, this.routes[route]);
        }
    }

    , _resetRoutes: function(){
        this.getHistory().resetHandlers();
    }
    
    , _routeToRegExp: function(route){
        route = route.replace(escapeRegExp, '\\$&')
                    .replace(optionalParam, '(?:$1)?')
                    .replace(namedParam, function(match, optional){
                        return optional ? match : '([^/?]+)'; 
                    })
                    .replace(splatParam, '([^?]*?)');

        return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
    }

    , _extractParameters: function(route, fragment){
        var params = route.exec(fragment).slice(1);
        return Utils.map(params, function(param, i){
            // Query params should not be decoded
            if(i === params.length - 1) return param || null;
            return param ? decodeURIComponent(param) : null;
        });
    }

    , _getViewClass: function(action){
        return Router.viewClasses[action];
    }

    , registerViewClass: function(action, viewClass){
        Router.registerViewClass(action, viewClass);
        return this;
    }

    , pageOrder: []

    , getPageOrder: function(){
        return this.pageOrder.slice();
    }

    /**
     * Insert a new order in various ways:
     *   options: 
     *     { pos:  'FIRST' } : prepend
     *     { pos:   'LAST' } : append
     *     { pos:   NUMBER } : insert at position NUMBER
     *     { pos: 'BEFORE', relatedAction: 'action' } : insert before 'action'
     *     { pos:  'AFTER', relatedAction: 'action' } : insert after 'action' 
     */
    , insertPageOrder: function(action, options){
        var order = this.pageOrder, isBefore, relatedAction, index, i;
        options || ( options = {pos: 'LAST'} );
        i = order.length;
        // Prevent duplicated items
        while(i >= 0){ if(order[i] == action) order.splice(i, 1); i--; }
        switch(options.pos){
            case 'FIRST' : order.unshift(action); break;
            case 'LAST'  : order.push(action); break;
            case 'BEFORE': isBefore = true;
            case 'AFTER' :
                relatedAction = options.relatedAction; 
                i = 0;
                while(i < order.length){
                    if(order[i] == relatedAction){
                        if(isBefore) index = i;
                        else index = i + 1;
                        break;
                    }
                    i++;
                } 
                break;
            default: 
                if(/\d+/.test(options.pos)){
                    index = options.pos;
                }
        }
        if(index !== void 0){
            order.splice(index, 0, action);
        }

        return this;
    }

    , removePageOrder: function(action){
        var order = this.pageOrder, i = 0;
        while(i < order.length){
            if(order[i] == action){
                order.splice(i, 1);
            }
            i++;
        }

        return this;
    }

    /**
     * Config of page transition
     * 
     * The config is a list of key-value, which the key is pattern `"action-action"` and
     * the value is the name of animation to be taken. 
     *      pageTransition: {
     *          'index-search': 'fade'
     *          , 'index-page': 'slide'
     *      } 
     */
    , pageTransition: {}

    , defaultPageTransition: 'simple'

    , registerPageTransition: function(pattern, animate){
    }

    , _selectParamNames: function(action, args){
        var arr = this.paramNames[action], i = 0, names = [];
        while(i < arr.length){
            if(arr[i].length + 1 == args.length){
                names = arr[i];
                break;
            }
            i++;
        } 
        return names;
    }

    , _defaultHandler: function(){
        var args = Utils.map(arguments, function(item){
                return item;
            });
        var action = args.shift();
        var params = {}, names = this._selectParamNames(action, args); 
        if(names.length + 1 == args.length){
            for(var i=0; i < names.length; i++){
                params[names[i]] = args[i];
            } 
            params['_query_'] = args[i];
        }
        this.doAction(action, params);
    }

    , doAction: function(action, params){
        var me = this, view = me.views[action];

        if(!view){
            var cls = me._getViewClass(action);
            if (!cls) {
                throw new Error('Router.doAction: view class for action ' + action + ' not exist!');
            }
            view = me.views[action]
                = new cls(params, action, me);
        }

        me.previousView = me.currentView;
        me.currentView = view;

        me.trigger('routechange', {
            from: me.previousView
            , to: me.currentView
        });

        me.switchPage(me.previousView, me.currentView, params);
    }

    , switchPage: function(from, to, params){
        var me = this,
            dir = 0, order = Utils.result(me, 'pageOrder'),
            fromAction = from && from.action || null,
            toAction = to && to.action || null,
            fromIndex, toIndex;

        // Get direction of page switch
        //    0 - no direction
        //    1 - left
        //    2 - right
        if(fromAction !== null && null !== toAction && fromAction !== toAction){
            if(-1 != ( fromIndex = order.indexOf( fromAction ) )
                && -1 != ( toIndex = order.indexOf( toAction ) ) ){
                dir = fromIndex > toIndex ? 2 : 1;
            }
        }

        // Save page position when `"enablePositionRestore"` is on
        me.enablePositionRestore && from && from.savePos();

        $.each(from == to ? [from] : [from, to], function(key, item){
            item && item.trigger('pagebeforechange', {
                from: me.previousView, 
                to: me.currentView,
                params: params 
            });
        });        

        me.doAnimation(
            from,
            to,
            dir,
            function(){
                // Restore page position when `"enablePositionRestore"` is on
                me.enablePositionRestore && to && (to.restorePos(params));

                $.each(from == to ? [from] : [from, to], function(key, item){
                    item && item.trigger(
                        'pageafterchange', {
                            from: me.previousView, 
                            to: me.currentView,
                            params: params 
                        });
                });
            }
        );

    }

    , doAnimation: function(fromView, toView, direction, callback){
        var animate, me = this;
        
        animate = me._selectAnimation(
                fromView && fromView.action || null, 
                toView && toView.action || null
            ) || Animation.get(Utils.result(me, 'defaultPageTransition'));

        animate(
            fromView && fromView.el, 
            toView && toView.el, 
            direction,
            callback
        );
    }

    , _selectAnimation: function(fromAction, toAction){

        if(null == fromAction || null == toAction){
            return;
        }

        var me = this,
            animateName,
            pageTransition = Utils.result(me, 'pageTransition') || {};

        animateName = pageTransition[fromAction + '-' + toAction]
            || pageTransition[toAction + '-' + fromAction];

        return Animation.get(animateName); 
    }



});

Router.extend = classExtend;

return Router;


})();
