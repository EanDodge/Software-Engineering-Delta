
//Define size of map
const mapXSize = 500;
const mapYSize = 500;

//create pirate player
let pirate = new Pirate(310, 380);

//array for island colliders
let colliders = [];

//global variable for debuging
let debugCollisionCloseWalk = true;

//global variables for overlay closing logic
let notClosed = true;
// let stillOnCollider = false; 

// grab references to overlay elements
const fireOverlay = document.getElementById('fireOverlay');
const barracksOverlay = document.getElementById('barracksOverlay');
const pierOverlay = document.getElementById('pierOverlay');
const puzzleOverlay = document.getElementById('puzzleOverlay');
const closeButtons = document.querySelectorAll('.closeOverlayBtn');

// Grab references to the buttons that actually trigger the overlays
const showFireOverlayBtn = document.getElementById('showCampfireOverlayButton');
const showBarracksOverlayBtn = document.getElementById('showBarracksOverlayButton');
const showPierOverlayBtn = document.getElementById('showPierOverlayButton');
const showPuzzleOverlayBtn = document.getElementById('showPuzzleOverlayButton');

function preload() {
    islandImg = loadImage('assets/upgradeislandAlt.png');
    pirate.img = loadImage('assets/pirate.gif');
    seaImg = loadImage('assets/sea.png');
    backgroundMusic = loadSound('music/HomeIslandVibe.wav');
}

//called once program starts
function setup() {
    const canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');  // So the canvas is placed behind the buttons
    cam = createCamera(mapXSize / 2, mapYSize / 2, 700);
    cam.setPosition(250, 250, 700); //sets the camera to look at the center of the map

    // Add event listeners for close buttons inside overlays
    closeButtons.forEach(button => {
        button.addEventListener('click', closeOverlay);
    });


    //setting up collider array of all the island places
    let fireCollider = new islandObject(230, 210, 80, 60, fireOverlay);
    colliders.push(fireCollider);
    let barracksCollider = new islandObject(50, 120, 90, 90, barracksOverlay);
    colliders.push(barracksCollider);
    let pierCollider = new islandObject(390, 330, 150, 80, pierOverlay);
    colliders.push(pierCollider);
    let puzzleCollider = new islandObject(370, 150, 70, 90, puzzleOverlay);
    colliders.push(puzzleCollider);

    loadMusic();
    
    // showOverlay(fireOverlay); //works
}

// Show Overlay Function
function showOverlay(overlay) {
    overlay.style.display = 'flex';  // Display the overlay (use 'flex' to center content)
    // console.log(pirate);
    // console.log(typeof pirate.updateCoinCount());
    pirate.updateCoinCount();
    notClosed = true;
}

//Close Overlay Function --------- Not needed without buttons
function closeOverlay(event) {
    const overlay = event.target.closest('.overlay'); // Find the closest overlay element
    if (overlay) {
        overlay.style.display = 'none';  // Hide the specific overlay that triggered the close
        notClosed = false;
    }
}

async function determineOverlay(collider) {
    while (pirate.isColliding(collider)) {
        if (notClosed) {
            // showOverlay(collider.overlay);
            return true;
        }
        else {
            // collider.overlay.style.display = 'none';
            return false;
        }
    }
}

function loadMusic() {
	userStartAudio(); //music starts playing when user interacts with browser
    backgroundMusic.setVolume(0.5);
	backgroundMusic.play();
    backgroundMusic.loop();
}

function draw() {
    imageMode(CENTER);
    image(seaImg, 250, 250);
    image(islandImg, 230, 250); //draws island image

    // //draw colliders hitbox for testing
    // colliders.forEach((collider) => {
    //     collider.draw();
    // });

    //options for the two overlay close types
    if (debugCollisionCloseWalk) {
        //tests for if the player is colliding with the object, opens overlay if true
        colliders.forEach((collider) => {
            if(pirate.isColliding(collider)) {
                showOverlay(collider.overlay);
                // console.log("colliding");
            }
            else {
                collider.overlay.style.display = 'none';
                // console.log("not colliding");
            }
        });
    }
    else {
        colliders.forEach((collider) => {

            if(determineOverlay(collider)) {
                showOverlay(collider);
            }
            else {
                collider.overlay.style.display = 'none';
            }
        });


        // colliders.forEach((collider) => {
        //     if(pirate.isColliding(collider)) {
        //         let computedStyle = window.getComputedStyle(collider.overlay);
        //         showOverlay(collider.overlay);
        //         while(pirate.isColliding(collider)) {
        //             while(computedStyle.display === 'flex') {
        //                 showOverlay(collider.overlay);
        //                 // console.log(computedStyle.display);   
        //                 computedStyle = window.getComputedStyle(collider.overlay);
        //             }
        //             // closeOverlay();
        //             console.log("piratecolliding loop"); //is stuck here
        //         }
        //     }
        // });
    }
    


    pirate.draw();
    pirate.move();
    cam.setPosition(pirate.x, pirate.y, 700);
}

function mousePressed() {
    console.log("mouse: " + (mouseX - 518) + ", " + (mouseY - 182));
}
