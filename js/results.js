//Display results, animation, and individual axes, plus name their ideology

//Affirmative -> right wing = -1, affirmative -> left wing = +1 - TRY THIS OUT

//Grab HTML elements
const canvas = document.getElementById('animation');
const xCanvas = document.getElementById("xAxis");
const yCanvas = document.getElementById("yAxis");
const zCanvas = document.getElementById("zAxis");
const xCaption = document.getElementById("xCaption");
const yCaption = document.getElementById("yCaption");
const zCaption = document.getElementById("zCaption");
const ideology = document.getElementById("ideology");

//Adjust axes slightly to straighten lines
xCanvas.getContext("2d").translate(0.5, 0.5);
yCanvas.getContext("2d").translate(0.5, 0.5);
zCanvas.getContext("2d").translate(0.5, 0.5);

//Get url parameters for the user score and show results based on that
const params = new URLSearchParams(window.location.search);
const cVal = params.get('c');
const eVal = params.get('e');
const aVal = params.get('a');
showResults();

function showResults() {
    console.log("Prepare thineself. The Cube cometh.");

    //Display user ideology
    ideology.innerHTML = "Your ideology is closest to: " + getIdeology();

    //Show the cube and axes with the user's score
    displayCube();
    showAxes();
}

//Show the user's score for each axis individually
function showAxes() {
    //Reveal everything
    notice.style.display = "inline-block";
    axes.style.display = "inline-block";
    console.log("Final user score -> Cultural: " + cVal + ", Economic: " + eVal + ", Authoritarian: " + aVal); //Display score for testing

    /*==================== 2D AXES ====================== */

    //X axis
    var xCtx = xCanvas.getContext("2d");

    //Constants for size of axes (all uniform height/width)
    var axisWidth = xCtx.canvas.width;
    var axisHeight = xCtx.canvas.height;
    var midWidth = axisWidth / 2;
    var midHeight = axisHeight / 2;

    //Create gradient
    var xGrd = xCtx.createLinearGradient(0, 0, axisWidth, 0);
    xGrd.addColorStop(0, "#ffdf00");
    xGrd.addColorStop(1, "blue");

    // Fill with gradient
    xCtx.fillStyle = xGrd;
    xCtx.fillRect(-.5, -.5, axisWidth, axisHeight);

    //Main line
    xCtx.moveTo(0, midHeight);
    xCtx.lineTo(axisWidth, midHeight);
    xCtx.stroke();

    //Left, middle, right bars
    xCtx.moveTo(0, midHeight + 12);
    xCtx.lineTo(0, midHeight - 12);
    xCtx.stroke();

    xCtx.moveTo(midWidth, midHeight + 12);
    xCtx.lineTo(midWidth, midHeight - 12);
    xCtx.stroke();

    xCtx.moveTo(axisWidth - 1, midHeight + 12);
    xCtx.lineTo(axisWidth - 1, midHeight - 12);
    xCtx.stroke();

    //User score point
    xCtx.beginPath();
    xCtx.arc(midWidth + (cVal * midWidth), midHeight, 10, 0, 2 * Math.PI);
    xCtx.stroke();
    xCtx.fillStyle = "black";
    xCtx.fill();

    //Y axis
    var yCtx = yCanvas.getContext("2d");

    //Create gradient
    var yGrd = yCtx.createLinearGradient(0, 0, axisWidth, 0);
    yGrd.addColorStop(0, "lime");
    yGrd.addColorStop(1, "magenta");

    //Fill with gradient
    yCtx.fillStyle = yGrd;
    yCtx.fillRect(-.5, -.5, axisWidth, axisHeight);

    //Main line
    yCtx.moveTo(0, midHeight);
    yCtx.lineTo(axisWidth, midHeight);
    yCtx.stroke();

    //Left, middle, right bars
    yCtx.moveTo(0, midHeight + 12);
    yCtx.lineTo(0, midHeight - 12);
    yCtx.stroke();

    yCtx.moveTo(midWidth, midHeight + 12);
    yCtx.lineTo(midWidth, midHeight - 12);
    yCtx.stroke();

    yCtx.moveTo(axisWidth - 1, midHeight + 12);
    yCtx.lineTo(axisWidth - 1, midHeight - 12);
    yCtx.stroke();

    //User score point
    yCtx.beginPath();
    yCtx.arc(midWidth + (eVal * midWidth), midHeight, 10, 0, 2 * Math.PI);
    yCtx.stroke();
    yCtx.fillStyle = "black";
    yCtx.fill();

    //Z axis
    var zCtx = zCanvas.getContext("2d");

    //Create gradient
    var zGrd = zCtx.createLinearGradient(0, 0, axisWidth, 0);
    zGrd.addColorStop(0, "cyan");
    zGrd.addColorStop(1, "red");

    // Fill with gradient
    zCtx.fillStyle = zGrd;
    zCtx.fillRect(-.5, -.5, axisWidth, axisHeight);

    //Main line
    zCtx.moveTo(0, midHeight);
    zCtx.lineTo(axisWidth, midHeight);
    zCtx.stroke();

    //Left, middle, right bars
    zCtx.moveTo(0, midHeight + 12);
    zCtx.lineTo(0, midHeight - 12);
    zCtx.stroke();

    zCtx.moveTo(midWidth, midHeight + 12);
    zCtx.lineTo(midWidth, midHeight - 12);
    zCtx.stroke();

    zCtx.moveTo(axisWidth - 1, midHeight + 12);
    zCtx.lineTo(axisWidth - 1, midHeight - 12);
    zCtx.stroke();

    //User score point
    zCtx.beginPath();
    zCtx.arc(midWidth + (aVal * midWidth), midHeight, 10, 0, 2 * Math.PI);
    zCtx.stroke();
    zCtx.fillStyle = "black";
    zCtx.fill();
}

//Show the cube animation
function displayCube() {
    //Grab the canvas for the cube
    gl = canvas.getContext('experimental-webgl');

    /*=================== GEOMETRY =================== */

    var vertices = [
        //Cube (6 sides, each w/ 4 coordinates) #0-23
        -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1,
        -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,
        -1, -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1,
        1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1,
        -1, -1, -1, -1, -1, 1, 1, -1, 1, 1, -1, -1,
        -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1,

        //Axes (x, z, y) #24-29
        -1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, -1, 0, 1, 0, 0, -1, 0,

        //User score #30
        cVal, eVal, aVal,

        //Axis arrows #31-42
        -0.95, 0.05, 0, -0.95, -0.05, 0,
        0.95, 0.05, 0, 0.95, -0.05, 0,
        0, 0.05, -0.95, 0, -0.05, -0.95,
        0, 0.05, 0.95, 0, -0.05, 0.95,
        0.05, -0.95, 0, -0.05, -0.95, 0,
        0.05, 0.95, 0, -0.05, 0.95, 0
    ];

    var colors = [
        //Cube
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

        //Axes (Golden Yellow <-> Blue (X), Cyan <-> Red (Z), Pink <-> Green (Y))
        1, 0.8745, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0,

        //User score (black)
        0, 0, 0,

        //Axis arrows
        1, 0.8745, 0, 1, 0.8745, 0,
        0, 0, 1, 0, 0, 1,
        0, 1, 1, 0, 1, 1,
        1, 0, 0, 1, 0, 0,
        0, 1, 0, 0, 1, 0,
        1, 0, 1, 1, 0, 1
    ];

    var indices = [
        //Cube
        0, 1, 1, 2, 2, 3, 3, 0,
        4, 5, 5, 6, 6, 7, 7, 4,
        8, 9, 9, 10, 10, 11, 11, 8,
        12, 13, 13, 14, 14, 15, 15, 12,
        16, 17, 17, 18, 18, 19, 19, 16,

        //Axes
        24, 25, 26, 27, 28, 29,

        //Axis arrows
        24, 31, 24, 32,
        25, 33, 25, 34,
        27, 35, 27, 36,
        26, 37, 26, 38,
        29, 39, 29, 40,
        28, 41, 28, 42
    ];

    // Create and store data into vertex buffer
    var vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Create and store data into color buffer
    var color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    // Create and store data into index buffer
    var index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    /*=================== SHADERS =================== */

    var vertCode = 'attribute vec3 position;' +
        'uniform mat4 Pmatrix;' +
        'uniform mat4 Vmatrix;' +
        'uniform mat4 Mmatrix;' +
        'attribute vec3 color;' + //Point color
        'varying vec3 vColor;' +
        'void main(void) { ' + //Pre-built function
        'gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, .5);' +
        'gl_PointSize = 16.0;' +
        'vColor = color;' +
        '}';

    var fragCode = 'precision mediump float;' +
        'varying vec3 vColor;' + //Circular point
        'void main(void) {' +
        'float r = 0.0, delta = 0.0, alpha = 1.0;' +
        'vec2 cxy = 2.0 * gl_PointCoord - 1.0;' +
        'r = dot(cxy, cxy);' +
        'if (r > 1.0) {' +
        'discard;' +
        '}' +
        'gl_FragColor = vec4(vColor, 1);' +
        '}';

    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);

    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(fragShader);

    var shaderprogram = gl.createProgram();
    gl.attachShader(shaderprogram, vertShader);
    gl.attachShader(shaderprogram, fragShader);
    gl.linkProgram(shaderprogram);

    /*======== Associating attributes to vertex shader =====*/
    var _Pmatrix = gl.getUniformLocation(shaderprogram, "Pmatrix");
    var _Vmatrix = gl.getUniformLocation(shaderprogram, "Vmatrix");
    var _Mmatrix = gl.getUniformLocation(shaderprogram, "Mmatrix");

    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    var _position = gl.getAttribLocation(shaderprogram, "position");
    gl.vertexAttribPointer(_position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(_position);

    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    var _color = gl.getAttribLocation(shaderprogram, "color");
    gl.vertexAttribPointer(_color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(_color);
    gl.useProgram(shaderprogram);

    /*==================== MATRIX ====================== */

    function get_projection(angle, a, zMin, zMax) {
        var ang = Math.tan((angle * .5) * Math.PI / 180);
        return [
            0.5 / ang, 0, 0, 0,
            0, 0.5 * a / ang, 0, 0,
            0, 0, -(zMax + zMin) / (zMax - zMin), -1,
            0, 0, (-2 * zMax * zMin) / (zMax - zMin), 0
        ];
    }

    var proj_matrix = get_projection(40, canvas.width / canvas.height, 1, 100);
    var mo_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    var view_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

    view_matrix[14] = view_matrix[14] - 6;

    /*================= Mouse events ======================*/

    var AMORTIZATION = 0.95;
    var drag = false;
    var old_x, old_y;
    var dX = 0, dY = 0;

    var mouseDown = function (e) {
        drag = true;
        old_x = e.pageX, old_y = e.pageY;
        e.preventDefault();
        return false;
    };

    var mouseUp = function (e) {
        drag = false;
    };

    var mouseMove = function (e) {
        if (!drag) return false;
        dX = (e.pageX - old_x) * 2 * Math.PI / canvas.width,
            dY = (e.pageY - old_y) * 2 * Math.PI / canvas.height;
        THETA += dX;
        PHI += dY;
        old_x = e.pageX, old_y = e.pageY;
        e.preventDefault();
    };

    canvas.addEventListener("mousedown", mouseDown, false);
    canvas.addEventListener("mouseup", mouseUp, false);
    canvas.addEventListener("mouseout", mouseUp, false);
    canvas.addEventListener("mousemove", mouseMove, false);

    /*=========================rotation================*/

    function rotateX(m, angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var mv1 = m[1], mv5 = m[5], mv9 = m[9];

        m[1] = m[1] * c - m[2] * s;
        m[5] = m[5] * c - m[6] * s;
        m[9] = m[9] * c - m[10] * s;

        m[2] = m[2] * c + mv1 * s;
        m[6] = m[6] * c + mv5 * s;
        m[10] = m[10] * c + mv9 * s;
    }

    function rotateY(m, angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var mv0 = m[0], mv4 = m[4], mv8 = m[8];

        m[0] = c * m[0] + s * m[2];
        m[4] = c * m[4] + s * m[6];
        m[8] = c * m[8] + s * m[10];

        m[2] = c * m[2] - s * mv0;
        m[6] = c * m[6] - s * mv4;
        m[10] = c * m[10] - s * mv8;
    }

    /*=================== Drawing =================== */

    var THETA = 0,
        PHI = 0;
    var time_old = 0;

    var animate = function (time) {

        if (!drag) {
            dX *= AMORTIZATION, dY *= AMORTIZATION;
            THETA += dX, PHI += dY;
        }

        //set model matrix to I4
        mo_matrix[0] = 1, mo_matrix[1] = 0, mo_matrix[2] = 0,
            mo_matrix[3] = 0,

            mo_matrix[4] = 0, mo_matrix[5] = 1, mo_matrix[6] = 0,
            mo_matrix[7] = 0,

            mo_matrix[8] = 0, mo_matrix[9] = 0, mo_matrix[10] = 1,
            mo_matrix[11] = 0,

            mo_matrix[12] = 0, mo_matrix[13] = 0, mo_matrix[14] = 0,
            mo_matrix[15] = 1;

        rotateY(mo_matrix, THETA);
        rotateX(mo_matrix, PHI);

        time_old = time;
        gl.enable(gl.DEPTH_TEST);

        gl.clearColor(0, 0, 0, 0);
        gl.clearDepth(1.0);
        gl.viewport(0.0, 0.0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.uniformMatrix4fv(_Pmatrix, false, proj_matrix);
        gl.uniformMatrix4fv(_Vmatrix, false, view_matrix);
        gl.uniformMatrix4fv(_Mmatrix, false, mo_matrix);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
        gl.drawElements(gl.LINES, indices.length, gl.UNSIGNED_SHORT, 0);

        //Show the user's score
        gl.drawArrays(gl.POINTS, 30, 1);

        window.requestAnimationFrame(animate);
    }
    animate(0);
}

//Calculate the user's closest ideology (in the most convoluted, unintuitive way possible)
function getIdeology() {

    //Determine closest ideology, pick point color based on quadrant
    if (cVal < 0 && eVal < 0 && aVal < 0) { return "Progressive Communist"; } //bottom back left   = Progressive Anarchist Socialist
    if (cVal > 0 && eVal < 0 && aVal < 0) { return "Traditional Communist"; } //bottom back right  = Traditionalist Anarchist Socialist
    if (cVal < 0 && eVal > 0 && aVal < 0) { return "Progressive Anarcho-Capitalist"; } //top back left      = Progressive Anarchist Capitalist
    if (cVal > 0 && eVal > 0 && aVal < 0) { return "Traditional Anarcho-Capitalist"; } //top back right     = Traditionalist Anarchist Capitalist
    if (cVal < 0 && eVal < 0 && aVal > 0) { return "Progressive Authoritarian Socialist"; } //bottom front left  = Progressive Authoritarian Socialist
    if (cVal > 0 && eVal < 0 && aVal > 0) { return "Traditional Authoritarian Socialist"; } //bottom front right = Traditionalist Authoritarian Socialist
    if (cVal < 0 && eVal > 0 && aVal > 0) { return "Progressive Authoritarian Capitalist"; } //top front left     = Progressive Authoritarian Capitalist
    if (cVal > 0 && eVal > 0 && aVal > 0) { return "Traditional Authoritarian Capitalist"; } //top front right    = Traditionalist Authoritarian Capitalist
}
