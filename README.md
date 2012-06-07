## Demo

http://hvergara.github.com/speedtest.js/demo.html

## Usage

### Latency

```
var latency  = new SpeedTest.Latency('samples/empty.bin?' + Math.random());

latency.on('finish', function(size, time) {
    console.log('Latency: ' + time + ' ms');
}                
```

### Download

```
var download = new SpeedTest.Download('samples/8mb.bin?' + Math.random());

download.on('progress', function(loaded, total, rate) {

    var percent = Math.round(loaded / total * 100),
        kbps = Math.round(rate / 1024);

    console.log(percent + ' loaded at ' + kbps + ' kbps')
}

download.on('finish', function(size, time) {
    console.log(size + ' bytes downloaded in ' + time + ' seconds');
}
```