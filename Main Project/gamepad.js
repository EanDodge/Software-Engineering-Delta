
let controllerIndex = null;
let leftPressed = false;
let rightPressed = false;
let upPressed = false;
let downPressed = false;

window.addEventListener("gamepadconnected", (event)=>{
    controllerIndex = event.gamepad.index;
    console.log("Connected");
});

window.addEventListener("gamepaddisconnected", (event)=>{
    controllerIndex = null;
    console.log("Disconnected");
});

function controllerInput(){

    if(controllerIndex !== null){
        const gamepad = navigator.getGamepads()[controllerIndex];
        const buttons = gamepad.buttons;
        upPressed = buttons[12].pressed;
        downPressed = buttons[13].pressed;
        leftPressed = buttons[14].pressed;
        rightPressed = buttons[15].pressed;
    }

    if(controllerIndex !== null){
        yMove = 0;
        turn = 0;

        if (upPressed) {
            yMove -= 1;
        }
        if (leftPressed) {
            turn += 1;
        }
        if (downPressed) {
            yMove += 1;
        }
        if (rightPressed) {
            turn -= 1;

        }
    }
}