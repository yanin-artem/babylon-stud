import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  ActionManager,
  SetValueAction,
  AbstractMesh,
  DoNothingAction,
  Color3,
  StandardMaterial,
} from "@babylonjs/core";

export default class MainScene {
  scene: Scene;
  engine: Engine;
  ground!: AbstractMesh;
  sphere!: AbstractMesh;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  CreateScene(): Scene {
    const scene = new Scene(this.engine);
    const camera = new FreeCamera("camera", new Vector3(0, 2, -6), this.scene);
    camera.attachControl();

    const hemiLight = new HemisphericLight(
      "hemiLight",
      new Vector3(0, 1, 0),
      this.scene
    );

    hemiLight.intensity = 0.5;

    this.ground = MeshBuilder.CreateBox(
      "ground",

      { width: 10, height: 1, depth: 10 },
      this.scene
    );

    this.sphere = MeshBuilder.CreateSphere(
      "sphere",
      { diameter: 1 },
      this.scene
    );
    this.sphere.position = new Vector3(0, 1, 0);

    return scene;
  }

  Actions(access: boolean): void {
    if (access) {
      const color = new StandardMaterial("color", this.scene);
      color.diffuseColor = new Color3(0, 128, 0);
      this.sphere.actionManager = new ActionManager(this.scene);
      this.ground.actionManager = new ActionManager(this.scene);

      function setColor(mesh: AbstractMesh) {
        mesh.actionManager?.registerAction(
          new SetValueAction(
            ActionManager.OnPickDownTrigger,
            mesh,
            "material",
            color
          )
        );
      }

      function deleteColor(mesh: AbstractMesh, oppositeMesh: AbstractMesh) {
        mesh.actionManager?.registerAction(
          new SetValueAction(
            ActionManager.OnPickDownTrigger,
            oppositeMesh,
            "material",
            null
          )
        );
      }

      setColor(this.sphere);
      setColor(this.ground);
      deleteColor(this.sphere, this.ground);
      deleteColor(this.ground, this.sphere);
    } else {
      this.sphere.actionManager = new ActionManager(this.scene);
      this.ground.actionManager = new ActionManager(this.scene);

      function stopAction(mesh: AbstractMesh) {
        mesh.actionManager?.registerAction(
          new DoNothingAction(ActionManager.OnPickDownTrigger)
        );
      }
      stopAction(this.sphere);
      stopAction(this.ground);
    }
  }
}
