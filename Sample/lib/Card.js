class Card {
    constructor(parentEl) {
        this.parentElement = parentEl;
    };

    add (title, body, bgColor = 'primary', txtColor = 'white') {
        let cardHtml =
            `<div class="card text-${txtColor} bg-${bgColor} mb-3">
                        <div class="card-body">
                            <h5 class="card-title">${title}</h5>
                            <p class="card-text">${body}</p>
                        </div>
                    </div>`;

        this.parentElement.innerHTML = cardHtml + container.innerHTML;
    }

    

    clear() {
        this.parentElement.innerHTML = "";
    }
}