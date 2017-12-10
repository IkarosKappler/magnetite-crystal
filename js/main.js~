/**
 * Example for creating a voxel torus.
 * 
 * @author  Ikaros Kappler
 * @date    2017-12-05
 * @version 1.0.0
 **/

(function() {

    var tweenPool = [];

    // This function builds the voxels
    function mkVoxelTorus( materialFactory, voxelAdded ) {
        // Found at:
        //    https://stackoverflow.com/questions/13460711/given-origin-and-radii-how-to-find-out-if-px-y-z-is-inside-torus
        //
        //    From my calculation you must test the sign of the expression
        //    (x^2+y^2+z^2+a^2-b^2)^2-4a^2(x^2+y^2)
        //    where the point is {x,y,z} and the minor radius of the torus is b, and the major radius a.

        // Create a geometry conaining the logical 3D information (here: a cube)
        var geometry = new THREE.Geometry(); // empty
        
        // Create the cube from the geometry and the material ...
        var torus = new THREE.Mesh(geometry, materialFactory()); 

	    var minorRadius = parseInt(getParams.minorRadius || 25);
        var majorRadius = parseInt(getParams.majorRadius || 75);
        var raster      =  parseInt(getParams.raster || 8);
        console.log( 'minorRadius=' + minorRadius + ', majorRadius=' + majorRadius + ', raster=' + raster );
        var bounds = new THREE.Box3( 
            new THREE.Vector3( -majorRadius-minorRadius, -majorRadius-minorRadius, -majorRadius-minorRadius ),
            new THREE.Vector3(  majorRadius+minorRadius,  majorRadius+minorRadius,  majorRadius+minorRadius )
        );
	    // Iterate through all {x,y,z} that are possible voxel centers given by the raster
        for( var x = bounds.min.x + raster/2; x < bounds.max.x+raster/2; x+= raster ) {
            var xPow = x*x;
            for( var y = bounds.min.y + raster/2; y < bounds.max.y+raster/2; y+= raster ) {
                var yPow = y*y;
                for( var z = bounds.min.z + raster/2; z < bounds.max.z+raster/2; z+= raster ) {
		            // This term is smaller than zero if the point is inside the torus
                    if( Math.pow(xPow+yPow+z*z+Math.pow(majorRadius,2)-Math.pow(minorRadius,2),2)-4*Math.pow(majorRadius,2)*(xPow+yPow) > 0 )
                        continue;
                    // Add a voxel at {x,y,z} (a cube)
                    var voxelGeometry = new THREE.CubeGeometry(raster,raster,raster); 
                    
                    // Create the cube from the geometry and the material ...
                    var voxel = new THREE.Mesh(voxelGeometry, materialFactory()); 
                    voxel.position.set( x, y, z );

		            // Add to the torus
                    torus.children.push( voxel );

                    voxelAdded( voxel, torus.children.length-1 );
                }
            }     
        }
        
        return torus;
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
        var cube = new THREE.Mesh(geometry, material); 

        // ... and add it to your scene.
        this.scene.add(cube);

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
        this.camera.position.set( 75, 75, 75 );
        // And look at the cube again
        this.camera.lookAt( cube.position );
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
        this.orbitControls.target.copy( cube.position );  



        // This is the basic render function. It will be called perpetual, again and again,
        // depending on your machines possible frame rate.
        var _self = this;  // workaround for the Safari requestAnimationFrame bug.
        this._render = function ( time ) { 
            // Pass the render function itself
            requestAnimationFrame(_self._render); 
            
            // Let's animate the cube: a rotation.
            cube.rotation.x += 0.05; 
            cube.rotation.y += 0.04;

            for( i in tweenPool ) {
                //console.log( "Tweening " + i );
                tweenPool[i].update( time );
            }

            _self.renderer.render(_self.scene, _self.camera); 
        }; 
        // Call the rendering function. This will cause and infinite recursion (we want 
        // that here, because the animation shall run forever).
        //this._render();
        requestAnimationFrame(_self._render);

	
	// Load a texture and use the loade for asyn creating of the torus
	new THREE.TextureLoader().load( 'square-gradient.png',
					function ( texture ) {
					    // Use single color for all voxels or randomize?
					    var material = new THREE.MeshPhongMaterial( { color: 0x00ff00, map : texture } );
					    var materialFactory = null;
					    console.log( window.location.search.indexOf('colors=1') );
					    if( window.location.search.indexOf('colors=1') != -1 ) 
						  materialFactory = function() { return new THREE.MeshPhongMaterial({color: Math.random()*0xFFFFFF, map : texture}); };
					    else 
						  materialFactory = function() { return material; }; 
					    var domEvents = new THREEx.DomEvents(this.camera, this.renderer.domElement);
					    
					    // Compute the torus asynchronously
					    torus = mkVoxelTorus( materialFactory, function(voxel,index) {
    						domEvents.addEventListener(voxel, 'mouseover', function(event) {
    						    //console.log('you hover on the mesh');
    						    //event.target.scale.set(1.5,1.5,1.5);
                                tweenPool.push( new TWEEN.Tween( event.target.scale ).to( { x : 1.5, y : 1.5, z : 1.5 }, 200 ).easing(TWEEN.Easing.Elastic.Out).start() );

    						}, false);
    						domEvents.addEventListener(voxel, 'mouseout', function(event) {
    						    //console.log('you hover off the mesh');
    						    // event.target.scale.set(1.0,1.0,1.0);
                                //tweenPool.push( new TWEEN.Tween( event.target.scale ).to( { x : 1.0, y : 1.0, z : 1.0 }, 200 ).easing(TWEEN.Easing.Elastic.Out).start() );
                                tweenPool.push( new TWEEN.Tween( event.target.scale ).to( { x : 0, y : 0, z : 0 }, 200 ).onComplete( function() { torus.remove(event.target); } ).start() );
                            }, false);
                            domEvents.addEventListener(voxel, 'click', function(event) {
                                //console.log('you hover off the mesh');
                                // event.target.scale.set(1.0,1.0,1.0);
                                tweenPool.push( new TWEEN.Tween( event.target.scale ).to( { x : 0, y : 0, z : 0 }, 200 ).onComplete( function() { torus.remove(event.target); } ).start() );
                            }, false);
    					} );
					    scene.add( torus );
					    // Hide overlay
					    document.getElementById('overlay').style.display = 'none';
					},
					function ( xhr ) { }, // progress
					// Function called when download errors
					function ( xhr ) {
					    console.error( 'An error happened when loading the texture' );
					    document.getElementById('overlay').innerHTML = 'An error happened when loading the texture';
					}
				      );

        
    } // END function init

    window.addEventListener('load', init );
})();

