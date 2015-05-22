(function(){

module('Events');

var Events = Rocket.Events;

var E = function(){};

E.prototype.on = Events.on;
E.prototype.off = Events.off;
E.prototype.once = Events.once;
E.prototype.trigger = Events.trigger;
E.prototype.listenTo = Events.listenTo;
E.prototype.listenToOnce = Events.listenToOnce;
E.prototype.stopListening = Events.stopListening;


test('on', function(){

    var listener = new E(),
        emitter = new E(),
        callback1 = function(){},
        callback2 = function(){},
        callback3 = function(){};

    ok(!emitter._events, 'when initialized, _events undefined');

    emitter.on('event1', callback1, listener);

    ok(
        !!emitter._events['event1']
        , 'after registration, the _events should has key event1'
    );

    deepEqual(
        emitter._events['event1'][0]
        , {
            callback: callback1
            , context: listener
            , ctx: listener
        }
        , '_events["event1"] content check passes'
    );

    emitter.on('event2 event3', callback2, listener);

    deepEqual(
        emitter._events['event2'][0]
        , {
            callback: callback2
            , context: listener
            , ctx: listener
        }
        , '_events["event2"] content check passes'
    );

    deepEqual(
        emitter._events['event3'][0]
        , {
            callback: callback2
            , context: listener
            , ctx: listener
        }
        , '_events["event3"] content check passes'
    );


});


test('once', function(){

    var listener = new E(),
        emitter = new E(),
        callback1 = function(){},
        callback2 = function(){};

    ok(!emitter._events, 'when initialized, _events undefined');

    emitter.once('event1', callback1, listener);

    ok(
        !!emitter._events['event1']
        , 'after registration, the _events should has key event1'
    );

    deepEqual(
        emitter._events['event1'][0].callback._callback
        , callback1
        , '_events["event1"][0].callback._callback check passes'
    );

    emitter.once('event2 event3', callback2, listener);

    deepEqual(
        emitter._events['event2'][0].callback._callback
        , callback2
        , '_events["event2"][0].callback._callback check passes'
    );

    deepEqual(
        emitter._events['event3'][0].callback._callback
        , callback2
        , '_events["event3"][0].callback._callback check passes'
    );


});


test('on-off', function(){

    var listener = new E(),
        emitter = new E(),
        callback1 = function(){},
        callback2 = function(){};

    emitter.on('event1', callback1, listener);
    emitter.off('event1', callback1, listener);

    deepEqual(
        emitter._events
        , {} 
        , 'after "off", the _events should be {}'
    );


    emitter.on('event1 event2 event3', callback2, listener);
    emitter.off('event2', callback2, listener);

    deepEqual(
        emitter._events['event2']
        , void 0
        , '_events["event2"] content check passes'
    );

    deepEqual(
        emitter._events['event1'][0]
        , {
            callback: callback2
            , context: listener
            , ctx: listener
        }
        , '_events["event1"] content check passes'
    );

    deepEqual(
        emitter._events['event3'][0]
        , {
            callback: callback2
            , context: listener
            , ctx: listener
        }
        , '_events["event3"] content check passes'
    );

    emitter.off();

    deepEqual(
        emitter._events
        , void 0
        , 'after "off all", the _events should be undefined'
    );

});




test('once-off', function(){

    var listener = new E(),
        emitter = new E(),
        callback1 = function(){},
        callback2 = function(){};

    emitter.once('event1', callback1, listener);
    emitter.off('event1', callback1, listener);

    deepEqual(
        emitter._events
        , {} 
        , 'after "off", the _events should be {}'
    );


    emitter.once('event1 event2 event3', callback2, listener);
    emitter.off('event2', callback2, listener);

    deepEqual(
        emitter._events['event2']
        , void 0
        , '_events["event2"] content check passes'
    );

    deepEqual(
        emitter._events['event1'][0].callback._callback
        , callback2
        , '_events["event1"][0].callback._callback check passes'
    );

    deepEqual(
        emitter._events['event3'][0].callback._callback
        , callback2
        , '_events["event3"][0].callback._callback check passes'
    );


    emitter.off();

    deepEqual(
        emitter._events
        , void 0
        , 'after "off all", the _events should be undefined'
    );

});



test('on-trigger', function(){

    var listener = new E(),
        emitter = new E(),
        callback1 = function(inc){
            this.flag1 || (this.flag1 = 0);
            inc ? ( this.flag1 += inc ) : this.flag1++;
        },
        callback2 = function(inc){
            this.flag2 || (this.flag2 = 0);
            inc ? ( this.flag2 += inc ) : this.flag2++;
        },
        callbackall = function(name, inc){
            this.flagall || (this.flagall = '');
            this.flagall += name + '@' + inc;
        };

    emitter.on('event1', callback1, listener);
    emitter.trigger('event1');
    equal(listener.flag1, 1, 'triggered');

    emitter.off();
    emitter.trigger('event1');
    equal(listener.flag1, 1, 'when off all, never triggered');

    emitter.on('event1', callback1, listener);
    emitter.on('event1', callback2, listener);
    emitter.trigger('event1', 10);
    equal(listener.flag1, 11, 'triggered');
    equal(listener.flag2, 10, 'triggered');

    emitter.on('all', callbackall, listener);
    emitter.trigger('event1', 10);
    equal(listener.flag1, 21, 'triggered');
    equal(listener.flag2, 20, 'triggered');
    equal(listener.flagall, 'event1@10', 'triggered');

    emitter.on('event1', callback1);
    emitter.trigger('event1', 10);
    equal(listener.flag1, 31, 'triggered');
    equal(listener.flag2, 30, 'triggered');
    equal(listener.flagall, 'event1@10event1@10', 'triggered');
    equal(emitter.flag1, 10, 'default context passes');

});


test('once-trigger', function(){

    var listener = new E(),
        emitter = new E(),
        callback1 = function(inc){
            this.flag1 || (this.flag1 = 0);
            inc ? ( this.flag1 += inc ) : this.flag1++;
        },
        callback2 = function(inc){
            this.flag2 || (this.flag2 = 0);
            inc ? ( this.flag2 += inc ) : this.flag2++;
        },
        callbackall = function(name, inc){
            this.flagall || (this.flagall = '');
            this.flagall += name + '@' + inc;
        };

    emitter.once('event1', callback1, listener);
    emitter.trigger('event1');
    equal(listener.flag1, 1, 'triggered');
    emitter.trigger('event1');
    equal(listener.flag1, 1, 'never triggered more than 1 time');

    emitter.once('event1', callback1, listener);
    emitter.once('event1', callback2, listener);
    emitter.trigger('event1', 10);
    equal(listener.flag1, 11, 'triggered');
    equal(listener.flag2, 10, 'triggered');
    emitter.trigger('event1', 10);
    equal(listener.flag1, 11, 'never triggered more than 1 time');
    equal(listener.flag2, 10, 'never triggered more than 1 time');

    emitter.once('all', callbackall, listener);
    emitter.trigger('eventfoo', 10);
    equal(listener.flagall, 'eventfoo@10', 'all events always be triggered');
    emitter.trigger('eventfoo', 10);
    equal(listener.flagall, 'eventfoo@10', 'all events cannot be triggered more than 1 time');

    emitter.once('event1', callback1);
    emitter.trigger('event1', 10);
    equal(listener.flag1, 11, 'never triggered');
    equal(listener.flag2, 10, 'never triggered');
    equal(listener.flagall, 'eventfoo@10', 'never triggered');
    equal(emitter.flag1, 10, 'default context passes');

});



test('listenTo-stopListening', function(){

    var listener = new E(),
        emitter = new E(),
        callback1 = function(inc){
            this.flag1 || (this.flag1 = 0);
            inc ? ( this.flag1 += inc ) : this.flag1++;
        },
        callback2 = function(inc){
            this.flag2 || (this.flag2 = 0);
            inc ? ( this.flag2 += inc ) : this.flag2++;
        },
        callbackall = function(name, inc){
            this.flagall || (this.flagall = '');
            this.flagall += name + '@' + inc;
        };

    listener.listenTo(emitter, 'event1', callback1);
    ok(!!emitter._listenId, 'emitter._listenId exists');
    ok(!!listener._listeningTo, 'listener._listeningTo exists');
    deepEqual(
        listener._listeningTo[emitter._listenId]
        , emitter
        , 'listener._listeningTo[emitter._listenId] === emitter'
    );

    emitter.trigger('event1');
    equal(listener.flag1, 1, 'triggered');

    listener.stopListening(emitter);
    emitter.trigger('event1');
    equal(listener.flag1, 1, 'never triggered again');

    listener.listenTo(emitter, 'event1 event2', callback2);
    emitter.trigger('event1 event2', 10);
    equal(listener.flag1, 1, 'never triggered again');
    equal(listener.flag2, 20, 'triggered');

    listener.stopListening();
    emitter.trigger('event1 event2', 10);
    equal(listener.flag1, 1, 'never triggered again');
    equal(listener.flag2, 20, 'never triggered again');

    listener.listenTo(emitter, {'event1': callback1, 'event2': callback2, 'all': callbackall});
    emitter.trigger('event1 event2', 10);
    equal(listener.flag1, 11, 'triggered');
    equal(listener.flag2, 30, 'triggered');
    equal(listener.flagall, 'event1@10event2@10', 'triggered');

    listener.stopListening();
    emitter.trigger('event1 event2', 10);
    equal(listener.flag1, 11, 'never triggered again');
    equal(listener.flag2, 30, 'never triggered again');
    equal(listener.flagall, 'event1@10event2@10', 'never triggered again');

});




test('listenToOnce-stopListening', function(){

    var listener = new E(),
        emitter = new E(),
        callback1 = function(inc){
            this.flag1 || (this.flag1 = 0);
            inc ? ( this.flag1 += inc ) : this.flag1++;
        },
        callback2 = function(inc){
            this.flag2 || (this.flag2 = 0);
            inc ? ( this.flag2 += inc ) : this.flag2++;
        },
        callbackall = function(name, inc){
            this.flagall || (this.flagall = '');
            this.flagall += name + '@' + inc;
        };

    listener.listenToOnce(emitter, 'event1', callback1);
    ok(!!emitter._listenId, 'emitter._listenId exists');
    ok(!!listener._listeningTo, 'listener._listeningTo exists');
    deepEqual(
        listener._listeningTo[emitter._listenId]
        , emitter
        , 'listener._listeningTo[emitter._listenId] === emitter'
    );

    emitter.trigger('event1');
    equal(listener.flag1, 1, 'triggered');

    emitter.trigger('event1');
    equal(listener.flag1, 1, 'never triggered again');

    listener.listenToOnce(emitter, 'event1 event2', callback2);
    emitter.trigger('event1 event2', 10);
    equal(listener.flag1, 1, 'never triggered again');
    equal(listener.flag2, 10, 'only triggered once');

    listener.listenToOnce(emitter, 'event1 event2', callback2);
    listener.stopListening();
    emitter.trigger('event1 event2', 10);
    equal(listener.flag2, 10, 'never triggered again');

});





})();
