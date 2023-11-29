const mat4 = glMatrix.mat4;

const canvas = document.getElementById("canvas0");

const TG = {
    gl: null,
    shaderProgram: null,

    buffers: {
        position: null,
        color: null,
    },
    camera: {
        position: [0, 0, 5],
        lookAt: [0, 0, 0],
    },
    init: function (canvasId) {
        const canvas = document.getElementById(canvasId);
        this.gl = canvas.getContext('webgl');

        if (!this.gl) {
            console.error('Unable to initialize WebGL.');
            return;
        }

        // 顶点着色器代码
        this.vertexShaderSource = `
        attribute vec3 aPosition;
        attribute vec3 aColor;
        varying vec3 vColor;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
            vColor = aColor;
        }
        `;

        // 片段着色器代码
        this.fragmentShaderSource = `
        precision mediump float;
        varying vec3 vColor;

        void main() {
            gl_FragColor = vec4(vColor, 1.0);
        }
        `;

        this.initShaders();
        this.initBuffers();
    },
    initShaders: function () {
        // 创建顶点着色器
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, this.vertexShaderSource);
        // 创建片段着色器
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, this.fragmentShaderSource);

        // 创建着色器程序
        this.shaderProgram = this.gl.createProgram();
        // 将顶点着色器和片段着色器附加到着色器程序上
        this.gl.attachShader(this.shaderProgram, vertexShader);
        this.gl.attachShader(this.shaderProgram, fragmentShader);
        // 链接着色器程序
        this.gl.linkProgram(this.shaderProgram);

        // 检查着色器程序是否链接成功
        if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
            console.error('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(this.shaderProgram));
            return;
        }

        // 使用着色器程序
        this.gl.useProgram(this.shaderProgram);

        // 获取着色器程序中的属性和 uniform 变量的位置
        this.shaderProgram.aPositionLocation = this.gl.getAttribLocation(this.shaderProgram, 'aPosition');
        this.shaderProgram.aColorLocation = this.gl.getAttribLocation(this.shaderProgram, 'aColor');
        this.shaderProgram.uModelViewMatrixLocation = this.gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix');
        this.shaderProgram.uProjectionMatrixLocation = this.gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix');
    },
    initBuffers: function () {
        // 顶点坐标数据
        const positionData = [
            // 线段的起点和终点坐标
            0, 0, 0,  // 起点
            1, 1, 1   // 终点
        ];

        // 颜色数据
        const colorData = [
            // 线段的起点和终点颜色
            1, 0, 0,  // 红色
            1, 0, 0   // 红色
        ];

        // 创建顶点缓冲区
        this.buffers.position = this.createBuffer(this.gl.ARRAY_BUFFER, new Float32Array(positionData));
        // 将顶点缓冲区绑定到属性变量 aPosition 上
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
        this.gl.enableVertexAttribArray(this.shaderProgram.aPositionLocation);
        this.gl.vertexAttribPointer(this.shaderProgram.aPositionLocation, 3, this.gl.FLOAT, false, 0, 0);

        // 创建颜色缓冲区
        this.buffers.color = this.createBuffer(this.gl.ARRAY_BUFFER, new Float32Array(colorData));
        // 将颜色缓冲区绑定到属性变量 aColor 上
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color);
        this.gl.enableVertexAttribArray(this.shaderProgram.aColorLocation);
        this.gl.vertexAttribPointer(this.shaderProgram.aColorLocation, 3, this.gl.FLOAT, false, 0, 0);
    },

    // 创建着色器函数
    createShader: function (type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        // 检查着色器是否编译成功
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    },

    // 创建缓冲区函数
    createBuffer: function (target, data) {
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(target, buffer);
        this.gl.bufferData(target, data, this.gl.STATIC_DRAW);
        return buffer;
    },
    
    /** 画直线 */
    drawLine: function (startPoint, endPoint, color) {
        // 更新顶点坐标数据和颜色数据
        const positionData = [
            startPoint[0], startPoint[1], startPoint[2],
            endPoint[0], endPoint[1], endPoint[2]
        ];

        const colorData = [
            color[0], color[1], color[2],
            color[0], color[1], color[2]
        ];

        // 更新顶点缓冲区和颜色缓冲区的数据
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positionData), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.shaderProgram.aPositionLocation, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colorData), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.shaderProgram.aColorLocation, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.drawArrays(this.gl.LINES, 0, 2);

    },

    setCamera: function (position, lookAt) {
        this.camera.position = position;
        this.camera.lookAt = lookAt;
    },
    // 更新相机参数的函数
    updateCamera: function () {
        const modelViewMatrix = mat4.create();
        mat4.lookAt(modelViewMatrix, this.camera.position, this.camera.lookAt, [0, 1, 0]);

        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, 45 * Math.PI / 180, this.gl.canvas.width / this.gl.canvas.height, 0.1, 100);

        // 传递相机参数到着色器程序中的 uniform 变量
        this.gl.uniformMatrix4fv(this.shaderProgram.uModelViewMatrixLocation, false, modelViewMatrix);
        this.gl.uniformMatrix4fv(this.shaderProgram.uProjectionMatrixLocation, false, projectionMatrix);
    },

    /** 清空画布，更新参数 */
    update: function () {

        // 清空画布
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // 更新相机参数
        this.updateCamera();
    },
};

// 页面加载完成后初始化
window.onload = function () {
    TG.init('canvas0');
    TG.setCamera([0.2, 0.2, 2], [0, 0, 0]);
    TG.update();
    TG.drawLine([0, 0, 0], [1, 0, 0], [1, 0, 0]); // X 轴，红色
    TG.drawLine([0, 0, 0], [0, 1, 0], [0, 1, 0]); // Y 轴，绿色
    TG.drawLine([0, 0, 0], [0, 0, 1], [0, 0, 1]); // Z 轴，蓝色
};
