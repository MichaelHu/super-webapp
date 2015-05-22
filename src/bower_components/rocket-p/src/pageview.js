var PageView = BaseView.extend({

    /**
     * @param {json} options: construct options 
     * @param {string} action: action name  
     */
    initialize: function(options, action, router){
        var me = this;

        if(!action || !Utils.isString(action)){
            throw Error('PageView initialize: action must be an non-empty string'); 
        }

        if(!router instanceof Router){
            throw Error('PageView initialize: router must be an instance of Router'); 
        }

        me.action = action;
        me._router = router;
        me._tops = {};

        // Make sure the PageView node is under certain node 
        if(!me.$el.parent().length){
            me.$el.appendTo('#wrapper');
        }

        // PageView has no `"_parent"`
        me._super(options, null); 
    }

    , isActivePage: function(){
        return Utils.isReallyDisplay(this.el);
    }

    , _getDynamicFeatureString: function(params){
        var me = this;
        return $.param(
                params 
                // _dynamicOptions is set within BaseView._onpageafterchange
                || me._dynamicOptions 
                || me.options
                , true
            );
    }    

    ,savePos: function(){
        var me = this;
        me._tops[me._getDynamicFeatureString()] = window.scrollY;
    }

    ,restorePos: function(params, defaultTop){
        var me = this,
            cls =  me._getDynamicFeatureString(params);

        // Delay for iOS4
        setTimeout(function(){
            window.scrollTo(0, me._tops[cls] || defaultTop || 0);
        }, 0);
    }

});
