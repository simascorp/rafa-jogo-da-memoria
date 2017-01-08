(function(win, doc){
	'use strict';

	function some(array, callback) {
		for (var i=0; i<array.length; i++) {
			if  (callback(array[i],i)) {
				return true;
			}
		}
		return false;
	}

	var DOM = function(selector) {

		this.elements = doc.querySelectorAll(selector);

		this.get = function() {
			return this.elements;
		}

		this.each = function(callback) {
			for (var i=0; i<this.elements.length; i++) {
				callback(this.elements[i],i);
			}
		}

		this.on = function(event, callback) {
			for (var i=0; i<this.elements.length; i++) {
				this.elements[i].addEventListener(event, callback);
			}	
		}

		this.off = function(event, callback) {
			for (var i=0; i<this.elements.length; i++) {
				this.elements[i].removeEventListener(event, callback);
			}
		}

		this.remove = function() {
			for (var i=0; i<this.elements.length; i++) {
				this.elements[i].parentNode.removeChild(this.elements[i]);
			}
		}

		this.html = function(html) {
			for (var i=0; i<this.elements.length; i++) {
				this.elements[i].innerHTML = html;
			}
		}

		this.addClass = function(className) {
			for (var i=0; i<this.elements.length; i++) {
				this.elements[i].classList.add(className);
			}
		}

		this.removeClass = function(className) {
			for (var i=0; i<this.elements.length; i++) {
				this.elements[i].classList.remove(className);
			}
		}

		this.toggle = function(className) {
			for (var i=0; i<this.elements.length; i++) {
				this.elements[i].classList.toggle(className);
			}
		}

		this.show = function() {
			for (var i=0; i<this.elements.length; i++) {
				this.elements[i].style.display = 'block';
			}
		}

		this.hide = function() {
			for (var i=0; i<this.elements.length; i++) {
				this.elements[i].style.display = 'none';
			}
		}

		this.fadeOut = function() {
			for (var i=0; i<this.elements.length; i++) {
				this.elements[i].style.opacity = 0;				
			}
		}
	}

	function randomArray(array) {
		var newArray = [];
		while (newArray.length < array.length) {
			var newItem = array[Math.floor(Math.random() * array.length + 0)];
			if (!some(newArray, function(item,index) {
				return item === newItem;
			})){
				newArray.push(newItem);
			}
		}
		return newArray;
	}

	var Game = function(images) {

		this.images = images;
		this.score = 0;
		this.maxScore = this.images.length - 1;

		this.createCards = function() {

			var imagesObj = [];

			for (var i=0; i<this.images.length; i++) {
				imagesObj.push({image: this.images[i], index: i});
				imagesObj.push({image: this.images[i], index: i});
			}

			var imagesRandom = randomArray(imagesObj);
			
			var cardsContainer = doc.querySelector('.section-cards');
			cardsContainer.innerHTML = '';

			for (var index=0; index<imagesRandom.length; index++) {
				
				var item = imagesRandom[index];

				var card = doc.createElement('div');
				card.setAttribute('class', 'card');
				card.setAttribute('data-pair-index', item.index);
				card.setAttribute('data-card-index', index);
				card.addEventListener('click', click);

				var front = doc.createElement('figure');
				front.setAttribute('class', 'front');

				var imgFront = doc.createElement('img');
				imgFront.setAttribute('src', 'images/default.jpg');
				front.appendChild(imgFront);
				card.appendChild(front);

				var back = doc.createElement('figure');
				back.setAttribute('class', 'back');

				var imgBack = doc.createElement('img');
				imgBack.setAttribute('src', 'images/' + item.image);
				back.appendChild(imgBack);
				card.appendChild(back);

				cardsContainer.appendChild(card);

			}

		}

		this.flipShow = function(cardIndex) {
			var card = new DOM('div[data-card-index="'+cardIndex+'"]');
			card.addClass('flip');
			this.play();
		}

		this.hide = function(cardIndex) {
			var card = new DOM('div[data-card-index="'+cardIndex+'"]');
			card.fadeOut(100);
		}

		this.flipShowAll = function() {
			var cards = new DOM('.card');
			cards.addClass('flip');
		}

		this.flipHideAll = function() {
			var cards = new DOM('.card');
			cards.removeClass('flip');
		}

		this.enableClick = function() {
			var cards = new DOM('.card');
			cards.on('click', click);
		}

		this.disableClick = function() {
			var cards = new DOM('.card');
			cards.off('click', click);
		}

		this.getShowCards = function()  {
			return doc.querySelectorAll('.flip');
		}

		this.isValid = function(card1, card2) {
			return card1.dataset.pairIndex === card2.dataset.pairIndex;	
		}

		this.play = function() {

			if (this.getShowCards().length == 2) {

				var that = this;
				this.disableClick();

				var card1 = this.getShowCards()[0];
				var card2 = this.getShowCards()[1];

				if (this.isValid(card1, card2)) {
					
					setTimeout(function() {

						that.hide(card1.dataset.cardIndex);
						that.hide(card2.dataset.cardIndex);
						
						if (that.score == that.maxScore) {
							that.end();
						} else {
							//console.log('acertou!');
							that.score++;
							that.flipHideAll();
							that.enableClick();
						}							
											
					},1500);
					
				} else {

					//console.log('errou!');

					setTimeout(function() {

						that.flipHideAll();

						setTimeout(function() {
							that.enableClick();
						},100);
						
					},1500);

				}

			} 

		}

		this.end = function() {

			var winnerCard = new DOM('.winner');
			var cards = new DOM('.card');

			cards.remove();

			winnerCard.addClass('animated');
			winnerCard.toggle('fadeIn');
			winnerCard.show();

		}

		this.reset = function() {

			var winnerCard = new DOM('.winner');
			winnerCard.hide();
			this.score = 0;		
			this.createCards();	

		}

	}

	//var images = ['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg','7.jpg','8.jpg'];
	var images = ['1.jpg','2.jpg','3.jpg'];
	
	var game = new Game(images);
	
	game.createCards();

	var playAgain = new DOM('#play-again');

	playAgain.on('click', function(e) {
		game.reset();
		e.preventDefault();
	});

	function click(e) {
		game.flipShow(this.dataset.cardIndex);
		e.preventDefault();
	}

}(window, document));