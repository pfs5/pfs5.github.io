Connection = function () 
{
    this.address = null;
    this.port = null;
    this.url = null;
    
    this.precision = 2;
    this.reconnectInterval = 3000;
    
    this.onOpenCallback = function () {};
    this.onCloseCallback = function () {};
    
    this.__socket = null;
    this.__interval = null;
    
    this.__pinch = 0;
    
    this.init = function (address, port) 
    {
        this.address = address;
        this.port = port;
        this.url = 'ws://' + address  + ":" + port;
    };
    
    this.connect = function (address, port) 
    {
        console.log("Connecting to " + this.url );
        
        var that = this;
        
        //try to reconnect until a connection could be established.
        this.__interval = setInterval(function() {
            
            console.log("Connection attempt...");
        
            that.__socket = new WebSocket(that.url);
            that.__socket.parentCtx = that;
            
            that.__socket.onmessage = that._onMessage;
            that.__socket.onopen = that._onOpen;
            that.__socket.onerror = that._onError;
            that.__socket.onclose = that._onClose;
            
        }, this.reconnectInterval);
    };
    
    this.disconnect = function ()
    {
        //Stop reconnection attempts
        if(this.__interval != null)
            clearInterval(this.__interval);
        
        if(this.__socket != null)
            this.__socket.close();
    };
    
    this.sendObject = function (object)
    {
        this.sendMessage(JSON.stringify(object));
    };
    
    this.sendMeasurements = function (mesurements)
    {
        var values = [
        	'measurements',
            mesurements.x.toFixed(this.precision),
            mesurements.y.toFixed(this.precision),
            mesurements.z.toFixed(this.precision),
            mesurements.alpha.toFixed(this.precision),
            mesurements.beta.toFixed(this.precision),
            mesurements.gamma.toFixed(this.precision),
            this.__pinch
        ];
        
        //Add prefix character 
        //because first character will get lost on the server side
        this.sendMessage('0' + values.join(';'));
    };
    
    this.setPinchStart = function(zoom)
    {
    	this.__pinch = 1 * zoom;	
    }
    
    this.setPinchEnd = function()
    {
    	this.__pinch = 0;	
    }
    
    this.sendGesture = function(gesture)
    {
    	var values = ['gesture', gesture];
    	this.sendMessage('0' + values.join(';'));
    }
    
    this.sendMessage = function (data)
    {
        if(this.isReady())
        {
            this.__socket.send(data);
        }
    };
    
    this.isReady = function ()
    {
        return this.__socket != null && this.__socket.readyState === 1; //OPEN 
    };
    
    this._onMessage = function (event)
    {
        console.log("WebSocket:Message", event);
    };
    
    this._onOpen = function (event)
    {
        //console.log("WebSocket:Open", event);
        console.log("Successfully connected.");
        
        //Stop reconnection attempts
        clearInterval(this.parentCtx.__interval);
        
        this.parentCtx.onOpenCallback(event);
    };
    
    this._onError = function (event)
    {
        console.log("WebSocket:Error", event);
    };
    
    this._onClose = function (event)
    {
        //console.log("WebSocket:Close", event);
        
        console.log("Connection closed.");
        
        this.parentCtx.onCloseCallback(event);
    };
};

con = new Connection();
