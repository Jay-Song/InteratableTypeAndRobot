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

    for (var mesher_idx = 0; mesher_idx < 2; mesher_idx++) {
        scene.remove(arr_type_mesher[mesher_idx].mesh);
        arr_type_mesher[mesher_idx].changeText(value);
        scene.add(arr_type_mesher[mesher_idx].mesh);
    }
});

//GUI font size: changing geometry is required so removing and adding are necessary
gui.add(params, "fontSize", 12, 150, 1).onChange(function (value) {
    scene.remove(type_mesher.mesh);
    type_mesher.changeTextSize(value);
    scene.add(type_mesher.mesh);

    for (var mesher_idx = 0; mesher_idx < 2; mesher_idx++) {
        scene.remove(arr_type_mesher[mesher_idx].mesh);
        arr_type_mesher[mesher_idx].changeTextSize(value);
        scene.add(arr_type_mesher[mesher_idx].mesh);
    }
});

//GUI height: changing geometry is required so removing and adding are necessary
gui.add(params, "fontThickness", 10, 100, 1).onChange(function (value) {
    scene.remove(type_mesher.mesh);
    type_mesher.changeThickness(value);
    scene.add(type_mesher.mesh);

    for (var mesher_idx = 0; mesher_idx < 2; mesher_idx++) {
        scene.remove(arr_type_mesher[mesher_idx].mesh);
        arr_type_mesher[mesher_idx].changeThickness(value);
        scene.add(arr_type_mesher[mesher_idx].mesh);
    }
});

//GUI COLOR
gui.addColor(params, "color").onFinishChange(function (value) {
    type_mesher.changeTextColor(value);
    type_mesher.changeWireframeColor(value);

    for (var mesher_idx = 0; mesher_idx < 2; mesher_idx++) {
        arr_type_mesher[mesher_idx].changeTextColor(value);
        arr_type_mesher[mesher_idx].changeWireframeColor(value);
    }
});

//GUI wireframe
gui.add(params, "wireframe").onChange(function (value){ 
    type_mesher.setWireFrameVisibility(value);

    for (var mesher_idx = 0; mesher_idx < 2; mesher_idx++) {
        arr_type_mesher[mesher_idx].setWireFrameVisibility(value);
    }

});

//GUI multiple
gui.add(params, "multiple").onChange(function (value){ 
    if (value) {
        for (var mesher_idx = 0; mesher_idx < 2; mesher_idx++) {
            scene.add(arr_type_mesher[mesher_idx].mesh);
        }
    }
    else {
        for (var mesher_idx = 0; mesher_idx < 2; mesher_idx++) {
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

//MULTIPLE OBJECT
for(var mesher_idx = 0; mesher_idx < arr_type_mesher.length; mesher_idx++)
{
    arr_type_mesher[mesher_idx] = new TypeMesher(
        "hello", font, 12, 10,
        0xFF0000,
        10, 0xFF0000, false,
        window.innerWidth, window.innerHeight
    );
}

arr_type_mesher[0].mesh.position.x = 50;
arr_type_mesher[1].mesh.position.x = -50;

//type_mesher.setWireFrameVisibility(false);

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
