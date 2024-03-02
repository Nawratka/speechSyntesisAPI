'use-strict';

const textArea = document.querySelector('.text-input');
const speedInput = document.querySelector('.speed-input');
const playBtn = document.querySelector('.play');
const pauseBtn = document.querySelector('.pause');
const stopBtn = document.querySelector('.stop');

let utterance;

const state = {
  rate: 1,
  welcomeText:
    'Enjoy using speechSyntesis application. Type your text to speech...',
  onlyPaused: false,
};

const startSettings = function () {
  speedInput.value = +state.rate;
  textArea.value = state.welcomeText;
};

const startSpeak = function (text, speed) {
  if (text === '' || speed === '') return;
  speed = +speed;
  if (typeof speed !== 'number') return;
  if (speechSynthesis.speaking && state.onlyPaused === true) {
    pauseBtn.classList.remove('active-button');
    state.onlyPaused = false;
    return speechSynthesis.resume();
  }

  playBtn.classList.add('active-button');

  utterance = new SpeechSynthesisUtterance(text);

  utterance.rate = speed;
  speechSynthesis.speak(utterance);
  textArea.disabled = true;
  utterance.onend = () => {
    textArea.disabled = false;
    playBtn.classList.remove('active-button');
  };
};

playBtn.addEventListener('click', () => {
  startSpeak(textArea.value, speedInput.value);
});

pauseBtn.addEventListener('click', () => {
  if (!speechSynthesis.speaking) return;
  speechSynthesis.pause();
  state.onlyPaused = true;
  pauseBtn.classList.add('active-button');
});

stopBtn.addEventListener('click', () => {
  if (!speechSynthesis.speaking) return;
  speechSynthesis.cancel();
  pauseBtn.classList.remove('active-button');
  startBtn.classList.remove('active-button');
});

speedInput.addEventListener('change', () => {
  let remainingText;
  state.rate = +speedInput.value;

  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
    utterance.onend = function (e) {
      remainingText = utterance.text.slice(e.charIndex);
      startSpeak(remainingText, state.rate);
    };
  }
});

startSettings();
