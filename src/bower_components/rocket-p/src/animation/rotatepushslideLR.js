(function(){

function rotatepushslideLR(currentEle, nextEle, dir, callback) {
    var $currentEle = currentEle && $(currentEle),
        $nextEle = nextEle && $(nextEle);

    if(0 == dir){
        if(currentEle != nextEle){
            currentEle && $currentEle.hide();
            setTimeout(function(){
                nextEle && $nextEle.show();
            }, 0);
        }

        callback && callback();
        return;
    }

    var outClass = 'pt-page-rotatePushLeft', 
        inClass = 'pt-page-moveFromRight'
        ;

    if(2 == dir){
        outClass = 'pt-page-rotatePushRight'; 
        inClass = 'pt-page-moveFromLeft';
    }

    Animation.pageTransition(nextEle, currentEle, inClass, outClass, callback);

};

Animation.register('rotatepushslideLR', rotatepushslideLR);

})();

