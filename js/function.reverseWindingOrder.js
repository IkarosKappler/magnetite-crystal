/**
 * This function wraps the passed THREE.Mesh/THREE.Object3D inside out.
 **/

function reverseWindingOrder(object3D) {
    // TODO: Something is missing, the objects are flipped alright but the light reflection on them is somehow broken
    if (object3D.type === "Mesh") {
	var geometry = object3D.geometry;
	for (var i = 0, l = geometry.faces.length; i < l; i++) {
	    var face = geometry.faces[i];
	    var temp = face.a;
	    face.a = face.c;
	    face.c = temp;
	}
	
	var faceVertexUvs = geometry.faceVertexUvs[0];
	for (i = 0, l = faceVertexUvs.length; i < l; i++) {
	    var vector2 = faceVertexUvs[i][0];
	    faceVertexUvs[i][0] = faceVertexUvs[i][2];
	    faceVertexUvs[i][2] = vector2;
	}
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();
    }
    
    if (object3D.children) {
	for (var j = 0, jl = object3D.children.length; j < jl; j++) {
	    reverseWindingOrder(object3D.children[j]);
	}
    }
}

function flipMesh( mesh ) {
    // Make a twin crystal.
    //    See 'geometry flipping'
    //    https://stackoverflow.com/questions/19625199/threejs-geometry-flipping
    var twin = new THREE.Mesh();
    var mS   = (new THREE.Matrix4()).identity();
    
    // Set -1 to the corresponding axis
    mS.elements[0] = -1;
    mS.elements[5] = -1;
    mS.elements[10] = -1;
    for( var i in mesh.children ) {
	// twin.children[i].geometry.clone().applyMatrix(mS);
	// transformation
	var geom = mesh.children[i].geometry.clone();
	geom.applyMatrix(mS);
	
	// updates
	geom.verticesNeedUpdate = true;
	geom.normalsNeedUpdate = true;
	geom.computeBoundingSphere();
	geom.computeFaceNormals();
	geom.computeVertexNormals();
	
	var tmp = new THREE.Mesh(geom, new THREE.MeshPhongMaterial( { color : 0xffffff,
								      transparent : mesh.children[i].material.transparent,
								      opacity : mesh.children[i].material.opacity
								    } ) );
	// Reverse the surface 'inside out' if the flip is uneven.
	if( mS.elements[0]*mS.elements[5]*mS.elements[10] == -1 )
	    reverseWindingOrder( tmp );
	
	twin.add( tmp );
    }

    return twin;
}
