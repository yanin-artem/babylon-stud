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
  ScaleGizmo,
  RotationGizmo,
  Gizmo,
  ArcRotateCamera,
} from "@babylonjs/core";

export default class MainScene {
  scene: Scene;
  engine: Engine;
  ground!: AbstractMesh;
  sphere!: AbstractMesh;
  camera!: ArcRotateCamera;
  gizmo!: Gizmo;
  gizmoMesh!: AbstractMesh;
  utilLayer: UtilityLayerRenderer;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();
    this.utilLayer = new UtilityLayerRenderer(this.scene);

    this.CreateCamera();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  CreateScene(): Scene {
    const scene = new Scene(this.engine);

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

  CreateCamera(): void {
    this.camera = new ArcRotateCamera(
      "camera",
      0,
      Math.PI / 2.5,
      10,
      Vector3.Zero(),
      this.scene
    );

    this.camera.attachControl(this.canvas, true);
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
        new ExecuteCodeAction(ActionManager.OnLeftPickTrigger, () => {
          mesh.material = color;
          this.camera.setTarget(mesh);

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
      if (gizmo != undefined) {
        gizmo.attachedMesh = null;
      }

      switch (action) {
        case "position":
          gizmo = new PositionGizmo(this.utilLayer);
          gizmo.action = "position";
          break;
        case "scaling":
          gizmo = new ScaleGizmo(this.utilLayer);
          gizmo.action = "scaling";
          break;
        case "rotation":
          gizmo = new RotationGizmo(this.utilLayer);
          gizmo.action = "rotation";
          break;
      }
      gizmo.updateGizmoRotationToMatchAttachedMesh = false;
    }
    gizmo.attachedMesh = mesh;

    return gizmo;
  }
}
