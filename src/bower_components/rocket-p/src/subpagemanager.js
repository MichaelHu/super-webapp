var SubpageManager = function(options, subpageManagerView){
    
    var me = this,
        opt = $.extend({}, options);

    if(!subpageManagerView instanceof BaseView){
        throw Error('SubPageManager constructor: subPageManagerView must be an instance of class BaseView'); 
    }

    me._subpageClass = opt.subpageClass || null;
    me.MAX_SUBPAGES = opt.maxSubpages || 1;
    me.subpageTransition = opt.subpageTransition || 'slide';
    me.subpageManagerView = subpageManagerView;

    me._subpages = [];
    me._currentSubpage = null;
    me._previousSubpage = null;

    me.defaultSubpageTransition = 'simple';
}; 

SubpageManager.prototype = {

    switchSubpage: function(from, to, params){
        var me = this,
            dir = 0;

        dir = me.subpageManagerView.getSubpageSwitchDir
            ? me.subpageManagerView.getSubpageSwitchDir(from, to)
                : me.getSubpageSwitchDir(from, to); 

        $.each(from == to ? [from] : [from, to], function(key, item){
            item.trigger('subpagebeforechange', params);
        });

        me.doSubpageAnimation(
            from,
            to,
            dir,
            function(){
                $.each(from == to ? [from] : [from, to], function(key, item){
                    item && item.onsubpageafterchange
                         && item.onsubpageafterchange(params);
                });

                me.recycleSubpage();
            }
        );
    }

    /**
     * Get direction of subpage switch
     *    0 - no direction
     *    1 - left
     *    2 - right
     */
    , getSubpageSwitchDir: function(fromSubpage, toSubpage){
        var me = this,
            dir = 0,
            subpages = me._subpages,
            fromFeatureString = fromSubpage 
                && fromSubpage.getFeatureString() || null,
            toFeatureString = toSubpage 
                && toSubpage.getFeatureString() || null,
            fromIndex = -1, toIndex = -1;
        
        for(var i=0; i<subpages.length; i++){
            if(subpages[i].name == fromFeatureString){
                fromIndex = i;
            }
            if(subpages[i].name == toFeatureString){
                toIndex = i;
            }
        }

        if(fromFeatureString !== null 
            && null !== toFeatureString && fromFeatureString !== toFeatureString){
            if(-1 != fromIndex && -1 != toIndex ){
                dir = fromIndex > toIndex ? 2 : 1;
            }
        }

        return dir;
    }

    , doSubpageAnimation: function(fromView, toView, direction, callback){

        var animate, me = this;

        animate = Animation.get(
                me.subpageTransition || 'simple'
            );

        animate(
            fromView && fromView.el, 
            toView && toView.el, 
            direction,
            callback
        );
    }

    /**
     * @param {string} name: unique ID of subpage 
     * @param {SubpageView} subpage: instance of SubpageView
     */
    , registerSubpage: function(name, subpage){
        var me = this;
        if(!me.getSubpage(name)){
            me._subpages.push({
                name: name,
                subpage: subpage
            });
        }
    }

    /**
     * @param {string} name: unique ID of subpage 
     * @return {SubpageView or undefined} 
     */
    , getSubpage: function(name){
        var me = this, 
            p = me._subpages;

        for(var i=0, len=p.length; i<len; i++){
            if(p[i].name == name){
                return p[i].subpage;
            }
        }
        return;
    }

    , setCurrentSubpage: function(subpage){
        var me = this;
        if(subpage instanceof rocket.baseview){
            if(subpage != me._currentSubpage){
                me._previousSubpage = me._currentSubpage;
                me._currentSubpage = subpage;
            }
        }
        else{
            throw Error('error in method setCurrentSubpage: '
                + 'subpage is not an instance of rocket.baseview');
        }
    }

    , recycleSubpage: function(){
        var me = this, 
            p = me._subpages,
            item;

        while(p.length > me.MAX_SUBPAGES){
            item = p.shift();

            // Current active subpage will be skipped and pushed back
            if(item.subpage == me._currentSubpage){
                me._subpages.push(item); 
            }
            else{
                item.subpage.destroy();
            }
        }

    }



};

SubpageManager.extend = classExtend;
