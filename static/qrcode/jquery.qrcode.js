(function( $ ){
    var cache = {};

	$.fn.qrcode = function(options) {
		// if options is string, 
		if( typeof options === 'string' ){
			options	= { text: options };
		}

		// set default values
		// typeNumber < 1 for automatic calculation
        var levels = [QRErrorCorrectLevel.L, QRErrorCorrectLevel.M, QRErrorCorrectLevel.Q, QRErrorCorrectLevel.H]
		options	= $.extend( {}, {
			width		: 256,
			height		: 256,
			typeNumber	: -1,
			correctLevel	: 0,
			/*QRErrorCorrectLevel = {
                L : 1, // 7% 的字码可被修正
                M : 0, // 15% 的字码可被修正
                Q : 3, // 25% 的字码可被修正
                H : 2 // 30% 的字码可被修正
            };*/

            // 背景
            background: "#ffffff",
            bgImage: null,

            foreground      : "#000000",
            padding: 20,
            quality: 3,
            angle: 0,
            type: 0,
            src: null,
            stroke: 0,
            eyeOutColor: null,
            eyeInColor: null,
		}, options);

		var MyQrcode = function(elem) {
            var that = this;

            // create the qrcode itself
            var qrcode	= new QRCode(options.typeNumber, levels[options.quality]);
            qrcode.addData(options.text);
            qrcode.make();

			// create canvas element
            var canvas = elem;
            canvas.id = 'canvas';
            canvas.width = options.width;
            canvas.height = options.height;
			/*var canvas	= document.createElement('canvas');
            canvas.id = 'canvas';
			canvas.width = options.width;
			canvas.height = options.height;*/
			var ctx	 = canvas.getContext('2d');
            that.ctx = ctx;
            ctx.strokeStyle = 'transparent';

            // 计算单元格大小
            var width = options.width - 2 * options.padding;
            var height = options.height - 2 * options.padding;
			that.tile = width / qrcode.getModuleCount();

            ctx.translate(options.width / 2, options.width / 2);

            ctx.rotate(options.angle * Math.PI / 180);

            function roundedRect(cornerX, cornerY, width, height, cornerRadius) {
                if (width> 0) {
                    /*cornerRadius = width / 2;
                    ctx.moveTo(cornerX + cornerRadius, cornerY);
                    ctx.arcTo(cornerX+width,cornerY,cornerX + width,cornerY+height,cornerRadius);
                    ctx.arcTo(cornerX+width,cornerY + height,cornerX,cornerY+height,cornerRadius);
                    ctx.arcTo(cornerX,cornerY+height,cornerX,cornerY,cornerRadius);
                    ctx.arcTo(cornerX,cornerY,cornerX+width,cornerY,cornerRadius);*/

                } else {
                    //ctx.moveTo(cornerX - cornerRadius, cornerY);
                    fillRect(Math.round(col * that.tile) + options.padding,
                        Math.round(row * that.tile) + options.padding, w, h);
                }

                if (width> 0) {

                } else {
                    //ctx.arcTo(cornerX,cornerY,cornerX-cornerRadius,cornerY,cornerRadius);
                }
            }

            function asd(cornerX, cornerY, width, height, cornerRadius) {
                if (width> 0) {
                    /*cornerRadius = width / 2;
                     ctx.moveTo(cornerX + cornerRadius, cornerY);
                     ctx.arcTo(cornerX+width,cornerY,cornerX + width,cornerY+height,cornerRadius);
                     ctx.arcTo(cornerX+width,cornerY + height,cornerX,cornerY+height,cornerRadius);
                     ctx.arcTo(cornerX,cornerY+height,cornerX,cornerY,cornerRadius);
                     ctx.arcTo(cornerX,cornerY,cornerX+width,cornerY,cornerRadius);*/

                }



                if (width> 0) {

                } else {
                    //ctx.arcTo(cornerX,cornerY,cornerX-cornerRadius,cornerY,cornerRadius);
                }
            }

            function drawRoundedRect(cornerX, cornerY, width, height, cornerRadius) {
                ctx.beginPath();
                roundedRect(cornerX, cornerY, width, height, cornerRadius);
                ctx.stroke();
                ctx.fill();
            }

            // 绘制背景
            //options.bgImage = 'asset/img/bg-1.jpg';
            if (options.bgImage) {
                var img;
                if (cache[options.bgImage]) {
                    img = cache[options.bgImage];
                    that.drawImage(img, 0, 0, options.width, options.height);
                    that.drawOther(qrcode);
                } else {
                    img = new Image();
                    img.src = options.bgImage;
                    img.onload = function () {
                        cache[options.bgImage] = img;
                        that.drawImage(img, 0, 0, options.width, options.height);
                        that.drawOther(qrcode);
                    }
                }

            } else {
                ctx.fillStyle = options.background;
                that.fillRect(0, 0, options.width, options.height);

                that.drawOther(qrcode);
            }


            /*if (options.padding > 0) {
                ctx.fillStyle = options.background;
                fillRect(0, 0, options.padding, options.height);
                fillRect(0, 0, options.width, options.padding);
                fillRect(options.width - options.padding, 0, options.width, options.height);
                fillRect(0, options.height - options.padding, options.width, options.padding);
            }*/
		};

        MyQrcode.prototype.drawOther = function (qrcode) {
            var that = this;
            var ctx = that.ctx;

            var grd = ctx.createLinearGradient(options.padding, options.padding,
                options.width - options.padding, options.height - options.padding); // TODO
            if (options.gradient) {
                grd.addColorStop(0, options.gradient.color1);
                grd.addColorStop(0.1, options.gradient.color2);
            }

            //var bgImage = document.getElementById('asd');
            var url = 'asset/img/bg-1.jpg';

            if (false) {
                var bgCanvas = document.getElementById('canvas2');
                var bgImage;
                bgImage = new Image();
                var pattern;
                bgImage.src="asset/img/bg-1.jpg";
                bgImage.onload=function(){
                    console.log('load');
                    //bgImage.width = 500;
                    //bgImage.height = 500;
                    var ctx2 = bgCanvas.getContext('2d');
                    ctx2.drawImage(bgImage, 0, 0, bgImage.width, bgImage.height);
                    pattern=ctx.createPattern(bgCanvas, "repeat");//no-repeat,repeat-x,repeat-y,repeat

                    drawFront(pattern);

                };

            } else {
                drawFront(pattern);
            }


            function drawFront(pattern) {
                // 绘制二维码
                for( var row = 0; row < qrcode.getModuleCount(); row++ ){
                    for( var col = 0; col < qrcode.getModuleCount(); col++ ){
                        var w = (Math.ceil((col+1)*that.tile) - Math.floor(col*that.tile));
                        var h = (Math.ceil((row+1)*that.tile) - Math.floor(row*that.tile));

                        if (!qrcode.isDark(row, col)) {
                            ctx.fillStyle = '#f00';//options.background;

                            //drawRoundedRect(Math.round(col*tileW),Math.round(row*tileH), w, h, 5);
                            //fillRect(Math.round(col * tileW) + options.padding, Math.round(row * tileH) + options.padding, w, h);
                        } else {
                            // 判断是否外框
                            if ((row < 7 && col < 7) || (row < 7 && col > qrcode.getModuleCount() - 8)
                                || (col < 7 && row > qrcode.getModuleCount() - 8)) {

                                // 判断是否内框
                                if ((row > 1 && row < 5 && col > 1 && col < 5)
                                    || (row >1 && row < 5 && col > qrcode.getModuleCount() - 6 && col < qrcode.getModuleCount() - 2)
                                    || (col > 1 && col < 5 && row > qrcode.getModuleCount() - 6 && row < qrcode.getModuleCount() - 2)) {
                                    if (options.eyeInColor) {
                                        ctx.fillStyle = options.eyeInColor;
                                    } else {
                                        ctx.fillStyle = options.foreground;
                                    }
                                } else {
                                    if (options.eyeOutColor) {
                                        ctx.fillStyle = options.eyeOutColor;
                                    } else {
                                        ctx.fillStyle = options.foreground;
                                    }
                                }
                            } else {
                                ctx.fillStyle = options.foreground;
                            }

                            //ctx.fillStyle = options.foreground;
                            //ctx.strokeStyle = options.foreground;
                            /*fillRect(Math.round(col * tileW) + options.padding,
                             Math.round(row * tileH) + options.padding, w, h);*/

                            if (options.gradient) {
                                ctx.fillStyle = grd;
                            }
                            if (pattern) {

                                ctx.fillStyle = pattern;
                            }

                            if (options.type == 0) {
                                // 画方格
                                that.fillRect(Math.round(col * that.tile) + options.padding,
                                    Math.round(row * that.tile) + options.padding, w, h);
                            } else if (options.type == 1) {
                                // 画圆
                                ctx.beginPath();
                                var r = that.tile / 2;
                                that.arc(Math.round(col * that.tile) + options.padding + r,
                                    Math.round(row * that.tile) + options.padding + r,
                                    r);
                                ctx.fill();
                            } else {
                                // 液化
                                function ok(row, col) {
                                    if (row === 0 || qrcode.isDark(row, col)) {
                                        return 1;
                                    }
                                    return 3;
                                }

                                // 左上
                                if ((row === 0 || !qrcode.isDark(row - 1, col)) &&
                                    (col === 0 || !qrcode.isDark(row, col - 1))) {
                                    ctx.beginPath();
                                    var r = that.tile / 2;
                                    that.arc(Math.round(col * that.tile) + options.padding  + r,
                                        Math.round(row * that.tile) + options.padding + r,
                                        r, Math.PI, Math.PI * 1.5);
                                    that.lineTo(Math.round(col * that.tile) + options.padding + that.tile / 2 + 2,
                                        Math.round(row * that.tile) + options.padding + that.tile / 2 + 2);
                                    ctx.fill();
                                } else {
                                    that.fillRect(Math.round(col * that.tile) + options.padding,
                                        Math.round(row * that.tile) + options.padding, w / 2, h / 2);
                                }

                                // 右上
                                if ((row === 0 || !qrcode.isDark(row - 1, col)) &&
                                    (col === qrcode.getModuleCount() - 1 || !qrcode.isDark(row, col + 1))) {
                                    ctx.beginPath();
                                    var r = that.tile / 2;
                                    that.arc(Math.round(col * that.tile) + options.padding  + r,
                                        Math.round(row * that.tile) + options.padding + r,
                                        r, Math.PI * 1.5, Math.PI * 2);
                                    that.lineTo(Math.round(col * that.tile) + options.padding + that.tile / 2 - 2,
                                        Math.round(row * that.tile) + options.padding + that.tile / 2 + 2);
                                    ctx.fill();
                                } else {
                                    that.fillRect(Math.round(col * that.tile) + options.padding + w / 2,
                                        Math.round(row * that.tile) + options.padding, w / 2, h / 2);
                                }

                                // 右下
                                if ((row === qrcode.getModuleCount() - 1 || !qrcode.isDark(row + 1, col)) &&
                                    (col === 0 || !qrcode.isDark(row, col - 1))) {
                                    ctx.beginPath();
                                    var r = that.tile / 2;
                                    that.arc(Math.round(col * that.tile) + options.padding  + r,
                                        Math.round(row * that.tile) + options.padding + r,
                                        r, Math.PI * 0.5, Math.PI);
                                    that.lineTo(Math.round(col * that.tile) + options.padding + that.tile / 2 - 2,
                                        Math.round(row * that.tile) + options.padding + that.tile / 2 - 2);
                                    ctx.fill();
                                } else {
                                    that.fillRect(Math.round(col * that.tile) + options.padding,
                                        Math.round(row * that.tile) + options.padding + w / 2, w / 2, h / 2);
                                }

                                // 左下
                                if ((row === qrcode.getModuleCount() - 1 || !qrcode.isDark(row + 1, col)) &&
                                    (col === qrcode.getModuleCount() - 1 || !qrcode.isDark(row, col + 1))) {
                                    ctx.beginPath();
                                    var r = that.tile / 2;
                                    that.arc(Math.round(col * that.tile) + options.padding  + r,
                                        Math.round(row * that.tile) + options.padding + r,
                                        r, 0, Math.PI * 0.5);
                                    that.lineTo(Math.round(col * that.tile) + options.padding + that.tile / 2,
                                        Math.round(row * that.tile) + options.padding + that.tile / 2);
                                    ctx.fill();
                                } else {
                                    that.fillRect(Math.round(col * that.tile) + options.padding + w / 2,
                                        Math.round(row * that.tile) + options.padding + w / 2, w / 2, h / 2);
                                }
                            }
                            /*drawRoundedRect(Math.round(col * tileW) + options.padding,
                             Math.round(row * tileH) + options.padding, w, h, 16);*/
                        }
                    }
                }

                // 绘制特殊码眼
                ctx.fillStyle = '#f00';
                // 左上
                /*console.log(w, h);
                that.fillRect(Math.round(0 * that.tile) + options.padding,
                    Math.round(0 * that.tile) + options.padding, w * 7, h);
                that.fillRect(Math.round(0 * that.tile) + options.padding,
                    Math.round(1 * that.tile) + options.padding, w, h * 6);
                that.fillRect(Math.round(6 * that.tile) + options.padding,
                    Math.round(1 * that.tile) + options.padding, w, h * 6);
                that.fillRect(Math.round(1 * that.tile) + options.padding,
                    Math.round(6 * that.tile) + options.padding, w * 5, h);*/
            }


            // 绘制图标
            if (options.src) {
                if (options.stroke > 0) {
                    // 绘制图标背景
                    ctx.fillStyle = '#fff';
                    var size = 60 + options.stroke;
                    that.fillRect(options.width / 2 - size / 2, options.height / 2 - size / 2,
                        size, size, 1);
                }

                var img;
                if (cache[options.src]) {
                    img = cache[options.src];
                    that.drawImage(img, options.width / 2 - 60 / 2 , options.height / 2 - 60 / 2, 60, 60);
                } else {

                    var img = new Image();
                    img.src = options.src;
                    img.onload = function(){
                        cache[options.src] = img;
                        that.drawImage(img, options.width / 2 - 60 / 2 , options.height / 2 - 60 / 2, 60, 60);
                    };
                }
            }
        };

        MyQrcode.prototype.fillRect = function (x, y, w, h) {
            var that = this;
            that.ctx.fillRect(x - options.width / 2, y - options.width / 2, w, h);
        };

        MyQrcode.prototype.arc = function (x, y, r, sAngle, eAngle, counterclockwise) {
            var that = this;
            that.ctx.arc(x - options.width / 2, y - options.width / 2, r, 0, Math.PI * 2);
        };

        MyQrcode.prototype.drawImage = function (img, sx, sy, swidth, sheight, x, y, width, height) {
            var that = this;
            that.ctx.drawImage(img, sx - options.width / 2, sy - options.width / 2, swidth, sheight);
        };

        MyQrcode.prototype.lineTo = function (x, y) {
            var that = this;
            that.ctx.lineTo(x - options.width / 2, y -options.width / 2);
        };

		return this.each(function(){
            new MyQrcode(this, options);
		});
	};
})( jQuery );
