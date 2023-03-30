import { Howl } from 'howler';

const vibro = new Howl({
  src: [
    'assets/sounds/461808__15gpanskazaceksamuel__2_vibrating-mobile-phone.wav',
  ],
  sprite: {
    bzz: [3600, 160],
  },
});

class GameSounds {
  constructor() {
    console.log('Initializing game sounds )))');
  }

  haptic() {
    vibro.fade(1, 0, 160, vibro.play('bzz'));
  }
}

export const gameSounds = new GameSounds();
