const formElementEditProfile = document.forms["edit-profile"];

const nameInput = document.querySelector(".profile__title");
const jobInput = document.querySelector(".profile__description");

function openModal(modal) {
  modal.classList.add("popup_is-animated");
  setTimeout(() => {
    modal.classList.add("popup_is-opened");
  }, 10);
  document.addEventListener("keydown", closeByEscape);
}

function closeModal() {
  document
    .querySelector(".popup_is-opened")
    .classList.remove("popup_is-opened");
}

function closeByEscape(evt) {
  if (evt.key === "Escape") {
    const escape = document.querySelector(".popup_is-opened");
    closeModal(escape);
  }
}

function handleFormSubmit(evt) {
  evt.preventDefault();
  nameInput.textContent = formElementEditProfile.name.value;
  jobInput.textContent = formElementEditProfile.description.value;
  closeModal();
}

export {
  openModal,
  closeByEscape,
  closeModal,
  handleFormSubmit,
  jobInput,
  nameInput,
  formElementEditProfile,
};
