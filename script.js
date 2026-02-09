// Configuration du CAPTCHA
const config = {
    valentineIndices: [0, 1, 2, 3], // Les 4 premières images représentent "votre valentine"
    totalImages: 9
};

// État du jeu
let selectedImages = new Set();

// Initialiser le CAPTCHA
function initCaptcha() {
    const imageGrid = document.getElementById('imageGrid');
    imageGrid.innerHTML = '';
    selectedImages.clear();

    // Créer les images (utilisez vos propres images!)
    // Les 4 premières images (image1.jpg à image4.jpg) sont les "bonnes" réponses
    const imageFiles = [
        'images/image1.jpg',
        'images/image2.jpg',
        'images/image3.jpg',
        'images/image4.jpg',
        'images/image5.jpg',
        'images/image6.jpg',
        'images/image7.jpg',
        'images/image8.jpg',
        'images/image9.jpg'
    ];

    // Créer un tableau avec les indices et mélanger
    const shuffledIndices = imageFiles.map((file, index) => ({
        file: file,
        originalIndex: index,
        isValentine: config.valentineIndices.includes(index)
    }));

    // Mélanger (algorithme Fisher-Yates)
    for (let i = shuffledIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
    }

    // Créer la grille avec les images mélangées
    for (let i = 0; i < config.totalImages; i++) {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.dataset.index = i;
        imageItem.dataset.isValentine = shuffledIndices[i].isValentine;

        const img = document.createElement('img');
        img.src = shuffledIndices[i].file;
        img.alt = `Photo ${i + 1}`;

        imageItem.appendChild(img);
        imageItem.addEventListener('click', () => toggleImage(i, imageItem));
        imageGrid.appendChild(imageItem);
    }
}

// Basculer la sélection d'une image
function toggleImage(index, element) {
    if (selectedImages.has(index)) {
        selectedImages.delete(index);
        element.classList.remove('selected');
    } else {
        selectedImages.add(index);
        element.classList.add('selected');
    }
}

// Vérifier la réponse
function verifyAnswer() {
    const imageItems = document.querySelectorAll('.image-item');
    const totalValentines = config.valentineIndices.length;

    // Compter combien d'images valentine sont correctement sélectionnées
    let correctSelections = 0;
    let wrongSelections = 0;

    imageItems.forEach((item, index) => {
        const isSelected = selectedImages.has(index);
        const isValentine = item.dataset.isValentine === 'true';

        if (isSelected && isValentine) {
            correctSelections++;
        } else if (isSelected && !isValentine) {
            wrongSelections++;
        }
    });

    // Vérifier si toutes les valentines sont sélectionnées et aucune erreur
    const isCorrect = correctSelections === totalValentines && wrongSelections === 0;

    if (isCorrect) {
        showSuccess();
    } else {
        showError();
    }
}

// Afficher le message de succès
function showSuccess() {
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.add('show');

    // Ajouter des confettis de cœurs
    createHeartConfetti();
}

// Créer des confettis de cœurs
function createHeartConfetti() {
    const hearts = ['💕', '❤️', '💖', '💗', '💝', '💘'];
    const container = document.getElementById('successMessage');

    for (let i = 0; i < 30; i++) {
        const heart = document.createElement('div');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.position = 'fixed';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = '-50px';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        heart.style.opacity = Math.random() * 0.5 + 0.5;
        heart.style.zIndex = '1001';
        heart.style.pointerEvents = 'none';
        heart.style.animation = `fall ${Math.random() * 3 + 3}s linear`;

        container.appendChild(heart);

        setTimeout(() => heart.remove(), 6000);
    }
}

// Ajouter l'animation de chute
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// Afficher une erreur
function showError() {
    const captchaCard = document.querySelector('.captcha-card');
    captchaCard.style.animation = 'shake 0.5s';

    setTimeout(() => {
        captchaCard.style.animation = '';
    }, 500);
}

// Animation de secousse
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(shakeStyle);

// Réinitialiser le CAPTCHA
function resetCaptcha() {
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.remove('show');
    initCaptcha();
}

// Rafraîchir les images
function refreshImages() {
    const imageItems = document.querySelectorAll('.image-item');
    imageItems.forEach(item => {
        item.style.animation = 'fadeOut 0.3s';
    });

    setTimeout(() => {
        initCaptcha();
        const newImageItems = document.querySelectorAll('.image-item');
        newImageItems.forEach(item => {
            item.style.animation = 'fadeIn 0.3s';
        });
    }, 300);
}

// Ajouter les animations
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
    @keyframes fadeOut {
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(fadeStyle);

// Événements
document.getElementById('verifyBtn').addEventListener('click', verifyAnswer);
document.getElementById('retryBtn').addEventListener('click', resetCaptcha);
document.getElementById('refreshBtn').addEventListener('click', refreshImages);

// Info button
document.getElementById('infoBtn').addEventListener('click', () => {
    alert('💕 Saint-Valentin CAPTCHA 💕\n\nSélectionnez toutes les images de votre valentine!\n\nLes images sont mélangées à chaque fois. 💖');
});

// Audio button (juste pour le fun)
document.getElementById('audioBtn').addEventListener('click', () => {
    alert('🎵 Audio CAPTCHA pas disponible... mais imaginez une belle chanson d\'amour! 💕');
});

// Initialiser au chargement
window.addEventListener('DOMContentLoaded', initCaptcha);
