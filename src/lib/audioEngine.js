// Procedural Ambient Engine 3 tracks dengan karakter sonik berbeda jelas.
// Senja: pad hangat + tremolo + tape hiss
// Kabut: pad rendah + shimmer oktaf tinggi + delay/echo + filter wobble LFO
// Jeda: drone bass + bell pings acak + wind noise

let _ctx = null;
let _masterGain = null;
let _activeNodes = []; // semua audio nodes yang sedang berjalan
let _activeIntervals = []; // setInterval ids
let _activeTimeouts = []; // setTimeout ids
let _started = false;
let _currentTrack = "senja";

export const TRACKS = {
 senja: {
 id: "senja",
 name: "Senja",
 desc: "Hangat, intim",
 accent: "#e36c49",
 },
 kabut: {
 id: "kabut",
 name: "Kabut",
 desc: "Lapang, samar",
 accent: "#aac8b7",
 },
 jeda: {
 id: "jeda",
 name: "Jeda",
 desc: "Drone, minimalis",
 accent: "#e1b049",
 },
};

const midiToHz = (m) => 440 * Math.pow(2, (m - 69) / 12);

function ensureCtx() {
 if (_ctx) return _ctx;
 const Ctx = window.AudioContext || window.webkitAudioContext;
 if (!Ctx) return null;
 _ctx = new Ctx();
 _masterGain = _ctx.createGain();
 _masterGain.gain.value = 0;
 _masterGain.connect(_ctx.destination);
 return _ctx;
}

// ============ shared helpers ============
function track(node) {
 _activeNodes.push(node);
 return node;
}

function clearAll() {
 _activeIntervals.forEach(clearInterval);
 _activeIntervals = [];
 _activeTimeouts.forEach(clearTimeout);
 _activeTimeouts = [];
 _activeNodes.forEach((n) => {
 try { n.stop?.(); } catch (_e) { /* ignore */ }
 try { n.disconnect?.(); } catch (_e) { /* ignore */ }
 });
 _activeNodes = [];
}

// Pink-ish noise buffer source used for tape hiss & wind
function createNoise(ctx, kind = "tape") {
 const seconds = 2;
 const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
 const data = buffer.getChannelData(0);
 // Simple pink-ish filter
 let b0 = 0, b1 = 0, b2 = 0;
 for (let i = 0; i < data.length; i++) {
 const white = Math.random() * 2 - 1;
 b0 = 0.99765 * b0 + white * 0.0990460;
 b1 = 0.96300 * b1 + white * 0.2965164;
 b2 = 0.57000 * b2 + white * 1.0526913;
 data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.18;
 }
 const noise = ctx.createBufferSource();
 noise.buffer = buffer;
 noise.loop = true;
 return noise;
}

// ============ TRACK: SENJA ============
// Warm sine+triangle pad, slow A-minor progression, gentle TREMOLO (LFO on output gain),
// + soft pink "tape hiss" in background.
const SENJA_CHORDS = [
 [57, 60, 64, 67],
 [55, 60, 62, 65],
 [52, 55, 60, 64],
 [53, 57, 60, 64],
 [50, 53, 57, 60],
 [48, 52, 55, 59],
];

function startSenja() {
 const ctx = _ctx;
 // Track filter (warm)
 const filter = track(ctx.createBiquadFilter());
 filter.type = "lowpass";
 filter.frequency.value = 1400;
 filter.Q.value = 0.5;

 // Output gain (with tremolo)
 const outGain = track(ctx.createGain());
 outGain.gain.value = 0.85;

 // Tremolo LFO slow gentle pulse
 const tremoloLFO = track(ctx.createOscillator());
 const tremoloGain = track(ctx.createGain());
 tremoloLFO.frequency.value = 0.18; // ~5.5s cycle
 tremoloGain.gain.value = 0.10; // ±10% volume swing
 tremoloLFO.connect(tremoloGain);
 tremoloGain.connect(outGain.gain);
 tremoloLFO.start();

 filter.connect(outGain);
 outGain.connect(_masterGain);

 // Tape hiss very low volume
 const hiss = track(createNoise(ctx, "tape"));
 const hissFilter = track(ctx.createBiquadFilter());
 hissFilter.type = "highpass";
 hissFilter.frequency.value = 3000;
 const hissGain = track(ctx.createGain());
 hissGain.gain.value = 0.025;
 hiss.connect(hissFilter);
 hissFilter.connect(hissGain);
 hissGain.connect(_masterGain);
 hiss.start();

 // Chord scheduler
 let idx = 0;
 const playSenjaChord = () => {
 const chord = SENJA_CHORDS[idx % SENJA_CHORDS.length];
 const now = ctx.currentTime;
 const dur = 9;
 chord.forEach((m, i) => {
 const o1 = ctx.createOscillator();
 const o2 = ctx.createOscillator();
 o1.type = "sine";
 o2.type = "triangle";
 o1.frequency.value = midiToHz(m);
 o2.frequency.value = midiToHz(m + 0.04);
 if (i === 0) o2.frequency.value = midiToHz(m - 12);
 const g = ctx.createGain();
 g.gain.value = 0;
 const peak = 0.07 - i * 0.012;
 g.gain.linearRampToValueAtTime(peak, now + 2.5);
 g.gain.linearRampToValueAtTime(peak * 0.8, now + dur - 1);
 g.gain.linearRampToValueAtTime(0, now + dur + 1.5);
 o1.connect(g); o2.connect(g);
 g.connect(filter);
 o1.start(now); o2.start(now);
 o1.stop(now + dur + 2); o2.stop(now + dur + 2);
 track(o1); track(o2); track(g);
 });
 idx++;
 };
 playSenjaChord();
 _activeIntervals.push(setInterval(playSenjaChord, 7800));

 return 0.55; // master peak
}

// ============ TRACK: KABUT ============
// Spacious low pad + shimmer pad (octave-up sine), heavy delay/echo, filter wobble LFO.
const KABUT_CHORDS = [
 [38, 50, 57, 65],
 [36, 48, 55, 63],
 [41, 53, 60, 67],
 [43, 55, 62, 69],
];

function startKabut() {
 const ctx = _ctx;

 // Filter much more muffled than Senja
 const filter = track(ctx.createBiquadFilter());
 filter.type = "lowpass";
 filter.frequency.value = 700;
 filter.Q.value = 1.0;

 // Filter WOBBLE LFO
 const filterLFO = track(ctx.createOscillator());
 const filterLFOGain = track(ctx.createGain());
 filterLFO.frequency.value = 0.06; // very slow
 filterLFOGain.gain.value = 380; // sweep ±380Hz around 700
 filterLFO.connect(filterLFOGain);
 filterLFOGain.connect(filter.frequency);
 filterLFO.start();

 // Delay (echo) chain
 const delay = track(ctx.createDelay(2.5));
 delay.delayTime.value = 0.55;
 const feedback = track(ctx.createGain());
 feedback.gain.value = 0.62;
 const delayFilter = track(ctx.createBiquadFilter());
 delayFilter.type = "lowpass";
 delayFilter.frequency.value = 1100;
 // chain: filter → delay → delayFilter → feedback → delay (loop)
 filter.connect(delay);
 delay.connect(delayFilter);
 delayFilter.connect(feedback);
 feedback.connect(delay);

 // Dry / wet to master
 const wet = track(ctx.createGain());
 wet.gain.value = 0.55;
 const dry = track(ctx.createGain());
 dry.gain.value = 0.7;
 filter.connect(dry);
 delay.connect(wet);
 dry.connect(_masterGain);
 wet.connect(_masterGain);

 // Distant wind noise
 const wind = track(createNoise(ctx, "wind"));
 const windFilter = track(ctx.createBiquadFilter());
 windFilter.type = "bandpass";
 windFilter.frequency.value = 400;
 windFilter.Q.value = 1.5;
 const windGain = track(ctx.createGain());
 windGain.gain.value = 0.06;
 // Slow wind swell LFO
 const windLFO = track(ctx.createOscillator());
 const windLFOGain = track(ctx.createGain());
 windLFO.frequency.value = 0.04;
 windLFOGain.gain.value = 0.04;
 windLFO.connect(windLFOGain);
 windLFOGain.connect(windGain.gain);
 windLFO.start();
 wind.connect(windFilter);
 windFilter.connect(windGain);
 windGain.connect(_masterGain);
 wind.start();

 // Chord scheduler bass + mid + shimmer
 let idx = 0;
 const playKabutChord = () => {
 const chord = KABUT_CHORDS[idx % KABUT_CHORDS.length];
 const now = ctx.currentTime;
 const dur = 13;
 chord.forEach((m, i) => {
 // Main voice
 const o = ctx.createOscillator();
 o.type = i === 0 ? "sine" : "sine";
 o.frequency.value = midiToHz(m);
 const g = ctx.createGain();
 g.gain.value = 0;
 const peak = 0.085 - i * 0.014;
 g.gain.linearRampToValueAtTime(peak, now + 3.5);
 g.gain.linearRampToValueAtTime(peak * 0.85, now + dur - 1.5);
 g.gain.linearRampToValueAtTime(0, now + dur + 2);
 o.connect(g);
 g.connect(filter);
 o.start(now); o.stop(now + dur + 2.5);
 track(o); track(g);

 // Shimmer octave-up layer (only on upper notes)
 if (i >= 1) {
 const oShim = ctx.createOscillator();
 oShim.type = "sine";
 oShim.frequency.value = midiToHz(m + 12); // octave up
 const gShim = ctx.createGain();
 gShim.gain.value = 0;
 const shimPeak = 0.028 - i * 0.006;
 gShim.gain.linearRampToValueAtTime(shimPeak, now + 4);
 gShim.gain.linearRampToValueAtTime(0, now + dur + 1);
 oShim.connect(gShim);
 gShim.connect(filter);
 oShim.start(now + 0.2); oShim.stop(now + dur + 1.5);
 track(oShim); track(gShim);
 }
 });
 idx++;
 };
 playKabutChord();
 _activeIntervals.push(setInterval(playKabutChord, 11500));

 return 0.5;
}

// ============ TRACK: JEDA ============
// Single sustained drone (root + 5th), random bell pings, lowpassed wind.
function startJeda() {
 const ctx = _ctx;

 // Very dark filter
 const filter = track(ctx.createBiquadFilter());
 filter.type = "lowpass";
 filter.frequency.value = 600;
 filter.Q.value = 0.8;
 filter.connect(_masterGain);

 // Drone A1 + E2 + A2 sustained, very low
 const droneNotes = [33, 40, 45]; // A1, E2, A2
 droneNotes.forEach((m, i) => {
 const o = ctx.createOscillator();
 o.type = i === 0 ? "sine" : "sine";
 o.frequency.value = midiToHz(m);
 const g = ctx.createGain();
 g.gain.value = 0;
 g.gain.linearRampToValueAtTime(0.09 - i * 0.018, ctx.currentTime + 4);
 o.connect(g);
 g.connect(filter);
 o.start();
 track(o); track(g);

 // Each drone voice has its own subtle LFO detuning for life
 const lfo = ctx.createOscillator();
 const lfoGain = ctx.createGain();
 lfo.frequency.value = 0.05 + Math.random() * 0.04;
 lfoGain.gain.value = 2 + i;
 lfo.connect(lfoGain);
 lfoGain.connect(o.detune);
 lfo.start();
 track(lfo); track(lfoGain);
 });

 // Wind noise very low, soft
 const wind = track(createNoise(ctx, "wind"));
 const windFilter = track(ctx.createBiquadFilter());
 windFilter.type = "lowpass";
 windFilter.frequency.value = 350;
 const windGain = track(ctx.createGain());
 windGain.gain.value = 0.05;
 wind.connect(windFilter);
 windFilter.connect(windGain);
 windGain.connect(_masterGain);
 wind.start();

 // Bell pings sparse, random
 // Use A pentatonic scale: A, C, D, E, G across octaves
 const BELL_NOTES = [69, 72, 74, 76, 79, 81, 84, 88, 91]; // A4, C5, D5, E5, G5, A5, C6, E6, G6
 const playBell = () => {
 const ctx = _ctx;
 if (!ctx) return;
 const note = BELL_NOTES[Math.floor(Math.random() * BELL_NOTES.length)];
 const freq = midiToHz(note);
 const now = ctx.currentTime;

 const o = ctx.createOscillator();
 o.type = "sine";
 o.frequency.value = freq;
 const g = ctx.createGain();
 g.gain.setValueAtTime(0, now);
 g.gain.linearRampToValueAtTime(0.085, now + 0.02);
 g.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

 // Slight overtone (5th harmonic) for bell-like timbre
 const o2 = ctx.createOscillator();
 o2.type = "sine";
 o2.frequency.value = freq * 2.76; // bell partial
 const g2 = ctx.createGain();
 g2.gain.setValueAtTime(0, now);
 g2.gain.linearRampToValueAtTime(0.025, now + 0.015);
 g2.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

 const bellFilter = ctx.createBiquadFilter();
 bellFilter.type = "lowpass";
 bellFilter.frequency.value = 4000;

 o.connect(g);
 o2.connect(g2);
 g.connect(bellFilter);
 g2.connect(bellFilter);
 bellFilter.connect(_masterGain);

 o.start(now); o.stop(now + 5);
 o2.start(now); o2.stop(now + 2.5);
 track(o); track(o2); track(g); track(g2); track(bellFilter);
 };

 // Schedule first bell after small initial delay, then keep scheduling with random gap
 const scheduleNextBell = () => {
 const gap = 2800 + Math.random() * 4500; // 2.8s 7.3s between bells
 const id = setTimeout(() => {
 playBell();
 scheduleNextBell();
 }, gap);
 _activeTimeouts.push(id);
 };
 scheduleNextBell();

 return 0.55;
}

// ============ PUBLIC API ============
function startTrack(id) {
 clearAll();
 const ctx = _ctx;
 if (!ctx) return false;
 if (ctx.state === "suspended") ctx.resume();
 let peak = 0.55;
 if (id === "senja") peak = startSenja();
 else if (id === "kabut") peak = startKabut();
 else if (id === "jeda") peak = startJeda();
 else { peak = startSenja(); id = "senja"; }
 _currentTrack = id;
 // Fade master in
 _masterGain.gain.cancelScheduledValues(ctx.currentTime);
 _masterGain.gain.linearRampToValueAtTime(peak, ctx.currentTime + 1.6);
 return true;
}

export function startAudio(trackId) {
 const ctx = ensureCtx();
 if (!ctx) return false;
 const id = trackId || _currentTrack;
 startTrack(id);
 _started = true;
 return true;
}

export function switchTrack(trackId) {
 if (!_ctx) return startAudio(trackId);
 if (!TRACKS[trackId]) return;
 // Quick crossfade: dip master to ~0, swap track, fade back
 const t = _ctx.currentTime;
 _masterGain.gain.cancelScheduledValues(t);
 _masterGain.gain.setValueAtTime(_masterGain.gain.value, t);
 _masterGain.gain.linearRampToValueAtTime(0.02, t + 0.45);
 const id = setTimeout(() => {
 startTrack(trackId);
 }, 480);
 _activeTimeouts.push(id);
}

export function stopAudio() {
 if (!_ctx || !_masterGain) return;
 const t = _ctx.currentTime;
 _masterGain.gain.cancelScheduledValues(t);
 _masterGain.gain.setValueAtTime(_masterGain.gain.value, t);
 _masterGain.gain.linearRampToValueAtTime(0, t + 0.6);
 setTimeout(clearAll, 700);
 _started = false;
}

export function getCurrentTrack() {
 return _currentTrack;
}

export function isAudioSupported() {
 return !!(window.AudioContext || window.webkitAudioContext);
}
