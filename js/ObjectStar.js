
export class StarSprite extends THREE.Sprite {

    constructor(position, starID) {

        let _textureLoader = new THREE.TextureLoader();
        let starWhiteTex = _textureLoader.load( "./Assets/Grx/point.png" );
        let starFlareTex = _textureLoader.load( "./Assets/Grx/flare.png" );

        let _matStar = new THREE.SpriteMaterial({transparent:true, opacity: 1, map:starWhiteTex, side:THREE.FrontSide, depthTest:false, fog:false});
        let _matFlare = new THREE.SpriteMaterial({transparent:true, opacity: 0.75, map:starFlareTex, side:THREE.FrontSide, depthTest:false, fog:false});

        super(_matStar.clone());
        this.flare = new THREE.Sprite(_matFlare.clone());
        this.add(this.flare);

        this.scale.set(3.5,3.5,1);
        this.flare.scale.set(0.8, 0.8, 0.8);

        this.position.set(position.x, position.y, position.z );
        this.oldPositionY = this.position.clone().y;
        this.speedY = 1;
        this.starID = starID;
        if(this.starID%2) {this.speedY =1;} else {this.speedY=-1;}

    }
    UpdateOldPositionY(){
        this.oldPositionY = this.position.clone().y;
    }

    AnimationStar(delta, timeTranscurred, index){

        switch (index){
            case 1: this.AnimationStarUpAnHold(delta,timeTranscurred, index); break;
            case 2: this.AnimationStarUpAndDown(delta,timeTranscurred, index); break;
           // case 3: this.AnimationStarCenter(delta,timeTranscurred, index); break;
        }

        //AnimateFlare
        this.flare.material.rotation+=0.5* delta;
    }
    AnimationStarUpAnHold(delta,timeTranscurred){
        let positionTarget= 3;
        if(timeTranscurred <= 2){
            if(this.starID%2){ this.position.setY( THREE.MathUtils.lerp(this.oldPositionY, positionTarget, timeTranscurred / 2)) }
            else{ this.position.setY( THREE.MathUtils.lerp(this.oldPositionY, -positionTarget, timeTranscurred / 2)) }

        }
    }
    AnimationStarUpAndDown(delta,timeTranscurred){
        let positionBords = 3;
        if(timeTranscurred <= 5){
            let newY = this.position.y + (this.speedY * delta);
            this.position.setY(newY);
            if(this.position.y > positionBords){this.speedY = -3; this.position.setY(3); }
            if(this.position.y < -positionBords){this.speedY = 3; this.position.setY(-3);}
        }
    }
    /*AnimationStarCenter(delta,timeTranscurred){
        let positionTarget= 0;
        if(timeTranscurred <= 1){
            this.position.setY( MathUtils.lerp(this.oldPositionY, positionTarget, timeTranscurred / 1))

        }
    }*/


}





