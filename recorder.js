/*!
 *  Recorder.js
 *  https://github.com/mattdiamond/Recorderjs
 *  Licensed under the MIT license.
 *  Copyright (c) 2013 Matt Diamond
 */
(function(window){
  var WORKER_PATH = 'recorderWorker.js';
  var Recorder = function(source, cfg){
    var config = cfg || {};
    var bufferLen = config.bufferLen || 4096;
    this.context = source.context;
    if(!this.context.createScriptProcessor){
       this.node = this.context.createJavaScriptNode(bufferLen, 2, 2);
    } else {
       this.node = this.context.createScriptProcessor(bufferLen, 2, 2);
    }
    var worker = new Worker(config.workerPath || WORKER_PATH);
    worker.postMessage({ command: 'init', config: {
      sampleRate: this.context.sampleRate
    }});
    var recording = false,
      currCallback;
    this.node.onaudioprocess = function(e){
      if (!recording) return;
      worker.postMessage({ command: 'record', buffer: [
        e.inputBuffer.getChannelData(0),
        e.inputBuffer.getChannelData(1)
      ]});
    };
    this.configure = function(cfg){
      for (var prop in cfg){
        if(cfg.hasOwnProperty(prop)){
          config[prop] = cfg[prop];
        }
      }
    };
    this.record = function(){
      recording = true;
    };
    this.stop = function(){
      recording = false;
    };
    this.clear = function(){
      worker.postMessage({ command: 'clear' });
    };
    this.exportWAV = function(cb, type){
      currCallback = cb || config.callback;
      type = type || config.type || 'audio/wav';
      if (!currCallback) throw new Error('Callback not set');
      worker.postMessage({ command: 'exportWAV', type: type });
    };
    worker.onmessage = function(e){
      var blob = e.data;
      currCallback(blob);
    };
    source.connect(this.node);
    this.node.connect(this.context.destination);    //this should not be necessary
  };
  window.Recorder = Recorder;
})(window);
