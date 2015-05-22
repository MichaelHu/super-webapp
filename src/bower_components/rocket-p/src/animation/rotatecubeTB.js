(function(){

function rotatecubeTB(currentEle, nextEle, dir, callback) {
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

    var outClass = 'pt-page-rotateCubeTopOut pt-page-ontop', 
        inClass = 'pt-page-rotateCubeTopIn'
        ;

    if(2 == dir){
        outClass = 'pt-page-rotateCubeBottomOut pt-page-ontop'; 
        inClass = 'pt-page-rotateCubeBottomIn';
    }

    Animation.pageTransition(nextEle, currentEle, inClass, outClass, callback);

};

Animation.register('rotatecubeTB', rotatecubeTB);

})();


