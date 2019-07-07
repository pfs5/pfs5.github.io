window.onload = function()
{    
    class MainCharacter
    {
        width   = 20;
        height  = 20;

        px = 0;
        py = 0;

        velx = 0.0;
        vely = 0.0;

        moveSpeed = 100.0;

        draw(displayBuffer, w, h)
        {
            var px_int = Math.round(this.px);
            var py_int = Math.round(this.py);

            for (var y = py_int; y < py_int + this.height; ++y)
            {
                for (var x = px_int; x < px_int + this.width; ++x)
                {
                    var index = (y * w + x) * 4;
                    if (index < h * w * 4)
                    {
                        displayBuffer[index + 0] = 255;
                        displayBuffer[index + 1] = 0;
                        displayBuffer[index + 2] = 0;
                        displayBuffer[index + 3] = 255;
                    }
                }
            }
        }

        update(deltaTime)
        {
            var dx = 0.0;
            if (keys["d"]) dx += this.moveSpeed;
            if (keys["a"]) dx -= this.moveSpeed;
            this.velx = dx;

            var dy = 0.0;
            if (keys["s"]) dy += this.moveSpeed;
            if (keys["w"]) dy -= this.moveSpeed;
            this.vely = dy;

            this.px += this.velx * deltaTime;
            this.py += this.vely * deltaTime;
        }
    }
    
    var mainChar = new MainCharacter();
    mainChar.px = 100;
    mainChar.py = 100;

    // Init keys
    keys = {};
    keys["w"] = false;
    keys["a"] = false;
    keys["s"] = false;
    keys["d"] = false;
    keys["UpArrow"] = false;
    keys["DownArrow"] = false;
    keys["LeftArrow"] = false;
    keys["RightArrow"] = false;

    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
    
    function gameLoop() 
    {
        window.requestAnimationFrame(gameLoop);
        
        currentTime = (new Date()).getTime();
        delta = (currentTime-lastTime);

        if(delta > interval) {
        
            mainChar.update(delta / 1000.0);

            cx.clearRect(0,0,cw,cw);
            for (var i = 0; i < cw * ch * 4; ++i)
            {
                imgData.data[i] = 0;
            }

            // -- Draw --
            // ------------------------------------------------------------
            mainChar.draw(imgData.data, cw, ch);
            // ------------------------------------------------------------
            
            cx.putImageData(imgData, 0, 0);
            
            lastTime = currentTime - (delta % interval);
        }
    }

    function key_down(event)
    {
        keys[event.key] = true;
    }

    function key_up(event)
    {
        keys[event.key] = false;
    }

    var canvas = document.getElementById('canvas'),
        cw = canvas.width,
        ch = canvas.height,
        cx = null,
        fps = 30,
        bX = 30,
        bY = 30,
        mX = 10,
        mY = 20,
        interval     =    1000/fps,
        lastTime     =    (new Date()).getTime(),
        currentTime  =    0,
        delta = 0,
        imgData = null;
 
    
    if (typeof (canvas.getContext) !== undefined) 
    {
        cx = canvas.getContext('2d');
        imgData = cx.createImageData(cw, ch);

        gameLoop();
    }

    document.addEventListener('keydown', key_down);
    document.addEventListener('keyup', key_up);
}