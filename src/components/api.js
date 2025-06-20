import { updateProfile } from "../index.js";

export const apiConfig = {
  url: "https://nomoreparties.co/v1/wff-cohort-41",
  headers: {
    "Content-Type": "application/json",
    authorization: "7564c66a-aa2b-404d-99e6-765f18d0ed8a",
  },
};

export const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(console.log(`Ошибка: ${res.status}`));
};

export const getUserInfoApi = () => {
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
      throw error;
    });
};

export const getInitialCardsApi = () => {
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

export const setUserInfoApi = (name, about) => {
  return fetch(`${apiConfig.url}/users/me`, {
    method: "PATCH",
    headers: apiConfig.headers,
    body: JSON.stringify({
      name: name,
      about: about,
    }),
  })
    .then(checkResponse)
    .catch((error) => {
      console.error("Ошибка обновления информации профиля", error);
    });
};
