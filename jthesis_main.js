var renderer,
    scene,
    camera,
    type_mesher,
    myCanvas = document.getElementById('myCanvas');

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
});

//GUI font size
gui.add(params, "fontSize", 12, 150, 1).onChange(function (value) {
    scene.remove(type_mesher.mesh);
    type_mesher.changeTextSize(value);
    scene.add(type_mesher.mesh);
});

//GUI height
gui.add(params, "fontThickness", 10, 100, 1).onChange(function (value) {
    scene.remove(type_mesher.mesh);
    type_mesher.changeThickness(value);
    scene.add(type_mesher.mesh);
});

//GUI COLOR
gui.addColor(params, "color").onFinishChange(function (value) {
    type_mesher.changeTextColor(value);
    type_mesher.changeWireframeColor(value);
});

//GUI wire frame: change visibility
// var wireframe_btn_obj = {
//     wireframe: function () {
//         if (type_mesher.wire_visible == true) {
//             type_mesher.setWireFrameVisibility(false);
//             console.log("W Off");
//         }
//         else {
//             type_mesher.initializeChangingWireframeScale();
//             type_mesher.setWireFrameVisibility(true);
//             console.log("W On");
//         }
//     }
// };
// gui.add(wireframe_btn_obj, 'wireframe');

//GUI wirefram
gui.add(params, "wireframe").onChange(function (value){ 
    type_mesher.setWireFrameVisibility(value);
});

//GUI multiple
gui.add(params, "multiple").onChange(function (value){ 
    
});
//CAMERA
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 7000);
camera.position.z = 100;


//SCENE
scene = new THREE.Scene();
scene.add(camera);


//LIGHTS
var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

var pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(25, 50, 25);
scene.add(pointLight);


//CONTROLS
controls = new THREE.OrbitControls(camera, renderer.domElement);


//load font
var loader = new THREE.FontLoader();
var font = loader.parse(fontJSON);


//OBJECT
type_mesher = new TypeMesher(
    "hello", font, 12, 10,
    0xFF0000,
    10, 0xFF0000,
    window.innerWidth, window.innerHeight
);

type_mesher.setWireFrameVisibility(false);
scene.add(type_mesher.mesh);

//RENDER LOOP
render();

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);

    type_mesher.updateMesh(window.innerWidth, window.innerHeight );
    type_mesher.updateWireframeScale();
}
