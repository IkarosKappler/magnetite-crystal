/**
 * Example for creating magnetite crystals wih CSG (constructive solid geometry).
 * 
 * @author  Ikaros Kappler
 * @date    2017-12-10
 * @version 1.0.0
 **/

(function() {
    
    var meshes = [];
    
    // This function builds the crystal
    function mkCrystal( material, settings ) {

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
	    mesh.updateMatrix(); 
	    mesh.geometry.applyMatrix( mesh.matrix );
	    mesh.matrix.identity();
	    mesh.verticesNeedUpdate = true;
	    // Clear the rotation
	    mesh.rotation.x = 0;
	    mesh.rotation.y = 0;
	    mesh.rotation.z = 0;
	}

	// +-------------------------------------------------------------------------
	// | This is a helper function that uses a cube as base.
	// +-------------------------------------------------
	function _useCubeBase() {
	    // var meshBase = new THREE.Mesh( new THREE.CubeGeometry(36, 36, 36 ) );
	    var meshBase = new THREE.Mesh( new THREE.OctahedronGeometry(36,0) );
	    var bspBase = new ThreeBSP( meshBase );
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
	    
	    return mesh;
	} // END _useCubeBase

	
	// +-------------------------------------------------------------------------
	// | This is a helper function that uses bricks for intersection.
	// +-------------------------------------------------
	function _useBricks() {
	    var DEG_TO_RAD = Math.PI*2;
	    function makeBrickMesh( brickSettings, color ) {
		var brick = new THREE.Mesh( new THREE.CubeGeometry(brickSettings.size.x,
								   brickSettings.size.y,
								   brickSettings.size.z),
					    new THREE.MeshPhongMaterial( { color : color, transparent : true, opacity : 0.5 } ) );
		return brick;
	    }
	    var meshBrickA = makeBrickMesh( settings.brickA, 0x0000ff );
	    var meshBrickB = makeBrickMesh( settings.brickB, 0x0000ff );
	    var meshBrickC = makeBrickMesh( settings.brickC, 0x0000ff );
	    var meshBrickD = makeBrickMesh( settings.brickD, 0x0000ff );
	    applyMeshRotation( meshBrickA, settings.brickA.rotation );
	    applyMeshRotation( meshBrickB, settings.brickB.rotation );
	    applyMeshRotation( meshBrickC, settings.brickC.rotation );
	    applyMeshRotation( meshBrickD, settings.brickD.rotation );
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

	    var bspIntersection = bspBrickA;
	    bspIntersection = _applyIntersectWithDiff( bspIntersection, 0xff0000, bspBrickB, 0x0088ff,
						       function( difA, difB ) { if( !settings.showBricks ) return; mesh.add(difA); mesh.add(difB); }
						     );
	    bspIntersection = _applyIntersectWithDiff( bspIntersection, 0xff0000, bspBrickC, 0x0088ff,
						       function( difA, difB ) { if( !settings.showBricks ) return; mesh.add(difA); mesh.add(difB); }
						     );
	    mesh.add( bspIntersection.toMesh( new THREE.MeshPhongMaterial( { color : 0x00ff00 } ) ) );
	    return mesh;
	} // END _useCubeBase

	return _useBricks();
    } // END mkCrystal

    function init() {
        window.removeEventListener('load',init);

	var settings = {
	    brickA : { size : { x : 18, y : 36, z : 42 }, translation : { x : 0, y : 0, z : 0 }, rotation : { x : 0, y : 120, z : 0 } },
	    brickB : { size : { x : 36, y : 18, z : 36 }, translation : { x : 0, y : 0, z : 0 }, rotation : { x : 0, y : -120, z : 0 } },
	    brickC : { size : { x : 36, y : 36, z : 18 }, translation : { x : 0, y : 0, z : 0 }, rotation : { x : 120, y : 0, z : 0 } },
	    brickD : { size : { x : 18, y : 36, z : 36 }, translation : { x : 0, y : 0, z : 0 }, rotation : { x : -120, y : 0, z : 0 } },
	    showBricks : true,
	    autoRotate : true,
	    rebuild : function() { performCrystalCSG(); }
	};

        // Create new scene
        this.scene = new THREE.Scene(); 

        // Create a camera to look through
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000); 

        // Initialize a new THREE renderer (you are also allowed 
        // to pass an existing canvas for rendering).
        this.renderer = new THREE.WebGLRenderer( { antialias : true } ); 
        this.renderer.setSize( window.innerWidth, 
			       window.innerHeight
			     ); 

        // ... and append it to the DOM
        document.body.appendChild(renderer.domElement); 


        // Create a geometry conaining the logical 3D information (here: a cube)
        var geometry = new THREE.CubeGeometry(12,12,12); 

        // Pick a material, something like MeshBasicMaterial, PhongMaterial, 
        var material = new THREE.MeshPhongMaterial({color: 0x00ff00}); 
        
        // Create the cube from the geometry and the material ...
        //var cube = new THREE.Mesh(geometry, material); 

        // ... and add it to your scene.
        //this.scene.add(cube);

	// In this version the voxel torus is generates asynchronously. Look below.

        // Add some light
        this.pointLight = new THREE.PointLight(0xFFFFFF);

        // add to the scene
        this.scene.add( this.pointLight );

        // Add grid helper
        var gridHelper = new THREE.GridHelper( 90, 9 );
        gridHelper.colorGrid = 0xE8E8E8;
        this.scene.add( gridHelper );


        // Add an axis helper
        var ah                  = new THREE.AxesHelper(50);
        ah.position.y -= 0.1;  // The axis helper should not intefere with the grid helper
        this.scene.add( ah );


        // Set the camera position
        this.camera.position.set( 35, 35, 35 );
        // And look at the cube again
        this.camera.lookAt( new THREE.Vector3(0,0,0) ); 
	this.camera.add( this.pointLight );
	// Add the camera to the scene, too (it contains the lighting)
	this.scene.add( this.camera );


        // Finally we want to be able to rotate the whole scene with the mouse: 
        // add an orbit control helper.
        var _self = this;
        this.orbitControls = new THREE.OrbitControls( this.camera, this.renderer.domElement ); 
        this.orbitControls.enableDamping = true;
        this.orbitControls.dampingFactor = 1.0;
        this.orbitControls.enableZoom    = true;
        this.orbitControls.target.copy( new THREE.Vector3(0,0,0) );



        // This is the basic render function. It will be called perpetual, again and again,
        // depending on your machines possible frame rate.
        var _self = this;  // workaround for the Safari requestAnimationFrame bug.
        this._render = function ( time ) { 
            // Pass the render function itself
            requestAnimationFrame(_self._render); 
            
            // Let's animate the elements: a rotation.
	    if( settings.autoRotate ) {
		for( i in meshes ) {
		    meshes[i].rotation.x += 0.02; 
		    meshes[i].rotation.y += 0.01;
		}
	    }

            _self.renderer.render(_self.scene, _self.camera); 
        }; 
        // Call the rendering function. This will cause and infinite recursion (we want 
        // that here, because the animation shall run forever).
        //this._render();
        requestAnimationFrame(_self._render);

	

	// +-------------------------------------------------------------------------
	// | Initialize dat.gui
	// +-------------------------------------------------
	var updateCrystal = function() {
	    console.log( 'update ...' );

	    
	};
	var gui = new dat.GUI();
	function addBrickFolder(brick,name) {
	    var folder = gui.addFolder(name);
	    function addSubFolder( triple, name, min, max ) {
		var subfolder = folder.addFolder(name);
		subfolder.add( triple, 'x' ).min(min).max(max).onChange( updateCrystal );
		subfolder.add( triple, 'y' ).min(min).max(max).onChange( updateCrystal );
		subfolder.add( triple, 'z' ).min(min).max(max).onChange( updateCrystal );
	    }
	    addSubFolder( brick.size, 'Size' );
	    addSubFolder( brick.translation, 'Translation' );
	    addSubFolder( brick.rotation, 'Rotation' );
	}
	addBrickFolder(settings.brickA,'Brick A');
	addBrickFolder(settings.brickB,'Brick B');
	addBrickFolder(settings.brickC,'Brick C');
	addBrickFolder(settings.brickD,'Brick D');

	gui.add( settings, 'showBricks' ).onChange( performCrystalCSG );
	gui.add( settings, 'autoRotate' );
	gui.add( settings, 'rebuild' );


	// +-------------------------------------------------------------------------
	// | Clear all meshes from the scene (keep camera, lights, grid, axes helper, ...)
	// +-------------------------------------------------
	function removeMeshes() {
	    var rotation = null;
	    if( meshes.length == 0 ) rotation = { x : 0, y : 0, z : 0 };
	    else                     rotation = meshes[0].rotation.clone();
	    for( i in meshes ) {
		scene.remove( meshes[i] );
	    }
	    meshes = [];
	    return rotation;
	}

	
	// +-------------------------------------------------------------------------
	// | Perform the actual CSG.
	// +-------------------------------------------------
	function performCrystalCSG() {
	    var currentRotation = removeMeshes();
	    console.log( 'currentRotation=' + currentRotation );
	    // Use single color for all voxels or randomize?
	    var material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
	    //var domEvents = new THREEx.DomEvents(this.camera, this.renderer.domElement);
	    
	    // Compute the crystal asynchronously
	    var crystal = mkCrystal( material, settings );
	    crystal.rotation.set( currentRotation.x, currentRotation.y, currentRotation.z );
	    scene.add( crystal );
	    meshes.push( crystal );
	    // Hide overlay
	    document.getElementById('overlay').style.display = 'none';
	};
	// new THREE.TextureLoader().load( 'square-gradient.png',
	window.setTimeout( performCrystalCSG, 100 );
	
    } // END function init

    window.addEventListener('load', init );
})();

