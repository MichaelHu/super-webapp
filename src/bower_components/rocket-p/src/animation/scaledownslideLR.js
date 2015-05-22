(function(){

function scaledownslideLR(currentEle, nextEle, dir, callback) {
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

    var outClass = 'pt-page-scaleDown', 
        inClass = 'pt-page-moveFromRight pt-page-ontop'
        ;

    if(2 == dir){
        outClass = 'pt-page-scaleDown'; 
        inClass = 'pt-page-moveFromLeft pt-page-ontop';
    }

    Animation.pageTransition(nextEle, currentEle, inClass, outClass, callback);

};

Animation.register('scaledownslideLR', scaledownslideLR);

})();

