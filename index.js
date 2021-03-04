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


    // All drawing will be organized in a scene graph
    var scene = new THREE.Scene();

    // show axes at the origin
    var axes = new THREE.AxesHelper(10);
    scene.add(axes);

    // need a camera to look at things
    // calcaulate aspectRatio
    var aspectRatio = window.innerWidth / window.innerHeight;

    // Camera needs to be global
    camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 1000);
    // position the camera back and point to the center of the scene
    camera.position.z = 2000;
    camera.lookAt(scene.position);

    // render the scene
    renderer.render(scene, camera);

    render();

    function render() {
        // render using requestAnimationFrame - register function
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // If we use a canvas then we also have to worry of resizing it
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = init;

// register our resize event function
window.addEventListener('resize', onResize, true);

document.addEventListener('keydown', handleKeyDown);

function handleKeyDown(e) {
    switch (e.code) {
        case "ArrowUp":
            camera.position.z -= 50;
            break;
        case "ArrowDown":
            camera.position.z += 50;
            break;
    }
}