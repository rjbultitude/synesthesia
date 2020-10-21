import { getDefaultIntervals } from '../utils/utils';
import { ONESHOT } from '../utils/constants';

function playCurrentNote(config, freq) {
  config.osc.freq(freq);
  config.osc.start();
}

function stopCurrentNote(config) {
  config.osc.stop();
}

export function stopAndHideNote(config, updateAudioOutput) {
  config.playing = false;
  updateAudioOutput(config);
  stopCurrentNote(config);
}

export function playAndShowNote(config, index, updateAudioOutput) {
  const currFreq = config.tuningSysNotes[config.selectedTuningSys][index];
  config.playing = true;
  config.currentFreq = currFreq;
  config.selectedInterval = index;
  updateAudioOutput(config);
  playCurrentNote(config, currFreq);
  return config;
}

export function createKeyboard(config, updateAudioOutput) {
  const keyboardWrapper = document.createElement('section');
  keyboardWrapper.setAttribute('class', 'keyboard');
  keyboardWrapper.setAttribute('tabindex', '0');
  const defaultIntervals = getDefaultIntervals(config);
  defaultIntervals.forEach((num, index) => {
    const keyButton = document.createElement('button');
    keyButton.innerText = `${num}`;
    keyButton.addEventListener(
      'mousedown',
      (e) => {
        playAndShowNote(config, index, updateAudioOutput);
      },
      false
    );
    keyButton.addEventListener(
      'mouseup',
      () => {
        console.log('config', config);
        if (config.playMode === ONESHOT) {
          stopAndHideNote(config, updateAudioOutput);
        }
      },
      false
    );
    keyboardWrapper.appendChild(keyButton);
  });
  return keyboardWrapper;
}
