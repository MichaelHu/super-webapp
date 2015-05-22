(function(){

function simple(currentEle, nextEle, dir, callback) {
    var $currentEle = currentEle && $(currentEle),
        $nextEle = nextEle && $(nextEle);

    if(currentEle != nextEle){
        currentEle && $currentEle.hide();
        setTimeout(function(){
            nextEle && $nextEle.show();
        }, 0);
    }

    callback && callback();
};

Animation.register('simple', simple);

})();
