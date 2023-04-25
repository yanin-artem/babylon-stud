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
  ExecuteCodeAction,
  Color3,
  StandardMaterial,
  UtilityLayerRenderer,
  PositionGizmo,
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

  Actions(action: string): void {
    const color = new StandardMaterial("color", this.scene);
    let gizmo = {};
    color.diffuseColor = new Color3(0, 128, 0);
    this.sphere.actionManager = new ActionManager(this.scene);
    this.ground.actionManager = new ActionManager(this.scene);

    function setElement(
      this: MainScene,
      mesh: AbstractMesh,
      oppositeMesh: AbstractMesh
    ) {
      mesh.actionManager?.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickDownTrigger, () => {
          mesh.material = color;
          gizmo = this.Gizmo(mesh, gizmo);
          oppositeMesh.material = null;
        })
      );
    }

    setElement.call(this, this.sphere, this.ground);
    setElement.call(this, this.ground, this.sphere);
  }

  Gizmo(mesh: AbstractMesh, gizmo: any): any {
    if (gizmo.attachedMesh == null) {
      const utilLayer = new UtilityLayerRenderer(this.scene);
      gizmo = new PositionGizmo(utilLayer);
    }
    gizmo.attachedMesh = mesh;
    return gizmo;
  }
}
