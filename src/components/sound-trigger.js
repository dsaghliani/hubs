AFRAME.registerComponent('sound-trigger', {
  schema: {
    sound: {type: 'string', default: ''},
    threshold: {type: 'number', default: '1.0'},
    isOneshot: {type: 'boolean', default: 'true'}
  },

  init() {
    this.triggerSystem = this.el.sceneEl.systems['hubs-systems'].soundTriggerSystem;
    this.triggerSystem.registerTrigger(this.el);
  },

  remove() {
    this.triggerSystem.unregisterTrigger(this.el);
  }
});