// initialization of Three.js
function init() {
    // add our rendering surface and initialize the renderer
    var container = document.createElement('div');
    document.body.appendChild(container);
    // WebGL2 examples suggest we need a canvas
    // canvas = document.createElement( 'canvas' );
    // var context = canvas.getContext( 'webgl2' );
    // var renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context } );
    renderer = new THREE.WebGLRenderer();
    // set some state - here just clear color
    renderer.setClearColor(new THREE.Color(0x333333));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    var aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 1000);
    const controls = new THREE.OrbitControls(camera)
    camera.position.set(0,20,50);

    controls.update()


    var loader = new THREE.GLTFLoader();

    // Load a glTF resource
    loader.load('models/tropical-island/source/Sketchfab/Tropical_Sketchfab.gltf',
        function ( gltf ) {
            island = gltf.scene.children[0];
            island.scale.set(100,100,100);
            scene.add(gltf.scene);
        }
    );



   
    // All drawing will be organized in a scene graph
    var scene = new THREE.Scene();
    scene.background = new THREE.Color().setHSL( 0.6, 0, 1 );
	scene.fog = new THREE.Fog( scene.background, 1, 5000 );
    // show axes at the origin
    var axes = new THREE.AxesHelper(10);
    scene.add(axes);

    // need a camera to look at things
    // calcaulate aspectRatio

    // Camera needs to be global
    // position the camera back and point to the center of the scene

    const color = 0xFFFFFF;
    const intensity = 0.45;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light);

    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    scene.add( hemiLight );

    var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
    dirLight.position.multiplyScalar( 50);
    scene.add( dirLight );

    var gui = new dat.GUI();
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    gui.add(light, 'intensity', 0, 2, 0.01);

    gui.addColor(new ColorGUIHelper(hemiLight, 'color'), 'value').name('color');
    gui.add(hemiLight, 'intensity', 0, 2, 0.01);


    // render the scene
    renderer.render(scene, camera);

    render();

    function render() {
        // render using requestAnimationFrame - register function
        requestAnimationFrame(render);
        controls.update();
        renderer.render(scene, camera);
    }

}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // If we use a canvas then we also have to worry of resizing it
    renderer.setSize(window.innerWidth, window.innerHeight);
}

class ColorGUIHelper {
    constructor(object, prop) {
      this.object = object;
      this.prop = prop;
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
      this.object[this.prop].set(hexString);
    }
  }

window.onload = init;

// register our resize event function
window.addEventListener('resize', onResize, true);

