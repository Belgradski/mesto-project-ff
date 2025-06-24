
export const apiConfig = {
  url: "https://nomoreparties.co/v1/wff-cohort-41",
  headers: {
    "Content-Type": "application/json",
    authorization: "7564c66a-aa2b-404d-99e6-765f18d0ed8a",
  },
};

export const checkResponseApi = (res) => {
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
      return checkResponseApi(res);
    })
};

export const getInitialCardsApi = () => {
  return fetch(`${apiConfig.url}/cards`, {
    headers: apiConfig.headers,
  })
    .then((res) => {
      return checkResponseApi(res);
    })
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
    .then(checkResponseApi)
};

export const addCardApi = (cardPlaceName, cardLink) => {

  return fetch(`${apiConfig.url}/cards`, {
    method: "POST",
    headers: apiConfig.headers,
    body: JSON.stringify({
      name: cardPlaceName,
      link: cardLink,
    }),
  })
    .then((res) => {
      return checkResponseApi(res);
    })   
}

export const updateAvatarApi = (link) => {
  return fetch(`${apiConfig.url}/users/me/avatar`, {
    method: "PATCH",
    headers: apiConfig.headers,
    body: JSON.stringify({
      avatar: link,
    }),
  })
    .then((res) => {
      return checkResponseApi(res);
    })
}

export const deleteCardApi = (card, cardId) => {
  return fetch(`${apiConfig.url}/cards/${cardId}`, {
    method: 'DELETE',
    headers: apiConfig.headers
  })
  .then((res) => {return checkResponseApi(res)})
  .then(() => {
    card.remove();
  })
}

export const toggleLike = (method, cardId, likeButton, likeCounter) => {
  return fetch(`${apiConfig.url}/cards/likes/${cardId}`, {
    method: method,
    headers: apiConfig.headers
  })
    .then((res) => {return checkResponseApi(res)})
    .then((updateCard) => {
      likeCounter.textContent = updateCard.likes.length;
      likeButton.classList.toggle('card__like-button_is-active')
    }) 
}