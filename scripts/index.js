const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const profileEditButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile");
const modalCloseButton = document.querySelector(".modal__close-button");
const profileFormElement = document.querySelector(".modal__form");
const nameInput = document.querySelector("#name-input");
const jobInput = document.querySelector("#description-input");
const profileNameElement = document.querySelector(".profile__name");
const profileJobElement = document.querySelector(".profile__description");
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function getCardTemplate(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  return cardElement;
}

function openModal() {
  nameInput.value = profileNameElement.textContent;
  jobInput.value = profileJobElement.textContent;
  editProfileModal.classList.add("modal_opened");
}

function closeModal() {
  editProfileModal.classList.remove("modal_opened");
}

profileEditButton.addEventListener("click", openModal);
modalCloseButton.addEventListener("click", closeModal);

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileNameElement.textContent = nameInput.value;
  profileJobElement.textContent = jobInput.value;
  closeModal();
}

profileFormElement.addEventListener("submit", handleProfileFormSubmit);

for (let i = 0; i < initialCards.length; i++) {
  const cardFill = getCardTemplate(initialCards[i]);
  cardsList.prepend(cardFill);
}
