export function openModal(modal) {
  modal.classList.add("popup_is-opened");
  document.addEventListener("keydown", closeByEscape);
}

export function closeModal(modal) {
  if (!modal) return;

  modal.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", closeByEscape);
}

function closeByEscape(evt) {
  if (evt.key === "Escape") {
    const modal = document.querySelector(".popup_is-opened");
    closeModal(modal);
  }
}


