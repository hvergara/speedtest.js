/* Compat functions */

Object.extend = Object.extend || function (dest, orig) {
    for(var name in orig) {
        if(typeof orig[name] != 'function') { 
            dest[name] = orig[name]; 
        }
    }
};

Function.prototype.bind = Function.prototype.bind || function () {
    var args  = Array.prototype.slice.call(arguments, 0), scope = args.shift(), self = this;
    return function () { self.apply(scope, arguments); };
};

Date.now = Date.now || function () {
    return (new Date().getTime());
};




/* SpeedTest */

var SpeedTest = {

    Base: function (options) {
        this.options = options;
    },
    
    Latency: function(url) {
        return new SpeedTest.Base({ method: 'HEAD', url: url });
    },
    
    Download: function(url) {
        return new SpeedTest.Base({ method: 'GET', url: url });
    },
    
    Upload: function(url) {
        return new SpeedTest.Base({ method: 'POST', url: url });
    }
    
};

Object.extend(SpeedTest.Base.prototype, {

    setup: function () {
    
        this.client = new XMLHttpRequest();
        
        this.client.onprogress         = this.onProgress.bind(this);
        this.client.onreadystatechange = this.onStateChange.bind(this);
        
        this.client.open(this.options.method, this.options.url, true);    
    },
    
    onProgress: function (info) {
    
        if(!this.bytesTotal) {
            this.bytesTotal = info.total;
        }
        
        var rate = info.loaded / ((Date.now() - this.report.timer.start) / 1000);
        
        this.emit('progress', info.loaded, info.total, rate);
    },
    
    onStateChange: function () {
    
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


var EventEmitter = {
    events: {},
    
    on: function (event, listener) {
        this._events[event] =  this._events[event] || [];
        this._events[event].push(listener); 
    },
    
    emit: emit = function () {
        var args  = Array.prototype.slice.call(arguments, 0), event = args.shift();
    
        if(event in this._events) {
            for(var i = 0, length = this._events[event].length; i < length; i++) {
                (this._events[event][i]).apply(this, args);
            }
        }
    }
};

Object.extend(SpeedTest.Base.prototype, EventEmitter);
