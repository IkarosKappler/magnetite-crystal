/**
 * A wrapper class for the crystal construction functions (moved from main.js to 
 * keep the code managable.
 * 
 * @author  Ikaros Kappler
 * @date    2017-12-15
 * @version 1.0.0
 **/

var CrystalBuilder = function() {
    
    // +-------------------------------------------------------------------------
    // | This is a helper function that uses a cube as base.
    // +-------------------------------------------------
    function useOctahedron( material ) {
	var meshBase = new THREE.Mesh( new THREE.OctahedronGeometry(6,0), material );
	/*var bspBase = new ThreeBSP( meshBase );
	var meshCubeA = new THREE.Mesh( new THREE.CubeGeometry(36, 36, 36), new THREE.MeshPhongMaterial( { color : 0x0088ff, transparent : true, opacity : 0.5 } ) );
	var meshCubeB = new THREE.Mesh( new THREE.CubeGeometry(36, 36, 36), new THREE.MeshPhongMaterial( { color : 0xff0000, transparent : true, opacity : 0.5 } ) );
	applyMeshRotation(meshBase,0,Math.PI/4,0);
	var bspCubeA = new ThreeBSP( meshCubeA );
	var bspCubeB = new ThreeBSP( meshCubeB );

	var mesh = new THREE.Mesh();
	
	var intersectionA = bspBase.intersect( bspCubeA );
	var meshIntersectionA = intersectionA.toMesh( material );
	meshIntersectionA.geometry.computeVertexNormals();

	var differenceA = bspCubeA.subtract( bspBase );
	var differenceB = bspBase.subtract( bspCubeA );
	var meshDifferenceA = differenceA.toMesh( new THREE.MeshPhongMaterial( { color : 0xff0000, transparent : true, opacity : 0.5 } ) );
	meshDifferenceA.geometry.computeVertexNormals();
	var meshDifferenceB = differenceB.toMesh( new THREE.MeshPhongMaterial( { color : 0x0088ff, transparent : true, opacity : 0.5 } ) );
	meshDifferenceB.geometry.computeVertexNormals();

	mesh.add( meshIntersectionA );
	
	mesh.add( meshDifferenceA );
	mesh.add( meshDifferenceB );
	*/
	var mesh = meshBase;
	
	return mesh;
    } // END useOctahedron
    

    
    // +-------------------------------------------------------------------------
    // | This is a helper function that uses bricks for intersection.
    // +-------------------------------------------------
    function useBricks( settings ) {
	//var DEG_TO_RAD = Math.PI*2;
	function makeBrickMesh( brickSettings, color ) {
	    var brick = new THREE.Mesh( new THREE.CubeGeometry(brickSettings.size.x,
							       brickSettings.size.y,
							       brickSettings.size.z),
					new THREE.MeshPhongMaterial( { color : color, transparent : true, opacity : 0.5 } ) );
	    return brick;
	}
	var meshBase   = makeBrickMesh( settings.base,   settings.base.color );
	var meshBrickA = makeBrickMesh( settings.brickA, settings.brickA.color );
	var meshBrickB = makeBrickMesh( settings.brickB, settings.brickB.color );
	var meshBrickC = makeBrickMesh( settings.brickC, settings.brickC.color );
	var meshBrickD = makeBrickMesh( settings.brickD, settings.brickD.color );
	applyMeshRotation( meshBase, deg2rad(settings.base.rotation) );
	applyMeshRotation( meshBrickA, deg2rad(settings.brickA.rotation) );
	applyMeshRotation( meshBrickB, deg2rad(settings.brickB.rotation) );
	applyMeshRotation( meshBrickC, deg2rad(settings.brickC.rotation) );
	applyMeshRotation( meshBrickD, deg2rad(settings.brickD.rotation) );
	applyMeshTranslation( meshBase, settings.base.translation );
	applyMeshTranslation( meshBrickA, settings.brickA.translation );
	applyMeshTranslation( meshBrickB, settings.brickB.translation );
	applyMeshTranslation( meshBrickC, settings.brickC.translation );
	applyMeshTranslation( meshBrickD, settings.brickD.translation );
	var bspBase   = new ThreeBSP( meshBase );
	var bspBrickA = new ThreeBSP( meshBrickA );
	var bspBrickB = new ThreeBSP( meshBrickB );
	var bspBrickC = new ThreeBSP( meshBrickC );
	var bspBrickD = new ThreeBSP( meshBrickD );

	var mesh = new THREE.Mesh();

	function _applyIntersectWithDiff( bspBase, colorBase, bspSub, colorSub, callback ) {
	    var bspIntersection  = bspBase.intersect( bspSub );
	    var bspDiffBase      = bspBase.subtract( bspSub );
	    var bspDiffSub       = bspSub.subtract( bspBase );
	    var meshDiffBase     = bspDiffBase.toMesh( new THREE.MeshPhongMaterial( { color : colorBase,  transparent : true, opacity : 0.5 } ) );
	    var meshDiffSub      = bspDiffSub.toMesh( new THREE.MeshPhongMaterial( { color : colorSub,  transparent : true, opacity : 0.5 } ) );
	    callback( meshDiffBase, meshDiffSub );

	    return bspIntersection;
	}

	var bspIntersection = bspBase;
	bspIntersection = _applyIntersectWithDiff( bspIntersection, settings.base.color,
						   bspBrickA, settings.brickA.color,
						   function( difBase, difA ) { if( !settings.showBricks ) return; mesh.add(difA); }
						 );
	bspIntersection = _applyIntersectWithDiff( bspIntersection, settings.base.color,
						   bspBrickB, settings.brickB.color,
						   function( difBase, difB ) { if( !settings.showBricks ) return; mesh.add(difBase); mesh.add(difB); }
						 );	
	bspIntersection = _applyIntersectWithDiff( bspIntersection, settings.base.color,
						   bspBrickC, settings.brickC.color,
						   function( difBase, difC ) { if( !settings.showBricks ) return; mesh.add(difBase); mesh.add(difC); }
						 );
	
	bspIntersection = _applyIntersectWithDiff( bspIntersection, settings.base.color,
						   bspBrickD, settings.brickD.color,
						   function( difBase, difD ) { if( !settings.showBricks ) return; mesh.add(difBase); mesh.add(difD); }
						 );
	
	mesh.add( bspIntersection.toMesh( new THREE.MeshPhongMaterial( { color : 0x00ff00 } ) ) );
	return mesh;
    } // END useBricks

    
    return function( type, settings, material ) {
	switch( type ) {
	case 'octahedron' : return useOctahedron(material); break;
	case 'bricks': return useBricks( settings ); break;
	default: throw "Unrecognized crystal construction type: " + type + ".";
	}
    }
}();
