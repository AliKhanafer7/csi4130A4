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
  camera.position.set(0, 620, 10000);
  controls.update()

  controls.keyPanSpeed = 50;
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
  scene.add(axes);

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
  mesh.position.y = 600
  scene.add(mesh);


  // create an AudioListener and add it to the camera
  const listener = new THREE.AudioListener();
  camera.add(listener);

  // create the PositionalAudio object (passing in the listener)
  const sound = new THREE.PositionalAudio(listener);

  // load a sound and set it as the PositionalAudio object's buffer
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load('sounds/calypso.mp3', function (buffer) {
    sound.setBuffer(buffer);
    sound.setRefDistance(10);
    sound.play();
  });

  var loader = new THREE.GLTFLoader();
  // Load a glTF resource
  loader.load('models/tropical-island/source/Sketchfab/Tropical_Sketchfab_NoRoof.gltf',
    function (gltf) {
      island = gltf.scene.children[0];
      gltf.scene.name = "island"
      scene.add(gltf.scene);
      gltf.scene.children[21].add(sound);

      document.querySelector('button').addEventListener('click', function () {
        audioLoader.resume().then(() => {
          console.log('Playback resumed successfully');
        });
      });
    }
  );

  loader.load('models/sign/sign.glb',
  function (gltf) {
    gltf.scene.scale.x = 30
    gltf.scene.scale.z = 30
    gltf.scene.scale.y = 30
    gltf.scene.position.set(-100,650,5000)
    scene.add(gltf.scene);
  }
);

  loader.load('models/volleyball_net/scene.gltf',
    function (gltf) {
      net = gltf.scene.children[0];
      net.translateX(10)
      net.translateZ(-0.7)
      net.scale.set(1.2, 1.2, 1.2)
      gltf.scene.name = "net"
      scene.add(gltf.scene);
    });

  // Load a glTF resource
  loader.load('models/tropical-island/source/Sketchfab/Tropical_Sketchfab_NoRoof.gltf',
    function (gltf) {
      island = gltf.scene.children[0];
      scene.add(gltf.scene);
    }
  );

  loader.load('models/volleyball_player/scene.gltf',
    function (gltf) {
      player = gltf.scene.children[0];
      player.scale.set(0.0035, 0.0035, 0.0035)
      player.translateX(9.3)
      player.translateZ(-0.9)
      player.rotateZ(1.57)
      gltf.scene.userData.name = "player"
      scene.add(gltf.scene);

    }
  );

  loader.load('models/volleyball_player2/scene.gltf',
    function (gltf) {
      player = gltf.scene.children[0];
      player.scale.set(0.03, 0.03, 0.03)
      player.translateX(10.5)
      player.translateZ(-0.85)
      player.rotateZ(-1.3)
      gltf.scene.userData.name = "player2"
      scene.add(gltf.scene);
    }
  );

  loader.load('models/bar/scene.gltf',
    function (gltf) {
      player = gltf.scene.children[0];
      player.translateY(10)
      player.translateX(4)
      player.rotateZ(-1.6)
      scene.add(gltf.scene);
    });

  loader.load('models/woman1/scene.gltf',
    function (gltf) {
      player = gltf.scene.children[0];
      player.translateY(9.4)
      player.translateX(4)
      player.translateZ(-0.97)
      player.rotateZ(3.14)
      player.scale.set(0.004, 0.004, 0.004)
      scene.add(gltf.scene);
    });

  loader.load('models/bartender/scene.gltf',
    function (gltf) {
      player = gltf.scene.children[0];
      player.translateY(10.4)
      player.translateX(4.20)
      player.translateZ(-0.97)
      player.scale.set(0.008, 0.008, 0.008)
      scene.add(gltf.scene);
    });

  loader.load('models/cesna_airplane/scene.gltf', (gltf) => {
    gltf.scene.position.z = 8000
    gltf.scene.position.y = 600
    gltf.scene.rotation.y = -Math.PI / 2
    gltf.scene.name = "airplane"
    scene.add(gltf.scene);
  })


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
    if (camera.position.z >= 2000) {
      camera.position.z -= 10
      // controls.position.z -= 10
    } else {
      camera.position.y > 3 ? camera.position.y -= 1 : camera.position.y -= 0
      camera.position.z > 10 ? camera.position.z -= 3.197 : camera.position.z -= 0
    }
    if (scene.getObjectByName("airplane")) {
      scene.getObjectByName("airplane").position.z -= 10;
    }
    controls.update();
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
      if (intersects[i].object.parent.name === "Player") {
        controls.target.set(9, 0.012, -0.13);
        camera.position.set(7, 0, 0);
        controls.update();
        break;
      } else if (intersects[i].object.parent.name == "Bar") {
        controls.target.set(5, 0, -12);
        // camera.position.set(5,0,4);
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
