import "./index.css";
import { initialCards } from "./components/cards.js";
import { createCard, deleteCard, addLike, setUserId } from "./components/card.js";
import { openModal, closeModal, resetForm } from "./components/modal.js";
import {
  enableValidation,
  clearValidation,
  validationConfig,
} from "./components/validation.js";
import { data } from "autoprefixer";

const profileEditButton = document.querySelector(".profile__edit-button");
const popupTypeEdit = document.querySelector(".popup_type_edit");
const profileAddButton = document.querySelector(".profile__add-button");
const popupTypeNewCard = document.querySelector(".popup_type_new-card");


const placesList = document.querySelector(".places__list");

const nameInput = document.querySelector(".profile__title");
const jobInput = document.querySelector(".profile__description");
const avatar = document.querySelector(".profile__image");

const imagePopup = document.querySelector(".popup_type_image");
const popupImage = imagePopup.querySelector(".popup__image");
const popupCaption = imagePopup.querySelector(".popup__caption");

const formElementEditProfile = document.forms["edit-profile"];
const formElementNewPlace = document.forms["new-place"];

document.querySelectorAll(".popup").forEach((popup) => {
  popup.classList.add("popup_is-animated");
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
  const name = formElementEditProfile.name.value;
  const about = formElementEditProfile.description.value;
  setUserInfoApi(name, about)
  .then((updateData) => {
    updateProfile(updateData);
    console.log('данные обновлены', updateData);
    closeModal();
  })
  .catch((error) => {
    console.error('ошибка', error);
  })
  getUserInfoApi();
});

formElementNewPlace.addEventListener("submit", (evt) => {
  addCard(evt);
});

function addCard(evt) {
  evt.preventDefault();
  const cardPlaceName = formElementNewPlace.elements["place-name"].value;
  const cardLink = formElementNewPlace.elements["link"].value;
  fetch(`${apiConfig.url}/cards`, {
    method: 'POST',
    headers: apiConfig.headers,
    body: JSON.stringify({
      name: cardPlaceName,
      link: cardLink
    })
  })
   
  .then((res) => {
    return checkResponse(res);
  })
  .then((cardData) => {
    placesList.prepend(
      createCard(
        cardData,
        deleteCard,
        addLike,
        openCardImage
      ))
  })
  .catch((err) => {
    console.error('Ошибка создания карточки', err);
  });
  closeModal();
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
// --------------------------------api-------------------------------- //

const apiConfig = {
  url: "https://nomoreparties.co/v1/wff-cohort-41",
  headers: {
    "Content-Type": "application/json",
    authorization: "7564c66a-aa2b-404d-99e6-765f18d0ed8a",
  },
};

const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(console.log(`Ошибка: ${res.status}`));
};

const getUserInfoApi = () => {
  return fetch(`${apiConfig.url}/users/me`, {
    headers: apiConfig.headers,
  })
    .then((res) => {
      return checkResponse(res);
    })
    .then((data) => {
      updateProfile(data);
      return data;
    })
    .catch((error) => {
      console.error("Ошибка при загрузке данных профиля", error);
    });
};

const updateProfile = (data) => {
  if (nameInput) nameInput.textContent = data.name;
  if (jobInput) jobInput.textContent = data.about;
  if (avatar.src) avatar.src = data.avatar;
  if (avatar.alt) avatar.alt = data.name;
};

const getInitialCardsApi = () => {
  return fetch(`${apiConfig.url}/cards`, {
    headers: apiConfig.headers,
  })
    .then((res) => {
      return checkResponse(res);
    })
    .catch((error) => {
      console.error("Ошибка загрузки карточек", error);
    });
};

const setUserInfoApi = (name, about) => {
  return fetch(`${apiConfig.url}/users/me`, {
    method: 'PATCH',
    headers: apiConfig.headers,
    body: JSON.stringify({
      name: name,
      about: about
    })
  })
  .then(checkResponse)
  .catch(error => {
    console.error('Ошибка обновления информации профиля', error);
  })
}

let userId;

Promise.all([getUserInfoApi(), getInitialCardsApi()])
.then(([userData, cardsData]) => {
  userId = userData._id;
  setUserId(userId);
  console.log("данные пользователя и карточки", userData, cardsData);
   renderCard(cardsData, placesList);
})
.catch((error) => {
  console.error("Ошибка при загрузке данных", error);
});

export {apiConfig, checkResponse}