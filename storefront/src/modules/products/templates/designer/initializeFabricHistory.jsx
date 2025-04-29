const initializeFabricHistory = (minUndoActions = 3) => {
    // Initialize history properties first
    fabric.Canvas.prototype._historyInit = function () {
      this.historyUndo = [];
      this.historyRedo = [];
      this.extraProps = ['selectable', 'editable',  'excludeSave', 'customType', '_userSetOpacity','_isValid'];
      this.historyProcessing = false;
      this.minUndoActions = minUndoActions; // Store minimum actions required
      this.historyNextState = this._historyNext();
  
      this.on(this._historyEvents());
    };
  
    // Modified canUndo to check minimum actions
    fabric.Canvas.prototype.canUndo = function () {
      return Array.isArray(this.historyUndo) && 
             this.historyUndo.length > this.minUndoActions;
    };
  
    fabric.Canvas.prototype.canRedo = function () {
      return Array.isArray(this.historyRedo) && this.historyRedo.length > 0;
    };
  
    fabric.Canvas.prototype._historySaveAction = function (e) {
      if (!Array.isArray(this.historyUndo) || !Array.isArray(this.historyRedo)) {
        this._historyInit();
      }
      
      if (this.historyProcessing) return;
      
      if (!e || (e.target && !e.target.excludeFromExport)) {
        const json = this.historyNextState;
        const currentState = this._historyNext();
        
        if (currentState !== json) {
          this.historyUndo.push(json);
          this.historyNextState = currentState;
          this.historyRedo = [];
          this.fire('history:append', { json: json });
        }
      }
    };
  
    fabric.Canvas.prototype.undo = function (callback) {
      if (!Array.isArray(this.historyUndo) || 
          this.historyUndo.length <= this.minUndoActions) return;
      
      this.historyProcessing = true;
      const history = this.historyUndo.pop();
      
      if (history) {
        if (!Array.isArray(this.historyRedo)) {
          this.historyRedo = [];
        }
        const currentState = this._historyNext();
        this.historyRedo.push(currentState);
        this._loadHistory(history, 'history:undo', callback);
      } else {
        this.historyProcessing = false;
      }
    };
  
    // Rest of your existing methods...
    fabric.Canvas.prototype.initialize = (function (originalFn) {
      return function (...args) {
        originalFn.call(this, ...args);
        this._historyInit();
        return this;
      };
    })(fabric.Canvas.prototype.initialize);
  
    fabric.Canvas.prototype._historyNext = function () {
      return JSON.stringify(this.toDatalessJSON(this.extraProps));
    };
  
    fabric.Canvas.prototype._historyEvents = function () {
      return {
        'object:added': this._historySaveAction.bind(this),
        'object:removed': this._historySaveAction.bind(this),
        'object:modified': this._historySaveAction.bind(this),
        'object:skewing': this._historySaveAction.bind(this)
      };
    };
  
    fabric.Canvas.prototype.redo = function (callback) {
      if (!Array.isArray(this.historyRedo)) return;
      
      this.historyProcessing = true;
      const history = this.historyRedo.pop();
      
      if (history) {
        if (!Array.isArray(this.historyUndo)) {
          this.historyUndo = [];
        }
        const currentState = this._historyNext();
        this.historyUndo.push(currentState);
        this._loadHistory(history, 'history:redo', callback);
      } else {
        this.historyProcessing = false;
      }
    };
  
    fabric.Canvas.prototype._loadHistory = function (history, event, callback) {
      this.loadFromJSON(history, () => {
        this.renderAll();
        this.historyNextState = this._historyNext();
        this.historyProcessing = false;
        this.fire(event);
        
        if (callback && typeof callback === 'function') callback();
      });
    };
  
    // Added method to get current action count
    fabric.Canvas.prototype.getActionCount = function() {
      return Array.isArray(this.historyUndo) ? this.historyUndo.length : 0;
    };
  
    // Added method to get remaining actions needed before undo is available
    fabric.Canvas.prototype.getRemainingActionsForUndo = function() {
      const current = this.getActionCount();
      return Math.max(0, this.minUndoActions - current + 1);
    };
  };
  
  export default initializeFabricHistory;