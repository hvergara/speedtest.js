
var SpeedTest = {

    Base: function (options) {
        EventEmitter.call(this);
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

Object.extend(SpeedTest.Base.prototype, EventEmitter.prototype);

Object.extend(SpeedTest.Base.prototype, {

    bytesTotal: undefined,
    
    start: function() {
        
        this.client = new XMLHttpRequest();
        
        this.client.onprogress         = this.onProgress.bind(this);
        this.client.onreadystatechange = this.onStateChange.bind(this);
        
        this.client.open(this.options.method, this.options.url, true);
        this.client.responseType = 'arraybuffer';
        
        this.client.send(null);
    },
    
    onProgress: function (info) {

        if(!this.bytesTotal) {
            this.bytesTotal = info.total;
        }
        
        var rate = info.loaded / ((Date.now() - this.startTime) / 1000);
        
        this.emit('progress', info.loaded, info.total, rate);
    },
    
    onStateChange: function () {
    
        switch(this.client.readyState) {
        
            case 1: /* Opened */
                this.startTime = Date.now();
                break;
                
            case 2: /* Starts */
            
                var length = this.client.getResponseHeader('Content-Length');
                
                if(length) {
                    this.bytesTotal = parseInt(length);
                }
                       
                this.emit('start');
                break;
                
            case 3: /* Downloading */
                break;
            
            case 4: /* Finish */
                this.emit('finish', this.bytesTotal, Date.now() - this.startTime);
                break;
        }
    
    }

});