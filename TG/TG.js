const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;
const mat3 = glMatrix.mat3;

import * as TGDraw from '/TG/TGDraw.js';
import * as TGShaderProgram from '/TG/TGShaderProgram.js';

class TG {
    constructor(canvas) {
        this.modelMatrixStack = [];
        this.modelMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.projectionMatrix = mat4.create();

        this.normalMatrix = mat3.create();
        this.cameraPosition = vec3.create();
        this.cameraPosition[0] = 0;
        this.cameraPosition[1] = 0;
        this.cameraPosition[2] = 1;

        this.lightDir = [0, 0, -1];
        this.lightColor = [1, 1, 1];

        this.canvas = canvas;
        var gl = canvas.getContext('webgl');
        this.gl = gl;

        this.gl.viewportWidth = canvas.width;
        this.gl.viewportHeight = canvas.height;

        if (!this.gl) {
            console.error('Unable to initialize WebGL.');
            return;
        }

        this.setColorShaderProgram = TGShaderProgram.ColorShaderProgram(this);
        this.setColorShaderProgram2D = TGShaderProgram.ColorShaderProgram2D(this);
        this.setTextureShaderProgram = TGShaderProgram.TextureShaderProgram(this);
        this.setTextureShaderProgram2D = TGShaderProgram.TextureShaderProgram2D(this);
        this.setTextureMaterialShaderProgram = TGShaderProgram.TextureMaterialShaderProgram(this);
        this.setColorMaterialShaderProgram = TGShaderProgram.ColorMaterialShaderProgram(this);
        this.setColorLightShaderProgram = TGShaderProgram.ColorLightShaderProgram(this);
        this.setTextureLightShaderProgram = TGShaderProgram.TextureLightShaderProgram(this);

        this.drawLine = (...args) => TGDraw.drawLine(this, ...args);
        this.drawLine2D = (...args) => TGDraw.drawLine2D(this, ...args);
        this.drawArrow = (...args) => TGDraw.drawArrow(this, ...args);
        this.drawXYZ = (...args) => TGDraw.drawXYZ(this, ...args);
        this.drawText = (...args) => TGDraw.drawText(this, ...args);

        this.drawColorFaces = (...args) => TGDraw.drawColorFaces(this, ...args);
        this.image2texture = (...args) => TGDraw.image2texture(this, ...args);
        this.drawTextureFaces = (...args) => TGDraw.drawTextureFaces(this, ...args);
        this.drawImageTextureFaces = (...args) => TGDraw.drawImageTextureFaces(this, ...args);

        this.drawLightColorFaces = (...args) => TGDraw.drawLightColorFaces(this, ...args);
        this.drawLightTextureFaces = (...args) => TGDraw.drawLightTextureFaces(this, ...args);

        this.drawTriangle = (...args) => TGDraw.drawTriangle(this, ...args);
        this.drawLightTriangle = (...args) => TGDraw.drawLightTriangle(this, ...args);
        this.drawMaterialTriangle = (...args) => TGDraw.drawMaterialTriangle(this, ...args);
        this.drawMaterialTextureTriangle = (...args) => TGDraw.drawMaterialTextureTriangle(this, ...args);
        // this.drawImageTexture = (...args) => TGDraw.drawImageTexture(this, ...args);

        this.gl.enable(gl.DEPTH_TEST);
    }

    clear() {
        var gl = this.gl;
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    pushModelMatrix() {
        this.modelMatrixStack.push(mat4.clone(this.modelMatrix));
    }
    popModelMatrix() {
        if (this.modelMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        this.setModelMatrix(this.modelMatrixStack.pop());
    }
    translate(x, y, z) {
        mat4.translate(this.modelMatrix, this.modelMatrix, [x, y, z]);
    }
    rotate(angle, x, y, z) {
        mat4.rotate(this.modelMatrix, this.modelMatrix, angle, [x, y, z]);
    }
    rotateX(angle) {
        this.rotate(angle, 1, 0, 0);
    }
    rotateY(angle) {
        this.rotate(angle, 0, 1, 0);
    }
    rotateZ(angle) {
        this.rotate(angle, 0, 0, 1);
    }
    scale(x, y, z) {
        mat4.scale(this.modelMatrix, this.modelMatrix, [x, y, z]);
    }

    setModelMatrix(m) {
        this.modelMatrix = mat4.clone(m);

        var normalMatrix = mat3.create();
        mat3.normalFromMat4(normalMatrix, this.modelMatrix);
        this.normalMatrix = normalMatrix;
    }
    setViewMatrix(m) {
        this.viewMatrix = mat4.clone(m);
    }
    setProjectionMatrix(m) {
        this.projectionMatrix = mat4.clone(m);
    }

    setCamera(position, target, mode, fov, near, far) {
        this.cameraPosition = position;
        var gl = this.gl;

        if (mode == 'orthographic') {
            var viewMatrix = mat4.create();
            mat4.lookAt(viewMatrix, position, target, [0, 1, 0]);
            var projectionMatrix = mat4.create();
            var temp = fov * Math.PI / 180;
            mat4.ortho(projectionMatrix, -temp, temp, -temp, temp, near, far);
        }
        else if (mode == 'perspective') {
            var viewMatrix = mat4.create();
            mat4.lookAt(viewMatrix, position, target, [0, 1, 0]);
            var projectionMatrix = mat4.create();
            mat4.perspective(projectionMatrix, fov * Math.PI / 180, gl.canvas.width / gl.canvas.height, near, far);
        }
        else {
            throw 'Invalid camera mode!';
        }

        this.setViewMatrix(viewMatrix);
        this.setProjectionMatrix(projectionMatrix);
    }

    setLight(lightDir, lightColor) {
        this.lightDir = vec3.create();
        this.lightDir[0] = lightDir[0];
        this.lightDir[1] = lightDir[1];
        this.lightDir[2] = lightDir[2];

        this.lightColor = vec3.create();
        this.lightColor[0] = lightColor[0];
        this.lightColor[1] = lightColor[1];
        this.lightColor[2] = lightColor[2];

        var normalMatrix = mat3.create();
        mat3.normalFromMat4(normalMatrix, this.modelMatrix);
        this.normalMatrix = normalMatrix;
    }

    shot() {
        const image = new Image();
        image.src = this.canvas.toDataURL('image/png');

        const a = document.createElement('a');
        a.href = image.src;
        a.download = 'webgl_scene.png';
        a.click();
    }

    startCapture() {
        var recordedChunks = [];
        var canvas = this.canvas;
        var frameRate = 30;

        if (canvas.captureStream) {
            var stream = canvas.captureStream(frameRate);

            this.mediaRecorder = new MediaRecorder(stream);
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                const recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });

                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(recordedBlob);
                downloadLink.download = 'canvas-recording.webm';
                document.body.appendChild(downloadLink);
                downloadLink.click();

                recordedChunks = [];
                this.mediaRecorder = null;
            };
            this.mediaRecorder.start();
        } else {
            console.error('captureStream is not supported in this browser.');
        }
    }

    endCapture() {
        if (this.mediaRecorder) {
            this.mediaRecorder.stop();
        }
    }

};

export { TG };

