import { ACamera } from "/Camera.js";
import { TG } from "/TG/TG.js";

const canvas = document.getElementById("canvas0");

var tg = new TG(canvas);
var camera = new ACamera(canvas);

var frame = 0;
function animate() {
    requestAnimationFrame(animate);
    frame++;

    tg.clear();

    var { position, target, mode, fov, near, far } = camera.getParams();
    tg.setCamera(position, target, mode, fov, near, far);
    tg.setLight([0, 0, -1], [1, 1, 1]);

    tg.pushModelMatrix();
    {
        tg.rotate(frame / 100, 0, 1, 0);
        tg.translate(0.5, 0, 0);
        var scalef = 1 + 0.9 * Math.cos(frame / 80);
        tg.scale(scalef, scalef, scalef);
        tg.drawXYZ();
    }
    tg.popModelMatrix();
}

// 页面加载完成后初始化
window.onload = function () {
    animate();
};
