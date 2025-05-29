function openModal(modal) {
  modal.classList.add("popup_is-opened");
  document.addEventListener("keydown", closeByEscape);
}

function closeModal() {
  document
    .querySelector(".popup_is-opened")
    .classList.remove("popup_is-opened");
  removeEventListener("keydown", closeByEscape);
}

function closeByEscape(evt) {
  if (evt.key === "Escape") {
    const escape = document.querySelector(".popup_is-opened");
    closeModal(escape);
  }
}

export { openModal, closeModal };
