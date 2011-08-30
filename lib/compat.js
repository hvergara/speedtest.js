
/* Compat functions */

Object.extend = Object.extend || function (dest, orig) {
    for(var name in orig) {
        dest[name] = orig[name];
    }
};

Function.prototype.bind = Function.prototype.bind || function () {
    var args  = Array.prototype.slice.call(arguments, 0), scope = args.shift(), self = this;
    return function () { self.apply(scope, arguments); };
};

Date.now = Date.now || function () {
    return (new Date().getTime());
};




function EventEmitter () {
    this.events = {};
};

EventEmitter.prototype.on = function (event, listener) {
    this.events[event] =  this.events[event] || [];
    this.events[event].push(listener);
};

EventEmitter.prototype.emit = function(event) {
    var args = Array.prototype.slice.call(arguments, 1);
    
    if(event in this.events) {
        for(var i = 0, len = this.events[event].length; i < len; i++) {
            (this.events[event][i]).apply(this, args);
        }
    }
};

