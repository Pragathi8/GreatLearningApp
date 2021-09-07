import "../scss/index.scss";

const headerContainer = document.querySelector(".header-container");
const footerContainer = document.querySelector("footer");
const accordianTitles = document.getElementsByClassName("accordian-title");
const dots = document.getElementsByClassName("dot");
const prevSlide = document.querySelector(".prev");
const nextSlide = document.querySelector(".next");
const applyBtn = document.querySelector(".apply_btn");
const formSubmitBtn = document.querySelector(".form_submit");
//form elements
const userNameEl = document.querySelector("#name");
const userEmailEl = document.querySelector("#email");
const userPhoneNoEl = document.querySelector("#phone");
const experienceEl = document.querySelector("#experience");
const organizationEl = document.querySelector("#organization");
const authorizeEl = document.querySelector("#authorize");
const formEl = document.querySelector("#apply_form");
let slideIndex = 1;

const getToInitialState = () => {
  [...accordianTitles].forEach(acc => {
    acc.classList.remove("active");
    acc.nextElementSibling.classList.remove("show");
  });
};

const accordianClickHandler = e => {
  const setClasses = !e.target.classList.contains("active");
  getToInitialState();
  if (setClasses) {
    e.target.classList.toggle("active");
    e.target.nextElementSibling.classList.toggle("show");
  }
};

const plusSlides = n => {
  showSlides((slideIndex += n));
};

const currentSlide = n => {
  showSlides((slideIndex = n));
};

const showSlides = n => {
  var i;
  var slides = document.getElementsByClassName("slide");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
};

const scrollToTop = e => {
  e.preventDefault();
  window.scrollTo(0, 0);
};

const stickyFooter = entries => {
  const [entry] = entries;
  if (!entry.isIntersecting) footerContainer.classList.add("sticky");
  else footerContainer.classList.remove("sticky");
};

const checkExperience = exp => {
  if (isNaN(exp) || exp < 1) {
    console.log("invalid experience data");
    return false;
  }
  return true;
};

const handleFormSubmission = e => {
  e.preventDefault();
  const name = userNameEl.value.trim();
  const email = userEmailEl.value.trim();
  const phone = userPhoneNoEl.value.trim();
  const experience = experienceEl.value.trim();
  const organization = organizationEl.value.trim();
  const authorize = authorizeEl.checked;
  let isExperienceValid = checkExperience(experience);

  if (
    name &&
    email &&
    phone &&
    experience &&
    isExperienceValid &&
    organization &&
    authorize
  ) {
    console.log("form submitted");
    localStorage.setItem(
      "userData",
      JSON.stringify({
        name,
        email,
        phone,
        experience,
        organization,
        authorize
      })
    );
  } else {
    console.log("Some error in form validation, please refill the form");
  }
};

const prefillFormFields = () => {
  const formData = JSON.parse(localStorage.getItem("userData"));
  if (formData) {
    userNameEl.value = formData.name;
    userEmailEl.value = formData.email;
    userPhoneNoEl.value = formData.phone;
    experienceEl.value = formData.experience;
    organizationEl.value = formData.organization;
    authorizeEl.checked = formData.authorize;
  }
};

const init = () => {
  [...accordianTitles].map(accordianTitle =>
    accordianTitle.addEventListener("click", accordianClickHandler)
  );

  [...dots].map((dot, i) =>
    dot.addEventListener("click", () => currentSlide(i + 1))
  );

  prevSlide.addEventListener("click", () => plusSlides(-1));
  nextSlide.addEventListener("click", () => plusSlides(1));
  applyBtn.addEventListener("click", scrollToTop);
  formEl.addEventListener("submit", handleFormSubmission);

  showSlides(slideIndex);
  prefillFormFields();

  const footerObserver = new IntersectionObserver(stickyFooter, {
    root: null,
    threshold: 0,
    rootMargin: `-${footerContainer.getBoundingClientRect().height}px`
  });

  footerObserver.observe(headerContainer);
};

init();
