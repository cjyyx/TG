import { ACamera } from "/Camera.js";
import { TG } from "/TG/TG.js";

// 初始化
const canvas = document.getElementById("canvas0");
canvas.width = 960;
canvas.height = 720;

var tg = new TG(canvas);
var camera = new ACamera(canvas);

// 加载图片
tg.goutouTexture = null;
var image = new Image();
image.onload = () => {
    tg.goutouTexture = tg.image2texture(image);
}
image.src = '/src/goutou.png';

// 动画
var frame = 0;
function animate() {
    requestAnimationFrame(animate);
    frame++;

    tg.clear();

    var { position, target, mode, fov, near, far } = camera.getParams();
    tg.setCamera(position, target, mode, fov, near, far);

    var lightDir = [0.0, 0.0, -1.0];
    var lightColor = [1.0, 1.0, 1.0];
    tg.setLight(lightDir, lightColor);

    // 绘制光线
    tg.pushModelMatrix();
    {
        tg.translate(0.0, 0.0, 2.5);
        tg.drawArrow([0, 0, 0], lightDir, lightColor)
        tg.drawText("light", [lightDir[0] / 2, lightDir[1] / 2, lightDir[2] / 2], "#ffffff", 0.04, 1)
    }
    tg.popModelMatrix();

    // 绘制坐标轴
    tg.drawXYZ();


    tg.pushModelMatrix();
    {
        var vertices = [
            0.0, 0.0, 0.0,  // 0
            1.0, 0.0, 0.0,  // 1
            1.0, 1.0, 0.0,  // 2
            0.0, 1.0, 0.0,  // 3
        ];
        var colors = [
            1.0, 0.0, 0.0,  // 0
            0.0, 1.0, 0.0,  // 1
            0.0, 0.0, 1.0,  // 2
            1.0, 1.0, 1.0,  // 3
        ];
        var indices = [
            0, 1, 2,
            0, 2, 3,
        ];

        tg.translate(0.2, -1.2, 0);
        tg.drawColorFaces(vertices, colors, indices);
    }
    tg.popModelMatrix();

    tg.pushModelMatrix();
    {
        var vertices = [
            0.0, 0.0, 0.0,  // 0
            1.0, 0.0, 0.0,  // 1
            1.0, 1.0, 0.0,  // 2
            0.0, 1.0, 0.0,  // 3
        ];
        var colors = [
            1.0, 0.0, 0.0,  // 0
            0.0, 1.0, 0.0,  // 1
            0.0, 0.0, 1.0,  // 2
            1.0, 1.0, 1.0,  // 3
        ];
        var normals = [
            0.0, 0.0, 1.0,  // 0
            0.0, 0.0, 1.0,  // 1
            0.0, 0.0, 1.0,  // 2
            0.0, 0.0, 1.0,  // 3
        ]
        var indices = [
            0, 1, 2,
            0, 2, 3,
        ];

        tg.translate(-1.2, 0.2, 0);
        tg.drawLightColorFaces(vertices, colors, normals, indices);
    }
    tg.popModelMatrix();

    if (tg.goutouTexture) {

        tg.pushModelMatrix();
        {
            var vertices = [
                0.0, 0.0, 0.0,  // 0 正方形左下角
                1.0, 0.0, 0.0,  // 1 正方形右下角
                1.0, 1.0, 0.0,  // 2 正方形右上角
                0.0, 1.0, 0.0,  // 3 正方形左上角
            ];
            var texCoords = [
                0.0, 1.0,  // 0 图片左下角
                1.0, 1.0,  // 1 图片右下角
                1.0, 0.0,  // 2 图片右上角
                0.0, 0.0,  // 3 图片左上角
            ];
            var indices = [
                0, 1, 2,
                0, 2, 3,
            ];

            tg.translate(-1.2, -1.2, 0);
            tg.drawTextureFaces(vertices, texCoords, tg.goutouTexture, indices);
        }
        tg.popModelMatrix();

        tg.pushModelMatrix();
        {
            var vertices = [
                0.0, 0.0, 0.0,  // 0 正方形左下角
                1.0, 0.0, 0.0,  // 1 正方形右下角
                1.0, 1.0, 0.0,  // 2 正方形右上角
                0.0, 1.0, 0.0,  // 3 正方形左上角
            ];
            var texCoords = [
                0.0, 1.0,  // 0 图片左下角
                1.0, 1.0,  // 1 图片右下角
                1.0, 0.0,  // 2 图片右上角
                0.0, 0.0,  // 3 图片左上角
            ];
            var normals = [
                0.0, 0.0, 1.0,  // 0
                0.0, 0.0, 1.0,  // 1
                0.0, 0.0, 1.0,  // 2
                0.0, 0.0, 1.0,  // 3
            ]
            var indices = [
                0, 1, 2,
                0, 2, 3,
            ];

            tg.translate(0.2, 0.2, 0);
            tg.drawLightTextureFaces(vertices, texCoords, normals, tg.goutouTexture, indices);
        }
        tg.popModelMatrix();
    }

}

window.onload = function () {
    animate();
};
