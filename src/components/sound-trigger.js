import { waitForDOMContentLoaded } from "../utils/async-utils";
import { SOUND_DUA_1, SOUND_DUA_2 } from "../systems/sound-effects-system";

const SOUNDS = {
  "DUA_1": SOUND_DUA_1,
  "DUA_2": SOUND_DUA_2
};

AFRAME.registerComponent('sound-trigger', {
  schema: {
    sound: {type: 'string', default: ''},
    radius: {type: 'number', default: '1.0'},
    hasFired: {type: 'boolean', default: 'false'},
    isOneshot: {type: 'boolean', default: 'true'},
    isPositional: {type: 'boolean', default: 'false'},
    isNetworked : {type: 'boolean', default: 'false'},
    isInterruptible: {type: 'boolean', default: 'false'}
  },

  init() {
    waitForDOMContentLoaded().then(() => {
      this.avatar3D = document.querySelector("#avatar-rig").object3D;
    });
    this.position = this.el.object3D.getWorldPosition();
    this.sfxSystem = this.el.sceneEl.systems['hubs-systems'].soundEffectsSystem;
  },

  tick() {
    const trigger = this.data;
    
    if (trigger.isOneshot && trigger.hasFired)
      return;
    
    const distance = this.position.distanceTo(this.avatar3D.getWorldPosition());
    const isInside = distance < trigger.radius;
    const entered = isInside && !trigger.hasFired;
    const exited = !isInside && trigger.hasFired;

    if (entered) {
      const sound = SOUNDS[trigger.sound];
      if (trigger.isPositional) {
        const isLooped = false;
        this.sfxSystem.playPositionalSoundAt(sound, this.position, isLooped, trigger.isNetworked, trigger.isInterruptible);
      } else
        this.sfxSystem.playSoundOneShot(sound, trigger.isNetworked);

      this.el.setAttribute("sound-trigger", "hasFired", "true");
    }
    
    // Since there's already an isOneshot check at the top, it can be skipped here.
    if (exited)
      this.el.setAttribute("sound-trigger", "hasFired", "false");
  }
});