$(function () {

    var size = 500;
    var color = '#000000';
    var bgColor = '#ffffff';
    var gradient = null;
    var src = null;
    var stroke = 0; // 图标描边
    var textType = 0;
    var type = 0;
    var quality = 3;
    var padding = 20;
    var angle = 0;
    var bgImage = null;
    var eyeOutColor = null;
    var eyeInColor = null;
    
    /**
     *
     *  UTF-8 data encode / decode
     *  http://www.webtoolkit.info/
     *
     **/
    function utf8Encode(string) {
        string = string.replace(/\r\n/g,'\n');
        var utftext = '';
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    }

    function makeCode () {
        var allText;
        var elText = document.getElementById('text');

        if (textType === 0) {
            allText = elText.value
            if (!elText.value) {
                ui.msg('请输内容');
                elText.focus();
                return;
            }
        } else if (textType === 1) {
            allText = document.getElementById('text2').value
            if (!allText) {
                ui.msg('请输网址');
                return;
            }
        } else if (textType === 2) {
            var phone = document.getElementById('tel-phone').value;
            allText = 'tel:' + phone;
        }

        $('#canvas').qrcode({
            width: size,
            height: size,
            background: bgColor,
            foreground: color,
            cellSize: 8, //2-10
            effect: {
                key: 'round',
                value: 0.2
            },
            text: utf8Encode(allText),
            ecLevel: 'L',
            mSize: 0.1,
            mPosX: 0.5,
            mPosY: 0.5,
            label: 'no label',
            fontname: 'sans',
            fontcolor: '#FFF',
            gradient: gradient,
            padding: padding,
            quality: quality,
            type: type,
            angle: angle,
            src: src,
            stroke: stroke,
            bgImage: bgImage,
            eyeOutColor: eyeOutColor,
            eyeInColor: eyeInColor
        });
    }

    $('#sub-tab').find('a[data-toggle="tab"]').on('shown.ui.tab', function (e) {
        textType = $(e.target).parent().index();
    })

    $('#create').on('click', function () {
        makeCode()

        var canvas = document.getElementById("canvas")
        var img = canvas.toDataURL("image/png")
        $('#result-img').attr('src', img)
        $('#result-box').show()
    })

    $('#close').on('click', function () {
        $('#result-box').hide()
    })
})
