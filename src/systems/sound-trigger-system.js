import { THREE } from "aframe";
import { waitForDOMContentLoaded } from "../utils/async-utils";
import { SOUND_TEST } from "./sound-effects-system"

export class SoundTriggerSystem {
  constructor(characterController, sfxSystem) {
    waitForDOMContentLoaded().then(() => {
      this.avatar = characterController.avatarRig;
    });
    this.sfxSystem = sfxSystem;
    this.triggers = this.populateTriggers();
  }

  tick() {
    if (typeof this.avatar === 'undefined') {
      console.log("SOUND TRIGGER SYSTEM: AvatarRig not yet defined.");
      return;
    }

    if (typeof this.sfxSystem === 'undefined') {
      console.log("SOUND TRIGGER SYSTEM: SOUND EFFECTS SYSTEM undefined.");
      return;
    }

    for (const trigger of this.triggers) {
      if (trigger.isOneshot && trigger.hasFired)
        continue;
      
      const distance = this.avatar.object3D.position.distanceTo(trigger.position);
      const isInside = distance < trigger.threshold;
      const entered = isInside && !trigger.hasFired;
      const exited = !isInside && trigger.hasFired;

      if (entered) {
        this.sfxSystem.playSoundOneShot(trigger.sound);
        trigger.hasFired = true;
      }
      
      // Since there's already an isOneshot check at the top, it can be skipped here.
      if (exited)
        trigger.hasFired = false;
    }
  }

  populateTriggers() {
    return [
      new Trigger(
        new THREE.Vector3(-0.11575639550739468, 0.5759219704997984, 1.319775810614856), 1, SOUND_TEST, false)
    ];
  }
}

class Trigger {
  constructor(position, threshold, sound, isOneshot) {
    this.position = position;
    this.threshold = threshold;
    this.sound = sound;
    this.isOneshot = isOneshot;
    this.hasFired = false;
  }
}