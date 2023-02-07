import _constant from "../../constant"
import PrimitiveNode from "./PrimitiveNode"
import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { getStore } from "../../core/store";
import _ from "lodash"

const store = getStore()
export default class FirstPersonControlNode extends PrimitiveNode {
  constructor(res, config) {
    super(config)
    if (res.control instanceof PointerLockControls) {
      this.control = res.control
      this.minPolarAngle = Math.PI / 4; // radians
      this.maxPolarAngle = 5 * Math.PI / 4; // radians
    } else {
      throw new Error('control 初始化失败')
    }
    this.camera = res.camera;
    this._eyeHeight = _.get(this.props, 'eyeHeight', 5)
    this._jumpHeight = _.get(this.props, 'jumpHeight ', 200)
    this._continueJump = _.get(this.props, 'continueJump', false)
    this._intersectIDs = _.get(this.props, 'intersectIDs', [])
    this._speedStep = _.get(this.props, 'speedStep', 10)
    this._speed = _.get(this.props, 'speed', 400)
    this._mass = _.get(this.props, 'mass', 100)
    this._g = _.get(this.props, 'g', 9.8)
    this._a = _.get(this.props, 'a', 2)
    this._raycaster = new THREE.Raycaster(
      new THREE.Vector3(),
      new THREE.Vector3(0, -1, 0),
      0,
      this._eyeHeight
    );
    this._PI_2 = Math.PI * 2
    this._moveForward = false;
    this._moveBackward = false;
    this._moveLeft = false;
    this._moveRight = false;
    this._canJump = false;
    this._velocity = new THREE.Vector3()
    this._direction = new THREE.Vector3()
    this._prevTime = performance.now()
  }

  lock = (...args) => {
    this.control.lock(...args);
  }

  _onLock = (...args) => {
    this.props?.onlock?.(...args)
  }

  _onUnLock = (...args) => {
    this.props?.onUnLock?.(...args)
  }

  _onKeyDown = (event) => {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        this._moveForward = true;
        break;

      case "ArrowLeft":
      case "KeyA":
        this._moveLeft = true;
        break;

      case "ArrowDown":
      case "KeyS":
        this._moveBackward = true;
        break;

      case "ArrowRight":
      case "KeyD":
        this._moveRight = true;
        break;
      case "ShiftLeft":
      case "ShiftRIGHT":
        this._pressShift = true;
        break;
      case "Space":
        if (this._canJump === true) {
          this._velocity.y += this._jumpHeight;
        }
        if (!this._continueJump) {
          this._canJump = false;
        }
        break;
    }
    this.promiseWrap.userData?.onKeyDown?.(event.code)
  }

  _onKeyUp = (event) => {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        this._moveForward = false;
        break;

      case "ArrowLeft":
      case "KeyA":
        this._moveLeft = false;
        break;

      case "ArrowDown":
      case "KeyS":
        this._moveBackward = false;
        break;

      case "ArrowRight":
      case "KeyD":
        this._moveRight = false;
        break;
      case "ShiftLeft":
      case "ShiftRIGHT":
        this._pressShift = false;
        break;
    }
    this.promiseWrap.userData?.onKeyUp?.(event.code)
  }



  addEvent() {
    this.control.addEventListener("lock", this._onLock)
    this.control.addEventListener("unlock", this._onUnLock);
    document.addEventListener("keydown", this._onKeyDown);
    document.addEventListener("keyup", this._onKeyUp);
  }

  removeEvent() {
    this.control.removeEventListener("lock", this._onLock)
    this.control.removeEventListener("unlock", this._onUnLock);
    document.removeEventListener("keydown", this._onKeyDown);
    document.removeEventListener("keyup", this._onKeyUp);
  }

  _getIntersectObjects = () => _.flatten(this._intersectIDs.map(x => (store.uidMap[x])?.wrap?.userData?.[_constant.__needRaycasterChildren__] || [])) 

  _collideCheck = (angle) => {
    let rotationMatrix = new THREE.Matrix4();
    //射线方向设置为对应按键移动方向
    rotationMatrix.makeRotationY(angle * Math.PI / 180);
    const target = this.camera
    const targetDirection = target.getWorldDirection(new THREE.Vector3(0, 0, 0)).clone()
    targetDirection.applyMatrix4(rotationMatrix);
    const raycaster = new THREE.Raycaster(target.position.clone(), targetDirection, 0, 5);
    raycaster.ray.origin.y -= this._eyeHeight;
    const intersectObjects = this._getIntersectObjects()
    const intersections = raycaster.intersectObjects(intersectObjects, false);
    return intersections.length;
  }

  update = () => {
    const time = performance.now();
    if (this.control.isLocked === true) {
      const raycaster = this._raycaster
      const target = this.camera
      raycaster.ray.origin.copy(target.position);
      raycaster.ray.origin.y -= this._eyeHeight;
      const intersectObjects =this._getIntersectObjects()
      const intersections = raycaster.intersectObjects(intersectObjects, false);
      const onObject = intersections.length;
      //四个方位是否产生碰撞
      let leftCollide = [];
      let rightCollide = [];
      let forwardCollide = [];
      let backCollide = [];

      const moveForward = this._moveForward
      const moveBackward = this._moveBackward
      const moveLeft = this._moveLeft
      const moveRight = this._moveRight
      const direction = this._direction;
      const velocity = this._velocity
      const controls = this.control
      const eyeHeight = this._eyeHeight

      if (moveForward) {
        forwardCollide = this._collideCheck(0);
      }
      if (moveBackward) {
        backCollide = this._collideCheck(180);
      }
      if (moveLeft) {
        leftCollide = this._collideCheck(90);
      }
      if (moveRight) {
        rightCollide = this._collideCheck(270);
      }
      direction.z = Number(moveForward) - Number(moveBackward);
      direction.x = Number(moveRight) - Number(moveLeft);
      direction.normalize();

      const delta = (time - this._prevTime) / 1000;

      velocity.x -= velocity.x * this._speedStep * delta;
      velocity.z -= velocity.z * this._speedStep * delta;
      velocity.y -= this._g * this._mass * delta;

      direction.z = Number(moveForward) - Number(moveBackward);
      direction.x = Number(moveRight) - Number(moveLeft);
      direction.normalize();

      if (moveForward || moveBackward) velocity.z -= direction.z * this._speed * delta;
      if (moveLeft || moveRight) velocity.x -= direction.x * this._speed * delta;

      if (onObject) {
        velocity.y = Math.max(0, velocity.y);
        this._canJump = true;
        // console.log('碰着', intersections)
      }
      const quicken = this._pressShift ? this._a : 1;

      let rightDistance = -velocity.x * delta * quicken;
      let forwardDistance = -velocity.z * delta * quicken;

      if ((moveRight && rightCollide) || (moveLeft && leftCollide)) {
        console.log('碰到左右')
        rightDistance = 0;
      }

      if ((moveForward && forwardCollide) || (moveBackward && backCollide)) {
        console.log('碰到前后')
        forwardDistance = 0;
      }

      if (moveLeft || moveRight) controls.moveRight(rightDistance);

      if (moveForward || moveBackward) controls.moveForward(forwardDistance);

      target.position.y += velocity.y * delta;
      if (target.position.y < eyeHeight) {
        velocity.y = 0;
        target.position.y = eyeHeight;
        this._canJump = true;
      }
    }
    this._prevTime = time;
  }
}