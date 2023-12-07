const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;

const canvas = document.getElementById("canvas0");

var tg = new TG();

var loopCount = 0;
function loop() {
    requestAnimationFrame(loop);
    loopCount++;
    tg.rander();
    // console.log(loopCount);
}

// 页面加载完成后初始化
window.onload = function () {
    tg.init(canvas);
    tg.camera = TGCamera.MouseCamera(canvas);
    tg.addObject3D(new TGObject3D.XYZ([0, 0, 0]));
    loop();
};
