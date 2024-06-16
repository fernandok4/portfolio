class AboutSkillOnePageComponent {
    constructor() {
        this.sphereRadius = 1.5;
        this.skills = ["HTML5", 'CSS3', 'JavaScript', 'TypeScript', 'Angular', 'Bootstrap',
            'Kotlin', 'Java', 'Node.js', 'Spring Framework', 'MySQL', 'PostgreSQL', 'Docker', 'Selenium', 'Web Services',
            'Crawler', 'JPA/Hibernate', 'JSON', 'Git'
        ];
    }

    ngOnInit() {
        setTimeout(() => {
            this.createContext();
            let sphere = this.createReferenceSphere();
            let points = this.getSpherePoints([1.5, 0.75, 0], sphere);
            this.createTextMesh(points);
            this.startRenderLoop();
        }, 20);
    }

    createContext() {
        this.engine = new BABYLON.Engine(this.skillCanvas, true);
        this.createScene();
        this.createCamera();
        this.createLight();
    }

    createScene() {
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    }

    createLight() {
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 1), this.scene);
        light.intensity = 0.8;
    }

    createCamera() {
        let arcRotateCamera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 7, new BABYLON.Vector3(0, 0, 0), this.scene);
        arcRotateCamera.lowerRadiusLimit = arcRotateCamera.upperRadiusLimit = arcRotateCamera.radius;
        arcRotateCamera.inputs.attached.pointers.buttons.splice(1, 2);
        console.log(arcRotateCamera.inputs.attached);
        this.camera = arcRotateCamera;
        this.camera.attachControl(this.skillCanvas, true);
        let behavior = new BABYLON.AutoRotationBehavior();
        behavior.idleRotationSpeed = 0.25;
        behavior.idleRotationWaitTime = 2;
        this.camera.addBehavior(behavior);
    }

    createReferenceSphere() {
        this.sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: this.sphereRadius * 2 });
        return this.sphere;
    }

    getSpherePoints(arrayHeight, sphere) {
        const spherePivot = sphere.getPivotPoint();
        let heightDesired = arrayHeight;
        let divisions = 6;
        let arrayPoints = [];
        let widthFactorX = window.screen.width > 1080 ? 2 : 1;
        for (let i = 0; i < heightDesired.length; i++) {
            let variation = i % 2 !== 0 ? -((360 / divisions) / 2) : 0;
            let totalRotation = (360 / divisions) + variation;
            let height = heightDesired[i];
            let polarRadius = this.pythagorasCalculationWithHypotenuse(this.sphereRadius, height);
            let vectorPositive = new BABYLON.Vector3(spherePivot.x + polarRadius * widthFactorX, spherePivot.y + height, spherePivot.z);
            let vectorNegative = new BABYLON.Vector3(spherePivot.x + polarRadius * widthFactorX, spherePivot.y - height, spherePivot.z);
            if (height === this.sphereRadius) {
                totalRotation = 359;
            }
            if (height === 0) {
                while (totalRotation <= 360) {
                    totalRotation += (360 / divisions);
                    arrayPoints.push(this.getAbsoluteVectorPosition(vectorPositive, totalRotation, sphere));
                }
            } else {
                while (totalRotation <= 360) {
                    totalRotation += (360 / (divisions + 0.1));
                    arrayPoints.push(this.getAbsoluteVectorPosition(vectorPositive, totalRotation, sphere));
                    arrayPoints.push(this.getAbsoluteVectorPosition(vectorNegative, totalRotation, sphere));
                }
            }
        }
        sphere.dispose();
        return arrayPoints;
    }

    createTextMesh(points) {
        for (let i = 0; i < this.skills.length; i++) {
            let plane = BABYLON.Mesh.CreatePlane("plane", 2, this.scene);
            plane.parent = this.sphere;
            plane.position = points[i];
            plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
            let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);
            let text = new BABYLON.GUI.TextBlock("text", this.skills[i]);
            text.fontSize = 60;
            advancedTexture.addControl(text);
        }
    }

    getAbsoluteVectorPosition(vector, rotation, sphere) {
        let spherePositive = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.1 });
        spherePositive.setPositionWithLocalVector(vector);
        spherePositive.setPivotMatrix(sphere.getPivotMatrix());
        spherePositive.rotateAround(sphere.getPivotPoint(), new BABYLON.Vector3(0, 1, 0), this.degreesToRadians(rotation));
        let vectorPosition = spherePositive.getAbsolutePosition();
        spherePositive.dispose();
        return vectorPosition;
    }

    pythagorasCalculationWithHypotenuse(hypotenuse, cathetus) {
        return Math.sqrt(Math.pow(hypotenuse, 2) - Math.pow(cathetus, 2));
    }

    degreesToRadians(degrees) {
        return (Math.PI / 180) * degrees;
    }

    startRenderLoop() {
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    resizeCanvas() {
        this.engine.resize();
    }
}

const component = new AboutSkillOnePageComponent();
component.skillCanvas = document.querySelector("#skillCanvas");

// Simula o comportamento do decorador ViewChild e do ciclo de vida ngOnInit do Angular
document.addEventListener("DOMContentLoaded", function () {
    component.ngOnInit();
});

document.addEventListener("resize", function () {
    component.resizeCanvas();
});