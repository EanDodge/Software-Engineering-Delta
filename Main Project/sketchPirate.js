document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const pirateImgUrl = './assets/pirate.png';
    const seaImgUrl = './assets/sea.png';
    const backgroundImgUrl = './assets/upgradeislandAlt.png';
    //const backgroundImgUrl = './assets/upgrade.png';

    const pirate = new Pirate(750, 630, pirateImgUrl);

    const seaImage = new Image();
    const background = new Image();
    
    background.src = backgroundImgUrl;
    seaImage.src = seaImgUrl;

    function resizeCanvas(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawScene();
    }

    function drawScene(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(seaImage, 0, 0, canvas.width , canvas.height);
        
        //need to scale the island.
        //default size is not big enough for entire browser scree
        let scaleFactor = 1.5;
        const newWidth = background.width * scaleFactor;
        const newHeight = background.height * scaleFactor;

    
        const centerX = (canvas.width - newWidth) / 2;
        const centerY = (canvas.height - newHeight) / 2;
        ctx.drawImage(background, centerX, centerY, newWidth, newHeight);
        pirate.draw(ctx);
    }

    seaImage.onload = () => {
        background.onload = () => {
        resizeCanvas()
        window.addEventListener('resize', resizeCanvas);
        gameLoop();
    };
};

    function gameLoop() {
        drawScene();
        requestAnimationFrame(gameLoop);
    }

    //gameLoop();

function onKeyPress(e){
    switch(e.key){
        case 'ArrowUp':
        case 'w':
            pirate.move(0, -10);
            break;
        case 'ArrowDown':
        case 's':
            pirate.move(0, 10);
            break;
        case 'ArrowLeft':
        case 'a':
            pirate.setDirection('left');
            pirate.move(-10, 0);                       
            break;
        case 'ArrowRight':
        case 'd':
            pirate.setDirection('right');
            pirate.move(10, 0);
            break;

    }
}

window.addEventListener('keydown', onKeyPress)
});

