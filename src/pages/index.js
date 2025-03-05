//Imports
import "./index.css";

import {
  enableValidation,
  config,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";

import { Api } from "../utils/Api.js";

//Card deletion modal elements
const cardDeleteModal = document.querySelector("#delete-modal");
const cardDeleteCloseButton = cardDeleteModal.querySelector(
  ".modal__close-button"
);
const cardDeleteCancelButton = cardDeleteModal.querySelector(
  "#delete-post-cancel"
);
const cardDeleteForm = cardDeleteModal.querySelector(".modal__delete-buttons");

//Edit profile modal elements
const profileEditButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile");
const editCloseButton = editProfileModal.querySelector(".modal__close-button");
const profileFormElement = editProfileModal.querySelector(".modal__form");
const nameInput = editProfileModal.querySelector("#name-input");
const jobInput = editProfileModal.querySelector("#description-input");

//Edit avatar modal elements
const editAvatarButton = document.querySelector(".profile__avatar-button");
const editAvatarModal = document.querySelector("#edit-avatar");
const avatarSubmitButton = editAvatarModal.querySelector(
  ".modal__submit_button"
);
const avatarCloseButton = editAvatarModal.querySelector(".modal__close-button");
const avatarInput = editAvatarModal.querySelector("#avatar-input");
const avatarForm = editAvatarModal.querySelector(".modal__form");

//New post modal elements
const newPostButton = document.querySelector(".profile__post-button");
const newPostModal = document.querySelector("#new-post");
const newPostCloseButton = newPostModal.querySelector(".modal__close-button");
const newPostForm = newPostModal.querySelector(".modal__form");
const linkInput = newPostModal.querySelector("#link-input");
const captionInput = newPostModal.querySelector("#caption-input");
const newPostSubmitButton = newPostModal.querySelector("#new-post-submit");

//Post preview modal elements
const previewModal = document.querySelector("#preview-modal");
const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__image-caption");
const previewCloseButton = previewModal.querySelector(
  ".modal__close-button_type_preview"
);

//Profile elements
const avatarImage = document.querySelector(".profile__avatar");
const profileNameElement = document.querySelector(".profile__name");
const profileJobElement = document.querySelector(".profile__description");

//Card elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");
let selectedCard;
let selectedCardId;

//API initialization
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "36b3b370-c3f7-447d-abe8-f5174d0c50a3",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, me]) => {
    cards.forEach((card) => {
      const cardFill = getCardTemplate(card);
      cardsList.prepend(cardFill);
    });
    const userInfo = me;
    const profileAvatar = document.querySelector(".profile__avatar");
    profileAvatar.src = userInfo["avatar"];
    profileNameElement.textContent = userInfo["name"];
    profileJobElement.textContent = userInfo["about"];
  })
  .catch((err) => {
    console.error(err);
  });

//Card generation
function getCardTemplate(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-button_clicked");
  }

  cardLikeButton.addEventListener("click", (evt) => {
    handleLike(evt, data._id);
  });

  cardDeleteButton.addEventListener("click", (evt) => {
    handleCardDelete(cardElement, data);
  });

  cardImageElement.addEventListener("click", () => {
    openModal(previewModal);
    previewImage.src = data.link;
    previewImage.alt = cardImageElement.alt;
    previewCaption.textContent = data.name;
  });

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  return cardElement;
}

//Card deletion handler
function handleCardDelete(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(cardDeleteModal);
}

//Card like handler
function handleLike(evt, id) {
  const isLiked = evt.target.classList.contains("card__like-button_clicked");
  const cardId = id;
  api
    .changeLiked({ _id: cardId, isLiked: isLiked })
    .then(() => {
      evt.target.classList.toggle("card__like-button_clicked");
    })
    .catch((err) => {
      console.error(err);
    });
}

//Modal open and close functions
function openModal(modal) {
  modal.classList.add("modal_opened");
  modal.addEventListener("mousedown", handleOverlayClose);
  document.addEventListener("keydown", handleEscKey);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  modal.removeEventListener("mousedown", handleOverlayClose);
  document.removeEventListener("keydown", handleEscKey);
}

function handleOverlayClose(evt) {
  if (evt.target.classList.contains("modal_opened")) {
    closeModal(evt.target);
  }
}

function handleEscKey(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

//Edit profile modal listeners
profileEditButton.addEventListener("click", () => {
  nameInput.value = profileNameElement.textContent;
  jobInput.value = profileJobElement.textContent;
  resetValidation(profileFormElement, [nameInput, jobInput], config);
  openModal(editProfileModal);
});

editCloseButton.addEventListener("click", () => {
  closeModal(editProfileModal);
});

//Edit avatar modal listeners
editAvatarButton.addEventListener("click", () => {
  resetValidation(avatarForm, [avatarInput], config);
  openModal(editAvatarModal);
});

avatarCloseButton.addEventListener("click", () => {
  closeModal(editAvatarModal);
});

//New post modal listeners
newPostButton.addEventListener("click", () => {
  openModal(newPostModal);
});

newPostCloseButton.addEventListener("click", () => {
  closeModal(newPostModal);
});

//Post preview modal listener
previewCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
});

//Card deletion modal listeners
cardDeleteCloseButton.addEventListener("click", () => {
  closeModal(cardDeleteModal);
});

cardDeleteCancelButton.addEventListener("click", () => {
  closeModal(cardDeleteModal);
});

//Submission handlers
function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  submitButton.textContent = "Deleting...";
  api
    .deleteCard({ _id: selectedCardId })
    .then(() => {
      selectedCard.remove();
      closeModal(cardDeleteModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      submitButton.textContent = "Delete";
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  submitButton.textContent = "Saving...";
  api
    .editAvatar(avatarInput.value)
    .then((data) => {
      avatarImage.src = data.avatar;
      closeModal(editAvatarModal);
    })
    .catch((err) => console.error(err))
    .finally(() => {
      submitButton.textContent = "Save";
    });
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  submitButton.textContent = "Saving...";
  api
    .editUserInfo({ name: nameInput.value, about: jobInput.value })
    .then((data) => {
      profileNameElement.textContent = data.name;
      profileJobElement.textContent = data.about;
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      submitButton.textContent = "Save";
    });

  closeModal(editProfileModal);
}

function handleNewPostSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  submitButton.textContent = "Saving...";
  api
    .addNewCard({ name: captionInput.value, link: linkInput.value })
    .then((data) => {
      const inputValues = { name: data.name, link: data.link };
      const cardFill = getCardTemplate(inputValues);
      cardsList.prepend(cardFill);
      closeModal(newPostModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      submitButton.textContent = "Save";
    });
  evt.target.reset();
  disableButton(newPostSubmitButton, config);
}

//Submission listeners
newPostForm.addEventListener("submit", handleNewPostSubmit);
cardDeleteForm.addEventListener("submit", handleDeleteSubmit);
profileFormElement.addEventListener("submit", handleProfileFormSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);

//Validation initialization
enableValidation(config);
