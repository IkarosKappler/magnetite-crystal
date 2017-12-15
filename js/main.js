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
	return new CrystalBuilder('bricks',settings);
    } // END mkCrystal



    // +-------------------------------------------------------------------------
    // | This is the init function.
    // | It is called upon window.load.
    // +-------------------------------------------------
    function init() {
        window.removeEventListener('load',init);

	var settings = {
	    base   : { size : { x : 36, y : 36, z : 36 }, translation : { x : 0, y : 0, z : 0 }, rotation : { x : 0, y : 0, z : 0 }, color : 0x00ff00 },
	    brickA : { size : { x : 14, y : 18, z : 48 }, translation : { x : 0, y : 0, z : 0 }, rotation : { x : 0, y : 0, z : 30 }, color : 0xffff00 },
	    brickB : { size : { x : 14, y : 18, z : 36 }, translation : { x : 0, y : 0, z : 0 }, rotation : { x : 0, y : 0, z : -30 }, color : 0xff0000 },
	    brickC : { size : { x : 42, y : 24, z : 18 }, translation : { x : 0, y : 0, z : 0 }, rotation : { x : 120, y : 0, z : 0 }, color : 0x0088ff },
	    brickD : { size : { x : 14, y : 24, z : 36 }, translation : { x : 0, y : 0, z : 0 }, rotation : { x : -120, y : 0, z : 0 }, color : 0x0000ff },
	    showBricks : false,
	    makeTwin : true,
	    autoRotate : true,
	    rebuild : function() { performCrystalCSG(); }
	};
	console.log( 'getParams=' + JSON.stringify(getParams) );
	if( typeof getParams.autoRotate !== "undefined" ) settings.autoRotate = JSON.parse(getParams.autoRotate);
	if( typeof getParams.makeTwin !== "undefined" )   settings.makeTwin   = JSON.parse(getParams.makeTwin);
	if( typeof getParams.showBricks !== "undefined" ) settings.showBricks = JSON.parse(getParams.showBricks);

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

        // Pick a material, something like MeshBasicMaterial, PhongMaterial, ...
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
        this._render = function( time ) { 
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
        requestAnimationFrame(_self._render);

	
	

	// +-------------------------------------------------------------------------
	// | Initialize dat.gui
	// +-------------------------------------------------
	var updateCrystal = function() { console.log( 'update?' ); };
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
	gui.add( settings, 'makeTwin' ).onChange( performCrystalCSG );
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
	    
	    var crystal = mkCrystal( material, settings );

	    
	    if( settings.makeTwin ) {
		// Make a twin crystal.
		//    See 'geometry flipping'
		//    https://stackoverflow.com/questions/19625199/threejs-geometry-flipping
		var twin = flipMesh(crystal);
		applyMeshRotation( twin, Math.PI/8, Math.PI*(0/180), 0 );
		twin.rotation.set( currentRotation.x, currentRotation.y, currentRotation.z );
		applyMeshTranslation( twin, 0, 3, 0 );
		applyMeshRotation( crystal, -Math.PI/8, Math.PI*(0/180), 0 ); 
		applyMeshTranslation( crystal, 0, -3, 0 );
		twin.scale.set(0.75,0.75,0.75);
		scene.add( twin );
		meshes.push( twin );
	    }
	    
	    
	    // Keep the current rotation
	    crystal.rotation.set( currentRotation.x, currentRotation.y, currentRotation.z );
	    scene.add( crystal );
	    meshes.push( crystal );
	    // Hide overlay
	    document.getElementById('overlay').style.display = 'none';
	};

	// Compute the crystal asynchronously
	window.setTimeout( performCrystalCSG, 100 );
	
    } // END function init

    window.addEventListener('load', init );
})();

