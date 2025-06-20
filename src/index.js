import "./index.css";
import {
  createCard,
  deleteCard,
  addLike,
  setUserId,
} from "./components/card.js";
import { openModal, closeModal, resetForm } from "./components/modal.js";
import {
  enableValidation,
  clearValidation,
  validationConfig,
} from "./components/validation.js";
import { data } from "autoprefixer";
import {
  apiConfig,
  checkResponse,
  getUserInfoApi,
  getInitialCardsApi,
  setUserInfoApi,
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

let userId;

export const updateProfile = (data) => {
  if (nameInput) nameInput.textContent = data.name;
  if (jobInput) jobInput.textContent = data.about;
  if (avatar.src) avatar.src = data.avatar;
  if (avatar.alt) avatar.alt = data.name;
};


Promise.all([getUserInfoApi(), getInitialCardsApi()])
  .then(([userData, cardsData]) => {
    userId = userData._id;
    setUserId(userId);
    renderCard(cardsData, placesList);
  })
  .catch((error) => {
    console.error("Ошибка при загрузке данных", error);
  });


document.querySelectorAll(".popup").forEach((popup) => {
  popup.classList.add("popup_is-animated");
});

profileImage.addEventListener("click", () => {
  clearValidation(formElementAvatarEdit, validationConfig);
  openModal(popupTypeAvatar);
});

profileEditButton.addEventListener("click", () => {
  formElementEditProfile.name.value = nameInput.textContent;
  formElementEditProfile.description.value = jobInput.textContent;
  clearValidation(formElementEditProfile, validationConfig);
  openModal(popupTypeEdit);
});

profileAddButton.addEventListener("click", () => {
  clearValidation(formElementNewPlace, validationConfig);
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
  const submitButton = formElementEditProfile.querySelector(".button__submit");
  const initialText = submitButton.textContent;
  submitButton.textContent = "Сохранение...";
  const name = formElementEditProfile.name.value;
  const about = formElementEditProfile.description.value;
  setUserInfoApi(name, about)
    .then((updateData) => {
      updateProfile(updateData);
      console.log("данные обновлены", updateData);
      closeModal();
    })
    .catch((error) => {
      console.error("ошибка", error);
    })
    .finally(() => {
      submitButton.textContent = initialText;
    });
  getUserInfoApi();
});

formElementNewPlace.addEventListener("submit", (evt) => {
  addCard(evt);
});

formElementAvatarEdit.addEventListener("submit", (evt) => {
  updateAvatar(evt);
});

function addCard(evt) {
  evt.preventDefault();
  const submitButton = formElementNewPlace.querySelector(".button__submit");
  const initialText = submitButton.textContent;
  submitButton.textContent = "Создание...";

  const cardPlaceName = formElementNewPlace.elements["place-name"].value;
  const cardLink = formElementNewPlace.elements["link"].value;
  fetch(`${apiConfig.url}/cards`, {
    method: "POST",
    headers: apiConfig.headers,
    body: JSON.stringify({
      name: cardPlaceName,
      link: cardLink,
    }),
  })
    .then((res) => {
      return checkResponse(res);
    })
    .then((cardData) => {
      placesList.prepend(
        createCard(cardData, deleteCard, addLike, openCardImage)
      );
    })
    .catch((err) => {
      console.error("Ошибка создания карточки", err);
    })
    .finally(() => {
      submitButton.textContent = initialText;
    });
  closeModal();
}

function updateAvatar(evt) {
  const link = formElementAvatarEdit.elements["avatar"].value.trim();
  const submitButton = formElementAvatarEdit.querySelector(".button__submit");
  const initialText = submitButton.textContent;
  submitButton.textContent = "Обновление...";
  evt.preventDefault();
  return fetch(`${apiConfig.url}/users/me/avatar`, {
    method: "PATCH",
    headers: apiConfig.headers,
    body: JSON.stringify({
      avatar: link,
    }),
  })
    .then((res) => {
      return checkResponse(res);
    })
    .then((data) => {
      console.log("прилет из промиса аватара", data);
      avatar.src = data.avatar;
      avatar.alt = data.name;
      closeModal();
    })
    .catch((err) => {
      console.error("Ошибка обновления аватарки", err);
    })
    .finally(() => {
      submitButton.textContent = initialText;
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

enableValidation(validationConfig);





