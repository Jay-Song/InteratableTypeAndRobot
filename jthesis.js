
// import * as THREE from './js/build/three.module.js';
// import { Line2 } from './js/lines/Line2.js';
// import { LineMaterial } from './js/lines/LineMaterial.js';
// import { LineGeometry } from './js/lines/LineGeometry.js';
// import { GeometryUtils } from './js/utils/GeometryUtils.js';


var renderer,
    scene,
    camera,
    myCanvas = document.getElementById('myCanvas');

//var textBox;

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
    //wireframe_color: 0xFF0000,
    fontSize: 12,
    fontThickness: 10
}
const gui = new dat.GUI();
var current_string = "hello"
var new_string = "hello"
gui.add(params, "textField").onFinishChange(function (value) {
    //Do something with the new value
    new_string = value;
});
var current_color = 0xFF0000;// = "#FF0000";// = 0xFF0000;
var new_color = 0xFF0000;//"#FF0000";// = 0xFF0000;
gui.addColor(params, "color").onFinishChange(function (value) {
    new_color = value;
});

//var current_wire_color = 0xFF0000;// = "#FF0000";// = 0xFF0000;
//var new_wire_color = 0xFF0000;//"#FF0000";// = 0xFF0000;
//gui.addColor(params, "wireframe_color").onFinishChange(function (value) {
//new_wire_color = value;
//});

//font size
var current_size = 12;
var new_size = 12;//"#FF0000";// = 0xFF0000;
gui.add(params, "fontSize", 12, 150, 1).onChange(function (value) {
    new_size = value;
});

//height
var current_height = 10;
var new_height = 10;
gui.add(params, "fontThickness", 10, 100, 1).onChange(function (value1) {
    new_height = value1;
});

var wirefrme_display_onoff = false;
var scale_factor = 1;
var max_scale_factor = 50;
var incremental_unit_scale_factor = 0.5;
var incremental_time_for_scale = 2;
var incremental_time_count = 0;
var wireframe_btn_obj = {
    wireframe: function () {
        if (wirefrme_display_onoff == true) {
            incremental_time_count = 0;
            scale_factor = 1;
            incremental_unit_scale_factor = 0.5;
            wirefrme_display_onoff = false;
            console.log("W Off");
        }
        else {
            wirefrme_display_onoff = true;
            console.log("W On");
        }
    }
};
gui.add(wireframe_btn_obj, 'wireframe');

//CAMERA
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 7000);

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

//OBJECT
var loader = new THREE.FontLoader();
let font = loader.parse(fontJSON);
var is_wire_frame = false;

var geometry = new THREE.TextGeometry(current_string,
    {
        font: font, size: current_size, height: 10, material: 0, bevelEnabled: true, bevelThickness: 0, bevelSize: 0, extrudeMaterial: 1, curveSegments: 10
    });  //TextGeometry(text, parameters)
geometry.center();
var material = new THREE.MeshLambertMaterial({ color: current_color, wireframe: is_wire_frame });
var mesh = new THREE.Mesh(geometry, material);
mesh.position.z = -100;

scene.add(mesh);

//wire frame
// var geoLine = new THREE.EdgesGeometry(geometry);
// var mat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 100 });
// var wireframe = new THREE.LineSegments(geoLine, mat);
// wireframe.scale.set(scale_factor, scale_factor, scale_factor);
// wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
// scene.add(wireframe);

var geoEdge = new THREE.EdgesGeometry( geometry );
var geoLine = new THREE.LineSegmentsGeometry().fromEdgesGeometry( geoEdge );
var matLine = new THREE.LineMaterial( {
    color: current_color,
    linewidth: 5, // in pixels
    dashed: false
} );

var wireframe = new THREE.LineSegments2( geoLine, matLine );
wireframe.scale.set(scale_factor, scale_factor, scale_factor);
wireframe.scale.set(1.5, 1.5, 1.5);
wireframe.renderOrder = 1;
//wire.visible = false;
//mesh.add(wireframe);



// var geoLine = new THREE.WireframeGeometry2( geometry );

// var matLine = new THREE.LineMaterial( {

//     color: 0x4080ff,
//     linewidth: 1, // in pixels
//     //resolution:  // to be set by renderer, eventually
//     dashed: false

// } );

// var wireframe = new THREE.Wireframe( geoLine, matLine );
// wireframe.computeLineDistances();
// wireframe.scale.set( 0.01, 0.01, 0.01 );
// scene.add( wireframe );

// var resolution = new THREE.Vector2( window.innerWidth, window.innerHeight ); 
// var geoLine = new MeshLine();
// geoLine.setGeometry( geo );

// var matLine = new MeshLineMaterial( {
//     useMap: false,
//     color: 0xffffff,
//     opacity: 1,
//     resolution: resolution,
//     sizeAttenuation: !false,
//     lineWidth: 1,
//     near: camera.near,
//     far: camera.far
// });
// var wireframe = new THREE.Mesh( geoLine.geometry, material );
// scene.add( wireframe );


var delta = 0;
camera.position.z = 5;




//RENDER LOOP
render();

function render() {
    //ROTATION
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.005;

    //delta += 0.1;
    //geometry.vertices[0].x = -25 + Math.sin(delta) * 50;
    //geometry.verticesNeedUpdate = true;

    //camera.position.set(30,0,0);
    //camera.up = new THREE.Vector3(0,0,1);
    //delta = delta + delta;
    //camera.lookAt(new THREE.Vector3(0,delta,0))
    renderer.render(scene, camera);
    matLine.resolution.set( window.innerWidth, window.innerHeight );
    requestAnimationFrame(render);

    //console.log(new_color);
    if ((current_string != new_string) || (current_color != new_color)
        || (current_size != new_size) || (current_height != new_height)) 
    {
        current_string = new_string;
        current_color = new_color;
        current_size = new_size;
        current_height = new_height;
        //current_wire_color = new_wire_color;
        delete geometry;
        delete mesh;
        delete material;

        // remove all the children in scene
        while (scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }

        // add again children to scene
        scene.add(camera);
        scene.add(ambientLight);
        scene.add(pointLight);

        geometry = new THREE.TextGeometry(current_string,
            {
                font: font, size: current_size, height: current_height, material: 0, bevelThickness: 1, extrudeMaterial: 1
            });

        geometry.center();
        material = new THREE.MeshLambertMaterial({ color: current_color, wireframe: is_wire_frame });

        mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = -100;
        scene.add(mesh);


        delete geoEdge;
        delete geoLine;
        delete matLine;
        delete wireframe;

        geoEdge = new THREE.EdgesGeometry(geometry);
        geoLine = new THREE.LineSegmentsGeometry().fromEdgesGeometry(geoEdge);
        matLine = new THREE.LineMaterial({
            color: current_color,
            linewidth: 5, // in pixels
            dashed: false
        });

        wireframe = new THREE.LineSegments2(geoLine, matLine);
        wireframe.scale.set(scale_factor, scale_factor, scale_factor);
        wireframe.renderOrder = 1;
    }



    if (wirefrme_display_onoff == true) {
        if (incremental_time_count == 0) { 
            wireframe.scale.set(scale_factor, scale_factor, scale_factor);
            mesh.add(wireframe);
        }

        incremental_time_count++;

        if (incremental_time_count == incremental_time_for_scale) {
            mesh.remove(wireframe);
            scale_factor += incremental_unit_scale_factor;
            incremental_time_count = 0;
            if (scale_factor > max_scale_factor) {
                scale_factor = max_scale_factor;
                incremental_unit_scale_factor *= -1.0;
                wireframe.scale.set(scale_factor, scale_factor, scale_factor);
                mesh.add(wireframe);
            }
            else if (scale_factor < 1.0) {
                scale_factor = 1.0;
                incremental_unit_scale_factor *= -1.0;
                wireframe.scale.set(scale_factor, scale_factor, scale_factor);
                mesh.add(wireframe);
            }
        }
    }
    else {
        mesh.remove(wireframe);
    }

}
