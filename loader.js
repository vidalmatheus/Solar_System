const sceneBuilder = (modelName) => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xCCCCCC);

    const camera = new THREE.PerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(10, 10, 10);

    const domElem = document.getElementById("mycanvas");

    const renderer = new THREE.WebGLRenderer({
        canvas: domElem,
        alpha: true,
        antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const controls = new THREE.OrbitControls(camera, domElem);

    //const axesHelper = new THREE.AxesHelper(75);
    //scene.add(axesHelper);

    // Setting light
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

    modelLoader(modelName, scene);

    // animation
    const animate = () => {
        requestAnimationFrame(animate);
        controls.update();

        renderer.render(scene, camera);
    }

    animate();
}

const modelLoader = (modelName, scene) => {
    const loader = new THREE.GLTFLoader();
    loader.load(
        `./models/${modelName}`,
        (gltf) => {
            //gltf.scene.scale.set(1000, 1000, 1000);
            //gltf.scene.position.set(satelliteData.distanceFromAxis, 0, 0);

            scene.add(gltf.scene);
            console.log("Satellite added!");
        },
        (xhr) => console.log(`${xhr.loaded / xhr.total * 100} % loaded...`),
        (err) => console.log(err)
    );
}
