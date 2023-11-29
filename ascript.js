const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;

const canvas = document.getElementById("canvas0");

var tg = TG.creatNew();

var loopCount = 0;


function drawXYZ(tg) {
    tg.drawLine([0, 0, 0], [1, 0, 0], [1, 0, 0]); // X 轴，红色
    tg.drawLine([0, 0, 0], [0, 1, 0], [0, 1, 0]); // Y 轴，绿色
    tg.drawLine([0, 0, 0], [0, 0, 1], [0, 0, 1]); // Z 轴，蓝色
}

function display() {
    tg.update();
    drawXYZ(tg);
}

function loop() {
    loopCount++;

    display();

    // console.log(loopCount);
    requestAnimationFrame(loop);

}

// 页面加载完成后初始化
window.onload = function () {
    tg.init('canvas0');
    tg.setCamera = MouseCamera(canvas);
    loop();
};
