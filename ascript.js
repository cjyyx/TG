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
    tg.addObject3D(new TGObject3D.XYZ(tg, [0, 0, 0]));

    var vertices = [
        0.0, 0.0, 0.0,
        0.7, 0.3, 0.0,
        -0.6, 0.3, 0.4
    ];
    var colors = [
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
    ];

    var triangle = new TGObject3D.Triangle(tg, vertices, colors);
    tg.addObject3D(triangle);

    loop();
};
