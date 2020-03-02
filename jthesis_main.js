var renderer,
    scene,
    camera,
    arr_type_mesher,
    myCanvas = document.getElementById('myCanvas');

arr_type_mesher = new Array();

//RENDERER
renderer = new THREE.WebGLRenderer({ canvas: myCanvas, antialias: true });
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//RESIZING
window.addEventListener('resize', function () {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});


//USER GUI
const params = {
    textField: "Type in whatever",
    color: 0xFF0000,
    fontSize: 12,
    fontThickness: 10,
    wireframe: false,
    multiple: false
}
const gui = new dat.GUI();

//GUI TEXT: changing geometry so removing and adding are necessary
gui.add(params, "textField").onFinishChange(function (value) {
    scene.remove(type_mesher.mesh);
    type_mesher.changeText(value);
    scene.add(type_mesher.mesh);

    for (var mesher_idx = 0; mesher_idx < arr_type_mesher.length; mesher_idx++) {
        scene.remove(arr_type_mesher[mesher_idx].mesh);
        arr_type_mesher[mesher_idx].changeText(value);

        if (params.multiple == true) {
            scene.add(arr_type_mesher[mesher_idx].mesh);
        }
    }
});

//GUI font size: changing geometry is required so removing and adding are necessary
gui.add(params, "fontSize", 12, 150, 1).onChange(function (value) {
    scene.remove(type_mesher.mesh);
    type_mesher.changeTextSize(value);
    scene.add(type_mesher.mesh);

    for (var mesher_idx = 0; mesher_idx < arr_type_mesher.length; mesher_idx++) {
        scene.remove(arr_type_mesher[mesher_idx].mesh);
        arr_type_mesher[mesher_idx].changeTextSize(value);
        if (params.multiple == true) {
            scene.add(arr_type_mesher[mesher_idx].mesh);
        }
    }
});

//GUI height: changing geometry is required so removing and adding are necessary
gui.add(params, "fontThickness", 10, 100, 1).onChange(function (value) {
    scene.remove(type_mesher.mesh);
    type_mesher.changeThickness(value);
    scene.add(type_mesher.mesh);

    for (var mesher_idx = 0; mesher_idx < arr_type_mesher.length; mesher_idx++) {
        scene.remove(arr_type_mesher[mesher_idx].mesh);
        arr_type_mesher[mesher_idx].changeThickness(value);
        if (params.multiple == true) {
            scene.add(arr_type_mesher[mesher_idx].mesh);
        }
    }
});

//GUI COLOR
gui.addColor(params, "color").onFinishChange(function (value) {
    type_mesher.changeTextColor(value);
    type_mesher.changeWireframeColor(value);

    for (var mesher_idx = 0; mesher_idx < arr_type_mesher.length; mesher_idx++) {
        arr_type_mesher[mesher_idx].changeTextColor(value);
        arr_type_mesher[mesher_idx].changeWireframeColor(value);
    }
});

//GUI wireframe
gui.add(params, "wireframe").onChange(function (value){ 
    type_mesher.setWireFrameVisibility(value);

    if (params.multiple == true) {
        for (var mesher_idx = 0; mesher_idx < arr_type_mesher.length; mesher_idx++) {
            arr_type_mesher[mesher_idx].setWireFrameVisibility(value);
        }
    }
});

//GUI multiple
gui.add(params, "multiple").onChange(function (value){ 
    if (value) {
        for (var mesher_idx = 0; mesher_idx < arr_type_mesher.length; mesher_idx++) {
            scene.add(arr_type_mesher[mesher_idx].mesh);
        }
    }
    else {
        for (var mesher_idx = 0; mesher_idx < arr_type_mesher.length; mesher_idx++) {
            scene.remove(arr_type_mesher[mesher_idx].mesh);
        }
    }
});

//CAMERA
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 7000);
camera.position.z = 100;


//LIGHTS
var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
var pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(25, 50, 25);


//CONTROLS
controls = new THREE.OrbitControls(camera, renderer.domElement);


//load font
var loader = new THREE.FontLoader();
var font = loader.parse(fontJSON);


//SINGLE OBJECT
type_mesher = new TypeMesher(
    "hello", font, 12, 10,
    0xFF0000,
    10, 0xFF0000, false,
    window.innerWidth, window.innerHeight
);

type_mesher.setRotationVelocity(0.005);

//MULTIPLE OBJECT
var num_of_mesh = 20;
for(var mesher_idx = 0; mesher_idx < num_of_mesh; mesher_idx++)
{
    arr_type_mesher[mesher_idx] = new TypeMesher(
        "hello", font, 12, 10,
        0xFF0000,
        10, 0xFF0000, false,
        window.innerWidth, window.innerHeight
    );

    var new_idx = mesher_idx % 20;
    if(new_idx < 10) {
        arr_type_mesher[mesher_idx].mesh.position.x = (mesher_idx + 1) * 50;
    }
    else
    {
        arr_type_mesher[mesher_idx].mesh.position.x = -(mesher_idx - 10 + 1) * 50;
    }

    arr_type_mesher[mesher_idx].setRotationVelocity(Math.random()*0.01 + 0.001);
}

// % 10 % 2
for(var mesher_idx = 20; mesher_idx < num_of_mesh + 20; mesher_idx++)
{
    arr_type_mesher[mesher_idx] = new TypeMesher(
        "hello", font, 12, 10,
        0xFF0000,
        10, 0xFF0000, false,
        window.innerWidth, window.innerHeight
    );

    var new_idx = mesher_idx % 20;
    if(new_idx < 10) {
        arr_type_mesher[mesher_idx].mesh.position.x = (mesher_idx-20 + 1) * 50;
    }
    else
    {
        arr_type_mesher[mesher_idx].mesh.position.x = -((mesher_idx-20) - 10 + 1) * 50;
    }

    arr_type_mesher[mesher_idx].setRotationVelocity(Math.random()*0.01 + 0.001);

    arr_type_mesher[mesher_idx].mesh.position.y = 50;
}

for(var mesher_idx = 40; mesher_idx < num_of_mesh + 40; mesher_idx++)
{
    arr_type_mesher[mesher_idx] = new TypeMesher(
        "hello", font, 12, 10,
        0xFF0000,
        10, 0xFF0000, false,
        window.innerWidth, window.innerHeight
    );

    var new_idx = mesher_idx % 20;
    if(new_idx < 10) {
        arr_type_mesher[mesher_idx].mesh.position.x = (mesher_idx-40 + 1) * 50;
    }
    else
    {
        arr_type_mesher[mesher_idx].mesh.position.x = -((mesher_idx-40) - 10 + 1) * 50;
    }

    arr_type_mesher[mesher_idx].setRotationVelocity(Math.random()*0.01 + 0.001);

    arr_type_mesher[mesher_idx].mesh.position.y = -50;
}

var mesher_idx = 60;
arr_type_mesher[mesher_idx] = new TypeMesher(
    "hello", font, 12, 10,
    0xFF0000,
    10, 0xFF0000, false,
    window.innerWidth, window.innerHeight
);

arr_type_mesher[mesher_idx].setRotationVelocity(Math.random()*0.01 + 0.001);
arr_type_mesher[mesher_idx].mesh.position.y = -50;

var mesher_idx = 61;
arr_type_mesher[mesher_idx] = new TypeMesher(
    "hello", font, 12, 10,
    0xFF0000,
    10, 0xFF0000, false,
    window.innerWidth, window.innerHeight
);

arr_type_mesher[mesher_idx].setRotationVelocity(Math.random()*0.01 + 0.001);
arr_type_mesher[mesher_idx].mesh.position.y = 50;


//SCENE
scene = new THREE.Scene();
scene.add(camera);
scene.add(ambientLight);
scene.add(pointLight);
scene.add(type_mesher.mesh);

//RENDER LOOP
render();

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);

    type_mesher.updateMesh(window.innerWidth, window.innerHeight );
    type_mesher.updateWireframeScale();

    for(var mesher_idx = 0; mesher_idx < arr_type_mesher.length; mesher_idx++)
    {
        arr_type_mesher[mesher_idx].updateMesh(window.innerWidth, window.innerHeight );
        arr_type_mesher[mesher_idx].updateWireframeScale();
    }
}
