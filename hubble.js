var earthHubbleDist = 568; // km
var hubbleData = {
    orbitRate: 95.47, // dia
    rotationRate: 95.47/(earthHubbleDist + earthRadius), // dia
    distanceFromAxis: earthHubbleDist + earthRadius,
    name: "hubble",
}
var earthISSDist = 408; // km
var ISSData = {
    orbitRate: 91.34, // min
    rotationRate: 91.34, // dia
    distanceFromAxis: earthISSDist + earthRadius,
    name: "iss",
}

/**
 * This is the function that starts everything.
 * @returns {THREE.Scene|scene}
 */
function init() {
    earthData = constructPlanetData(365.2564, 0.0015, 0, "earth", "img/earth.jpg", earthRadius, planetSegments);
    // Create the camera that allows us to view into the scene.
    camera = new THREE.PerspectiveCamera(
        70, // field of view
        window.innerWidth / window.innerHeight, // aspect ratio
        0.00001, // near clipping plane
        1000000 // far clipping plane
    );
    camera.position.z = 30000;
    camera.position.x = 1.2 * earthData.distanceFromAxis;
    camera.position.y = 100;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Create the scene that holds all of the visible objects.
    scene = new THREE.Scene();

    // Create the renderer that controls animation.
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClearColor = false;

    // Attach the renderer to the div element.
    document.getElementById('webgl').appendChild(renderer.domElement);

    // Create controls that allows a user to move the scene with a mouse.
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // Load the images used in the background.
    /*var path = 'cubemap/';
    var format = '.png';
    var urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];
    var reflectionCube = new THREE.CubeTextureLoader().load(urls);
    reflectionCube.format = THREE.RGBFormat;

    // Attach the background cube to the scene.
    scene.background = reflectionCube;*/
    bgScene = new THREE.Scene();
    const vertShader = document.getElementById('vertexShader').innerHTML;
    const fragShader = document.getElementById('fragmentShader').innerHTML;
    const uniforms = {
        time: {
            type: 'f',
            value: 0.0
        },
        bgtexture: {
            type: 't',
            value: new THREE.TextureLoader().load('./cubemap/sky.jpg')
        }
    };
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertShader,
        fragmentShader: fragShader,
        depthWrite: false,
        side: THREE.BackSide,
    });
    const plane = new THREE.BoxBufferGeometry(2, 2, 2);
    bgMesh = new THREE.Mesh(plane, material)
    bgScene.add(bgMesh)

    // Create light from the sun.
    // pointLight = getPointLight(5, "rgb(255, 220, 180)");
    // scene.add(pointLight);

    // Create light that is viewable from all directions.
    // var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    // scene.add(ambientLight);
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.15);
    scene.add(ambientLight);
    const directionalLights = [
        [1, 1, 0],
        [0, 1, -1],
        [-1, 1, 0],
        [0, 1, 1],

        [1, 0, 0],
        [0, 0, -1],
        [-1, 0, 0],
        [0, 0, 1],

        [1, -1, 0],
        [0, -1, -1],
        [-1, -1, 0],
        [0, -1, 1]
    ]
    directionalLights.forEach((dl) => {
        const light = new THREE.DirectionalLight(0xFFFFFF, 0.35);

        light.position.set(10 * dl[0], 10 * dl[1], 10 * dl[2]);
        light.lookAt(new THREE.Vector3(0, 0, 0));

        scene.add(light)
    });

    // Create the sun.
    // var sunTexture = new THREE.TextureLoader().load('img/sun.jpg');
    // var sunMaterial = getMaterial("basic", "rgb(255, 255, 255)", sunTexture);
    // sun = getSphere(sunMaterial, sunRadius / moonRadius, planetSegments);
    // scene.add(sun);

    // Create the glow of the sun.
    // var spriteMaterial = new THREE.SpriteMaterial(
    //     {
    //         map: new THREE.ImageUtils.loadTexture("img/glow.png")
    //         , useScreenCoordinates: false
    //         , color: 0xffffee
    //         , transparent: false
    //         , blending: THREE.AdditiveBlending
    //     });
    // var sprite = new THREE.Sprite(spriteMaterial);
    // sprite.scale.set(5 * sunRadius / moonRadius, 5 * sunRadius / moonRadius, 1.0);
    // sun.add(sprite); // This centers the glow at the sun.

    // Create the Earth, the Moon, and a ring around the earth.
    earth = loadTexturedPlanet(earthData, 0, 0, 0);
    // moon = loadTexturedPlanet(moonData, moonData.distanceFromAxis, 0, 0);
    satRing = getTube(hubbleData.distanceFromAxis, 1, 480, 0xffffff, "ring", earthData.distanceFromAxis);

    // Create the visible orbit that the Earth uses.
    // createVisibleOrbits();
    
    // Add the satelite
    modelLoader("ISS_stationary.glb", scene);

    // Create the GUI that displays controls.
    var gui = new dat.GUI();
    var folder2 = gui.addFolder('Speed');
    folder2.add(orbitData, 'value', 0, 600);
    folder2.add(orbitData, 'runOrbit', 0, 1);
    folder2.add(orbitData, 'runRotation', 0, 1);
    var obj = {};
    obj.SolarSystem = function() {
        window.open("/")
    }
    obj.Cassini = function() {
        window.open("cassini.html");
    }
    obj.ISS = function() {
    window.open("iss.html");
    }
    obj.NewHorizons = function() {
        window.open("newHorizons.html");
    }
    obj.Voyager = function() {
        window.open("voyager.html");
    }
    gui.add(obj, 'SolarSystem');
    gui.add(obj, 'Cassini');
    gui.add(obj, 'ISS');
    gui.add(obj, 'NewHorizons');
    gui.add(obj, 'Voyager');
    // Start the animation.
    update_sat(renderer, scene, camera, controls);
}

/**
 * This function is called in a loop to create animation.
 * @param {type} renderer
 * @param {type} scene
 * @param {type} camera
 * @param {type} controls
 * @returns {undefined}
 */
function update_sat(renderer, scene, camera, controls) {
    const time = Date.now();

    bgMesh.material.uniforms.time.value = (time - beginOfTime) / 1000.0;
    bgMesh.position.copy(camera.position);
    renderer.render(bgScene, camera);

    // pointLight.position.copy(sun.position);
    controls.update();

    movePlanet(earth, earthData, time, false, "rot"); // only rotation
    if (typeof sat != "undefined")
        moveSat(sat, earth, hubbleData, time, "sat");
    // movePlanet(moonRing, earthData, time, true);

    renderer.render(scene, camera);
    requestAnimationFrame(function () {
    update_sat(renderer, scene, camera, controls);
    });
}

// Start everything.
init();
