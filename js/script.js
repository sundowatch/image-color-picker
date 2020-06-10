var canvas;
var ctx;



$(function(){


    $('#drg').draggable();




    var CLIPBOARD = new CLIPBOARD_CLASS("panel", true, function(){
        $('.placeholder').remove();
    });

    /**
     * image pasting into canvas
     * 
     * @param {string} canvas_id - canvas id
     * @param {boolean} autoresize - if canvas will be resized
     */
    function CLIPBOARD_CLASS(canvas_id, autoresize, callback=()=>{}) {
        var _self = this;
        var canvas = document.getElementById(canvas_id);
        var ctx = document.getElementById(canvas_id).getContext("2d");

        //handlers
        document.addEventListener('paste', function (e) { _self.paste_auto(e); }, false);

        //on paste
        this.paste_auto = function (e) {
            if (e.clipboardData) {
                var items = e.clipboardData.items;
                if (!items) return;
                
                //access data directly
                var is_image = false;
                for (var i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf("image") !== -1) {
                        //image
                        var blob = items[i].getAsFile();
                        var URLObj = window.URL || window.webkitURL;
                        var source = URLObj.createObjectURL(blob);
                        this.paste_createImage(source);
                        is_image = true;
                    }
                }
                if(is_image == true){
                    e.preventDefault();
                }
            }
        };
        //draw pasted image to canvas
        this.paste_createImage = function (source) {
            var pastedImage = new Image();
            pastedImage.onload = function () {
                if(autoresize == true){
                    //resize
                    canvas.width = pastedImage.width;
                    canvas.height = pastedImage.height;
                }
                else{
                    //clear canvas
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
                ctx.drawImage(pastedImage, 0, 0);
                callback();
            };
            pastedImage.src = source;
        };
    }






    // drawing active image
    /*
    var image = new Image();
    image.onload = function () {
        ctx.drawImage(image, 0, 0, image.width, image.height); // draw the image on the canvas
    }
    image.src = images[iActiveImage];
    */

    // creating canvas object
    canvas = document.getElementById('panel');
    ctx = canvas.getContext('2d');

    $('#panel').mousemove(function(e) { // mouse move handler
        var canvasOffset = $(canvas).offset();
        var canvasX = Math.floor(e.pageX - canvasOffset.left);
        var canvasY = Math.floor(e.pageY - canvasOffset.top);

        var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
        var pixel = imageData.data;

        var pixelColor = "rgba("+pixel[0]+", "+pixel[1]+", "+pixel[2]+", "+pixel[3]+")";
        $('#preview').css('backgroundColor', pixelColor);
    });

    $('#panel').click(function(e) { // mouse click handler
        var canvasOffset = $(canvas).offset();
        var canvasX = Math.floor(e.pageX - canvasOffset.left);
        var canvasY = Math.floor(e.pageY - canvasOffset.top);

        var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
        var pixel = imageData.data;

        $('#rVal').val(pixel[0]);
        $('#gVal').val(pixel[1]);
        $('#bVal').val(pixel[2]);

        $('#rgbVal').val(pixel[0]+','+pixel[1]+','+pixel[2]);
        $('#rgbaVal').val(pixel[0]+','+pixel[1]+','+pixel[2]+','+pixel[3]);
        var dColor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0];
        $('#hexVal').val( '#' + dColor.toString(16) );
    }); 

});