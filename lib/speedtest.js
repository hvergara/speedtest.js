Object.extend = Object.extend || function(dest, orig) {
    for(var name in orig) { dest[name] = orig[name] }
}

Function.prototype.bind = Function.prototype.bind || function() {
    var args  = Array.prototype.slice.call(arguments, 0), scope = args.shift(), self = this;
    return function() { self.apply(scope, arguments) }
}

Date.now = Date.now || function() {
    return (new Date().getTime());
}




function EventEmitter () {}

EventEmitter.prototype._events = {};

EventEmitter.prototype.on = function(event, listener) {
   this._events[event] =  this._events[event] || [];
   this._events[event].push(listener); 
}

EventEmitter.prototype.emit = function() {
    var args  = Array.prototype.slice.call(arguments, 0), event = args.shift();

    if(event in this._events) {
        this._events[event].map(function(listener) {
            listener.apply(this, args);
        })
    }
};



/* SpeedTest */

SpeedTest.Base = function(method, url) { 
    this.options = { method: method, url: url }
}

Object.extend(SpeedTest.Base.prototype, EventEmitter.prototype);
Object.extend(SpeedTest.Base.prototype, {

    setup: function() {
    
        this.client = new XMLHttpRequest();
        
        this.client.onprogress         = this.onProgress.bind(this);
        this.client.onreadystatechange = this.onStateChange.bind(this);
        
        this.client.open(this.options.method, this.options.url, true);    
    },
    
    onProgress: function() {
    
        if(!this.bytesTotal) {
            this.bytesTotal = info.total;
        }
        
        var rate = info.loaded / ((Date.now() - this.report.timer.start) / 1000);
        
        this.emit('progress', obj.loaded, obj.total, rate);
    },
    
    onStateChange: function() {
    
        switch(this.request.readyState) {
        
            case 1: 
            
                break;
                
            case 2: /* Starts */
                this.report.timer.start = Date.now();
                this.emit('start');
                break;
                
            case 3: /* Downloading */
                break;
            
            case 4: /* Finish */
            
                this.report.bytes.total  = this.report.bytesTotal || this.request.responseText.length;
                this.report.timer.finish = Date.now();
            
                this.emit('finish', this.report);
                break;
        }
    
    }

});

SpeedTest.Latency = function(url) {
    this.prototype = new SpeedTest.Base('HEAD', url);
};

SpeedTest.Download = function(url) {
    this.prototype = new SpeedTest.Base('GET', url);
}

SpeedTest.Upload = function(url) {
    this.prototype = new SpeedTest.Base('POST', url);
}
