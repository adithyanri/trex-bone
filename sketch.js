var monkey, monkey_running, monkeyCollide;
var ground, invisiGround, groundImg;
var banana, bananaImage, obstacle, obstacleImage;
var FoodGroup, obstacleGroup;
var score = 0;
var bananaScore = 0;
var PLAY = 0;
var END = 1;
var gameState = PLAY;
var hah, bird, preview;
var cloudsGroup, cloudImage;

function preload() {
  monkey_running = loadAnimation("trex ka haddi2.png", "trex ka haddi3.png")

  monkeyCollide = loadAnimation("trex ka haddi2.png");


  groundImg = loadAnimation("ground.jpg")

  bananaImage = loadImage("gold coin.png");
  obstacleImage = loadImage("Inkedraptor.png");

  hah = loadSound("hah.mp3")
  bird = loadSound("bird.mp3")
  preview = loadSound("preview.mp3")
  cloudImage = loadImage("cloud.png");
}

function setup() {
  createCanvas(600, 300);

  obstacleGroup = createGroup();
  bananaGroup = createGroup();
  cloudsGroup = createGroup();

  monkey = createSprite(80, 230, 10, 10);
  monkey.scale = 0.12;
  monkey.addAnimation("monkey", monkey_running);
  monkey.addAnimation("collide", monkeyCollide);


  ground = createSprite(300, 340, 600, 10);
  ground.scale = 1;

  ground.addAnimation("ground", groundImg);

  invisiGround = createSprite(300, 278, 600, 7);
  invisiGround.visible = false;

}

function draw() {
  background("white");
  fill("black");
  text("SURVIVAL TIME: " + score, 470, 20);
  text("COINS COLLECTED: " + bananaScore, 300, 20);


  if (gameState === PLAY) {
    obstacles();
    bananas();
    spawnClouds();


    score = score + Math.round(getFrameRate() / 60);

    ground.velocityX = -(4 + score * 1.5 / 100);

    if (keyDown("space") && monkey.y >= 235) {
      monkey.velocityY = -13;
      bird.play(true);
    }

    monkey.velocityY = monkey.velocityY + 0.8

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (monkey.isTouching(bananaGroup)) {
      bananaScore++;
      bananaGroup.destroyEach();
      preview.play();
    }

    if (monkey.isTouching(obstacleGroup)) {
      gameState = END;
      hah.play();

    }

  }

  if (gameState === END) {
    ground.velocityX = 0;

    monkey.y = 235;
    monkey.scale = 0.12;
    monkey.changeAnimation("collide", monkeyCollide);

    obstacleGroup.setVelocityXEach(0);
    bananaGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
    bananaGroup.setLifetimeEach(-1);
    fill("red")
    stroke("black")
    textSize(30);
    text("GAMEOVER!!!", 220, 170);
    fill("black");
    textSize(15);
    text("Press 'R' to play again", 240, 200);

    if (keyDown("r")) {
      bananaGroup.destroyEach();
      obstacleGroup.destroyEach();
      monkey.changeAnimation("monkey", monkey_running);
      score = 0;
      bananaScore = 0;
      gameState = PLAY;
    }
  }



  drawSprites();

  monkey.collide(invisiGround);
}

function bananas() {
  if (frameCount % 80 === 0) {

    banana = createSprite(620, 120, 50, 50)
    banana.addAnimation("banana", bananaImage);
    banana.scale = 0.1;
    banana.velocityX = -(4 + score * 1.5 / 100);
    banana.lifetime = 220;
    bananaGroup.add(banana);
    bananaGroup.add(banana);


  }



}

function obstacles() {
  if (frameCount % 200 === 0) {

    obstacle = createSprite(620, 253, 50, 50);
    obstacle.addAnimation("rock", obstacleImage);
    obstacle.setCollider("circle", 0, 0, 180);
    obstacle.scale = 0.05;
    obstacle.velocityX = -(6 + score * 1.5 / 100);
    obstacle.lifetime = 220;
    obstacleGroup.add(obstacle);

  }


}




function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600, 120, 40, 10);
    cloud.y = Math.round(random(10, 80));
    cloud.addImage(cloudImage);
    cloud.scale = 0.05;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = 200;

    //adjust the depth
    cloud.depth = monkey.depth;
    monkey.depth = monkey.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
    cloud.depth = bananaGroup.depth;
    bananaGroup.depth = bananaGroup.depth + 1;
  }

}