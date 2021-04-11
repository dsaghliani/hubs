AFRAME.registerComponent('sound-trigger', {
  schema: {
    sound: {type: 'string', default: ''},
    radius: {type: 'number', default: '1.0'},
    isOneshot: {type: 'boolean', default: 'true'},
    isPositional: {type: 'boolean', default: 'false'},
    isNetworked : {type: 'boolean', default: 'false'},
    isInterruptible: {type: 'boolean', default: 'false'}
  },

  init() {
    this.triggerSystem = this.el.sceneEl.systems['hubs-systems'].soundTriggerSystem;
    this.triggerSystem.registerTrigger(this.el);
  },

  remove() {
    this.triggerSystem.unregisterTrigger(this.el);
  }
});