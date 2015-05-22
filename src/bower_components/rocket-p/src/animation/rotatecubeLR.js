(function(){

function rotatecubeLR(currentEle, nextEle, dir, callback) {
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

    var outClass = 'pt-page-rotateCubeLeftOut pt-page-ontop', 
        inClass = 'pt-page-rotateCubeLeftIn'
        ;

    if(2 == dir){
        outClass = 'pt-page-rotateCubeRightOut pt-page-ontop'; 
        inClass = 'pt-page-rotateCubeRightIn';
    }

    Animation.pageTransition(nextEle, currentEle, inClass, outClass, callback);

};

Animation.register('rotatecubeLR', rotatecubeLR);

})();


