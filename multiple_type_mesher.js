function MultipleTypeMesher(nrows, ncols, geo_string, geo_font, geo_size, geo_thickness, mesh_color, wire_width, wire_color, wire_visible, window_inner_width, window_inner_height, scene) {
    this.nrows = nrows;
    this.ncols = ncols;
    this.ntypes = nrows * ncols;

    this.multiple_type_mesher = new Array();


    for (var row_idx = 0; row_idx < nrows; row_idx++) {
        for (var col_idx = 0; col_idx < ncols; col_idx++) {
            this.multiple_type_mesher[row_idx * ncols + col_idx] = new TypeMesher(
                geo_string, geo_font, geo_size, geo_thickness,
                mesh_color,
                wire_width, wire_color, wire_visible,
                window_inner_width, window_inner_height,
                scene
            );

            if (ncols % 2 == 0) {
                this.multiple_type_mesher[mesher_idx].mesh.position.x = 50 * (mesher_idx % ncols) - 50 * (ncols % 2 - 1) - 25;
            }
            else {
                this.multiple_type_mesher[mesher_idx].mesh.position.x = 50 * (mesher_idx % ncols) - 50 * parseInt(ncols / 2);
            }

            if (nrows % 2 == 0) {
                this.multiple_type_mesher[mesher_idx].mesh.position.x = 50 * (mesher_idx % nrows) - 50 * (nrows % 2 - 1) - 25;
            }
            else {
                this.multiple_type_mesher[mesher_idx].mesh.position.x = 50 * (mesher_idx % nrows) - 50 * parseInt(nrows / 2);
            }
        }
    }
}

TypeMesher.