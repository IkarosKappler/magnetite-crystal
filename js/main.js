/**
 * Example for creating magnetite crystals wih CSG (constructive solid geometry).
 * 
 * @author  Ikaros Kappler
 * @date    2017-12-10
 * @version 1.0.0
 **/

(function() {

    var meshes = [];
    
    // This function builds the voxels
    function mkCrystal( material, elementAdded ) {

	/*
	var cube_geometry = new THREE.CubeGeometry( 12*3, 12*3, 12*3 );
	var cube_mesh = new THREE.Mesh( cube_geometry );
	cube_mesh.position.x = -7;
	var cube_bsp = new ThreeBSP( cube_mesh );
	var sphere_geometry = new THREE.SphereGeometry( 12*1.8, 32, 32 );
	var sphere_mesh = new THREE.Mesh( sphere_geometry );
	sphere_mesh.position.x = -7;
	var sphere_bsp = new ThreeBSP( sphere_mesh );
	
	var subtract_bsp = cube_bsp.subtract( sphere_bsp );
	var result = subtract_bsp.toMesh( new THREE.MeshLambertMaterial({
	    shading: THREE.SmoothShading
	    //map: new THREE.TextureLoader().load('texture.png')
	}));
	result.geometry.computeVertexNormals();
	*/

	var meshCubeA = new THREE.Mesh( new THREE.CubeGeometry(36, 36, 36 ) );
	//meshCubeA.position.x = -7;
	var bspCubeA = new ThreeBSP( meshCubeA );
	var meshCubeB = new THREE.Mesh( new THREE.CubeGeometry(36, 36, 36), new THREE.MeshPhongMaterial( { color : 0xff0000, transparent : true, opacity : 0.5 } ) );
	//meshCubeB.position.x = -7;
	//meshCubeB.rotation.x = Math.PI/4;
	meshCubeB.rotation.y = Math.PI/4;
	meshCubeB.updateMatrix(); 
	meshCubeB.geometry.applyMatrix( meshCubeB.matrix );
	meshCubeB.matrix.identity();
	//meshCubeB.matrixAutoUpdate = false;
	//meshCubeB.verticesNeedUpdate = true;
	meshCubeB.rotation.x = 0;
	meshCubeB.rotation.y = 0; 
	var bspCubeB = new ThreeBSP( meshCubeB );

	var mesh = new THREE.Mesh();
	
	var intersectionA = bspCubeA.intersect( bspCubeB );
	var meshIntersectionA = intersectionA.toMesh( material );
	meshIntersectionA.geometry.computeVertexNormals();

	var differenceA = bspCubeB.subtract( bspCubeA );
	var meshDifferenceA = differenceA.toMesh( new THREE.MeshPhongMaterial( { color : 0xff0000, transparent : true, opacity : 0.5 } ) );
	meshDifferenceA.geometry.computeVertexNormals();

	
	//elementAdded(meshCubeB);
	mesh.add( meshIntersectionA );
	mesh.add( meshDifferenceA );
	
	return mesh; // result;
    }

    function init() {
        window.removeEventListener('load',init);

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
        this.orbitControls.target.copy( new THREE.Vector3(0,0,0) ); // cube.position );  



        // This is the basic render function. It will be called perpetual, again and again,
        // depending on your machines possible frame rate.
        var _self = this;  // workaround for the Safari requestAnimationFrame bug.
        this._render = function ( time ) { 
            // Pass the render function itself
            requestAnimationFrame(_self._render); 
            
            // Let's animate the elements: a rotation.
	    for( i in meshes ) {
		meshes[i].rotation.x += 0.05; 
		meshes[i].rotation.y += 0.04;
	    }

            _self.renderer.render(_self.scene, _self.camera); 
        }; 
        // Call the rendering function. This will cause and infinite recursion (we want 
        // that here, because the animation shall run forever).
        //this._render();
        requestAnimationFrame(_self._render);

	
	// Load a texture and use the loade for asyn creating of the torus
	// new THREE.TextureLoader().load( 'square-gradient.png',
	window.setTimeout( 
	    function () {
		// Use single color for all voxels or randomize?
		var material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
		var domEvents = new THREEx.DomEvents(this.camera, this.renderer.domElement);
		
		// Compute the crystal asynchronously
		var crystal = mkCrystal( material,
					 function(mesh) {
					     scene.add(mesh);
					     
					 }
				       );
		/*
    		domEvents.addEventListener(crystal, 'mouseover', function(event) {
    		    //console.log('you hover on the mesh');
    		    event.target.scale.set(1.5,1.5,1.5);
		    
    		}, false);
    		domEvents.addEventListener(crystal, 'mouseout', function(event) {
    		    //console.log('you hover off the mesh');
    		    event.target.scale.set(1.0,1.0,1.0);
		    
		}, false);
		domEvents.addEventListener(crystal, 'click', function(event) {
		    //console.log('you hover off the mesh');
		    // event.target.scale.set(1.0,1.0,1.0);
		    
		}, false);
    		*/
		scene.add( crystal );
		// Hide overlay
		document.getElementById('overlay').style.display = 'none';
	    },
	    /*
	    function ( xhr ) { }, // progress
	    // Function called when download errors
	    function ( xhr ) {
		console.error( 'An error happened when loading the texture' );
		document.getElementById('overlay').innerHTML = 'An error happened when loading the texture';
	    }, 
	    */
	    100
	);
    } // END function init

    window.addEventListener('load', init );
})();

