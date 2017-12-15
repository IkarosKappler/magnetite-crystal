

// +-------------------------------------------------------------------------
// | This is a helper function that applies mesh rotations to the
// | meshe's vertices.
// +-------------------------------------------------
function applyMeshRotation(mesh,x,y,z) {
    if( typeof x.x != "undefined" ) {
	applyMeshRotation(mesh, x.x, x.y, x.z);
	return;
    }
    mesh.rotation.x = x;
    mesh.rotation.y = y;
    mesh.rotation.z = z;
    mesh.trans
    mesh.updateMatrix(); 
    mesh.geometry.applyMatrix( mesh.matrix );
    mesh.matrix.identity();
    mesh.verticesNeedUpdate = true;
    // Clear the rotation
    mesh.rotation.x = 0;
    mesh.rotation.y = 0;
    mesh.rotation.z = 0;

    for( var i in mesh.children )
	applyMeshRotation( mesh.children[i], x, y, z );
}


// +-------------------------------------------------------------------------
// | This is a helper function that applies translations to the
// | meshe's vertices.
// +-------------------------------------------------
function applyMeshTranslation(mesh,x,y,z) {
    if( typeof x.x != "undefined" ) {
	applyMeshRotation(mesh, x.x, x.y, x.z);
	return;
    } 

    for( i in mesh.geometry.vertices ) {
	mesh.geometry.vertices[i].x += x;
	mesh.geometry.vertices[i].y += y;
	mesh.geometry.vertices[i].z += z;
    }	
    mesh.verticesNeedUpdate = true;

    for( var i in mesh.children )
	applyMeshTranslation( mesh.children[i], x, y, z );
}
