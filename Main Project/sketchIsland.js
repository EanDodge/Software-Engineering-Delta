
//Define size of map
const mapXSize = 500;
const mapYSize = 500;

//create pirate player
let player = new Pirate(355, 383);

// grab references to overlay elements
const fireOverlay = document.getElementById('fireOverlay');
const barracksOverlay = document.getElementById('barracksOverlay');
const pierOverlay = document.getElementById('pierOverlay');
const closeButtons = document.querySelectorAll('.closeOverlayBtn');

// Grab references to the buttons that actually trigger the overlays
const showFireOverlayBtn = document.getElementById('showCampfireOverlayButton');
const showBarracksOverlayBtn = document.getElementById('showBarracksOverlayButton');
const showPierOverlayBtn = document.getElementById('showPierOverlayButton');

function preload() {
    islandImg = loadImage('assets/upgradeislandAlt.png');
    player.img = loadImage('assets/pirate.gif');
    seaImg = loadImage('assets/sea.png');
}

//called once program starts
function setup() {
    const canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');  // So the canvas is placed behind the buttons
    cam = createCamera(mapXSize / 2, mapYSize / 2, 700);
    cam.setPosition(250, 250, 700); //sets the camera to look at the center of the map

    // Add event listeners for overlay buttons
    showFireOverlayBtn.addEventListener('click', () => showOverlay(fireOverlay));
    showBarracksOverlayBtn.addEventListener('click', () => showOverlay(barracksOverlay));
    showPierOverlayBtn.addEventListener('click', () => showOverlay(pierOverlay));

    // Add event listeners for close buttons inside overlays
    closeButtons.forEach(button => {
        button.addEventListener('click', closeOverlay);
    });
}

// Show Overlay Function
function showOverlay(overlay) {
    overlay.style.display = 'flex';  // Display the overlay (use 'flex' to center content)
}

// Close Overlay Function
function closeOverlay(event) {
    const overlay = event.target.closest('.overlay'); // Find the closest overlay element
    if (overlay) {
        overlay.style.display = 'none';  // Hide the specific overlay that triggered the close
    }
}

function draw() {
    imageMode(CENTER);
    image(seaImg, 250, 250);
    image(islandImg, 230, 250); //draws island image

    player.draw();
    player.move();
    cam.setPosition(player.x, player.y, 700);
}

function mousePressed() {
    console.log("mouse: " + (mouseX - 518) + ", " + (mouseY - 182));
}
