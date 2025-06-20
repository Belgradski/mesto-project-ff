
import { apiConfig, checkResponse } from "./api";
const cardTemplate = document.querySelector("#card-template").content;

let userId;

export function setUserId(id) {
  userId = id;
}

function createCard(cardData, deleteCallback, likeCallback, openCardImage) {
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
    cardLikeButton.classList.add('card__like-button_is-active');
  }

  cardImage.addEventListener("click", () => {
    openCardImage(cardData);
  });

  cardDeleteButton.addEventListener("click", () => {
    deleteCallback(card, cardData._id);
  });
  cardLikeButton.addEventListener("click", () => {
    likeCallback(card, cardData._id);
  });

  return card;
}

function addLike(card, cardId) {
  const likeButton = card.querySelector(".card__like-button");
  const likeCounter = card.querySelector(".card__like-counter")
  
  const isLiked = likeButton.classList.contains('card__like-button_is-active');
  const method = isLiked ? 'DELETE' : 'PUT'; 
  
return fetch(`${apiConfig.url}/cards/likes/${cardId}`, {
  method: method,
  headers: apiConfig.headers
})
  .then((res) => {return checkResponse(res)})
  .then((updateCard) => {
    likeCounter.textContent = updateCard.likes.length;
    likeButton.classList.toggle('card__like-button_is-active')
  })
  .catch((err) => {
    console.error('Ошибка лайка', err);
  })
}

function deleteCard(card, cardId) {
  return fetch(`${apiConfig.url}/cards/${cardId}`, {
    method: 'DELETE',
    headers: apiConfig.headers
  })
  .then((res) => {return checkResponse(res)})
  .then(() => {
    card.remove();
  })
  .catch((err) => {
    console.error('Ошибка удаления карточки', err)
  })
  
}

export { createCard, deleteCard, addLike};
