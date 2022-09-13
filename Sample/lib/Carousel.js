class Carousel {
  constructor(parentEl, items, cardWidth) {

    /**
     * @Todo Add check for parentEl and items array length
     */
    this.launcher_containerWidth = 320;

    this.slideAmount;
    this.left;
    this.cursorX;

    // Launcher container
    this.launcher_container = document.createElement("div");
    this.launcher_container.className = "launcher__container";
    
    // Launcher card wrapper
    this.card_wrapper = document.createElement("div");
    this.card_wrapper.className = "launcher__card";

    this.launcher_container.appendChild(this.card_wrapper);

    // Create Cards
    this.cards = items.map((item, i) => {
      

      let card = document.createElement("div");
      const cardIcon = document.createElement("div");
      const cardImg = document.createElement("img");
      const cardTitle = document.createElement("div");
      const cardTitleHeading = document.createElement("h3");
      const cardSubtitle = document.createElement("span");

      if (item.action !== undefined && item.action.url !== undefined) {
        card = document.createElement("a");
        card.href = item.action.url;
        card.style.textDecoration = "none";
      }

      card.className = "card";
      cardIcon.className = "card__icon";
      cardTitle.className = "card__title";

      

      if (item.icon !== undefined) {
        if (item.icon.src !== undefined) cardImg.src = item.icon.src;
        if (item.icon.alt) cardImg.alt = item.icon.alt;
        cardIcon.append(cardImg);
      }

      if (item.title !== undefined && item.title.length > 0) {
        cardTitleHeading.append(document.createTextNode(item.title));
        cardTitle.append(cardTitleHeading);
      }
      if (item.subtitle !== undefined && item.subtitle.length > 0) {
        cardSubtitle.append(document.createTextNode(item.subtitle));
        cardTitle.append(cardSubtitle);
      }
      
      card.append(cardIcon);
      card.append(cardTitle);

      this.card_wrapper.append(card);

      return card;
    });

    parentEl.append(this.launcher_container);

    // set position of first card
    this.cards[0].classList.add("active");
    this.cards[1].classList.add("next");
    
    // card width = 100
    this.marginRight = (this.launcher_containerWidth - cardWidth) / 2;
    this.left = cardWidth
    this.card_wrapper.style.left = cardWidth + "px";
    
    this.cards.forEach(card => {
      card.style.width = cardWidth + "px";
      card.style.marginRight = this.marginRight + "px"
    });
   

    // listen for keyboard arrows pressed
    document.addEventListener('keydown', (event) => {
      if (event.key === "ArrowRight"){
        this.next();
      } else if (event.key === "ArrowLeft"){
        this.prev();
      }
    });

    // detect cursor position, starting anchor point
    document.addEventListener('mousedown', event => this.cursorX = event.clientX);
    // detect cursor position, detemine if point is left or right of cursor starting anchor position
    document.addEventListener('mouseup', event => this.cursorX > event.clientX ? this.next() : this.prev());
    // detect touch start anchor point
    document.addEventListener('touchstart', event => this.cursorX = event.changedTouches[0].clientX);
    // detect touch end, detemine if point is left or right of tocuh starting anchor position 
    document.addEventListener('touchend', event => this.cursorX > event.changedTouches[0].clientX ? this.next() : this.prev());
  }

  getCurrentCard() {
    this.activeCard = this.launcher_container.querySelector(".active");
    this.nextCard = this.activeCard.nextElementSibling;
    this.prevCard = this.activeCard.previousElementSibling;
  }

  next() {
    this.getCurrentCard()

    if(this.nextCard) {
      this.activeCard.classList.remove("active");
      this.activeCard.classList.add("prev");
      this.nextCard.classList.remove("next");
      this.nextCard.classList.add("active");
      if (this.nextCard.nextElementSibling) this.nextCard.nextElementSibling.classList.add("next")
      this.left = this.left - this.nextCard.offsetWidth - this.marginRight;
      this.card_wrapper.style.left = this.left + "px";
      if (this.prevCard) this.prevCard.classList.remove("prev");
    }
  }

  prev() {
    this.getCurrentCard()

    if(this.prevCard) {
      this.activeCard.classList.remove("active");
      this.activeCard.classList.add("next");
      this.prevCard.classList.remove("prev");
      this.prevCard.classList.add("active");
      if (this.prevCard.previousElementSibling) this.prevCard.previousElementSibling.classList.add("prev")
      this.left = this.left + this.prevCard.offsetWidth + this.marginRight;
      this.card_wrapper.style.left = this.left + "px";
      if (this.nextCard) this.nextCard.classList.remove("next");
    }
  }
}