
function createCard(cardData, deleteCallback) {
    const cardTemplate = document.querySelector('#card-template').content;
    const card = cardTemplate.querySelector('.card').cloneNode(true);

    const cardImage = card.querySelector('.card__image');
    const cardDeleteButton = card.querySelector('.card__delete-button');
    const cardTitle = card.querySelector('.card__title');

    cardImage.src = cardData.link;
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