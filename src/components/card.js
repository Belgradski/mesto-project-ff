const cardTemplate = document.querySelector("#card-template").content;

export function createCard(
  cardData,
  deleteCallback,
  likeCallback,
  openCardImage,
  userId,
  deleteCardApi,
  toggleLikeApi
) {
  const card = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = card.querySelector(".card__image");
  const cardTitle = card.querySelector(".card__title");
  const cardDeleteButton = card.querySelector(".card__delete-button");
  const cardLikeButton = card.querySelector(".card__like-button");
  const cardLikeCounter = card.querySelector(".card__like-counter");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  cardLikeCounter.textContent = cardData.likes ? cardData.likes.length : 0;

  if (cardData.owner._id !== userId) {
    cardDeleteButton.remove();
  }

  if (cardData.likes && cardData.likes.some((like) => like._id === userId)) {
    cardLikeButton.classList.add("card__like-button_is-active");
  }

  cardImage.addEventListener("click", () => {
    openCardImage(cardData);
  });

  cardDeleteButton.addEventListener("click", () => {
    deleteCallback(card, cardData._id, deleteCardApi);
  });
  cardLikeButton.addEventListener("click", () => {
    likeCallback(card, cardData._id, toggleLikeApi);
  });
  return card;
}

export function addLike(card, cardId, toggleLikeApi) {
  const likeButton = card.querySelector(".card__like-button");
  const likeCounter = card.querySelector(".card__like-counter");
  const isLiked = likeButton.classList.contains("card__like-button_is-active");
  const method = isLiked ? "DELETE" : "PUT";
  toggleLikeApi(method, cardId, likeButton, likeCounter)
    .then((updateCard) => {
      likeCounter.textContent = updateCard.likes.length;
      likeButton.classList.toggle("card__like-button_is-active");
    })
    .catch((err) => console.error("Ошибка счетчика и постановки лайка", err));
}

export function deleteCard(card, cardId, deleteCardApi) {
  deleteCardApi(card, cardId)
    .then(() => card.remove())
    .catch((err) => console.error("Ошибка удаления карточки", err));
}


