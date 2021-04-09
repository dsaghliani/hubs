import { waitForDOMContentLoaded } from "../utils/async-utils";
import { SOUND_DUA_1, SOUND_DUA_2 } from "./sound-effects-system";

const SOUNDS = {
  "DUA_1": SOUND_DUA_1,
  "DUA_2": SOUND_DUA_2
};

export class SoundTriggerSystem {
  constructor(characterController, sfxSystem) {
    waitForDOMContentLoaded().then(() => {
      this.avatar = characterController.avatarRig;
    });
    this.sfxSystem = sfxSystem;
    this.triggerEntities = [];
  }

  tick() {
    if (typeof this.avatar === 'undefined' || typeof this.sfxSystem === 'undefined')
      return;
      
    for (const entity of this.triggerEntities) {
      const trigger = entity.components['sound-trigger'].data;
      const triggerPosition = entity.object3D.position;
      
      if (trigger.isOneshot && trigger.hasFired)
        continue;
      
      const distance = this.avatar.object3D.position.distanceTo(triggerPosition);
      const isInside = distance < trigger.threshold;
      const entered = isInside && !trigger.hasFired;
      const exited = !isInside && trigger.hasFired;

      if (entered) {
        const sound = SOUNDS[trigger.sound];

        if (trigger.isPositional)
          this.sfxSystem.playPositionalSoundAt(sound, triggerPosition, false, true);
        else
          this.sfxSystem.playSoundOneShot(sound, true);
  
        trigger.hasFired = true;
      }
      
      // Since there's already an isOneshot check at the top, it can be skipped here.
      if (exited)
        trigger.hasFired = false;
    }
  }

  registerTrigger(entity) {
    this.triggerEntities.push(entity);
  }

  unregisterTrigger(entity) {
    const areSame = (element) => element == entity; 
    let index = this.triggerEntities.findIndex(areSame);
    this.triggerEntities.splice(index, 1);
  }
}