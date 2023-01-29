var trex ,trex_running, trex_collide;
var ground, invisibleGround, groundImage;

var cloudImg;
var obstacle, obstacle1, obstacle2, obstacle3;
var obstacle4, obstacle5, obstacle6;
var rand;

var score;
var play = 1;
var end = 0; 
var gameState = play;

var obstaclesGroup, cloudsGroup;
var gameOver, gameOverImg, restart, restarImg;

var jumpSound, dieSound, checkPointSound;



function preload(){
  //cargar animaciones
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");

  //agregar la imagen del suelo
  groundImage = loadImage("ground2.png")

  //agregar imagen de la nube
  cloudImg = loadImage("cloud.png")

  //agregar imagenes de los obstaculos
  obstacle1 = loadImage("obstacle1.png")
  obstacle2 = loadImage("obstacle2.png")
  obstacle3 = loadImage("obstacle3.png")
  obstacle4 = loadImage("obstacle4.png")
  obstacle5 = loadImage("obstacle5.png")
  obstacle6 = loadImage("obstacle6.png")

  //cargar imagen de game over
  gameOverImg = loadImage("gameOver.png");
  
  //cargar imagen de restart
  restarImg = loadImage("restart.png");

  //trex muerto
  trex_collide = loadImage("trex_collided.png");

  //cargar sonido cuando trex salta
  jumpSound = loadSound("jump.mp3")

  //cargar sonido cuando trex muere
  dieSound = loadSound("die.mp3")

  //cargar sonido de incremento de puntuaciones
  checkPointSound = loadSound("checkpoint.mp3")
}

function setup(){
  createCanvas(600, 200) 
  
  //create a trex sprite
  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("runing", trex_running);
  trex.addAnimation("collide", trex_collide)
  
 //agregar tamaño y posicion al trex
 trex.scale = 0.5;
 trex.x = 50;

 //crear el sprite del suelo
 ground = createSprite(200, 180, 400, 20);
 
 //hacer que el suelo se coloque simetricamente en la pantalla
 ground.addImage("ground", groundImage);
 ground.x = ground.width/2;
 ground.velocityX = -4;

 //crear sprite del suelo invisible
 invisibleGround = createSprite(200, 190, 400, 10);
 invisibleGround.visible = false;

 //crear grupos de nubes y obstaculos
 obstaclesGroup = new Group();
 cloudsGroup = new Group();

 //crear texto game over
 gameOver= createSprite(300, 100);
 gameOver.addImage(gameOverImg)
 gameOver.scale = 0.5;
 gameOver.visible = false;

 //crear boton de reinicio
 restart = createSprite(300, 140);
 restart.addImage(restarImg);
 restart.scale = 0.5;
 restart.visible = false;

 trex.setCollider("circle", 0, 0, 40)
 trex.debug = true
 //score
 score = 0;

 
 
}

function draw(){
  background("white");

  text("Puntuacion: " + score, 500, 50);

  //Estado play
  if(gameState === play){

    score = score + Math.round(getFrameRate()/60)
    //velocidad del suelo
   ground.velocityX = -(2 + 3*score/100);
    //hacer que no se caiga el trex
   if(ground.x < 0){
     ground.x = ground.width/2;
  }
   //hacer que el trex salte al presionar
   if(touches.length > 0 || keyDown("space") && trex.y >=100){
     //hacer que vuelva al suelo
     trex.velocityY = -10;

     //agregar el sonido
     jumpSound.play();

     touches = []
    
  }

  //gravedad
  trex.velocityY = trex.velocityY + 0.8;  

    //aparecer nubes
   spawClouds();

   //aparecer obstaculos
   spawnObstacles();

  if(obstaclesGroup.isTouching(trex)){
    gameState = end;

    //agregar sonido de muerte
    dieSound.play();

    
  } 

  //agregar sonido cada vez que la puntuacion sea mayor a 200
  if(score > 0 && score % 100 == 0){ 
    checkPointSound.play()
  }
}
  
  else if(gameState == end){
    ground.velocityX = 0;
    trex.changeAnimation("collide", trex_collide)
    gameOver.visible = true;
    restart.visible = true;
    //obstaclesGroup.setLifetimeEach(-1)
    //cloudsGroup.setLifetimeEach(-1)
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

   
  }
    
  

  trex.collide(invisibleGround)

  //Colocar fondo de otro color
  if(score >= 100000){
    background("black")
    ground.velocityX = -7;
    obstaclesGroup.velocityX = -5
  }

  //hacer funcionar restart
  if(mousePressedOver(restart)){
    reset();
  }

  drawSprites();
}

//funcion reset
function reset(){
 gameState = play;
 gameOver.visible = false;
 restart.visible = false;
 obstaclesGroup.destroyEach();
 cloudsGroup.destroyEach();
 trex.changeAnimation("runing", trex_running)
 score = 0;
}

function spawClouds(){
 //codigo para aparecer las nubes
 if(frameCount % 60 == 0){
  cloud = createSprite(600, 100, 40, 10);
  cloud.addImage( cloudImg);
  //darle un valor aleatorio a la altura de las nubes
  cloud.y = Math.round(random(10,100))
  cloud.scale = 0.5;
  cloud.velocityX = -3;

  //asignar life time a las variables
  cloud.lifeTime = 200;

  //Ajustar la profundidad de los sprites
  cloud.depth = trex.depth;
  trex.depth = trex.depth + 1;

 
   console.log( "profundidad de las nubes " + cloud.depth);
   console.log(trex.depth);

  //agregar grupos
  cloudsGroup.add(cloud)
 }

 
}

function spawnObstacles(){
  if(frameCount % 60 == 0){
    obstacle = createSprite(600, 165, 10, 40);
    obstacle.velocityX = -(6 + score/100);
    
    rand = Math.round(random(1, 6));
    console.log(rand)
  
    //generar obstaculos de forma aleatoria
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1)
        break;

      case 2:
        obstacle.addImage(obstacle2)
        break;

      case 3:
        obstacle.addImage(obstacle3)
        break;

      case 4:
        obstacle.addImage(obstacle4)
        break;

      case 5:
        obstacle.addImage(obstacle5)
        break;

      case 6:
        obstacle.addImage(obstacle6)
        break;

      default:
        break;
    }

    obstacle.scale = 0.5;
    obstacle.lifeTime = 300;

    //agregamos grupos
   obstaclesGroup.add(obstacle);
  
  }

}

