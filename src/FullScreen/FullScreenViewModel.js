define([
  "esri/core/Accessor", 
  "esri/core/HandleRegistry",
  "dojo/dom-class",
  "./screenfull",
], function(Accessor, HandleRegistry, domClass, screenfull) {

  var state = {
    disabled: "disabled",
    ready: "ready"
  };
  var mode = {
    on: "on",
    off: "off"
  };

  return Accessor.createSubclass({

    declaredClass: "fesri.widgets.FullScreenViewModel",
    properties: {
      navigationMode: {},
      state: {
        dependsOn: ["view.ready"],
        readOnly: !0
      },
      view: {}
    },

    constructor: function() {

      this._handles = new HandleRegistry;
      this.toggle = this.toggle.bind(this);   
      this._fullScreenHandler = this._fullScreenHandler.bind(this);   
    },

    initialize: function() {

      if (screenfull.enabled) {
        document.addEventListener(screenfull.raw.fullscreenchange, this._fullScreenHandler);
      }      
    },

    destroy: function() {
      
      if (screenfull.enabled) {
        document.removeEventListener(screenfull.raw.fullscreenchange, this._fullScreenHandler);
      } 

      this._handles.destroy();
    },

    _fullScreenHandler: function () {

        this.mode = screenfull.isFullscreen ? mode.on : mode.off;

        if (this.mode === mode.off) {
          domClass.remove(this.view.container, 'view-fullscreen-on');
        }
        else {
          domClass.add(this.view.container, 'view-fullscreen-on');
        }
    },

    _handles: null,

    state: state.disabled,
    _stateGetter: function() {

      return this.get("view.ready") ? state.ready : state.disabled
    },
    
    mode: mode.off,
    _modeGetter: function() {

      return this._get("mode") || mode.off;
    },

    view: null,
    
    toggle: function(e) {

      e.preventDefault();

      if (this.state === state.disabled) {
        return;
      }

      this.mode = this.mode !== mode.on ? mode.on : mode.off;

      if (!screenfull.enabled) {
        return;
      }
             
      if (this.mode === mode.off) {
                
        screenfull.exit();
      }
      else {

        screenfull.request(this.view.container);
      }      
    }    
  })
});
