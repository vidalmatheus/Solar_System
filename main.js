/**
 * This is the function that starts everything.
 * @returns {THREE.Scene|scene}
 */
function init() {
    // Create the camera that allows us to view into the scene.
    camera = new THREE.PerspectiveCamera(
        70, // field of view
        window.innerWidth / window.innerHeight, // aspect ratio
        0.1, // near clipping plane
        10000 // far clipping plane
    );
    camera.position.z = 50;
    camera.position.x = 1.2 * earthData.distanceFromAxis;
    camera.position.y = 100;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Create the scene that holds all of the visible objects.
    scene = new THREE.Scene();

    // Create the renderer that controls animation.
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Attach the renderer to the div element.
    document.getElementById('webgl').appendChild(renderer.domElement);

    // Create controls that allows a user to move the scene with a mouse.
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // Load the images used in the background.
    var path = 'cubemap/';
    var format = '.png';
    var urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];
    var reflectionCube = new THREE.CubeTextureLoader().load(urls);
    reflectionCube.format = THREE.RGBFormat;

    // Attach the background cube to the scene.
    scene.background = reflectionCube;

    // Create light from the sun.
    pointLight = getPointLight(5, "rgb(255, 220, 180)");
    scene.add(pointLight);

    // Create light that is viewable from all directions.
    var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);

    // Create the sun.
    var sunTexture = new THREE.TextureLoader().load('img/sun.jpg');
    var sunMaterial = getMaterial("basic", "rgb(255, 255, 255)", sunTexture);
    sun = getSphere(sunMaterial, sunRadius / moonRadius, planetSegments);
    scene.add(sun);

    // Create the glow of the sun.
    var spriteMaterial = new THREE.SpriteMaterial(
        {
            map: new THREE.ImageUtils.loadTexture("img/glow.png")
            , useScreenCoordinates: false
            , color: 0xffffee
            , transparent: false
            , blending: THREE.AdditiveBlending
        });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(5 * sunRadius / moonRadius, 5 * sunRadius / moonRadius, 1.0);
    sun.add(sprite); // This centers the glow at the sun.

    // Create the Earth, the Moon, and a ring around the earth.
    earth = loadTexturedPlanet(earthData, earthData.distanceFromAxis, 0, 0);
    moon = loadTexturedPlanet(moonData, moonData.distanceFromAxis, 0, 0);
    moonRing = getTube(earthMoonDist / moonRadius, 0.05, 480, 0xffffff, "ring", earthData.distanceFromAxis);

    // Include satellite 
    includeSatellite();
    satelliteRing = getTube(earthMoonDist / moonRadius * 0.5, 0.05, 480, 0xffffff, "ring", satelliteData.distanceFromAxis);

    // Create the visible orbit that the Earth uses.
    createVisibleOrbits();

    // Create the GUI that displays controls.
    var gui = new dat.GUI();
    var folder1 = gui.addFolder('light');
    folder1.add(pointLight, 'intensity', 0, 10);
    var folder2 = gui.addFolder('speed');
    folder2.add(orbitData, 'value', 0, 600);
    folder2.add(orbitData, 'runOrbit', 0, 1);
    folder2.add(orbitData, 'runRotation', 0, 1);

    // Start the animation.
    update(renderer, scene, camera, controls);
}

// Start everything.
init();
