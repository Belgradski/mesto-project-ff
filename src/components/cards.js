import { closeModal, closeByEscape } from "./modal";

const cardTemplate = document.querySelector("#card-template").content;
const placesList = document.querySelector(".places__list");
const formElementNewPlace = document.forms["new-place"];

const imagePopup = document.querySelector(".popup_type_image");
const popupImage = imagePopup.querySelector(".popup__image");
const popupCaption = imagePopup.querySelector(".popup__caption");

function addCard(evt) {
  evt.preventDefault();
  const cardPlaceName = formElementNewPlace.elements["place-name"].value;
  const cardLink = formElementNewPlace.elements["link"].value;

  initialCards.unshift({
    name: cardPlaceName,
    link: cardLink,
  });
  closeModal();
  renderCard();
}

function renderCard() {
  placesList.innerHTML = "";
  initialCards.forEach((cardData) => {
    const cardArray = createCard(
      cardData,
      deleteButton,
      addLike,
      openCardImage
    );
    placesList.append(cardArray);
  });
}

const initialCards = [
  {
    name: "Архыз",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg",
  },
  {
    name: "Челябинская область",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg",
  },
  {
    name: "Иваново",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg",
  },
  {
    name: "Камчатка",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg",
  },
  {
    name: "Холмогорский район",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg",
  },
  {
    name: "Байкал",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg",
  },
];

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

function deleteButton(card) {
  card.remove();
}

function openCardImage(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  imagePopup.classList.add("popup_is-animated");
  setTimeout(() => {
    imagePopup.classList.add("popup_is-opened");
  }, 10);

  document.addEventListener("keydown", closeByEscape);
}

export {
  initialCards,
  createCard,
  deleteButton,
  cardTemplate,
  placesList,
  addCard,
  formElementNewPlace,
  renderCard,
};
