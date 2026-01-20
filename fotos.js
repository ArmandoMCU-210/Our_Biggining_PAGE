/* --- 1. CONFIGURACIÓN DE IMÁGENES DE REFERENCIA --- */
// Se usa para las pistas (?)
const REFERENCE_IMAGES = [
    "referencias/1.jfif",
    "referencias/2.jfif",
    "referencias/3.jpg",
    "referencias/4.jfif",
    "referencias/5.jfif",
    "referencias/6.jfif",
    "referencias/7.jfif",
    "referencias/8.jfif",
    "referencias/9.jfif",
    "referencias/10.jfif",
    "referencias/11.jfif",
    "referencias/12.jfif",
    "referencias/13.jfif",
    "referencias/14.jfif",
    "referencias/15.jfif",
    "referencias/16.jfif",
    "referencias/17.jfif",
    "referencias/18.jfif",
    "referencias/19.jfif",
    "referencias/20.jfif",
    "referencias/21.jfif",
    "referencias/22.jfif",
];

/* --- 2. CONFIGURACIÓN DE CÓDIGOS SECRETOS --- */
const CONFIG = {
    1: { code: "AMOR" }, 
    2: { code: "2024" }, 
    3: { code: "ISELA" },
    4: { code: "SIEMPRE" }
};

let showingText = true; 

// --- AL CARGAR ---
window.addEventListener('load', () => {
    let hasPhotos = false;
    for (let i = 1; i <= 4; i++) {
        const savedImage = localStorage.getItem(`photo-${i}`);
        if (savedImage) {
            restoreImage(i, savedImage);
            hasPhotos = true;
        }
    }
    if (hasPhotos) {
        document.getElementById('toggle-view-btn').classList.remove('hidden');
    }
});

// --- FUNCIONES PRINCIPALES ---

function showSingleRef(id) {
    const modal = document.getElementById('hint-modal');
    const img = document.getElementById('hint-img');
    const randomIndex = Math.floor(Math.random() * REFERENCE_IMAGES.length);
    img.src = REFERENCE_IMAGES[randomIndex];
    modal.classList.remove('hidden');
}

function restoreImage(id, base64Image) {
    const img = document.getElementById(`preview-${id}`);
    const backImg = document.getElementById(`back-img-${id}`);
    const frame = document.getElementById(`frame-${id}`);
    
    img.src = base64Image;
    img.classList.remove('hidden'); 
    if (backImg) { backImg.src = base64Image; backImg.classList.remove('hidden'); }
    
    frame.querySelector('.lock-screen').classList.add('hidden');
    frame.querySelector('.status-icon').classList.add('hidden');
    frame.classList.remove('locked-frame');
    frame.querySelector('.upload-screen').classList.remove('hidden');
    frame.querySelector('.upload-label').style.opacity = "0";
    
    const hintIcon = frame.querySelector('.hint-icon');
    if(hintIcon) hintIcon.classList.add('hidden');

    frame.classList.add('flipped');

    img.onclick = function() {
        if (!frame.classList.contains('flipped')) {
            document.getElementById(`file-${id}`).click();
        }
    };
    unlockNextLevel(id);
}

function checkCode(id) {
    const input = document.getElementById(`input-${id}`);
    const val = input.value.toUpperCase().trim(); 
    const correctCode = CONFIG[id].code;

    if (val === correctCode) {
        const frame = document.getElementById(`frame-${id}`);
        frame.querySelector('.lock-screen').classList.add('hidden');
        frame.querySelector('.status-icon').classList.add('hidden'); 
        frame.querySelector('.upload-screen').classList.remove('hidden');
        frame.classList.remove('locked-frame');
    } else {
        alert("Código incorrecto. Intenta de nuevo. ❤");
        input.value = "";
    }
}

function previewImage(id, input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            resizeImage(e.target.result, function(compressedResult) {
                const img = document.getElementById(`preview-${id}`);
                const backImg = document.getElementById(`back-img-${id}`);
                const frame = document.getElementById(`frame-${id}`);

                img.src = compressedResult;
                img.classList.remove('hidden'); 
                if (backImg) { backImg.src = compressedResult; backImg.classList.remove('hidden'); }

                document.querySelector(`#frame-${id} .upload-label`).style.opacity = "0";
                const hintIcon = document.querySelector(`#frame-${id} .hint-icon`);
                if(hintIcon) hintIcon.classList.add('hidden');
    
                try { localStorage.setItem(`photo-${id}`, compressedResult); } catch (err) {}

                document.getElementById('toggle-view-btn').classList.remove('hidden');

                setTimeout(() => { frame.classList.add('flipped'); }, 1500);

                img.onclick = function() {
                    if (!frame.classList.contains('flipped')) { document.getElementById(`file-${id}`).click(); }
                };
                unlockNextLevel(id);
            });
        }
        reader.readAsDataURL(file);
    }
}

function toggleAllCards() {
    const frames = document.querySelectorAll('.frame-wrapper:not(.locked-frame)');
    showingText = !showingText;
    frames.forEach(frame => {
        const hasPhoto = !frame.querySelector('.upload-screen').classList.contains('hidden') 
                         && frame.querySelector('.lock-screen').classList.contains('hidden');
        if (hasPhoto) {
            if (showingText) frame.classList.add('flipped');
            else frame.classList.remove('flipped');
        }
    });
}

function resizeImage(base64Str, callback) {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800; 
        const scaleSize = MAX_WIDTH / img.width;
        const finalScale = (scaleSize < 1) ? scaleSize : 1;
        canvas.width = img.width * finalScale;
        canvas.height = img.height * finalScale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        callback(canvas.toDataURL('image/jpeg', 0.7));
    }
}

function unlockNextLevel(currentId) {
    const nextId = currentId + 1;
    if (nextId <= 4) {
        const nextInput = document.getElementById(`input-${nextId}`);
        const nextBtn = document.querySelector(`#frame-${nextId} .unlock-btn`);
        const nextFrame = document.getElementById(`frame-${nextId}`);
        if (!localStorage.getItem(`photo-${nextId}`)) {
            nextInput.disabled = false;
            nextBtn.disabled = false;
            nextFrame.style.opacity = "1"; 
            nextFrame.style.filter = "none";
        } else {
            nextFrame.style.opacity = "1";
            nextFrame.style.filter = "none";
        }
    } else {
        document.getElementById("final-message").classList.remove("hidden");
        document.getElementById("final-message").classList.add("fade-in");
    }
}

function closeModals() { 
    document.getElementById('hint-modal').classList.add('hidden');
}

function resetProgress() {
    if (confirm("¿Reiniciar todo?")) {
        localStorage.clear();
        location.reload();
    }
}