import {StarSprite} from "./ObjectStar.js";

var MathUtils = THREE.MathUtils;
var Vector3 = THREE.Vector3;


// scene
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x320000);

var div = document.getElementById('threed');
var ratio = div.offsetWidth /  (div.offsetHeight + 100);

// camera and renderer
const camera = new THREE.PerspectiveCamera(75, ratio, 0.1, 1000);//32, 600);
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);

var renderer = new THREE.WebGLRenderer({antialias:false});

renderer.setSize(div.offsetWidth, div.offsetHeight + 100);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('threed').appendChild(renderer.domElement);
renderer.gammaInput = false; renderer.gammaOutput = false;
renderer.render(scene, camera);


/*var _ambientLight = new THREE.PointLight(0xFFFFFF, 114.4);
_ambientLight.position.z = 10; _ambientLight.position.y = 0;
scene.add(_ambientLight);*/


function AddStarBG(){

  var _starsPointsA = [], _starsPointsB = [];

  var _numStars = 80;

  for(var i = 0; i < _numStars; i++){
    var _star = new THREE.Vector3();
    if(i < _numStars/3.3){
      //In the sides
      if((i%2) == 0) _star.x = (THREE.Math.randFloatSpread(512) + 256);
      else _star.x = - (THREE.Math.randFloatSpread(512) + 256);
      if(Math.random() < .5) _star.y = -Math.random() * 64 - 32;
      else _star.y = Math.random() * 64 + 32;
      _star.z = Math.random() * 128 + 64;
    }
    else{
      _star.x = THREE.Math.randFloatSpread(1600);
      _star.y = THREE.Math.randFloatSpread(512);
     // _star.z = - (Math.random() * 128 + 32);
    }
    _starsPointsA.push(_star);
  }
  for(i = 0; i < _numStars; i ++){
    var _star = new THREE.Vector3();
    if(i < _numStars/3.3){
      //In the sides
      if((i%2) == 0) _star.x = (THREE.Math.randFloatSpread(512) + 256);
      else _star.x = - (THREE.Math.randFloatSpread(512) + 256);
      if(Math.random() < .5) _star.y = -Math.random() * 64 - 32;
      else _star.y = Math.random() * 64 + 32;
      _star.z = Math.random() * 128 - 64;
    }
    else{
      _star.x = THREE.Math.randFloatSpread(1600);
      _star.y = THREE.Math.randFloatSpread(512);
      _star.z = - (Math.random() * 128 + 32);
    }
    _starsPointsB.push(_star);
  }

  var _starsGeometry  = new THREE.BufferGeometry().setFromPoints(_starsPointsA);
  var _starsBGeometry = new THREE.BufferGeometry().setFromPoints(_starsPointsB);

  var _starsMaterial = new THREE.PointsMaterial({size:.5, color:0x5959e3, depthTest:false, transparent:false, fog:false});
  var _starsBMaterial = new THREE.PointsMaterial({size:1, color:0xaa90eb, depthTest:false, transparent:false, fog:false});

  var _starField = new THREE.Points(_starsGeometry, _starsMaterial);
  var _starBField = new THREE.Points(_starsBGeometry, _starsBMaterial);


  _starField.position.z = -248, _starBField.position.z = -212;
  scene.add(_starField), scene.add(_starBField);

} //Create stars
AddStarBG();

var _hero;
function Hero(){
  var _textureLoader = new THREE.TextureLoader();
  var _heroMap = _textureLoader.load("./Assets/Grx/hero4.png");
  var _heroGeometry = new THREE.PlaneGeometry(8, 8, 1, 1); //w, h, wseg, hseg (more = better details)
  _heroGeometry.center();
  var _heroMaterial = new THREE.MeshBasicMaterial({transparent:true, map:_heroMap, side:THREE.FrontSide, depthTest:false, fog:false});
  _heroMaterial.opacity = 1;

  _hero = new THREE.Mesh(_heroGeometry, _heroMaterial);
  _hero.scale.set(1,1,1);

  _hero.position.set(4,0,0);

  scene.add(_hero);
}
Hero();

//Variables
var groupStarA = new THREE.Group();  groupStarA.position.set(1,1,0);
var groupStarB= new THREE.Group();  groupStarB.position.set(1,1,0);
function Espiral () {

  // geometry
  let i = 0, iMax = 12, vert, vertices = [], per, r;
  while (i < iMax) {
    // percent
    per = i / iMax;
    // radian
    r = Math.PI*2 * per;
    // current vertex
    vert = new THREE.Vector3();
    vert.x = Math.cos(r) * (6);
    vert.y = 0;//-10 + 15 * per;
    vert.z = Math.sin(r) * (6);

    let vertx = new Vector3(vert.x,vert.y,vert.z);
    let star = new StarSprite(vertx, i);
    if(i%2) { groupStarA.add(star);} else { groupStarB.add(star);}

    i += 1;
  }

  scene.add(groupStarA);
  scene.add(groupStarB);

}
Espiral();


var SkyGradiant;
var Sky1ColorA = new THREE.Color(0.1,0,0.15);
var Sky1ColorB = new THREE.Color(0,0,0);
var Sky2ColorA = new THREE.Color(0,0.92,1);
var Sky2ColorB = new THREE.Color(0,0.32,1);

function Skybox() {
  var myGradient = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2,2,1,1),
      new THREE.ShaderMaterial({
        uniforms: {
          uColorA: { value: new THREE.Color(0.1,0,0.15) },
          uColorB: { value: new THREE.Color(0,0,0) }
        },
        vertexShader: `
        varying vec2 vUv;
        void main(){
        vUv = uv;
        float depth = -1.; //or maybe 1. you can experiment
        gl_Position = vec4(position.xy, depth, 1.);
      }`,
        fragmentShader: `
        varying vec2 vUv;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        void main(){
          gl_FragColor = vec4(
            mix( uColorA, uColorB, vec3(vUv.y)),
            1.
          );
        }`
      })
  )
  myGradient.material.depthWrite = false
  myGradient.renderOrder = -99999
  //myGradient.material.uniforms.uColorA.value = new THREE.Color(1,0,0);
  SkyGradiant =myGradient;
  camera.add(myGradient);
  scene.add( camera);
  // myGradient.position.set(0,0,0);
  // myGradient.scale.set(0,0,0);
}
Skybox();

var groupCloud = new THREE.Group();  groupCloud.position.set(0,-15,0);
function AddWorld(){
        var _textureLoader = new THREE.TextureLoader();
        var _cloudMap = _textureLoader.load("./cloud.png");
				_cloudMap.magFilter = THREE.LinearMipMapLinearFilter;
				_cloudMap.minFilter = THREE.LinearMipMapLinearFilter;
        var _cloudGeometry = new THREE.PlaneGeometry(8, 8, 1, 1);
        var _cloudMaterial = new THREE.MeshBasicMaterial({transparent:true, map:_cloudMap, side:THREE.FrontSide, depthTest:false, fog:false});
        
        function MakeCloud(scale, position, rotationZ){
          let _cloud = new THREE.Mesh(_cloudGeometry, _cloudMaterial);
          _cloud.scale.set(scale.x, scale.y, scale.z);
          _cloud.position.set( position.x, position.y, position.z);
          _cloud.rotation.z = rotationZ; 
          groupCloud.add(_cloud)
        }

      /*   for ( var i = 0; i < 8; i++ ) {
					
          let newScale = Math.random() * Math.random() * 1.5 + 0.5;

          MakeCloud(new Vector3(newScale,newScale, 1),
           new Vector3(Math.random() * 10 - 5, Math.random() * -7 + 2, Math.random() * 2.5 ), 
           Math.random() * Math.PI);

				} */
        
        /* let _cloud = new THREE.Mesh(_cloudGeometry, _cloudMaterial);
        _cloud.scale.set(2, 2, 2);
        _cloud.position.set( 0, 0, 0);
        _cloud.rotation.z = Math.random() * Math.PI; 
        groupCloud.add(_cloud) */

        MakeCloud(new Vector3(2,2,2), new Vector3( 0, 0,0), Math.random() * Math.PI);
        MakeCloud(new Vector3(2,2,2), new Vector3( 5, 2,0), Math.random() * Math.PI);
        MakeCloud(new Vector3(2,2,2), new Vector3(-5, 2,0), Math.random() * Math.PI);
        MakeCloud(new Vector3(2,2,2), new Vector3( 0,-7,0), Math.random() * Math.PI);
        MakeCloud(new Vector3(2,2,2), new Vector3( 5,-5,0), Math.random() * Math.PI);
        MakeCloud(new Vector3(2,2,2), new Vector3(-5,-5,0), Math.random() * Math.PI);
        MakeCloud(new Vector3(2,2,2), new Vector3( 0,-14,0), Math.random() * Math.PI);
        MakeCloud(new Vector3(2,2,2), new Vector3( 5,-12,0), Math.random() * Math.PI);
        MakeCloud(new Vector3(2,2,2), new Vector3(-5,-12,0), Math.random() * Math.PI);
        MakeCloud(new Vector3(2,2,2), new Vector3( 0,-21,0), Math.random() * Math.PI);
        MakeCloud(new Vector3(2,2,2), new Vector3( 5,-19,0), Math.random() * Math.PI);
        MakeCloud(new Vector3(2,2,2), new Vector3(-5,-19,0), Math.random() * Math.PI);
        MakeCloud(new Vector3(2,2,2), new Vector3( 0,-28,0), Math.random() * Math.PI);
        MakeCloud(new Vector3(2,2,2), new Vector3( 5,-26,0), Math.random() * Math.PI);
        MakeCloud(new Vector3(2,2,2), new Vector3(-5,-26,0), Math.random() * Math.PI);
        MakeCloud(new Vector3(2,2,2), new Vector3( 0,-35,0), Math.random() * Math.PI);
        MakeCloud(new Vector3(2,2,2), new Vector3( 5,-33,0), Math.random() * Math.PI);
        MakeCloud(new Vector3(2,2,2), new Vector3(-5,-33,0), Math.random() * Math.PI);
        MakeCloud(new Vector3(2,2,2), new Vector3( 0,-42,0), Math.random() * Math.PI);
        MakeCloud(new Vector3(2,2,2), new Vector3( 5,-40,0), Math.random() * Math.PI);
        MakeCloud(new Vector3(2,2,2), new Vector3(-5,-40,0), Math.random() * Math.PI);
        MakeCloud(new Vector3(2,2,2), new Vector3( 0,-49,0), Math.random() * Math.PI);
        MakeCloud(new Vector3(2,2,2), new Vector3( 5,-47,0), Math.random() * Math.PI);
        MakeCloud(new Vector3(2,2,2), new Vector3(-5,-47,0), Math.random() * Math.PI);
        
        scene.add(groupCloud);
}
AddWorld();


var clock = new THREE.Clock();
var delta = 0;
var speedA = 0, speedATarget = 0.5, oldSpeedA = 0;
var speedB = -0, speedBTarget = -0.5, oldSpeedB = 0;
var timeTranscurred = 0;
var indexAnimation = 1;
function animate() {
  requestAnimationFrame(animate);
  delta = clock.getDelta();
  timeTranscurred += delta;

  if(timeTranscurred >= 5){
    indexAnimation = Math.floor(Math.random() * 2) + 1;
    //indexAnimation =3;
    switch (indexAnimation){
      case 1: if(Math.floor(Math.random() * 2)){ speedATarget = -2; speedBTarget=2;} else { speedATarget = 2; speedBTarget=-2;} break;
      case 2: speedATarget = 1; speedBTarget=1; break;
      case 3: speedATarget = 1; speedBTarget=1; break;
    }

    groupStarA.children.map( star =>{ star.UpdateOldPositionY(); })
    groupStarB.children.map( star =>{ star.UpdateOldPositionY(); })
    oldSpeedA = speedA;
    oldSpeedB = speedB;

    timeTranscurred = 0;
  }
  if(timeTranscurred <= 1){
    speedA = MathUtils.lerp(oldSpeedA, speedATarget, timeTranscurred / 1 ); //Analizar esto a futuro, compararlo con unity
    speedB = MathUtils.lerp(oldSpeedB, speedBTarget, timeTranscurred / 1 );
  }

  if (groupStarA) groupStarA.rotation.y += speedA * delta;
  if (groupStarB) groupStarB.rotation.y += speedB * delta;

  groupStarA.children.map( star =>{ star.AnimationStar(delta, timeTranscurred, indexAnimation); })
  groupStarB.children.map( star =>{ star.AnimationStar(delta, timeTranscurred, indexAnimation); })

   /* if(indexAnimation===3){
    groupStarA.rotation.y = MathUtils.lerp(groupStarA.rotation.y, 0, timeTranscurred / 1);
    groupStarB.rotation.y = MathUtils.lerp(groupStarB.rotation.y, 0, timeTranscurred / 1);
*/
    /*if(groupStarA.rotation.y >= Math.PI*2 || groupStarA.rotation.y <= -Math.PI*2 ){ groupStarA.rotation.y =0;}
    if(groupStarB.rotation.y >= Math.PI*2 || groupStarB.rotation.y <= -Math.PI*2 ){ groupStarB.rotation.y =0;}
  */

  renderer.render(scene, camera);
}
animate();

var colorA = SkyGradiant.material.uniforms.uColorA.value;
var colorB = SkyGradiant.material.uniforms.uColorB.value;
var posCamInit = new THREE.Vector3(0,0,10), posCamEnd = new THREE.Vector3(0,-15,10);

function ScrollAnimation() {

  /*const t = document.body.getBoundingClientRect().top;
  console.log(t)*/
  //console.log(window.scrollY);
  const spaceBefore = document.getElementById('Home').getBoundingClientRect().height +
      document.getElementById('Header').getBoundingClientRect().height;

  //Porcentaje de Scroll
  var per = document.getElementById('Projects').getBoundingClientRect().top / spaceBefore;
  per = 1 - per;
  var perClamp = MathUtils.clamp(per,0,1)

  colorA.r = MathUtils.lerp(Sky1ColorA.r, Sky2ColorA.r, perClamp );
  colorA.g = MathUtils.lerp(Sky1ColorA.g, Sky2ColorA.g, perClamp );
  colorA.b = MathUtils.lerp(Sky1ColorA.b, Sky2ColorA.b, perClamp );
  colorB.r = MathUtils.lerp(Sky1ColorB.r, Sky2ColorB.r, perClamp );
  colorB.g = MathUtils.lerp(Sky1ColorB.g, Sky2ColorB.g, perClamp );
  colorB.b = MathUtils.lerp(Sky1ColorB.b, Sky2ColorB.b, perClamp );

  SkyGradiant.material.uniforms.uColorA.value = colorA;
  SkyGradiant.material.uniforms.uColorB.value = colorB;

  var newPosCam = posCamInit.clone().lerp(posCamEnd.clone(), per)
  camera.position.set(newPosCam.x, newPosCam.y, newPosCam.z);

}
document.body.onscroll = ScrollAnimation;
ScrollAnimation();


//Resize
var tanFOV = Math.tan( ( ( Math.PI / 180 ) * camera.fov / 2 ) );
var windowHeight = div.offsetHeight + 100;
var planeAspectRatio = 1;

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize( event ) {
  console.log("Resoze");

  camera.aspect = div.offsetWidth / (div.offsetHeight + 100);
  if(camera.aspect > planeAspectRatio){
    _hero.position.set(4,0,0);
  }else{
    _hero.position.set(1,3,0);
  }

  // adjust the FOV
  camera.fov = ( 360 / Math.PI ) * Math.atan( tanFOV * ( (div.offsetHeight + 100) / windowHeight ) );

  camera.updateProjectionMatrix();
//  camera.lookAt( scene.position );
  //renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setSize(div.offsetWidth, div.offsetHeight+100);
  renderer.render( scene, camera );

}
onWindowResize();








