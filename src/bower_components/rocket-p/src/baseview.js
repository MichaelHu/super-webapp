var BaseView = View.extend({
    
    initialize: function(options, _parent){
        var me = this;

        me.options = $.extend({}, options);

        me._parent = _parent || null;
        me._children = {};
        me._length = 0;

        me.ec = me.getRoot();
        me.gec = me.ec._router;
        me.subec = me.getSubEC();
        me.featureString = me.getFeatureString();

        me.init(options);

        me._registerEvents();
        me.registerEvents();
    }

    // Implemented in sub classes
    , init: function(){}

    , getRoot: function(){
        var me = this, p, c;
        p = c = me;

        while(p){
            c = p;
            p = p._parent;
        }
        return c;
    }

    , getSubEC: function(){
        var me = this, p, c;
        p = c = me;

        while(p){
            if(p instanceof SubpageView){
                return p;
            }
            c = p;
            p = p._parent;
        }
        return c;
    }
    
    , getFeatureString: function(options){
        var me = this,
            opt = options || me.options,
            ft = '';

        /**
         * @note: 使用浅层序列化(shallow serialization)即可，避免
         *   options参数含有非常大的子对象，带来性能消耗，甚至堆栈溢出
         */
        ft = $.param(opt, true);

        options || (me.featureString = ft);
        return ft;
    }

    , append: function(view, isShow) {
        this._addSubview(view, 'APPEND', isShow);
        return this;
    }

    /**
     * Append a subview without appending DOM immediately under current view 
     * @param: {string or Zepto Object} container DOM container to be appended to  
     */
    , appendTo: function(view, container, isShow){
        this._addSubview(view, 'APPENDTO', isShow, container);
        return this;
    }

    , prepend: function(view, isShow) {
        this._addSubview(view, 'PREPEND', isShow);
        return this;
    }

    , prependTo: function(view, container, isShow) {
        this._addSubview(view, 'PREPENDTO', isShow, container);
        return this;
    }

    , setup: function(view, isShow) {
        this._addSubview(view, 'SETUP', isShow);
        return this;
    }

    /**
     * Add subviews to current view by various types 
     * @param {string} APPEND, PREPEND, SETUP, APPENDTO, PREPENDTO. default: APPEND
     */
    , _addSubview: function(view, type, isShow, container) {
        var me = this;
        if(view instanceof BaseView) {
            me._children[view.cid] = view;
            me._length++;
            view._parent = me;

            switch(type){
                case 'SETUP':
                    break;
                case 'PREPEND':
                    me.$el.prepend(view.$el);
                    break;
                case 'APPENDTO':
                    $(container).append(view.$el);
                    break;
                case 'PREPENDTO':
                    $(container).prepend(view.$el);
                    break;
                default:
                    me.$el.append(view.$el);
                    break;
            }

            // Hidden default 
            !isShow && view.$el.hide();
        }
        else {
            throw new Error("BaseView._addSubview: arguments must be an instance of BaseView");
        }
    }

    , remove: function(view){
        var me = this;

        if(view instanceof BaseView) {
            delete me._children[view.cid];
            me._length--;
            view._parent = null;
            view.$el.remove();
        }
        // 移除自身
        else{
            me._parent && 
                me._parent.remove(me);
        } 
    }

    , firstChild: function(){
        var me = this;

        for(var i in me._children){
            return me._children[i];
        }
        return null;
    } 

    , nextSibling: function(){
        var me = this,
            p = me._parent,
            prev = null,
            current = null;

        if(!p) return null;

        for(var i in p._children){

            prev = current;
            current = p._children[i];

            if(prev == me){
                return current;
            }
        }

        return null;
    }

    , prevSibling: function(){
        var me = this,
            p = me._parent,
            prev = null,
            current = null;

        if(!p) return null;

        for(var i in p._children){

            prev = current;
            current = p._children[i];

            if(current == me){
                return prev;
            }
        }

        return null;
    }

    , destroy: function() {

        var me = this;
        for(var key in me._children) {
            me._children[key].destroy();
        }

        me._unregisterEvents();
        me.unregisterEvents();
        me.undelegateEvents();

        this.$el.remove();

        me.el = me.$el = null;

        if(me._parent) {
            delete me._parent._children[me.cid];
            // @todo: subpages 
        }
    }

    , registerEvents: function(){}

    , unregisterEvents: function(){}

    /**
     * @param {0|90|-90|180} from: orientation before
     * @param {0|90|-90|180} to: orientation after
     */
    , onorientationchange: function(from, to){}

    , _registerEvents: function(){
        var me = this, ec = me.ec;

        me._onorientationchange = function(e){
            me.pageOrientationToBe = window.orientation;
            /**
             * Response directly when within an active page, delay otherwise.
             * 1. Prevents multi-page response even if it's not an active page
             * 2. Because inactive pages are hidden, computings of dom pixel sizes are
             *    often unexpected.  
             */
            if(ec.isActivePage()){
                if(me.pageOrientation != me.pageOrientationToBe){
                    me.onorientationchange(
                        me.pageOrientation
                        , me.pageOrientationToBe
                    ); 
                    me.pageOrientation = me.pageOrientationToBe;
                }
            }

        };

        $(window).on('orientationchange', me._onorientationchange);
        ec.on('pagebeforechange', me._onpagebeforechange, me);
        ec.on('pageafterchange', me._onpageafterchange, me);
    }

    , _unregisterEvents: function(){
        var me = this, ec = me.ec;

        $(window).off('orientationchange', me._onorientationchange);
        /**
         * @note: 需要置空该函数，避免页面recycle以后仍然调用该函数，导致报错
         * 原因还不是很清楚，但有几个线索可以参考：
         * 1. 该函数没有直接通过off卸载掉
         * 2. 同样响应pagebeforechange事件的onpagebeforechange先于_onpagebeforechange执行，而前者调用了recycleSubpage
         * 目前证明可靠的方式是将onorientationchange函数置为空函数
         */
        me.onorientationchange
            = me.onsubpagebeforechange
            = me.onsubpageafterchange = function(){};

        ec.off('pagebeforechange', me._onpagebeforechange, me);
        ec.off('pageafterchange', me._onpageafterchange, me);
    }

    , _onpagebeforechange: function(options){
        var me = this, 
            from = options.from,
            to = options.to,
            param = options.params,
            featureString = me.getFeatureString(param),
            spm = me.subpageManager;

        // Response to orientationchange when there is something inconsistent 
        if(me.pageOrientation != me.pageOrientationToBe){
            me.onorientationchange(
                me.pageOrientation
                , me.pageOrientationToBe
            ); 
            me.pageOrientation = me.pageOrientationToBe;
        }

        if(spm && spm._subpages.length){

            // If current subpage is not an target while switching between two different pages
            // subpage, the current subpage should be hidden in advance to ensure the quality
            // of switching 
            if(to == me.ec && from != to){
                if(spm._currentSubpage
                    && spm._currentSubpage.featureString
                        != featureString){
                    spm._currentSubpage.$el.hide();
                }
            }

        }

    } 

    ,_onpageafterchange: function(options){

        var me = this, 
            from = options.from,
            to = options.to,
            param = options.params,
            featureString = me.getFeatureString(param),
            fromSubpage, 
            toSubpage,
            spm = me.subpageManager;


        // Subpage related processing 
        if(to == me.ec && spm && spm._subpages.length){
            if(!spm.getSubpage(featureString)){
                // @todo: this._subpageClass validation
                var subView = new spm._subpageClass(
                        $.extend({}, param)
                        ,me
                    );
                me.append(subView);
                spm.registerSubpage(featureString, subView);
            }

            spm.setCurrentSubpage(spm.getSubpage(featureString));  
            fromSubpage = spm._previousSubpage;
            toSubpage = spm._currentSubpage;

            // Switch between subpages 
            if(from == to){
                spm.switchSubpage(
                    fromSubpage 
                    ,toSubpage
                    ,options
                );
            }

            /** 
             * Switch between different pages
             *
             * @note: Only response when it's itself a target page. Because
             * a subpage which is not a target subpage is hidden in advance when 
             * pagebeforechange occurs, `"switchSubpage"` should not be invoked
             * to prevent twinkling.  
             */
            else if(to == me.ec){
                $.each(fromSubpage == toSubpage 
                    ? [fromSubpage] : [fromSubpage, toSubpage], 
                    function(key, item){
                        item && item.onsubpagebeforechange
                             && item.onsubpagebeforechange(options);

                        item && item.onsubpageafterchange
                             && item.onsubpageafterchange(options);

                    }
                );

                spm.recycleSubpage();
            }
        }

        // Update pageview's options for use of position restore.
        if(to == me.ec && me == me.ec){
            me._dynamicOptions = $({}, param); 
        }

    }

    , getSubpageManager: function(options){
        var me = this,
            spm;

        if(spm = me.subpageManager){
            return spm;
        }

        spm = me.subpageManager 
            = new SubpageManager(options, me);

        return spm;
    }

    , getSubpageSwitchDir: function(fromSubpage, toSubpage){}

    /**
     * @param {string} text
     * @param {0=2} xpos: 0-center, 1-left, 2-right 
     * @param {0=2} ypos: 0-middle, 1-top, 2-bottom 
     * @param {number} duration: time(ms) to show
     */
    , tip: function(text, xpos, ypos, duration/*ms*/){
        Utils.tip.apply(window, arguments);
    }
    
    , show: function(){
        var me = this;
        setTimeout(function(){
            me.$el.show();
        }, 0);
    }

    , hide: function(){
        this.$el.hide();
    }

    , navigate: function(route, options){
        this.gec.history.navigate(
            route
            , $.extend({trigger:true}, options)
        );
    }




});
