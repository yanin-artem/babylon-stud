import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  ActionManager,
  AbstractMesh,
  ExecuteCodeAction,
  Color3,
  StandardMaterial,
  UtilityLayerRenderer,
  PositionGizmo,
  Gizmo,
} from "@babylonjs/core";

export default class MainScene {
  scene: Scene;
  engine: Engine;
  ground!: AbstractMesh;
  sphere!: AbstractMesh;
  gizmo!: Gizmo;
  gizmoMesh!: AbstractMesh;

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
    color.diffuseColor = new Color3(0, 128, 0);

    if (action == "action" && this.gizmo != undefined) {
      this.gizmo.attachedMesh = null;
    } else if (action != "action") {
      this.gizmo = this.Gizmo(this.gizmoMesh, this.gizmo, action);
    }
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

          this.gizmo =
            action == "action"
              ? undefined
              : this.Gizmo(mesh, this.gizmo, action);
          this.gizmoMesh = mesh;
          oppositeMesh.material = null;
        })
      );
    }

    setElement.call(this, this.sphere, this.ground);
    setElement.call(this, this.ground, this.sphere);
  }

  Gizmo(mesh: AbstractMesh, gizmo: any, action: string): any {
    if (gizmo == undefined || gizmo.action != action) {
      const utilLayer = new UtilityLayerRenderer(this.scene);
      switch (action) {
        case "action":
          gizmo.attachedMesh = null;
        case "position":
          gizmo = new PositionGizmo(utilLayer);
          gizmo.action = "position";
      }
    }
    gizmo.attachedMesh = mesh;

    return gizmo;
  }
}
