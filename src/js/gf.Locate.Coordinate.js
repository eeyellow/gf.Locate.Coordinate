;
(function ($, window, document, undefined) {
    //'use strict';
    var pluginName = 'gfLocateCoordinate'; //Plugin名稱
    var gfLocateCoordinate;

    
    
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
    

    //實例化，揭露方法，回傳
    $.fn[pluginName] = function (options, args) {
        var gfInstance;
        this.each(function () {
            gfInstance = new gfLocateCoordinate($(this), options);
        });
        
        return this;
    };
})(jQuery, window, document);