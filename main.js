// main.js
// Manejo de voces y síntesis de voz
const tiempoTotalSpan = document.getElementById("tiempo-total");
const tiempoActualSpan = document.getElementById("tiempo-actual");
let timerInterval = null;
let tiempoInicio = null;

function calcularTiempoTotal(texto, velocidad) {
  // Promedio de 180 palabras por minuto a velocidad 1
  const palabras = texto.trim().split(/\s+/).length;
  const minutos = palabras / (180 * velocidad);
  const segundos = minutos * 60;
  return segundos;
}

function formatoTiempo(segundos) {
  const min = Math.floor(segundos / 60);
  const sec = Math.floor(segundos % 60);
  return `${min.toString().padStart(2, "0")}:${sec
    .toString()
    .padStart(2, "0")}`;
}
let voices = [];
const textoInput = document.getElementById("texto");
const vozSelect = document.getElementById("voz");
const tonoInput = document.getElementById("tono");
const tonoValor = document.getElementById("tono-valor");
const velocidadInput = document.getElementById("velocidad");
const velocidadValor = document.getElementById("velocidad-valor");
const emocionSelect = document.getElementById("emocion");
const escucharBtn = document.getElementById("escuchar");
escucharBtn.textContent = "Escuchar";
escucharBtn.dataset.estado = "detenido";
const descargarBtn = document.getElementById("descargar");
const detenerBtn = document.getElementById("detener");

function cargarVoces() {
  voices = window.speechSynthesis.getVoices();
  vozSelect.innerHTML = "";
  voices.forEach((voice, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `${voice.name} (${voice.lang})`;
    vozSelect.appendChild(option);
  });
}

window.speechSynthesis.onvoiceschanged = cargarVoces;
window.addEventListener("DOMContentLoaded", cargarVoces);

tonoInput.addEventListener("input", () => {
  tonoValor.textContent = tonoInput.value;
});
velocidadInput.addEventListener("input", () => {
  velocidadValor.textContent = velocidadInput.value;
});

escucharBtn.addEventListener("click", () => {
  if (escucharBtn.dataset.estado === "reproduciendo") {
    window.speechSynthesis.cancel();
    escucharBtn.textContent = "Escuchar";
    escucharBtn.dataset.estado = "detenido";
    clearInterval(timerInterval);
    tiempoActualSpan.textContent = "Transcurrido: 00:00";
    return;
  }

  const texto = textoInput.value;
  if (!texto.trim()) return;
  const utter = new SpeechSynthesisUtterance(texto);
  const vozIndex = vozSelect.value;
  utter.voice = voices[vozIndex];
  ajustarEmocion(utter);
  utter.rate = parseFloat(velocidadInput.value);

  escucharBtn.textContent = "Detener";
  escucharBtn.dataset.estado = "reproduciendo";

  // Calcular y mostrar tiempo total estimado
  const segundosTotales = calcularTiempoTotal(texto, utter.rate);
  tiempoTotalSpan.textContent = `Tiempo total: ${formatoTiempo(
    segundosTotales
  )}`;
  tiempoActualSpan.textContent = "Transcurrido: 00:00";
  tiempoInicio = Date.now();
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const transcurrido = (Date.now() - tiempoInicio) / 1000;
    tiempoActualSpan.textContent = `Transcurrido: ${formatoTiempo(
      transcurrido
    )}`;
    if (transcurrido >= segundosTotales) {
      clearInterval(timerInterval);
    }
  }, 500);

  utter.onend = function () {
    escucharBtn.textContent = "Escuchar";
    escucharBtn.dataset.estado = "detenido";
    clearInterval(timerInterval);
    tiempoActualSpan.textContent = `Transcurrido: ${formatoTiempo(
      (Date.now() - tiempoInicio) / 1000
    )}`;
  };
  utter.onerror = function () {
    escucharBtn.textContent = "Escuchar";
    escucharBtn.dataset.estado = "detenido";
    clearInterval(timerInterval);
    tiempoActualSpan.textContent = "Transcurrido: 00:00";
  };

  window.speechSynthesis.speak(utter);
});

// Detener la reproducción de audio

// Nueva grabación usando MediaRecorder y getDisplayMedia
async function grabarYDescargar() {
  const texto = textoInput.value;
  if (!texto.trim()) return;

  // Solicitar al usuario capturar la pantalla/ventana con audio
  let stream;
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: false,
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        sampleRate: 44100,
      },
    });
  } catch (err) {
    alert(
      "Debes permitir la captura de pantalla/ventana con audio para grabar la voz."
    );
    return;
  }

  const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
  let chunks = [];

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(chunks, { type: "audio/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "voz.webm";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  };

  // Reproducir el texto y grabar
  const utter = new SpeechSynthesisUtterance(texto);
  const vozIndex = vozSelect.value;
  utter.voice = voices[vozIndex];
  // Ajustar parámetros según la emoción
  ajustarEmocion(utter);
  // Aplicar velocidad personalizada
  utter.rate = parseFloat(velocidadInput.value);

  utter.onstart = function () {
    mediaRecorder.start();
  };
  utter.onend = function () {
    setTimeout(() => mediaRecorder.stop(), 100); // Espera un poco para asegurar la grabación
    // Detener la captura de pantalla/ventana
    stream.getTracks().forEach((track) => track.stop());
  };

  window.speechSynthesis.speak(utter);
}

// Ajustar parámetros para simular emociones humanas
function ajustarEmocion(utter) {
  const emocion = emocionSelect.value;
  // El usuario aún puede ajustar el tono manualmente, pero la emoción modifica otros parámetros
  switch (emocion) {
    case "happy":
      utter.pitch = Math.max(1.3, parseFloat(tonoInput.value));
      // Si el usuario mueve el slider, se respeta su valor
      utter.rate = parseFloat(velocidadInput.value);
      utter.volume = 1;
      break;
    case "sad":
      utter.pitch = Math.min(0.8, parseFloat(tonoInput.value));
      utter.rate = parseFloat(velocidadInput.value);
      utter.volume = 0.8;
      break;
    case "angry":
      utter.pitch = Math.max(1, parseFloat(tonoInput.value));
      utter.rate = parseFloat(velocidadInput.value);
      utter.volume = 1;
      break;
    case "surprised":
      utter.pitch = Math.max(1.5, parseFloat(tonoInput.value));
      utter.rate = parseFloat(velocidadInput.value);
      utter.volume = 1;
      break;
    default: // neutral
      utter.pitch = parseFloat(tonoInput.value);
      utter.rate = parseFloat(velocidadInput.value);
      utter.volume = 1;
      break;
  }
}

descargarBtn.addEventListener("click", grabarYDescargar);
