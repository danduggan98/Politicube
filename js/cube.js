// Show the cube

//Add points for important figures
//Include information about each quadrant and its thinkers

//Grab the HTML element
const canvas = document.getElementById('animation');

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

        //Important people scores - #30-31
        0, 0, 0, //Hitler
        0.5, 0, 0, //Stalin
        //Pol Pot
        //Marx
        //Lenin
        //Mussolini
        //Pinochet
        //Jefferson
        //Jackson
        //Hamilton
        //Robespierre
        //Mao
        //Gandhi
        //Bismarck
        //Hugo Chavez
        //Fidel Castro
        //Thatcher
        //Rand
        //Orwell
        //Putin
        //Milton Friedman
        //Adam Smith
        //FDR
        //JFK
        //Reagan
        //Ron Paul
        //Obama
        //Trump
        //Mugabe
        //Jinping
        //Corbyn
        //Sanders

        //Axis arrows #32-43
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

        //Important people scores
        0, 1, 0,
        1, 1, 0,

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
        24, 32, 24, 33,
        25, 34, 25, 35,
        27, 36, 27, 37,
        26, 38, 26, 39,
        29, 40, 29, 41,
        28, 42, 28, 43
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
        gl.viewport(-200, 200, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.uniformMatrix4fv(_Pmatrix, false, proj_matrix);
        gl.uniformMatrix4fv(_Vmatrix, false, view_matrix);
        gl.uniformMatrix4fv(_Mmatrix, false, mo_matrix);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
        gl.drawElements(gl.LINES, indices.length, gl.UNSIGNED_SHORT, 0);

        //Show the scores for each important person
        gl.drawArrays(gl.POINTS, 30, 1);
        gl.drawArrays(gl.POINTS, 31, 1);

        window.requestAnimationFrame(animate);
    }
    animate(0);
}
