import "./index.css";
import {
  initialCards,
  createCard,
  deleteButton,
  cardTemplate,
  placesList,
  addCard,
  formElementNewPlace,
  renderCard,
} from "./components/cards";
import {
  openModal,
  closeModal,
  handleFormSubmit,
  jobInput,
  nameInput,
  formElementEditProfile,
} from "./components/modal.js";

const profileEditButton = document.querySelector(".profile__edit-button");
const popupTypeEdit = document.querySelector(".popup_type_edit");
const profileAddButton = document.querySelector(".profile__add-button");
const popupTypeNewCard = document.querySelector(".popup_type_new-card");

formElementEditProfile.name.value = nameInput.textContent;
formElementEditProfile.description.value = jobInput.textContent;

document.addEventListener("DOMContentLoaded", renderCard);

profileEditButton.addEventListener("click", () => {
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

formElementEditProfile.addEventListener("submit", handleFormSubmit);

formElementNewPlace.addEventListener("submit", addCard);
