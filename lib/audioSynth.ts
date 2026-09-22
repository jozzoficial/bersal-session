// Gerador Web Audio sintetizado para prévias de áudio ricas e demonstrativas offline
let audioCtx: AudioContext | null = null;
const activeSourceNodes: { [key: string]: { stop: () => void; intervalId?: number } } = {};

export function playSynthesizedPreview(trackNumber: number, onEnded?: () => void) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    stopAllSynthesizedPreviews();

    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.18, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    // Frequências base elegantes para cada faixa (acorde pentatônico suave / Afro-house synth)
    const chords: { [key: number]: number[] } = {
      1: [220, 261.63, 329.63, 392.00], // Am7
      2: [174.61, 220, 261.63, 329.63], // Fmaj7
      3: [196.00, 246.94, 293.66, 392.00], // G
      4: [146.83, 220, 261.63, 349.23], // Dm7
      5: [164.81, 207.65, 246.94, 329.63], // E
      6: [220, 277.18, 329.63, 415.30], // A
    };

    const notes = chords[trackNumber] || [220, 261.63, 329.63, 392.00];
    const oscillators: OscillatorNode[] = [];

    notes.forEach((freq, i) => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();

      osc.type = i === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      // Efeito de pulso rítmico sutil (groove 120bpm)
      oscGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(masterGain);

      osc.start();
      oscillators.push(osc);
    });

    const timer = setTimeout(() => {
      stopAllSynthesizedPreviews();
      if (onEnded) onEnded();
    }, 30000); // 30s de duração máxima

    activeSourceNodes[`track-${trackNumber}`] = {
      stop: () => {
        oscillators.forEach(o => {
          try {
            o.stop();
            o.disconnect();
          } catch {}
        });
        clearTimeout(timer);
      }
    };

    return activeSourceNodes[`track-${trackNumber}`];
  } catch (err) {
    console.warn('Web Audio synthesis not supported or blocked:', err);
    return null;
  }
}

export function stopAllSynthesizedPreviews() {
  Object.keys(activeSourceNodes).forEach(key => {
    try {
      activeSourceNodes[key].stop();
    } catch {}
    delete activeSourceNodes[key];
  });
}
