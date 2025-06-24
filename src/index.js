import "./index.css";
import { createCard, deleteCard, addLike } from "./components/card.js";
import { openModal, closeModal } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";

import {
  getUserInfoApi,
  getInitialCardsApi,
  setUserInfoApi,
  addCardApi,
  updateAvatarApi,
} from "./components/api.js";

const profileEditButton = document.querySelector(".profile__edit-button");
const popupTypeEdit = document.querySelector(".popup_type_edit");
const profileAddButton = document.querySelector(".profile__add-button");
const popupTypeNewCard = document.querySelector(".popup_type_new-card");
const profileImage = document.querySelector(".profile__image");
const popupTypeAvatar = document.querySelector(".popup_type_avatar");
const placesList = document.querySelector(".places__list");
const nameInput = document.querySelector(".profile__title");
const jobInput = document.querySelector(".profile__description");
const avatar = document.querySelector(".profile__avatar");
const imagePopup = document.querySelector(".popup_type_image");
const popupImage = imagePopup.querySelector(".popup__image");
const popupCaption = imagePopup.querySelector(".popup__caption");
const formElementEditProfile = document.forms["edit-profile"];
const formElementNewPlace = document.forms["new-place"];
const formElementAvatarEdit = document.forms["avatar-edit"];

export let userId = null;

function setUserId(id) {
  userId = id;
}

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

export const updateProfile = (data) => {
  if (nameInput) nameInput.textContent = data.name;
  if (jobInput) jobInput.textContent = data.about;
  if (avatar.src) avatar.src = data.avatar;
  if (avatar.alt) avatar.alt = data.name;
};

Promise.all([getUserInfoApi(), getInitialCardsApi()])
  .then(([userData, cardsData]) => {
    setUserId(userData._id);
    updateProfile(userData);
    renderCard(cardsData, placesList);
  })
  .catch((error) => {
    console.error("Ошибка при загрузке данных", error);
  });

document.querySelectorAll(".popup").forEach((popup) => {
  popup.classList.add("popup_is-animated");
  const closeButton = popup.querySelector(".popup__close");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      closeModal(popup);
    });
  }
  document.querySelectorAll(".popup").forEach((popup) => {
    popup.addEventListener("click", (evt) => {
      if (evt.target === popup) {
        closeModal(popup);
      }
    });
  });
});

profileImage.addEventListener("click", () => {
  openModal(popupTypeAvatar);
  resetForm(popupTypeAvatar);
  clearValidation(formElementAvatarEdit, validationConfig);
});

profileEditButton.addEventListener("click", () => {
  formElementEditProfile.name.value = nameInput.textContent;
  formElementEditProfile.description.value = jobInput.textContent;
  clearValidation(formElementEditProfile, validationConfig);
  openModal(popupTypeEdit);
});

profileAddButton.addEventListener("click", () => {
  openModal(popupTypeNewCard);
  resetForm(popupTypeNewCard);
  clearValidation(formElementNewPlace, validationConfig);
});

const renderPreloader = (evt, loading, displayText) => {
  const submitButton = evt.target.querySelector(".button__submit");
  if (!submitButton) return;
  if (!submitButton.dataset.initialText) {
    submitButton.dataset.initialText = submitButton.textContent;
  }
  submitButton.textContent = loading
    ? displayText
    : submitButton.dataset.initialText;
  submitButton.disabled = loading;
};

formElementEditProfile.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const name = formElementEditProfile.name.value;
  const about = formElementEditProfile.description.value;
  renderPreloader(evt, true, "Сохранение ...");
  setUserInfoApi(name, about)
    .then((updateData) => {
      updateProfile(updateData);
      console.log("данные обновлены", updateData);
    })
    .catch((error) => {
      console.error("ошибка", error);
    })
    .finally(() => {
      renderPreloader(evt, false);
    });
  closeModal(popupTypeEdit);
});

formElementNewPlace.addEventListener("submit", (evt) => {
  addCard(evt);
  closeModal(popupTypeNewCard);
});

formElementAvatarEdit.addEventListener("submit", (evt) => {
  updateAvatar(evt);
  closeModal(popupTypeAvatar);
});

function addCard(evt) {
  evt.preventDefault();
  const cardPlaceName = formElementNewPlace.elements["place-name"].value;
  const cardLink = formElementNewPlace.elements["link"].value;
  renderPreloader(evt, true, "Создание...");
  addCardApi(cardPlaceName, cardLink)
    .then((cardData) => {
      placesList.prepend(
        createCard(cardData, deleteCard, addLike, openCardImage)
      );
    })
    .catch((err) => {
      console.error("Ошибка создания карточки", err);
    })
    .finally(() => {
      renderPreloader(evt, false);
    });
}

function updateAvatar(evt) {
  const link = formElementAvatarEdit.elements["avatar"].value.trim();
  evt.preventDefault();
  renderPreloader(evt, true, "Обновление...");
  updateAvatarApi(link)
    .then((data) => {
      avatar.src = data.avatar;
      avatar.alt = data.name;
    })
    .catch((err) => {
      console.error("Ошибка обновления аватарки", err);
    })
    .finally(() => {
      renderPreloader(evt, false);
    });
}

function openCardImage(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openModal(imagePopup);
}

function renderCard(cardsData, placesList) {
  placesList.innerHTML = "";
  cardsData.forEach((cardData) => {
    const card = createCard(
      cardData,
      cardData.owner._id === userId ? deleteCard : null,
      addLike,
      openCardImage
    );
    placesList.append(card);
  });
}

function resetForm(formElement) {
  const form = formElement.querySelector(".popup__form");
  form.reset();
}

enableValidation(validationConfig);
