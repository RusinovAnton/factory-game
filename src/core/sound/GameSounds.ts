import { Howl } from 'howler';

const GAME_SFX_VOLUME = 0.5;

// Sound Effect by <a href="https://pixabay.com/users/beetpro-16097074/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=11509">beetpro</a> from <a href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=11509">Pixabay</a>
const waterDrops = new Howl({
  src: ['assets/sounds/water-drop-pop-sound-effect-28-11509.mp3'],
  volume: GAME_SFX_VOLUME,
  sprite: {
    pop: [0, 800],
  },
});

const vibro = new Howl({
  src: [
    'assets/sounds/461808__15gpanskazaceksamuel__2_vibrating-mobile-phone.wav',
  ],
  volume: GAME_SFX_VOLUME,
  sprite: {
    bzz: [3600, 160],
  },
});

class GameSounds {
  constructor() {
    console.log('Initializing game sounds )))');
  }

  haptic() {
    vibro.fade(GAME_SFX_VOLUME, 0, 160, vibro.play('bzz'));
  }

  pop() {
    waterDrops.fade(GAME_SFX_VOLUME, 0, 160, waterDrops.play('pop'));
  }
}

export const gameSounds = new GameSounds();
