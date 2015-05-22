(function(){

var Utils = null;

module('Utils', {
    setup: function(){
        Utils = Rocket.Utils;
    }
});


test('isObject', function(){
    ok(!Utils.isObject(null), 'null is not an Object');
    ok(!Utils.isObject(0), '0 is not an Object');
    ok(!Utils.isObject('hello, world'), '"hello, world" is not an Object');

    ok(Utils.isObject({}), '{} is an Object');
    ok(Utils.isObject([]), '[] is an Object');
    ok(Utils.isObject(new Number(0)), 'new Number(0) is an Object');
    ok(Utils.isObject(new String("hello, world")), 'new String("hello, world") is an Object');
    ok(Utils.isObject(/^[a-z]+$/), '/^[a-z]+$/ is an Object');
    ok(Utils.isObject(function(){}), 'function(){} is an Object');
    ok(Utils.isObject(new Date()), 'new Date() is an Object');
});


test('isArray', function(){
    ok(Utils.isArray([]), '[] is an Array');
    ok(!Utils.isArray(null), 'null is not an Array');
    ok(!Utils.isArray(void 0), 'void 0 is not an Array');
    ok(!Utils.isArray({}), '{} is not an Array');
    ok(!Utils.isArray(arguments), 'arguments is not an Array');
});

test('isEmpty', function(){
    ok(Utils.isEmpty(void 0), 'void 0 is empty');
    ok(Utils.isEmpty(''), '"" is empty');
    ok(Utils.isEmpty(null), 'null is empty');
    ok(Utils.isEmpty(false), 'false is empty');
    ok(Utils.isEmpty([]), '[] is empty');
    ok(Utils.isEmpty({}), '{} is empty');
    ok(Utils.isEmpty(0), '0 is empty');
});

test('extend', function(){
    var a = {name: 'a'},
        b = {name: 'b', color: 'red'}, 
        c = {age: 11, color: 'green'}; 

    deepEqual(
        Utils.extend({}, a, b, c)
        , {name: 'b', color: 'green', age: 11}
        , 'passes'
    );

    equal(
        Utils.extend(null, a, b, c)
        , null 
        , 'first parameter is null, return null'
    );

    equal(
        Utils.extend(a)
        , a 
        , 'only one parameter, just return it'
    );

});

test('isEqual', function(){

    ok(
        Utils.isEqual(
            NaN
            , NaN 
        )
        , 'NaN equals NaN'
    ); 

    ok(
        Utils.isEqual(
            0 
            , new Number(0) 
        )
        , '0 equals new Number(0)'
    ); 

    ok(
        Utils.isEqual(
            [] 
            , [] 
        )
        , '[] equals []'
    ); 

    ok(
        Utils.isEqual(
            void 0  
            , undefined 
        )
        , 'void 0 equals undefined'
    ); 

    ok(
        Utils.isEqual(
            [1, 2, 3] 
            , [1, 2, 3] 
        )
        , '[1, 2, 3] equals [1, 2, 3]'
    ); 

    ok(
        Utils.isEqual(
            {"ab": 1, "cd": [1, 2, 3]} 
            , {"ab": 1, "cd": [1, 2, 3]} 
        )
        , '{"ab": 1, "cd": [1, 2, 3]} equals {"ab": 1, "cd": [1, 2, 3]}'
    ); 



    var date1 = new Date(),
        date2 = new Date();

    date1.setTime(Date.parse("2014/12/01 19:15:00"));
    date2.setTime(Date.parse("2014/12/01 19:15:00"));

    ok(
        Utils.isEqual(
            date1
            , date2
        )
        , 'date1 equals date2'
    ); 

    ok(
        ! Utils.isEqual(
            function(a,b){return a==b;}
            , function(a,b){return a==b;}
        )
        , 'function(a,b){return a==b;} doesn\'t equal function(a,b){return a==b;}'
    ); 

    ok(
        Utils.isEqual(
            /abc/g 
            , /abc/g 
        )
        , '/abc/g equals /abc/g'
    ); 

    ok(
        Utils.isEqual(
            new RegExp("abc", "g")
            , new RegExp("abc", "g")
        )
        , 'new RegExp("abc", "g") equals new RegExp("abc", "g")'
    ); 

    ok(
        ! Utils.isEqual(
            'abc' 
            , NaN 
        )
        , '"abc" doesn\'t equal NaN'
    ); 

    ok(
        ! Utils.isEqual(
            '' 
            , undefined 
        )
        , '"" doesn\'t equal undefined'
    ); 

    ok(
        ! Utils.isEqual(
            0 
            , null 
        )
        , '0 doesn\'t equal null'
    ); 

    ok(
        ! Utils.isEqual(
            0 
            , false 
        )
        , '0 doesn\'t equal false'
    ); 

    ok(
        ! Utils.isEqual(
            null 
            , false 
        )
        , 'null doesn\'t equal false'
    ); 

    ok(
        ! Utils.isEqual(
            0 
            , '' 
        )
        , '0 doesn\'t equal ""'
    ); 

    ok(
        ! Utils.isEqual(
            0 
            , '0' 
        )
        , '0 doesn\'t equal "0"'
    ); 

    ok(
        ! Utils.isEqual(
            [] 
            , {} 
        )
        , '[] doesn\'t equal {}'
    ); 

    ok(
        ! Utils.isEqual(
            [1, 2, 3] 
            , [1, 0, 3] 
        )
        , '[1, 2, 3] doesn\'t equal [1, 0, 3]'
    ); 

    ok(
        ! Utils.isEqual(
            {"ab": 1, "cd": "12345"} 
            , {"ab": 1, "cd": "12345", "ef": 0} 
        )
        , '{"ab": 1, "cd": "12345", "ef": 0} doesn\'t equal {"ab": 1, "cd": "12345"}'
    ); 

    ok(
        ! Utils.isEqual(
            {"ab": 1, "cd": "12345", "ef": 0} 
            , {"ab": 1, "cd": "12345", "ef": null} 
        )
        , '{"ab": 1, "cd": "12345", "ef": 0} doesn\'t equal {"ab": 1, "cd": "12345", "ef": null}'
    ); 



});



test('defaults', function(){

    var a = {name: 'a', color: void 0},
        b = {name: 'b', color: 'red'}, 
        c = {age: 11, color: 'green'}; 

    deepEqual(
        Utils.defaults({}, a, b, c)
        , {name: 'a', color: 'red', age: 11}
        , 'passes'
    );
    
    equal(
        Utils.defaults(3)
        , 3 
        , 'first parameter is not an Object, just return it'
    );
    

});





test('clone', function(){

    var a = {name: 'a', age: 'b', color: 'yellow'},
        b = [1, 2, 3, 4]; 

    deepEqual(
        Utils.clone(a)
        , a 
        , 'Object testing passes'
    );
    
    deepEqual(
        Utils.clone(b)
        , b 
        , 'Array testing passes'
    );
    
    equal(
        Utils.clone(3)
        , 3 
        , 'first parameter is not an Object, just return it'
    );
    

});



test('result', function(){

    var a = {
            name: 'a'
            , age: 'b'
            , color: 'yellow'
            , sayHello: function(name){ return 'Hello' + (name ? ', ' + name : '') + '.';}
        };

    equal(
        Utils.result(a, 'name')
        , 'a'
        , 'property name passes'
    );

    equal(
        Utils.result(a)
        , void 0 
        , 'undefined property passes'
    );

    equal(
        Utils.result(a, 'abc')
        , void 0 
        , 'non-existed property passes'
    );

    equal(
        Utils.result(a, 'abc', 'fallback content')
        , 'fallback content' 
        , 'fallback passes'
    );

    equal(
        Utils.result(null, 'abc', 'fallback content')
        , 'fallback content' 
        , 'fallback passes'
    );

    equal(
        Utils.result(a, 'sayHello')
        , 'Hello.' 
        , 'method output passes'
    );


});


test('each', function(){
    
    var a = [1, 2, 3],
        b = {"a": 1, "b": 2, "c": 3};
 
    deepEqual(
        Utils.each(a, function(item, index, obj){
            obj[index] += 1;
        })
        , [2, 3, 4]
        , 'array testing passes'
    );

    deepEqual(
        Utils.each(b, function(item, index, obj){
            obj[index] += 1;
        })
        , {"a": 2, "b": 3, "c": 4}
        , 'array testing passes'
    );

    deepEqual(
        Utils.each(null)
        , null 
        , 'null testing passes'
    );

    
});


test('has', function(){

    var a = {name: 'a', age: 11};
    
    ok(Utils.has(a, 'name'), 'has key passes');
    ok(!Utils.has(null), 'null has no keys');
    ok(!Utils.has(a, 'toString'), 'plain object has no toString method');
});


test('uniqueId', function(){

    var firstKey = Utils.uniqueId(),
        secondKey = Utils.uniqueId(),
        thirdKey = Utils.uniqueId('kk');

    equal(firstKey - 0 + 1, secondKey, 'uniqueId passes');
    equal('kk' + ( firstKey - 0 + 2 ), thirdKey, 'prefix test passes');

});


test('sync', function(){

    var oldAjax = Utils.ajax;
    var options = {
            error: function(xhr, textStatus, errorThrown){
                equal(xhr.desc, 'a faked xhr', 'async param xhr passes');
                equal(textStatus, 200, 'param textStatus passes');
                equal(errorThrown, '', 'param errorThrown passes');
            } 
        };
    var model = {
        url: '/258i.com/dataapi'
        , toJSON: function(){
            return {
                "name": "Michael"
                , "age": 11
            };
        }
        , trigger: function(event, model, xhr, options){
            equal(event, 'request', 'param event passes');
            equal(model.url, '/258i.com/dataapi', 'param model passes');
            equal(xhr.desc, 'a faked xhr', 'param xhr passes');
        }
    };
    var xhr = {"desc": "a faked xhr"};

    expect(8);

    Utils.ajax = function(params){
        equal(params.contentType, void 0, 'params.contentType passes');
        equal(params.processData, void 0, 'params.processData passes');
        return xhr;
    };

    Utils.sync('read', model, {dataType: 'json'});
    Utils.ajax = oldAjax;

    setTimeout(function(){
        options.error.call(this, xhr, 200, ''); 
        start();
    }, 100);

    stop();
});


test('sync-error', function(){

    var oldAjax = Utils.ajax;
    var options = {
            error: function(xhr, textStatus, errorThrown){
                equal(xhr.desc, 'a faked xhr', 'async param xhr passes');
                equal(textStatus, 200, 'param textStatus passes');
                equal(errorThrown, '', 'param errorThrown passes');
            } 
        };
    var model = {
        url: '/258i.com/dataapi'
        , toJSON: function(){
            return {
                "name": "Michael"
                , "age": 11
            };
        }
        , trigger: function(event, model, xhr, options){
            equal(event, 'request', 'param event passes');
            equal(model.url, '/258i.com/dataapi', 'param model passes');
            equal(xhr.desc, 'a faked xhr', 'param xhr passes');
        }
    };
    var xhr = {"desc": "a faked xhr"};

    expect(8);

    Utils.ajax = function(params){
        equal(params.contentType, 'application/json', 'params.contentType passes');
        equal(params.processData, false, 'params.processData passes');
        return xhr;
    };

    Utils.sync('update', model, {dataType: 'json'});
    Utils.ajax = oldAjax;

    setTimeout(function(){
        options.error.call(this, xhr, 200, ''); 
        start();
    }, 100);

    stop();
});


test('flatten', function(){

    deepEqual(Utils.flatten({}), []);
    deepEqual(Utils.flatten(void 0), []);
    deepEqual(Utils.flatten(null), []);
    deepEqual(Utils.flatten(false), []);
    deepEqual(Utils.flatten(1), []);

    deepEqual(Utils.flatten('string'), ['s', 't', 'r', 'i', 'n', 'g']);
    deepEqual(Utils.flatten('string', true), ['s', 't', 'r', 'i', 'n', 'g']);

    deepEqual(Utils.flatten([1, 2, 3, 4]), [1, 2, 3, 4]);
    deepEqual(Utils.flatten([1, [2.1, 2.2, 2.3], 3, 4]), [1, 2.1, 2.2, 2.3, 3, 4]);
    deepEqual(
        Utils.flatten(
            [1, [2.1, ['2.2.1', '2.2.2'], 2.3], 3, 4]
        ) 
        , [1, 2.1, '2.2.1', '2.2.2', 2.3, 3, 4]
    );
    deepEqual(Utils.flatten([1, {a:1, b:2}, 3, 4]), [1, {a:1, b:2}, 3, 4]);

    deepEqual(Utils.flatten([1, 2, 3, 4], true), [1, 2, 3, 4]);
    deepEqual(Utils.flatten([1, [2.1, 2.2, 2.3], 3, 4], true), [1, 2.1, 2.2, 2.3, 3, 4]);
    deepEqual(
        Utils.flatten(
            [1, [2.1, ['2.2.1', '2.2.2'], 2.3], 3, 4]
            , true
        ) 
        , [1, 2.1, ['2.2.1', '2.2.2'], 2.3, 3, 4]
    );
    deepEqual(Utils.flatten([1, {a:1, b:2}, 3, 4], true), [1, {a:1, b:2}, 3, 4]);

});


test('pick', function(){

    var a = {
            a: 1
            , b: 2
            , c: [1, 2, 3]
            , d: {
                d1: 1
                , d2: 2
            }
        };

    deepEqual(Utils.pick(a, void 0), {});

    deepEqual(Utils.pick(a, ['a', 'b']), {a: 1, b:2});
    deepEqual(Utils.pick(a, ['a', 'b'], 'c'), {a: 1, b:2, c: [1, 2, 3]});
    deepEqual(Utils.pick(a, ['a', 'b'], 'c', 'd'), {a: 1, b:2, c: [1, 2, 3], d: {d1: 1, d2: 2}});

    deepEqual(
        Utils.pick(a, function(value, key, obj){
            return value == 2;
        })
        , {b: 2}
    );

});


test('map', function(){

    var obj = {a: 1, b: 2, c: 'hello'}; 
   
    deepEqual(
        Utils.map(null) 
        , []
    );

    // get output of function
    deepEqual(
        Utils.map(obj, function(item, index, obj){
            return ':' + item;
        }) 
        , [':1', ':2', ':hello']
    );

    // get output of function
    deepEqual(
        Utils.map(obj) 
        , [1, 2, 'hello']
    );

    // get matches
    deepEqual(
        Utils.map(obj, {a:1, c:'hello'}) 
        , [false, false, false]
    );

    // get matches
    var obj2 = {a: obj, b: 234};
    deepEqual(
        Utils.map(obj2, {a:1, c:'hello'}) 
        , [true, false]
    );

    // get property
    deepEqual(
        Utils.map(obj, 'a') 
        , [void 0, void 0, void 0]
    );

});


test('any', function(){

    var obj = {a: 1, b: 2, c: 'hello'};

    strictEqual(
        Utils.any(null) 
        , false
    );

    strictEqual(
        Utils.any(obj, function(item, index, obj){
            return item == 1;
        }) 
        , true
    );

    strictEqual(
        Utils.any(obj, 'a') 
        , false
    );

    // get matches
    var obj2 = {a: obj, b: 234};
    strictEqual(
        Utils.any(obj2, {a:1, c:'hello'}) 
        , true
    );

    // get property
    strictEqual(
        Utils.any(obj2, 'a') 
        , true 
    );
    
});



})();


