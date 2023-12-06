const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;

const canvas = document.getElementById("canvas0");

var tg = new TG();

var loopCount = 0;


function drawXYZ(tg) {
    tg.drawLine([0, 0, 0], [1, 0, 0], [1, 0, 0]); // X 轴，红色
    tg.drawLine([0, 0, 0], [0, 1, 0], [0, 1, 0]); // Y 轴，绿色
    tg.drawLine([0, 0, 0], [0, 0, 1], [0, 0, 1]); // Z 轴，蓝色
}

/* 

假设有一个函数 drawLine，可以绘制直线，如绘制坐标值示例如下

function drawXYZ(tg) {
    tg.drawLine([0, 0, 0], [1, 0, 0], [1, 0, 0]); // X 轴，红色
    tg.drawLine([0, 0, 0], [0, 1, 0], [0, 1, 0]); // Y 轴，绿色
    tg.drawLine([0, 0, 0], [0, 0, 1], [0, 0, 1]); // Z 轴，蓝色
}

帮我利用这个函数绘制长方体，参数是长方体的四点坐标，按右手坐标系绘制
*/

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
    tg.init(canvas);
    tg.setCamera = MouseCamera(canvas);
    loop();
};
