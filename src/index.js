import "./index.css";
import { initialCards } from "./components/cards.js";
import { createCard, deleteCard, addLike } from "./components/card.js";
import { openModal, closeModal } from "./components/modal.js";

const profileEditButton = document.querySelector(".profile__edit-button");
const popupTypeEdit = document.querySelector(".popup_type_edit");
const profileAddButton = document.querySelector(".profile__add-button");
const popupTypeNewCard = document.querySelector(".popup_type_new-card");

document.querySelectorAll(".popup").forEach((popup) => {
  popup.classList.add("popup_is-animated");
});

const placesList = document.querySelector(".places__list");

let nameInput = document.querySelector(".profile__title");
let jobInput = document.querySelector(".profile__description");

const formElementEditProfile = document.forms["edit-profile"];
const formElementNewPlace = document.forms["new-place"];

document.addEventListener("DOMContentLoaded", () => {
  renderCard(initialCards, placesList);
});

profileEditButton.addEventListener("click", () => {
  formElementEditProfile.name.value = nameInput.textContent;
  formElementEditProfile.description.value = jobInput.textContent;
  openModal(popupTypeEdit);
});

profileAddButton.addEventListener("click", () => {
  openModal(popupTypeNewCard);
});

document.querySelectorAll(".popup__close").forEach((closeButton) => {
  closeButton.addEventListener("click", closeModal);
});

document.querySelectorAll(".popup").forEach((popup) => {
  popup.addEventListener("click", (evt) => {
    if (evt.target === popup) {
      closeModal();
    }
  });
});

formElementEditProfile.addEventListener("submit", (evt) => {
  evt.preventDefault();
  nameInput.textContent = formElementEditProfile.name.value;
  jobInput.textContent = formElementEditProfile.description.value;
  closeModal();
});

formElementNewPlace.addEventListener("submit", (evt) => {
  addCard(evt);
});

function addCard(evt) {
  evt.preventDefault();
  const cardPlaceName = formElementNewPlace.elements["place-name"].value;
  const cardLink = formElementNewPlace.elements["link"].value;
  placesList.prepend(
    createCard(
      { name: cardPlaceName, link: cardLink },
      deleteCard,
      addLike,
      openCardImage
    )
  );
  closeModal();
}

function openCardImage(cardData) {
  const imagePopup = document.querySelector(".popup_type_image");
  const popupImage = imagePopup.querySelector(".popup__image");
  const popupCaption = imagePopup.querySelector(".popup__caption");

  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openModal(imagePopup);
}

function renderCard(initialCards, placesList) {
  placesList.innerHTML = "";
  initialCards.forEach((cardData) => {
    const cardArray = createCard(cardData, deleteCard, addLike, openCardImage);
    placesList.append(cardArray);
  });
}
