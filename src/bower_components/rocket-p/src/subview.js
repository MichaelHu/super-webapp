var SubView = BaseView.extend({

    /**
     * @param {json} options: construct options 
     * @param {string} action: action name  
     */
    initialize: function(options, parent){
        var me = this;

        if(!parent instanceof BaseView){
            throw Error('SubView initialize: parent must be an instance of class BaseView'); 
        }

        me._super(options, parent); 
    }

});

