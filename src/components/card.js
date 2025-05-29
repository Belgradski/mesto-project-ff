const cardTemplate = document.querySelector("#card-template").content;

function createCard(cardData, deleteCallback, likeCallback, openCardImage) {
  const card = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = card.querySelector(".card__image");
  const cardTitle = card.querySelector(".card__title");
  const cardDeleteButton = card.querySelector(".card__delete-button");
  const cardLikeButton = card.querySelector(".card__like-button");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  cardImage.addEventListener("click", () => {
    openCardImage(cardData);
  });

  cardDeleteButton.addEventListener("click", () => {
    deleteCallback(card);
  });
  cardLikeButton.addEventListener("click", () => {
    likeCallback(card);
  });

  return card;
}

function addLike(card) {
  const likeButton = card.querySelector(".card__like-button");
  likeButton.classList.toggle("card__like-button_is-active");
}

function deleteCard(card) {
  card.remove();
}

export { createCard, deleteCard, addLike };
