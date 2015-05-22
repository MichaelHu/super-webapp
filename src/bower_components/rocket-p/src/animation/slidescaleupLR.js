(function(){

function slidescaleupLR(currentEle, nextEle, dir, callback) {
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

    var outClass = 'pt-page-moveToLeft pt-page-ontop', 
        inClass = 'pt-page-scaleUp'
        ;

    if(2 == dir){
        outClass = 'pt-page-moveToRight pt-page-ontop'; 
        inClass = 'pt-page-scaleUp';
    }

    Animation.pageTransition(nextEle, currentEle, inClass, outClass, callback);

};

Animation.register('slidescaleupLR', slidescaleupLR);

})();

