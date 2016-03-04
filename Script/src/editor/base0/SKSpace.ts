import SKObject from './SKObject';
import {IApplication} from './IoC';
import SKScene from './SKScene';
import SKActor from './SKActor';
import WebGLRenderer from './renderer/WebGLRenderer';
import PerspectiveCamera from './camera/PerspectiveCamera';
import View2DController from './controller/View2DController';
import Controller from './actor/Controller';

import ControlPoint from './helpers/ControlPoint2D';

const enum controlPoints { topLeft, topCenter, topRight,
  middleLeft, middleCenter, middleRight,
  buttomLeft, buttomCenter, buttomRight};

export default class SKSpace extends SKObject implements IApplication{
  scene:SKScene;
  camera:PerspectiveCamera;
  orthoCamera: THREE.OrthographicCamera;
  renderer:WebGLRenderer;
  view2DController:View2DController;
  // public projector:THREE.Projector = new THREE.Projector();
  public transfromControl:THREE.TransformControls;
  public svgpoints:THREE.Vector2=new THREE.Vector2();
  public cameraControls;
  public selectedBox:THREE.BoxHelper = new THREE.BoxHelper();
  public ControlPoints:Array<ControlPoint>;

  private orthoCameraScale: number = 3;

  private _isEditMode:boolean = false;
  private _enabled2d:boolean = false;

  public commands = {};

  public getMode():boolean{
    return this._isEditMode;
  }
  public isNotEditMode(){
    this._isEditMode = false;
    this.selectedBox.visible = false;
  }
  public isEditMode(mesh:THREE.Object3D){
    this.selectedBox.update(mesh);
    this.selectedBox.visible = true;
    this._isEditMode =true;
    this.caluctorPosition();
  }
  public caluctorPosition(loca?:number){
    /*
        0__1__2
      3/__4__/5
     6/__7__/8

    0: max.x, max.y, max.z
    1: min.x, max.y, max.z
    2: min.x, min.y, max.z
    3: max.x, min.y, max.z
    4: max.x, max.y, min.z
    5: min.x, max.y, min.zols i
    */
    let boxArray = (<any>this.selectedBox.geometry).attributes.position.array;
    console.log(boxArray);

    switch(loca){
      case controlPoints.topLeft:
        break;
      default:
        break;

    }

  }

  public addControlPoint(){
    /*
		  5____4
		1/___0/|
		| 6__|_7
		2/___3ControlPoints/

    0: max.x, max.y, max.z
    1: min.x, max.y, max.z
    2: min.x, min.y, max.z
    3: max.x, min.y, max.z
    4: max.x, max.y, min.z
    5: min.x, max.y, min.z
    6: min.x, min.y, min.z
    7: max.x, min.y, min.z
    */
    let boxArray = (<any>this.selectedBox.geometry).attributes.position.array;
    if(this.ControlPoints === undefined){
      this.ControlPoints = new Array(8);
    }
    for(let i = 0; i<8;i++){
      let ctrPnt = new ControlPoint();
      let positionPnt = new THREE.Vector3(boxArray[i*3+0],boxArray[i*3+1],boxArray[i*3+2]);
      ctrPnt.position.copy(positionPnt);
      this.ControlPoints[i] = ctrPnt;
    }
  }

  isEnabled2D(){
    return this._enabled2d;
  }

  // addController(ctrl:Controller){
  //
  // }

  removeController(ctrl:Controller){

  }


  constructor(webglRendererParameters?:THREE.WebGLRendererParameters,clearColor?:number){
    super();

    webglRendererParameters = webglRendererParameters || { antialias:true };
    //let parWidth = $(".skong-con").width;
    //webglRendererParameters.canvas.style.width = parWidth+'px';
    let CanvasWidth = window.innerWidth - 330;
    let CanvasHeight = window.innerHeight -40;

    // this.camera = new PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 0.1, 50*1000 );

		this.camera = new PerspectiveCamera( 50, CanvasWidth/CanvasHeight, 1, 50*1000 );
    // camera = new THREE.CombinedCamera( window.innerWidth / 2, window.innerHeight / 2, 70, 1, 1000, - 500, 1000 );
    // this.camera = new THREE.CombinedCamera(CanvasWidth/2  ,CanvasHeight/2,70,0.1,50*1000,-25*1000,50*1000);

		this.renderer = new WebGLRenderer(webglRendererParameters);
    this.renderer.setClearColor(clearColor || 0xC7EDCC);
    this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize( window.innerWidth, window.innerHeight );
    if(!webglRendererParameters.canvas){
      		document.body.appendChild( this.renderer.domElement );
    }

    var dom = this.renderer.domElement;
    // console.log(CanvasWidth);
    // dom.width = CanvasWidth;
    // dom.style.width = CanvasWidth + 'px';
    this.scene = new SKScene(this);

	  this.camera.position.z = 5;
    this.cameraControls = new THREE.OrbitControls( this.camera, dom );
    this.cameraControls.enableDamping = true;
    this.cameraControls.dampingFactor = 0.25;
    // debugger;
    // this.cameraControls = new THREE.EditorControls( this.camera, dom );

    let objectPositionOnDown:THREE.Vector3 = new THREE.Vector3();
    let objectRotationOnDown:THREE.Euler = new THREE.Euler();
    let objectScaleOnDown:THREE.Vector3 = new THREE.Vector3();

    this.transfromControl = new THREE.TransformControls(this.camera,dom);
    this.transfromControl.addEventListener('change',(event)=>{
      let object = this.transfromControl.object;
      if(object !== undefined){
        this.selectedBox.update(object);

      }
    });
    this.transfromControl.addEventListener('mousedown',(event)=>{
      let object:THREE.Object3D = this.transfromControl.object;
      objectPositionOnDown = object.position.clone();
      objectRotationOnDown = object.rotation.clone();
      objectScaleOnDown = object.scale.clone();

    });
    this.transfromControl.addEventListener('mouseup',(event)=>{
      let object = this.transfromControl.object;
      if(object !== null){
        switch(this.transfromControl.getMode()){
          case 'scale':
            if(!objectPositionOnDown.equals(object.position)){
                this.executeCommand('sk:scale');
            }
            break;
          case 'default':
            return;
        }
      }
    });
    this.scene.add(this.transfromControl);

    this.orthoCamera = new THREE.OrthographicCamera(0,	0,	0, 0,	-10000, 500 * 1000);
    View2DController.setCameraFactor(this.orthoCamera)

    this.view2DController = new View2DController(this.orthoCamera,dom);
  //  this.enable2D();
    // this.addControlPoint();
    this.addCommand('sk:cancle',()=>{
      if(this.getMode()){
        this.isNotEditMode();
        console.log(this.getMode());
      }
    })

    this.addCommand('sk:scale',()=>{

    })

    this.addCommand('sk:alert',function(){
      alert('sk:alert');
    });

  }

  init(){
  }

  enable2D(value?: boolean){
  		this._enabled2d = value == undefined ? true : value;
      if(this._enabled2d){
        this.view2DController.enable();
        this.orthoCamera.left = -this.orthoCameraScale * 1000;
        this.orthoCamera.right = this.orthoCameraScale * 1000;
        this.orthoCamera.top = this.orthoCameraScale * 1000;
        this.orthoCamera.bottom = -this.orthoCameraScale * 1000;
      }else{
        this.view2DController.disable();
      }


  }

  startup(){
    var scope = this;
    var clock = new THREE.Clock();
    var render = function () {
      requestAnimationFrame( render );
      var delta = clock.getDelta();
      // cube.rotation.x += 0.1;
      // cube.rotation.y += 0.1;
      scope.scene.tick(delta);
      if(scope.isEnabled2D()){
	       scope.view2DController.update(delta);
      }else{
        scope.cameraControls.update( delta );
      }

      if(scope.isEnabled2D()){
        scope.renderer.render(scope.scene,scope.orthoCamera);
      }else{
        scope.renderer.render(scope.scene, scope.camera);
      }

    };

    render();
  }

  addCommand(name,receiver ){
    this.commands[name] = receiver;
  }

  executeCommand(name){
    var receiver = this.commands[name];
    if(receiver) receiver();
  }

  setKeymaps(keymaps){
    document.addEventListener('keydown', (event:KeyboardEvent)=> {
      event.preventDefault();
      event.stopPropagation();
      var keyEventStr = '';
      if(event.altKey){
        keyEventStr += 'alt-';
      }
      if(event.ctrlKey){
        keyEventStr += 'ctrl-';
      }
      if(event.shiftKey){
        keyEventStr += 'shift-';
      }
      if(event.keyCode === 27){
        let receiver = this.commands[keymaps['escape']];
        if(receiver) receiver();
      }
      keyEventStr +=   String.fromCharCode(event.keyCode).toLowerCase();
      if(keymaps[keyEventStr]){
          var receiver = this.commands[keymaps[keyEventStr]];
          if(receiver) receiver();
      }
    })
  }
}
