
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




/* SpeedTest */

var SpeedTest = {

    Base: function (options) {
        this.options = options;
        this.setup();
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

    bytesTotal: undefined,
    timeTotal: undefined,

    setup: function () {
    
        this.client = new XMLHttpRequest();

        
        //this.client.onprogress         = this.onProgress.bind(this);
        this.client.onreadystatechange = this.onStateChange.bind(this);
        
        this.client.open(this.options.method, this.options.url, true);
        this.client.overrideMimeType("text/plain; charset=x-user-defined");  
    },
    
    onProgress: function (info) {
        return;
        if(!this.bytesTotal) {
            this.bytesTotal = info.total;
        }
        
        var rate = info.loaded / ((Date.now() - this.startTime) / 1000);
        
        console.log(rate);
        
        //this.emit('progress', info.loaded, info.total, rate);
    },
    
    
    onStateChange: function () {
    
        switch(this.client.readyState) {
        
            case 1: /* Opened */
                console.log('connected');
                break;
                
            case 2: /* Starts */
                this.startTime = Date.now();
                this.bytesTotal = parseInt(this.client.getResponseHeader('Content-Length'));
                
                this.emit('start');

                break;
                
            case 3: /* Downloading */
                
                var loaded = this.client.responseText.length,
                    rate   = loaded / ((Date.now() - this.startTime) / 1000);
                
                this.emit('progress', loaded, this.bytesTotal, rate);
                
                console.log(loaded + ' of ' + this.bytesTotal);                
                if(loaded == this.bytesTotal) {
                    this.client = null;
                    console.log('ready');
                }

            
            
//                console.log(this.client.getResponseHeader('Content-Length'));
            
//                this.emit('downloading');
                break;
            
            case 4: /* Finish */
            
                console.log('FINISH');

/*            
                this.bytesTotal = this.bytesTotal || this.client.responseText.length;
                this.timeTotal  = Date.now() - this.startTime;
                
                console.log('finished');
                
            */
//                this.emit('finish', this.bytesTotal, this.timeTotal);
                this.emit('finish', 0, 0);
                
                break;
        }
    
    },
    
    start: function() {
        this.client.send(null);
    }

});

var EventEmitter = {
    
    on: function (event, listener) {
        if(!this.events) this.events = {};
        
        this.events[event] =  this.events[event] || [];
        this.events[event].push(listener); 
    },
    
    emit: function () {
        if(!this.events) this.events = {};
        
        var args  = Array.prototype.slice.call(arguments, 0), event = args.shift();
    
        if(event in this.events) {
            for(var i = 0, length = this.events[event].length; i < length; i++) {
                (this.events[event][i]).apply(this, args);
            }
        }
    }
};

Object.extend(SpeedTest.Base.prototype, EventEmitter);
