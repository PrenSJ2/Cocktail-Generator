"use strict";

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const shoppingList = document.getElementById('shopping-list');
const generateButton = document.getElementById('generate-button');

const constraints = {
    audio: false,
    video: {
        facingMode: 'environment'
    }
};

let ingredients = [];

const getIngredients = async () => {
    const canvasData = canvas.toDataURL();
    const response = await fetch('/api/ingredients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            image: canvasData
        })
    });
    const data = await response.json();
    ingredients = data.ingredients.filter(ingredient => {
        return ingredient.category === 'food' || ingredient.category === 'alcohol';
    });
    updateShoppingList();
};

const updateShoppingList = () => {
    shoppingList.innerHTML = '';
    ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.innerText = ingredient.name;
        shoppingList.appendChild(li);
    });
};

const generateCocktail = async () => {
    const prompt = `Cocktail recipe using ${ingredients.map(ingredient => ingredient.name).join(', ')}`;
    const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: prompt
        })
    });
    const data = await response.json();
    alert(data.text);
};

navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => {
        console.error(error);
    });

video.addEventListener('play', () => {
    const context = canvas.getContext('2d');
    setInterval(() => {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        getIngredients();
    }, 1000);
});

generateButton.addEventListener('click', () => {
    generateCocktail();
});