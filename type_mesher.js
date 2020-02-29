function TypeMesher(geo_string, geo_font, geo_size, geo_thickness, mesh_color, wire_width, wire_color, wire_visible, window_inner_width, window_inner_height)
{
    // set variables
    this.geo_string = geo_string;
    //this.geo_font = geo_font;
    this.geo_font = geo_font;
    this.geo_size = geo_size;
    this.geo_thickness = geo_thickness;
    this.mesh_color = mesh_color;
    this.wire_width = wire_width;
    this.wire_color = wire_color;
    this.wire_scale_factor = 1.0;
    this.wire_visible = wire_visible;

    this.incremental_unit_scale_factor = 0.25;
    this.incremental_direction = 1.0;
    this.max_scale_factor = 50.0;
    this.min_scale_factor = 1.0;
    this.window_inner_width = window_inner_width;
    this.window_inner_height = window_inner_height;

    this.rotation_speed = 0.005;
    this.position = new THREE.Vector3();
    this.rotation = new THREE.Euler();

    // make geometry
    this.geometry = new THREE.TextGeometry(this.geo_string,
        {
            font: this.geo_font, size: this.geo_size, height: this.geo_thickness, material: 0, 
            bevelEnabled: false, bevelThickness: 0, bevelSize: 0, extrudeMaterial: 1
        });
    this.geometry.center(); // move the geometry to center
    
    //make material and mesh
    this.material = new THREE.MeshLambertMaterial({ color: this.mesh_color, wireframe: false });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.position.copy(this.mesh.position); //this.position = this.mesh.position does not work
    this.rotation.copy(this.mesh.rotation); //position and rotation are object so we need a deep copy not shallow copy


    //make wire frame
    this.geo_edge = new THREE.EdgesGeometry(this.geometry);
    this.geo_wire = new THREE.LineSegmentsGeometry().fromEdgesGeometry(this.geo_edge);
    this.mat_wire = new THREE.LineMaterial({
        color: this.wire_color,
        linewidth: this.wire_width, // in pixels
        dashed: false
    });
    this.mat_wire.resolution.set( this.window_inner_width , this.window_inner_height);
    this.wire_mesh = new THREE.LineSegments2(this.geo_wire, this.mat_wire);
    this.wire_mesh.scale.set(1.0, 1.0, 1.0);
    this.wire_mesh.renderOrder = 1;
    this.wire_mesh.visible = this.wire_visible;

    this.mesh.add(this.wire_mesh);
}


//Text
TypeMesher.prototype.deleteAll = function()
{
    this.position.copy(this.mesh.position); //this.position = this.mesh.position does not work
    this.rotation.copy(this.mesh.rotation); //position and rotation are object so we need a deep copy not shallow copy

    delete this.geometry;
    // we don't need to make a new instance for material
    //delete this.material;
    delete this.mesh;
    
    delete this.geo_edge;
    delete this.geo_wire;
    // we don't need to make a new instance for material
    //delete this.mat_wire;
    delete this.wire_mesh;
}

TypeMesher.prototype.remakeAll = function () 
{
    // make geometry
    this.geometry = new THREE.TextGeometry(this.geo_string,
        {
            font: this.geo_font, size: this.geo_size, height: this.geo_thickness, material: 0, 
            bevelEnabled: false, bevelThickness: 0, bevelSize: 0, extrudeMaterial: 1
        });
    this.geometry.center(); // move the geometry to center
    
    //make material and mesh
    // we don't need to make a new instance for material
    //this.material = new THREE.MeshLambertMaterial({ color: this.mesh_color, wireframe: false });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.geometry = this.geometry;

    //make wire frame
    this.geo_edge = new THREE.EdgesGeometry(this.geometry);
    this.geo_wire = new THREE.LineSegmentsGeometry().fromEdgesGeometry(this.geo_edge);
    // we don't need to make a new instance for material
    // this.mat_wire = new THREE.LineMaterial({
    //     color: this.wire_color,
    //     linewidth: this.wire_width, // in pixels
    //     dashed: false
    // });
    // this.mat_wire.resolution.set( this.window_inner_width , this.window_inner_height);
    this.wire_mesh = new THREE.LineSegments2(this.geo_wire, this.mat_wire);
    this.wire_mesh.scale.set(1.0, 1.0, 1.0);
    this.wire_mesh.renderOrder = 1;
    this.wire_mesh.visible = this.wire_visible;

    this.mesh.add(this.wire_mesh);

    this.mesh.position.copy(this.position); //this.position = this.mesh.position does not work
    this.mesh.rotation.copy(this.rotation); //position and rotation are object so we need a deep copy not shallow copy
}

TypeMesher.prototype.changeText = function(string)
{
    this.geo_string = string;
    this.deleteAll();
    this.remakeAll();
}

TypeMesher.prototype.changeTextSize = function(size)
{
    this.geo_size = size;
    this.deleteAll();
    this.remakeAll();
}

TypeMesher.prototype.changeThickness = function(thickness)
{
    this.geo_thickness = thickness;
    this.deleteAll();
    this.remakeAll();
}

TypeMesher.prototype.changeTextColor = function(color)
{
    this.mesh.material.color.setHex(color);
}

TypeMesher.prototype.changeWireframeColor = function(color)
{
    this.wire_mesh.material.color.setHex(color);
}


//wireframe
TypeMesher.prototype.setWireFrameVisibility = function(visible)
{
    this.wire_mesh.visible = visible;
    this.wire_visible = visible;

    if(visible == false) {
        this.initializeChangingWireframeScale()
    }
}

TypeMesher.prototype.initializeChangingWireframeScale = function()
{
    this.wire_scale_factor = 1.0;
    this.incremental_direction = 1.0;
}

TypeMesher.prototype.updateWireframeScale = function () 
{
    if (this.wire_visible == false) {
        return;
    }

    this.wire_scale_factor += this.incremental_direction * this.incremental_unit_scale_factor;
    if (this.wire_scale_factor > this.max_scale_factor) {
        this.wire_scale_factor = this.max_scale_factor;
        this.incremental_direction = -1.0;
    }
    else if (this.wire_scale_factor < this.min_scale_factor) {
        this.wire_scale_factor = this.min_scale_factor;
        this.incremental_direction = 1.0;
    }
    this.wire_mesh.scale.set(this.wire_scale_factor, this.wire_scale_factor, this.wire_scale_factor);
}

TypeMesher.prototype.updateMesh = function(window_inner_width, window_inner_height)
{
    this.mesh.rotation.x += this.rotation_speed;
    this.mesh.rotation.y += this.rotation_speed;

    this.mat_wire.resolution.set(window_inner_width, window_inner_height);
}
//Animal.prototype.bark = function(cry) {
//    console.log(this.animal + " : " + cry);
//  };