/**
 * AkvaGrid lite
 *
 * Author: @robertpiira
 * Github: https://github.com/robertpiira/akvagrid-lite
 * Browser support: Chrome (more will follow)
 *
 */

var akvaGrids = [
  {
    gridName: 'desktop',
    breakpoints: {from: {size: 768, unit: 'px'}},
    columnCount: 6,
    gutterWidth: {size: 1, unit: 'em'},
    outerGutterWidth: {size: -1, unit: 'em'},
    borderTheme: {color: 'blue', style: 'solid'},
    width: {size: 80, unit: '%'},
    opacity: 0.5,
    zindex: '100'
  },
  {
    gridName: 'desktop-alt',
    breakpoints: {from: {size: 768, unit: 'px'}},
    columnCount: 4,
    gutterWidth: {size: 1, unit: 'em'},
    outerGutterWidth: {size: -1, unit: 'em'},
    borderTheme: {color: 'green', style: 'dashed'},
    width: {size: 80, unit: '%'},
    opacity: 0.5,
    zindex: '100'
  },
  {
    gridName: 'below-desktop',
    breakpoints: {to: {size: 767, unit: 'px'}},
    columnCount: 4,
    gutterWidth: {size: 1, unit: 'em'},
    outerGutterWidth: {size: -1, unit: 'em'},
    borderTheme: {color: 'green', style: 'solid'},
    width: {size: 80, unit: '%'},
    opacity: 0.5,
    zindex: '100'
  }
];

(function (grids, $) {

  'use strict';

  var debug = {
    grid: false,
    code: true
  };

  var els = {
    wrapper:    '.akva-grid',
    inner:      '.akva-inner',
    columns:    '.akva-cols',
    column:     '.akva-col',
    baseline:   '.akva-baseline',
    line:       '.akva-baseline-unit'
  };

  var common = {

    getPageHeight: function () {
      var pageHeight = $('html')[0].scrollHeight,
          windowHeight = $(window).height();
      return (pageHeight >= windowHeight) ? pageHeight : windowHeight;
    },

    // Throttle copyright (c) 2012, Nicholas C. Zakas
    throttle: function (method, scope) {
      clearTimeout(method._tId);
      method._tId = setTimeout(function () {
        method.call(scope);
      }, 700);
    },

    log: function () {
      if (debug.code) {
        if (window.console && window.console.log && window.console.log.apply) {
          window.console.log.apply(console, ['akva: ', arguments]);
        }
      }
    }

  };

  var Grid = function Grid(o) {
    this.gridName = o.gridName;
    this.columnCount = o.columnCount;
    this.breakpoints = (o.breakpoints) ? {from: (o.breakpoints.from) ? o.breakpoints.from.size + o.breakpoints.from.unit: null, to: (o.breakpoints.to) ? o.breakpoints.to.size + o.breakpoints.to.unit: null} : null;
    this.lineHeight = (o.lineHeight) ? ((o.lineHeight.size) ? o.lineHeight.size : null) + o.lineHeight.unit : null;
    this.gutterWidth = (o.gutterWidth) ? ((o.gutterWidth.size) ? o.gutterWidth.size : 0) + o.gutterWidth.unit : 0;
    this.outerGutterWidth = (o.outerGutterWidth) ? ((o.outerGutterWidth.size) ? o.outerGutterWidth.size : 0) + o.outerGutterWidth.unit : 0;
    this.width = (o.width) ? ((o.width.size) ? o.width.size : 'auto') + o.width.unit : null;
    this.borderTheme = (o.borderTheme) ? {color: o.borderTheme.color, style: o.borderTheme.style} : null;
    this.maxWidth = (o.maxWidth) ? ((o.maxWidth.size) ? o.maxWidth.size : 'auto') + o.maxWidth.unit : 'auto';
    this.opacity = (o.opacity) ? o.opacity : 1;
    this.zindex = (o.zindex) ? o.zindex : 1;

    // Handle visibility of grids with matchMedia
    var isVisible = true;
    var query;

    if (this.breakpoints) {

      query = {
        from: (this.breakpoints.from) ? '(min-width:' + this.breakpoints.from + ')' : '',
        and: (this.breakpoints.from && this.breakpoints.to) ? ' and ' : '',
        to: (this.breakpoints.to) ? '(max-width:' + this.breakpoints.to + ')' : '',
        id: o.gridName
      };

      var setVisibility = function (query) {
        isVisible = (query.matches) ?  true : false;
      };

      var handleWindowWidthChange = function (query, id) {
        if (query.matches) {
          $(els.wrapper + '-' + id).show();
        } else {
          $(els.wrapper + '-' + id).hide();
        }
      };

      (function addQueries() {
        var id  = query.id;
        var q   = query.from + query.and + query.to;
        var mq  = window.matchMedia(q);
        
        mq.addListener(function () {
          handleWindowWidthChange(mq, id);
        });

        setVisibility(mq);
        
      }());

      // On load visibility state
      this.isVisible = isVisible;
    }
    
  };

  Grid.prototype = {

    init: function () {

      common.log('Prototype init: ' + this.gridName + ' grid', this);

      var that = this;
      this.build();
      this.timer = null;
      this.updateGridOnWindowWidthChange();

      window.onresize = function () {
        common.throttle(that.updateGridOnWindowWidthChange, that);
      };

    },

    updateGridOnWindowWidthChange: function () {

      var that = this;
      var grids = $(els.wrapper);

      grids.each(function () {
        var thisGrid = $(this);
        if (thisGrid.is(':visible')) {
          thisGrid.css('height', common.getPageHeight());
          that.createBaseline(common.getPageHeight(), thisGrid);
        }
      });

    },

    build: function () {
      var wrapper   = this.createWrapper();
      var columns   = this.createColumns();
      var baseline  = this.createBaseline(common.getPageHeight());

      wrapper.find(els.inner).append(columns).append(baseline);

      $('body').append(wrapper);
    },

    createWrapper: function () {
      var wrapper = $('<div class="' + els.wrapper.slice(1) + '" />').css({
        maxWidth: this.maxWidth,
        width: this.width,
        opacity: this.opacity,
        zIndex: this.zindex
      }).addClass('akva-grid-' + this.gridName);
      
      var inner = $('<div class="' + els.inner.slice(1) + '" />');

      if (this.outerGutterWidth) {
        inner.css({
          'margin-left': this.outerGutterWidth,
          'margin-right': this.outerGutterWidth
        });
      }

      if (!this.isVisible) {
        wrapper.hide();
      }

      wrapper.append(inner);

      return wrapper;
      
    },

    createColumns: function () {
      common.log('creating ' + this.columnCount + ' columns for ' + this.gridName);
      var columns = $('<div class="' + els.columns.slice(1) + '" />');
      var column = $('<div class="' + els.column.slice(1) + '" />');
      var columnClone;
      var i = 0;

      // Border theme
      if (this.borderTheme) {
        column.css({
          borderColor: this.borderTheme.color,
          borderStyle: this.borderTheme.style
        });
      }

      // Gutters
      column.css({
        margin: '0 ' + this.gutterWidth
      });

      for (; i < this.columnCount; i++) {
        columnClone = column.clone();
        columns.append(columnClone);
      }

      return columns;

    },

    createBaseline: function (pageHeight, target) {

      if (!this.lineHeight) {
        return false;
      }

      var wrapper = (target !== undefined) ? target.find(els.baseline) : $('<div class="' + els.baseline.slice(1) + '" />');
      var line = $('<div class="' + els.line.slice(1) + '" />');
      var htmlLine;
      var markup = "";
      var lineCount = 0;

      if (this.lineHeight) {
        line.css({
          height: this.lineHeight
        });
      }

      lineCount = Math.ceil((pageHeight / line.height()) + 10);
      htmlLine = $('<div>').append(line.clone().remove()).html();

      // Max line elements
      if (lineCount > 1000) {
        lineCount = 1000;
      }

      // Trash the old lines
      wrapper.empty();

      // Create new lines
      while (lineCount--) {
        markup += htmlLine;
      }

      wrapper.html(markup);

      return wrapper;

    }

  };

  var akva = {

    instances: [],

    init: function () {

      this.addGrids(grids);
      this.style();
      this.initGrids();

    },

    addGrids: function (grids) {
      var that = this;

      $.each(grids, function (i) {
        var o = new Grid(grids[i]);
        that.instances.push(o);
      });
    },

    initGrids: function () {
      $.each(this.instances, function (i, o) {
        o.init();
      });
    },

    style: function () {
    
      var styles = '\
        .akva-grid,\
        .akva-grid * {\
          margin: 0;\
          padding: 0;\
          box-sizing: border-box;\
          pointer-events:none;\
        }\
        .akva-baseline {\
          position: absolute;\
          top: 0;\
          left: 0;\
          width: 100%;\
          height: 100%;\
          overflow: hidden;\
        }\
        .akva-baseline-unit {\
          height: 1.5em;\
          border-bottom: 1px dashed rgba(63, 95, 110, .5);\
        }\
        .akva-grid {\
          position: absolute;\
          left: 0;\
          right: 0;\
          top: 0;\
          bottom: 0;\
          margin: 0 auto;\
          z-index: 1;\
        }\
        .akva-inner {\
          height: 100%\
        }\
        .akva-cols {\
          height: 100%;\
          display: -webkit-flex;\
          display: flex;\
        }\
        .akva-col {\
          -webkit-flex: 1;\
          flex: 1;\
          border: 1px solid rgba(110, 180, 235,.9);\
          border-width: 0 1px;\
        }\
        ';
    
      this.addCSS(styles);

    },
      
    addCSS: function (css) {
      
      var styleElement = $('<style />', {
        type: 'text/css'
      });

      if (styleElement.styleSheet) {
        styleElement.styleSheet.cssText = css;
      } else {
        styleElement.append(document.createTextNode(css));
      }
      
      $('head').append(styleElement);

    }

  };

  akva.detect = function () {
    if (true) {
      akva.init();
    }
  }();

}(akvaGrids, jQuery));