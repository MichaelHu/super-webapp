var GlobalView = BaseView.extend({


    initialize: function(options, router){
        var me = this;

        if(!router instanceof Router){
            throw Error('GlobalView initialize: router must be an instance of Router');
        }
        
        me.router = me._router = router;
        router.on('routechange', me._onroutechange, me);
        
        // No parent view
        me._super.call(me, options, null);
    }

    // @note: just a placeholder
    , isActivePage: function(){
        return false;
    }

    /**
     * Subview under GlobalView has a reference to event center 
     * which is GlobalView itself. As belows:
     *      subview.ec == globalview
     */
    , _onroutechange: function(params){
        this.trigger('routechange', $.extend({}, params));
    }

    /**
     * @param {string} action: page action name, may be a comma-splitted list 
     * @param {string} eventName
     * @params {json} params
     */
    , triggerPageEvent: function(action, eventName, params){
        var me = this,
            actions = action.split(/\s*,\s*/),
            pageView;

        $.each(actions, function(index, item){
            pageView = me.router.views[item];
            pageView && (pageView.trigger(eventName, params));
        });

    }

    , getCurrentAction: function(){
        return this.router && this.router.currentView.action || '';        
    }


});
