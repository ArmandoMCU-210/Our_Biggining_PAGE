// --- CONFIGURACIÓN DE FECHA ---
const targetDate = new Date(2026, 0, 21, 10, 0, 0).getTime();

// --- LÓGICA DE MÚSICA INSTANTÁNEA ---
const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("musicBtn");

// 1. Intentar reproducir automáticamente al cargar
window.addEventListener('load', () => {
    music.volume = 0.5; // Volumen suave
    const playPromise = music.play();

    if (playPromise !== undefined) {
        playPromise.then(_ => {
            // Si funcionó el autoplay (pocas veces pasa en móviles)
            musicBtn.classList.remove('hidden');
            console.log("Autoplay exitoso");
        })
        .catch(error => {
            // Si el navegador bloqueó el sonido (lo más probable)
            console.log("Autoplay bloqueado. Esperando interacción.");
            // Agregamos un "escucha" a TODA la página
            document.body.addEventListener('click', startMusicOnFirstTouch, { once: true });
            document.body.addEventListener('touchstart', startMusicOnFirstTouch, { once: true });
        });
    }
});

// Función auxiliar para activar sonido con el primer toque
function startMusicOnFirstTouch() {
    music.play();
    musicBtn.classList.remove('hidden');
}

// --- FUNCIÓN PARA NAVEGAR ENTRE PANTALLAS ---
function nextStep(currentId, nextId) {
    const currentElement = document.getElementById(currentId);
    const nextElement = document.getElementById(nextId);

    // Desvanecer pantalla actual
    currentElement.style.opacity = '0';
    currentElement.style.transition = 'opacity 0.5s ease';

    // Esperar a que termine la transición
    setTimeout(() => {
        currentElement.classList.add('hidden');
        nextElement.classList.remove('hidden');
        nextElement.classList.add('fade-in');
    }, 500);
}

// --- LÓGICA DEL CONTADOR ---
const timerInterval = setInterval(function() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if(document.getElementById("days")) {
        document.getElementById("days").innerText = days < 10 ? "0" + days : days;
        document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
        document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;
    }

    if (distance < 0) {
        clearInterval(timerInterval);
        unlockExperience();
    }
}, 1000);

function unlockExperience() {
    const phase1 = document.getElementById("intrigue-phase");
    phase1.style.opacity = "0";
    
    setTimeout(() => {
        phase1.style.display = "none";
        const phase2 = document.getElementById("reveal-phase");
        phase2.style.display = "block";
        setTimeout(() => {
            phase2.style.opacity = "1";
        }, 50);
    }, 1000); 
}

// --- CONTROL MANUAL DE MÚSICA ---
musicBtn.addEventListener('click', toggleMusic);

function toggleMusic() {
    if (music.paused) {
        music.play();
    } else {
        music.pause();
    }
}

// --- FUNCIÓN PARA NAVEGAR ENTRE PANTALLAS (CON CONTROL DE MÚSICA) ---
function nextStep(currentId, nextId) {
    const currentElement = document.getElementById(currentId);
    const nextElement = document.getElementById(nextId);
    const music = document.getElementById("bg-music"); // Referencia al audio de fondo

    // 1. SI ENTRAMOS A SPOTIFY: Pausamos la música de fondo
    if (nextId === 'step-spotify') {
        music.pause();
        console.log("Música pausada para escuchar Spotify");
    }

    // 2. SI SALIMOS DE SPOTIFY: Volvemos a activar la música de fondo
    // (Esto ocurre cuando da clic en "Continuar" hacia el contador)
    if (currentId === 'step-spotify' && nextId === 'main-content') {
        music.play();
        console.log("Música reanudada para el final");
    }

    // --- LÓGICA VISUAL (DESVANECIMIENTO) ---
    // Desvanecer pantalla actual
    currentElement.style.opacity = '0';
    currentElement.style.transition = 'opacity 0.5s ease';

    // Esperar a que termine la transición para ocultar uno y mostrar el otro
    setTimeout(() => {
        currentElement.classList.add('hidden');
        nextElement.classList.remove('hidden');
        nextElement.classList.add('fade-in');
    }, 500);
}

// --- FUNCIÓN PARA NAVEGAR ENTRE PANTALLAS (CON CONTROL DE MÚSICA) ---
function nextStep(currentId, nextId) {
    const currentElement = document.getElementById(currentId);
    const nextElement = document.getElementById(nextId);
    const music = document.getElementById("bg-music"); 

    // 1. SI ENTRAMOS A SPOTIFY: Pausamos la música de fondo
    if (nextId === 'step-spotify') {
        music.pause();
        console.log("Música pausada para escuchar Spotify");
    }

    // 2. MODIFICADO: SI SALIMOS DE SPOTIFY HACIA LAS PELÍCULAS
    // Volvemos a activar la música de fondo
    if (currentId === 'step-spotify' && nextId === 'step-movies') {
        music.play();
        console.log("Música reanudada para la sección de películas");
    }

    // --- LÓGICA VISUAL (DESVANECIMIENTO) ---
    currentElement.style.opacity = '0';
    currentElement.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        currentElement.classList.add('hidden');
        nextElement.classList.remove('hidden');
        nextElement.classList.add('fade-in');
    }, 500);
}

function requestSecretAccess() {
    // Pide la contraseña
    const password = prompt("🔒 Ingresa la contraseña de acceso directo:");

    const masterPassword = "ARMANDO210"; 

    if (password && password.toUpperCase() === masterPassword) {
        // Si es correcta, redirige
        window.location.href = "fotos.html";
    } else if (password !== null) { // Si no le dio a cancelar...
        alert("Contraseña incorrecta. Acceso denegado.");
    }
}