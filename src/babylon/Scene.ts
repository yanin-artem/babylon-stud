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
} from "@babylonjs/core";
import { type } from "os";

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
      this.sphere.actionManager = new ActionManager(this.scene);
      this.sphere.actionManager
        .registerAction(
          new SetValueAction(
            ActionManager.OnPickDownTrigger,
            this.sphere,
            "position",
            new Vector3(0, 3, 0)
          )
        )
        ?.then(
          new SetValueAction(
            ActionManager.OnPickDownTrigger,
            this.sphere,
            "position",
            new Vector3(0, 1, 0)
          )
        );
    } else {
      console.log("nothing");
      this.sphere.actionManager = new ActionManager(this.scene);
      this.sphere.actionManager.registerAction(
        new DoNothingAction(ActionManager.OnPickDownTrigger)
      );
    }
  }
}
