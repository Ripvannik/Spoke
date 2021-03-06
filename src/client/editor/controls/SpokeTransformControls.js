import THREE from "../../vendor/three";

export default class SpokeTransformControls extends THREE.TransformControls {
  constructor(camera, canvas) {
    super(camera, canvas);
    this.name = "SpokeTransformControls";
  }

  clone() {
    // You can only have one instance of TransformControls so return a dummy object when cloning.
    return new THREE.Object3D().copy(this);
  }
}
