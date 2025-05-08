const cardTemplate = document.querySelector('#card-template').content;

function createCard(cardData, deleteCallback) {
    const card = cardTemplate.querySelector('.card').cloneNode(true);

    const cardImage = card.querySelector('.card__image');
    const cardDeleteButton = card.querySelector('.card__delete-button');
    const cardTitle = card.querySelector('.card__title');

    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;
    
    cardDeleteButton.addEventListener('click', () => {
        deleteCallback(card);
    })

    return card;
}

function deleteCard(card) {
    card.remove();
}

const placesList = document.querySelector('.places__list');

initialCards.forEach((cardData) => {
    const card = createCard(cardData, deleteCard);
    placesList.append(card);
});