;
(function ($, window, document, undefined) {
    //'use strict';
    var pluginName = 'gfLocateCoordinate'; //Plugin名稱
    var gfLocateCoordinate;

    //Load dependencies first
    $.when(
        $.ajax({
            url: 'node_modules/select2/dist/css/select2.min.css',
            dataType: 'text',
            cache: true
        }).then(data => {
            var style = $('<style/>',{ 'text': data });
            $('head').append(style);
        }),
        $.ajax({
            url: 'node_modules/gf.locate.coordinate/src/css/gf.Locate.Coordinate.css',
            dataType: 'text',
            cache: true
        }).then(data => {
            var style = $('<style/>',{ 'text': data });
            $('head').append(style);
        }),
        $.ajax({
            url: 'node_modules/proj4/dist/proj4.js',
            dataType: 'script',
            cache: true
        }),
        $.ajax({
            url: 'node_modules/select2/dist/js/select2.min.js',
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
                'width': '300px',
                'height': '300px',
                'background-color': '#e3f0db',
                'overflow-y': 'hidden',
                'overflow-x': 'hidden',
                'display': 'inline-block'
            },

            proj: {
                'EPSG:4326': {
                    name: 'WGS84',
                    def: '+title=long/lat:WGS84 +proj=longlat +a=6378137.0 +b=6356752.31424518 +ellps=WGS84 +datum=WGS84 +units=degrees'
                },
                'EPSG:3826': {
                    name: 'TWD97',
                    def: '+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
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

                var lbl = $('<label/>',{ 'text': '座標系統' });
                var sel = $('<select/>');
                Object.keys(o.opt.proj).forEach(function(key){
                    proj4.defs(key, o.opt.proj[key]["def"]);

                    var option = $('<option/>',{ 'value': key, 'text': o.opt.proj[key]["name"] });
                    sel.append(option);
                });
                o.target.append(lbl);
                o.target.append(sel);
                
            },
            _event: function () {
                var o = this;
                
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