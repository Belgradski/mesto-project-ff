import { clearValidation, validationConfig } from "./validation";


function resetForm(formElement) {
  formElement.resetForm();
}


function openModal(modal) {
  modal.classList.add("popup_is-opened");
  document.addEventListener("keydown", closeByEscape);
}

function closeModal() {
  const openModal = document.querySelector(".popup_is-opened");
  document.removeEventListener("keydown", closeByEscape);
  const resetForm = openModal.querySelector('.popup__form');
  if (resetForm) {
    resetForm.reset();
    
  }
  openModal.classList.remove("popup_is-opened");
}

function closeByEscape(evt) {
  if (evt.key === "Escape") {
    const escape = document.querySelector(".popup_is-opened");
    closeModal(escape);
  }
}

export { openModal, closeModal, resetForm };
