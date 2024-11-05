// document.addEventListener('DOMContentLoaded', () => {
//     const canvas = document.getElementById('gameCanvas');
//     const ctx = canvas.getContext('2d');

//     const pirateImgUrl = './assets/pirate.gif';
//     const seaImgUrl = './assets/sea.png';
//     const backgroundImgUrl = './assets/upgradeislandAlt.png';
    const pirateImgUrl = './assets/pirate.gif';
    const seaImgUrl = './assets/sea.png';
    const backgroundImgUrl = './assets/upgradeislandAlt.png';

//     const pirate = new Pirate(750, 630, pirateImgUrl);

//     const seaImage = new Image();
//     const background = new Image();
    
//     background.src = backgroundImgUrl;
//     seaImage.src = seaImgUrl;
    background.src = backgroundImgUrl;
    seaImage.src = seaImgUrl;

    //added container to keep track of key presses
    const keys = {
        ArrowUp: false,
        w: false,
        ArrowDown: false,
        s: false,
        ArrowLeft: false,
        a: false,
        ArrowRight: false,
        d: false
    };

//     function resizeCanvas(){
//         canvas.width = window.innerWidth;
//         canvas.height = window.innerHeight;
//         drawScene();
//     }

//     function drawScene(){
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         ctx.drawImage(seaImage, 0, 0, canvas.width , canvas.height);
        
//         //need to scale the island.
//         //default size is not big enough for entire browser scree
//         let scaleFactor = 1.5;
//         const newWidth = background.width * scaleFactor;
//         const newHeight = background.height * scaleFactor;

    
//         const centerX = (canvas.width - newWidth) / 2;
//         const centerY = (canvas.height - newHeight) / 2;
//         ctx.drawImage(background, centerX, centerY, newWidth, newHeight);
//         pirate.draw(ctx);
//     }

//     seaImage.onload = () => {
//         background.onload = () => {
//         resizeCanvas()
//         window.addEventListener('resize', resizeCanvas);
//         gameLoop();
//         circle(0,0, 50);
//     };
// };

    function updateMovement(){
        const stepSize = 1.5;
        if (keys.ArrowUp || keys.w) {
            pirate.move(0, -stepSize);
        }
        if (keys.ArrowDown || keys.s) {
            pirate.move(0, stepSize);
        }
        if (keys.ArrowLeft || keys.a) {
            pirate.setDirection('left');
            pirate.move(-stepSize, 0);
        }
        if (keys.ArrowRight || keys.d) {
            pirate.setDirection('right');
            pirate.move(stepSize, 0);
        }
    
    }

    function gameLoop() {
        updateMovement();
        drawScene();
        requestAnimationFrame(gameLoop);
    }

    seaImage.onload = () => {
        background.onload = () => {
        resizeCanvas()
        window.addEventListener('resize', resizeCanvas);
        gameLoop();
    };
};

//     function gameLoop() {
//         drawScene();
//         requestAnimationFrame(gameLoop);
//     }

//     //gameLoop();

// function onKeyPress(e){
//     switch(e.key){
//         case 'ArrowUp':
//         case 'w':
//             pirate.move(0, -10);
//             break;
//         case 'ArrowDown':
//         case 's':
//             pirate.move(0, 10);
//             break;
//         case 'ArrowLeft':
//         case 'a':
//             pirate.setDirection('left');
//             pirate.move(-10, 0);                       
//             break;
//         case 'ArrowRight':
//         case 'd':
//             pirate.setDirection('right');
//             pirate.move(10, 0);
//             break;
function onKeyDown(e) {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }
}

function onKeyUp(e) {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
}

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);
});


   

    //gameLoop();

// function onKeyPress(e){
//     switch(e.key){
//         case 'ArrowUp':
//         case 'w':
//             pirate.move(0, -10);
//             break;
//         case 'ArrowDown':
//         case 's':
//             pirate.move(0, 10);
//             break;
//         case 'ArrowLeft':
//         case 'a':
//             pirate.setDirection('left');
//             pirate.move(-10, 0);                       
//             break;
//         case 'ArrowRight':
//         case 'd':
//             pirate.setDirection('right');
//             pirate.move(10, 0);
//             break;

//     }
// }
// //     }
// // }

// window.addEventListener('keydown', onKeyPress)
// });

// // window.addEventListener('keydown', onKeyPress)
// // });
