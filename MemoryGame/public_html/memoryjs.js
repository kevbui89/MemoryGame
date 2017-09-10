"use strict";
var memoryGameApp = {};

/* 
 * Initializes the page, it initializes the game, cached images
 * and invokes event listeners for the buttons. 
 */
function init() {
    
  memoryGameApp.revealedImages = ["back_images/backImage0.jpg",
                            "back_images/backImage1.jpg",
                            "back_images/backImage2.jpg",
                            "back_images/backImage3.jpg",
                            "back_images/backImage4.jpg",
                            "back_images/backImage5.jpg",
                            "back_images/backImage6.jpg",
                            "back_images/backImage7.png"];
    
  //array of background images
  memoryGameApp.revealedBackgroundImages = ["background_images/background1.jpg",
                                     "background_images/background2.jpg",
                                     "background_images/background3.jpg",
                                     "background_images/background4.jpg", 
                                     "background_images/background5.jpg"];
                       
  memoryGameApp.revealedImageIndex = 0;
  memoryGameApp.revealImage = $("backImage");

  cachedImages();
  initializeGame();
}

/* 
 *   Adds an event listener to the game buttonw.
 */
function addListenersToButtons() {
  addListener($("start"), "click", restart);
  addListener($("end"), "click", endGame);
  addListener(document, "keypress", pickedCard);
}

/* 
 *  Caches the images.
 */
function cachedImages() {

  var images = [];
  //put both arrays into one array so I can loop through all images
  var allImages = images.concat(memoryGameApp.revealedImages, 
      memoryGameApp.revealedBackgroundImages);
        
  for (var i = 0; i < allImages.length; i++) {
    var img = new Image();
    img.src = allImages[i];
  }
}

/* 
 *  Initializes the game with an imageCounter (keeps track of images
 *  clicked), cardsFound (keeps track of pairs found), cardsClicked (array of images 
 *  clicked, so I can compare them), boolean match, and boolean next (prevents 
 *  player from mass clicking).    
 */
function initializeGame() {
  //this variable will keep count of the cards clicked
  memoryGameApp.imageCounter = 0;
  //this variable will contain the numbers of pairs found.
  memoryGameApp.pairFound = 0;
  //this array will contain the images clicked
  memoryGameApp.cardsClicked = [null, null];
  //boolean value to deal with matching cards
  memoryGameApp.match = false;
  //boolean value to enable player to keep on going.  Starts with true because 
  //this is a new game
  memoryGameApp.next = true;
    
  addListenersToButtons();
  attachListenersToCards();
  shuffle();
  imageSlideShow();
}

/* 
 *  Ends the game and removes all the divs to reveal the background
 *  image. 
 */
function endGame() {
  var allCards = $("game").children;
    
  for (var i = 0; i < allCards.length; i++){
    allCards[i].style.visibility = "hidden";
    allCards[i].children[0].style.visibility = "hidden";
  }
}

function restart() {
  var allCards = $("game").children;
    
  for (var i = 0; i < allCards.length; i++){
    allCards[i].style.visibility = "visible";
    allCards[i].children[0].style.visibility = "visible";
  }
    
  initializeGame();
}

/* 
 *  Switches between 5 background images like a slideshow.
 *  They are not random.
 */
function imageSlideShow() {
  memoryGameApp.revealedImageIndex = memoryGameApp.revealedImageIndex + 1;
  memoryGameApp.revealImage.src =
    memoryGameApp.revealedBackgroundImages[memoryGameApp.revealedImageIndex];

  if (memoryGameApp.revealedImageIndex === 5) {
    memoryGameApp.revealedImageIndex = 0;
    memoryGameApp.revealImage.src =
        memoryGameApp.revealedBackgroundImages[memoryGameApp.revealedImageIndex];
  }
}

/* 
 *  Creates fictional arrays that keeps track of the pictures and divs.
 */
function shuffle() {
  //initialize an array size 16 containing indexes
  //the array will contain all 1s when filled up
  //ensures that all cards are filled
  var cardsArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        
  //initialize an array containing the pictures indexes
  var pictureArray = [0,0,0,0,0,0,0,0];
    
  for (var i = 0; i < 8; i++) {
    //generates an image index
    var picNumber = generateNumber(pictureArray, 8);
    //adds the random index, removes the 0 and adds 1
    pictureArray.splice(picNumber, 1, 1);
        
    //generate a pair for that image
    var cardNumber = generateNumber(cardsArray, 16);
    cardsArray.splice(cardNumber, 1, 1);
        
    var cardNumber2 = generateNumber(cardsArray, 16);
    cardsArray.splice(cardNumber2, 1, 1);
    //send an image and 2 positions on the board
    setPair(picNumber, cardNumber, cardNumber2);      
    }    
}
/* 
 *  Sets the image chosen by the computer to 2 divs randomly.
 *  @param {int} imageIndex - The image index from the array.
 *  @param {int} cardIndex1 - The div index where to put the image.
 *  @param {int} cardIndex2 - The div index where to put the second image.
 * 
 */
function setPair(imageIndex, cardIndex1, cardIndex2) {
  var div1 = "c" + (cardIndex1 + 1);
  var div2 = "c" + (cardIndex2 + 1);

  $(div1).style.backgroundImage = "url('" + memoryGameApp.revealedImages[imageIndex] + "')";
  $(div2).style.backgroundImage = "url('" + memoryGameApp.revealedImages[imageIndex] + "')";
}

/* 
 *  Generates a random number between 0 and the max argument.
 *  @param {array} array  Any array of any size either containing images of divs.
 *  @param {int} max - The maximum number the random number can reach
 *  @return {int} - The random number generated.
 */
function generateNumber(array, max) {
  var invalid = true;
  var num = 0;
    
  while(invalid) {
    //ensure every random number is an int
    num = (Math.random() * (max - 0) + 0) | 0;
    if (array[num] === 0) {
      invalid = false;
    }
  }   
  return num;
}

/* 
 *  Adds event listeners to the cards on the game. 
 */
function attachListenersToCards() {
  var cards = $("game").children; 
 
  for(var i = 0; i < cards.length; i++) {
    //get the div and attach a on click event to them 
    addListener(cards[i], "click", pickedCard);
  }
}

/* 
 *  Adds listeners to objects.
 *  @param {obj} item      Any object from the site
 *  @param {even} type     The type of event.
 *  @param {function} func The function passed in.
 */
function addListener(item, type, func) {
  //add event type to the obj sent 
  if(window.addEventListener){
    item.addEventListener(type, func, false); 
  } else if(window.attachEvent) {
      item.attachEvent("on"+type, func);
    }
}

/* 
 *  Picks the cards from the event whether it is click or keypress.
 *  @param {obj} e - The card chosen by the player
 */
function pickedCard(e) {
  if (memoryGameApp.next) {
    var eventType = e.type;  
    if (eventType === "click") {
      handlePickedCard(this);
    } else {
        var evt = e || window.event;
        var charCode = evt.which || evt.keyCode;
            
        selectCardFromKeyBoard(charCode);
        }
    }
}

/* 
 *  Selects the card from the keyboard that matches the key.
 *  @param {char} charCode - The charcode from the keypress
 */
function selectCardFromKeyBoard(charCode) {
  var card = null; 

  if(charCode >= 97 && charCode <= 112)	{
    var num = charCode - 96; 
    var divId = "c" + num;
    card = $(divId);
  }
	
  if(card !== null) {
    // make sure user doesnt select a card that was previously matched 
    if(card.style.visibility !== "hidden")
      handlePickedCard(card);
  }
}

/* 
 *  Takes care of counting the cards and flipping them.
 *  @param {obj} obj - The card object chosen by the user.
 */
function handlePickedCard(obj) {
  if(memoryGameApp.cardsClicked[0] !== obj)	
    memoryGameApp.imageCounter++; 

  obj.children[0].style.visibility = "hidden";

  if(memoryGameApp.imageCounter === 1) {
    memoryGameApp.cardsClicked.splice(0, 1, obj);
  } else if(memoryGameApp.imageCounter === 2) {
      memoryGameApp.next = false;
      memoryGameApp.cardsClicked.splice(1, 1, obj);
      checkMatch();
  }
}

/* 
 *  Checks if the cards clicked matches.
 */
function checkMatch() {
  memoryGameApp.Timer = setInterval(HideOrRemoveCard, 700); 

  if(memoryGameApp.cardsClicked[0].style.backgroundImage === 
       memoryGameApp.cardsClicked[1].style.backgroundImage) {
         memoryGameApp.match = true;
	} else {
	    memoryGameApp.match = false; 
	}	
}

/* 
 *  Takes care of either replacing the cards or removing them from
 *  the board.
 */
function HideOrRemoveCard() {
  clearInterval(memoryGameApp.Timer); 
	
  var card1Image = memoryGameApp.cardsClicked[0].children[0];	

  var card2Image = memoryGameApp.cardsClicked[1].children[0];

  if(memoryGameApp.match) {
    //match card hide the div 
    memoryGameApp.cardsClicked[0].style.visibility = "hidden";
    memoryGameApp.cardsClicked[1].style.visibility = "hidden";
    memoryGameApp.pairFound++; 
    } else {
      //show outside card again 
      card1Image.style.visibility = "visible"; 
      card2Image.style.visibility = "visible";	
    }

  //reset params 
  memoryGameApp.cardsClicked.splice(0, 1, null);
  memoryGameApp.cardsClicked.splice(1, 1, null);
  memoryGameApp.imageCounter = 0;
  memoryGameApp.next = true; 

  if(memoryGameApp.pairFound === 8) {
    window.alert("Congratulations!");	
  }	
}

/* 
 *  Replaces document.getElementById by $.
 */
function $(value) {
  return document.getElementById(value);
}

addListener(document, "DOMContentLoaded", init);
