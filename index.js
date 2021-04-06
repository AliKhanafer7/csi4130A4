// initialization of Three.js
function init() {
  // add our rendering surface and initialize the renderer
  var container = document.createElement('div');
  document.body.appendChild(container);
  renderer = new THREE.WebGLRenderer();
  // set some state - here just clear color
  renderer.setClearColor(new THREE.Color(0x333333));
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  var aspectRatio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(30, aspectRatio, 1, 3000);
  controls = new THREE.OrbitControls(camera)
  camera.position.set(0, 20, 6000);
  controls.update()
  
  controls.keyPanSpeed = 35;
  projector = new THREE.Projector();
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  window.addEventListener('click', onDocumentMouseDown, false);


  // All drawing will be organized in a scene graph
  scene = new THREE.Scene();
  scene.background = new THREE.Color().setHex(0x326696);
  scene.fog = new THREE.Fog(scene.background, 1, 5000);
  // show axes at the origin
  var axes = new THREE.AxesHelper(10);
  // scene.add(axes);

  geometry = new THREE.Geometry();

  var texture = new THREE.TextureLoader().load('fluffy_cloud/textures/cloud10.png');
  texture.magFilter = THREE.LinearMipMapLinearFilter;
  texture.minFilter = THREE.LinearMipMapLinearFilter;


  var fog = new THREE.Fog(0x4584b4, - 100, 3000);

  material = new THREE.ShaderMaterial({

    uniforms: {

      "map": { type: "t", value: texture },
      "fogColor": { type: "c", value: fog.color },
      "fogNear": { type: "f", value: fog.near },
      "fogFar": { type: "f", value: fog.far },

    },
    vertexShader: document.getElementById('vs').textContent,
    fragmentShader: document.getElementById('fs').textContent,
    depthWrite: false,
    depthTest: false,
    transparent: true

  });

  var plane = new THREE.Mesh(new THREE.PlaneGeometry(64, 64));

  for (var i = 0; i < 20000; i++) {

    plane.position.x = Math.random() * 1000 - 500;
    plane.position.y = - Math.random() * Math.random() * 200 - 15;
    plane.position.z = i;
    plane.rotation.z = Math.random() * Math.PI;
    plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5;

    new THREE.GeometryUtils.merge(geometry, plane);

  }

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  var loader = new THREE.GLTFLoader();
  // Load a glTF resource
  loader.load('models/tropical-island/source/Sketchfab/Tropical_Sketchfab_NoRoof.gltf',
    function (gltf) {
      island = gltf.scene.children[0];
      gltf.scene.name = "island"
      scene.add(gltf.scene);
    }
  );

  loader.load('models/volleyball_net/scene.gltf',
    function (gltf) {
      net = gltf.scene.children[0];
      net.translateX(10)
      net.translateZ(-0.7)
      gltf.scene.name = "net"
      scene.add(gltf.scene);

    }
  );

  loader.load('models/volleyball/scene.gltf',
    function (gltf) {
      ball = gltf.scene.children[0];
      ball.scale.set(0.025, 0.025, 0.025)
      ball.translateX(10)
      ball.translateZ(-0.1)
      gltf.scene.name = "ball"
      scene.add(gltf.scene);
    }
  );

  loader.load('models/volleyball_player/scene.gltf',
    function (gltf) {
      player = gltf.scene.children[0];
      player.scale.set(0.0025, 0.0025, 0.0025)
      player.translateX(9.3)
      player.translateZ(-0.85)
      player.rotateZ(1.57)
      gltf.scene.userData.name = "player"
      scene.add(gltf.scene);

    }
  );
  // need a camera to look at things
  // calcaulate aspectRatio

  // Camera needs to be global
  // position the camera back and point to the center of the scene

  const color = 0xFFFFFF;
  const intensity = 0.45;
  const light = new THREE.AmbientLight(color, intensity);
  scene.add(light);

  var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  scene.add(hemiLight);

  var dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.multiplyScalar(50);
  scene.add(dirLight);

  var gui = new dat.GUI();
  gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
  gui.add(light, 'intensity', 0, 2, 0.01);

  gui.addColor(new ColorGUIHelper(hemiLight, 'color'), 'value').name('color');
  gui.add(hemiLight, 'intensity', 0, 2, 0.01);



  // render the scene
  renderer.render(scene, camera);

  render();


  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

}



function onDocumentMouseDown(event) {
  event.preventDefault();
  var mouseVector = new THREE.Vector3(
    (event.clientX / window.innerWidth) * 2 - 1,
    - (event.clientY / window.innerHeight) * 2 + 1,
    1);

  projector.unprojectVector(mouseVector, camera);
  var raycaster = new THREE.Raycaster(camera.position, mouseVector.sub(camera.position).normalize());

  // create an array containing all objects in the scene with which the ray intersects
  var intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    for (var i = 0; i < intersects.length; i++) {
      console.log(intersects[i].object.parent.name)
      if (intersects[i].object.parent.name === "Player") {
        controls.target.set(9, 0.012, -0.13);
        camera.position.set(7,0,0);
        controls.update();
        break;
      }
    }


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
