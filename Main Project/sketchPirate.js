document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const pirateImgUrl = './assets/pirate.png';
    const seaImgUrl = './assets/sea.png';
    const backgroundImgUrl = './assets/upgradeislandAlt.png';
    //const backgroundImgUrl = './assets/upgrade.png';

    const pirate = new Pirate(800, 650, pirateImgUrl);

    const seaImage = new Image();
    const background = new Image();
    
    background.src = backgroundImgUrl;
    seaImage.src = seaImgUrl;

    seaImage.onload = () => {
        //backgroundImage.onload = () => {
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(background, 0, 0, canvas.width/2, canvas.height/2);
        pirate.draw(ctx);
        gameLoop();
    //};
};

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(seaImage, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        pirate.draw(ctx);
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

