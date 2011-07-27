var Utils = {
    extends: function(dest, orig) {
        for(var name in orig) {
            dest[name] = orig[name];
        }
    },
    
    bind: function(fx, scope) {
        return function() {
            fx.apply(scope, arguments);
        }
    },
    
    now: function() {
        return (new Date().getTime());
    }
};

var SpeedTest = {};

SpeedTest.Download = function(url) {
    this.options = {};
    this.options.url = url;
    
}

Utils.extends(SpeedTest.Download.prototype, {

    options: {},
    request: {},
    events: {},

    start: function() {
     
        this.request = new XMLHttpRequest();
        
        this.request.onprogress         = Utils.bind(this._onProgress, this);
        this.request.onreadystatechange = Utils.bind(this._onStateChange, this);
        
        this.request.open('GET', this.options.url, true);
        this.request.send();
        
        this.report = {
            bytes: {}, timer: {}
        };
        
    },
    
    on: function(name, callback) {
        this.events[name] = callback;
    },
    
    emit: function(name, args) {
        //console.log('on: ' + name);
        if(name in this.events) {
            this.events[name].apply(this, args);
        }
    },
    
    _onProgress: function(obj) {
        
        if(this.report.bytes.total == undefined) {
            this.report.bytes.total = obj.total;
        }
        
        var now = Utils.now(),
            rate = obj.loaded / ((now - this.report.timer.start) / 1000);
    
        this.emit('progress', [obj.loaded, obj.total, rate]);
    },
    
    _onStateChange: function() {
        
        switch(this.request.readyState) {
        
            case 1: 
            
                break;
                
            case 2: /* Starts */
                this.report.timer.start = Utils.now();
                this.emit('start');
                break;
                
            case 3: /* Downloading */
                break;
            
            case 4: /* Finish */
            
                this.report.bytes.total    = this.report.bytesTotal || this.request.responseText.length;
                this.report.timer.finish = Utils.now();
            
                this.emit('finish', [this.report]);
                break;
        }
        
    }
    
});


