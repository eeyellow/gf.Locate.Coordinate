;
(function ($, window, document, undefined) {
    //'use strict';
    var pluginName = 'gfLocateCoordinate'; //Plugin名稱
    var gfLocateCoordinate;

    $.ajax({
        url: 'node_modules/bootstrap-select/dist/css/bootstrap-select.min.css',
        dataType: 'text',
        cache: true
    }).then(function(data){
        var style = $('<style/>',{ 'text': data });
        $('head').append(style);
    });
    $.ajax({
        url: 'node_modules/gf.locate.coordinate/src/css/gf.Locate.Coordinate.css',
        dataType: 'text',
        cache: true
    }).then(function(data){
        var style = $('<style/>',{ 'text': data });
        $('head').append(style);
    });
    //Load dependencies first
    $.when(
        $.ajax({
            url: 'node_modules/proj4/dist/proj4.js',
            dataType: 'script',
            cache: true
        }),
        $.ajax({
            url: 'node_modules/bootstrap-select/dist/js/bootstrap-select.min.js',
            dataType: 'script',
            cache: true
        })
    )
    .done(function(){
        //建構式
        gfLocateCoordinate = function (element, options) {

            this.target = element; //html container
            //this.prefix = pluginName + "_" + this.target.attr('id'); //prefix，for identity
            this.opt = {};
            var initResult = this._init(options); //初始化
            if (initResult) {
                //初始化成功之後的動作
                this._style();
                this._event();
                this._subscribeEvents();

                this.target.trigger('onInitComplete');
            }
        };

        //預設參數
        gfLocateCoordinate.defaults = {

            css: {
                'width': '100%',

                'background-color': '#e3f0db',
                'overflow-y': 'hidden',
                'overflow-x': 'hidden',
            },

            proj: {
                'EPSG:4326': {
                    name: 'WGS84',
                    def: '+title=long/lat:WGS84 +proj=longlat +a=6378137.0 +b=6356752.31424518 +ellps=WGS84 +datum=WGS84 +units=degrees'
                },
                'EPSG:3826': {
                    name: 'TWD97',
                    def: '+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
                },
                'EPSG:3828': {
                    name: 'TWD67',
                    def: '+proj=tmerc  +towgs84=-752,-358,-179,-.0000011698,.0000018398,.0000009822,.00002329 +lat_0=0 +lon_0=121 +x_0=250000 +y_0=0 +k=0.9999 +ellps=aust_SA  +units=m'
                }
            },

            onClick: undefined,
            onInitComplete: undefined

        };

        //方法
        gfLocateCoordinate.prototype = {
            //私有方法
            _init: function (_options) {
                //合併自訂參數與預設參數
                try {
                    this.opt = $.extend(true, {}, gfLocateCoordinate.defaults, _options);
                    return true;
                } catch (ex) {
                    return false;
                }
            },
            _style: function () {
                var o = this;
                o.target.css(o.opt.css);

                var row1 = $('<div/>', { 'class': 'gfLocateCoordinate-Row' });
                var lbl1 = $('<label/>', { 'class': 'gfLocateCoordinate-Label', 'text': '座標系統' });
                var sel = $('<select/>', { 'class': 'gfLocateCoordinate-Select' });
                Object.keys(o.opt.proj).forEach(function(key){
                    proj4.defs(key, o.opt.proj[key]["def"]);

                    var option = $('<option/>',{ 'value': key, 'text': o.opt.proj[key]["name"] });
                    sel.append(option);
                });
                row1.append(lbl1);
                row1.append(sel);

                var row2 = $('<div/>', { 'class': 'gfLocateCoordinate-Row' });
                var lbl2 = $('<label/>', { 'class': 'gfLocateCoordinate-Label', 'text': 'X座標或E經度' });
                var input2 = $('<input/>', { 'class': 'gfLocateCoordinate-Input gfLocateCoordinate-x', 'type': 'text', 'placeholder': '範例: 120.973' });
                row2.append(lbl2);
                row2.append(input2);

                var row3 = $('<div/>', { 'class': 'gfLocateCoordinate-Row' });
                var lbl3 = $('<label/>', { 'class': 'gfLocateCoordinate-Label', 'text': 'Y座標或N緯度' });
                var input3 = $('<input/>', { 'class': 'gfLocateCoordinate-Input gfLocateCoordinate-y', 'type': 'text', 'placeholder': '範例:  23.976' });
                row3.append(lbl3);
                row3.append(input3);

                var row4 = $('<div/>', { 'class': 'gfLocateCoordinate-Row' });
                var btn4 = $('<button/>', { 'class': 'gfLocateCoordinate-Button', 'text': '定位' });
                row4.append(btn4);

                o.target.append(row1);
                o.target.append(row2);
                o.target.append(row3);
                o.target.append(row4);

                sel.selectpicker();
            },
            _event: function () {
                var o = this;
                o.target
                    .find('.gfLocateCoordinate-Button')
                    .click(function(e){
                        var x = o.target.find('.gfLocateCoordinate-x').val();
                        var y = o.target.find('.gfLocateCoordinate-y').val();
                        var coord = o.target.find('.gfLocateCoordinate-Select').selectpicker('val');
                        var newPoint = o._coordinateTransfer(x, y, coord);
                        o.target.trigger("onClick", newPoint);
                    });
            },

            _coordinateTransfer: function(x, y, sourceCoord, targetCoord){
                if(targetCoord == undefined){
                    targetCoord = "EPSG:4326";
                }
                return proj4(sourceCoord, targetCoord, { x: x * 1, y: y * 1 });
            },

            //註冊事件接口
            _subscribeEvents: function () {
                //先解除所有事件接口
                this.target.off('onClick');
                this.target.off('onInitComplete');
                //綁定點擊事件接口
                if (typeof (this.opt.onClick) === 'function') {
                    this.target.on('onClick', this.opt.onClick);
                }
                if (typeof (this.opt.onInitComplete) === 'function') {
                    this.target.on('onInitComplete', this.opt.onInitComplete);
                }
            }



        };
    });

    //實例化，揭露方法，回傳
    $.fn[pluginName] = function (options, args) {
        var gfInstance;
        this.each(function () {
            gfInstance = new gfLocateCoordinate($(this), options);
        });

        return this;
    };
})(jQuery, window, document);