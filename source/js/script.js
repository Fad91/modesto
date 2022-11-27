'use strict';
document.addEventListener("DOMContentLoaded", () => {
  // Variables
  let menuBtn = document.querySelector(".js-burger-btn");
  let menu = document.querySelector(".js-menu");
  let signInBtns = document.querySelectorAll(".js-btn-sign-in");
  let signUpBtns = document.querySelectorAll(".js-btn-sign-up");
  let signInPopup = document.querySelector(".js-sign-in-popup");
  let signUpPopup = document.querySelector(".js-sign-up-popup");
  let closeBtns = document.querySelectorAll(".js-close-btn");
  let signInForm = document.querySelector(".js-login-form");
  let signUpForm = document.querySelector(".js-sign-up-form");
  let step1 = document.querySelector(".js-step-1");
  let step2 = document.querySelector(".js-step-2");
  let subscribeForm = document.querySelector(".subscribe-form");
  let nextBtn = document.querySelector(".js-btn-next");
  let backBtn = document.querySelector(".js-btn-back");
  let result = false;
  let code = document.querySelector('.js-code');
  let elements = document.querySelectorAll('.element-animation');
  let options = { threshold: [0.4] };
  let observer = new IntersectionObserver(onEntry, options);

  // Appear block by scroll

  function onEntry(entry) {
    entry.forEach(change => {
      if (change.isIntersecting) {
        change.target.classList.add('element-show');
      }
    });
  }

  for (let elm of elements) {
    observer.observe(elm);
  }

  // rendering a random code

  if (code) {
    code.textContent = Math.random().toString(36).slice(2, 7);
  }

  // Show menu

  menuBtn && menuBtn.addEventListener("click", hideMenu);

  function hideMenu() {
    menu.classList.toggle("open");
    menuBtn.classList.toggle("open");
  }

  // Show sign-in/sign-up popup

  signInBtns &&
    signInBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        showPopup(signInPopup);
      });
    });

  signUpBtns &&
    signUpBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        showPopup(signUpPopup);
      });
    });

  if (
    !signInPopup.classList.contains("hide") ||
    !signUpPopup.classList.contains("hide")
  ) {
    document.addEventListener("click", ({ target }) => {
      if (target === signInPopup || target === signUpPopup) {
        closePopup(signInPopup, signUpPopup);
      }
    });
  }

  closeBtns &&
    closeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        closePopup(signInPopup, signUpPopup);
      });
    });

  function closePopup(...popups) {
    popups.forEach((popup) => {
      if (!popup.classList.contains("hide")) {
        popup.classList.add("hide");
      }
    });
  }

  function showPopup(popup) {
    popup.classList.remove("hide");
  }

  // popup forms logic

  function checkInputs(form) {
    let inputWrappers = form.querySelectorAll(".js-input-wrapper");
    inputWrappers.forEach((wrapper) => {
      let input = wrapper.querySelector("input");
      if (!input.value) {
        let errorMessage = wrapper.querySelector(".js-error");
        errorMessage.classList.remove("hide");
        setTimeout(function () {
          errorMessage.classList.add("hide");
        }, 3000);
        result = false;
      } else {
        result =  true;
      }
    });
  }

  function addLoadingStyles(form) {
    let btn = form.querySelector('button[type="submit"]')
    btn.textContent = ''
    btn.classList.add('subscribe-form__btn--loading');
  }

  function removeLoadingStyles(form, text) {
    let btn = form.querySelector('button[type="submit"]')
    btn.textContent = text;
    btn.classList.remove('subscribe-form__btn--loading');
  }

  function postData(popup = false, form, body) {
    let url = "#";
      if (result) {
        addLoadingStyles(form);
        setTimeout(function() {
          fetch(url, {
            method: "POST",
            credentials: "same-origin",
            body: new FormData(form)
          }).then(function (response) {
            if (response.ok) {
              alert("Все норм!");
            } else {
              if (popup) {
                removeLoadingStyles(form, 'Успешно!')
                setTimeout(function () {
                    popup.classList.add("hide");
                }, 3000);
              } else {
                removeLoadingStyles(form, 'Успешно!')
                form.reset();
              }
            }
          });
        }, 3000)
      }
  }

  signInForm &&
    signInForm.addEventListener("submit", (evt) => {
      evt.preventDefault();
      checkInputs(signInForm);
      postData(signInPopup, signInForm);
    });

  signUpForm &&
    signUpForm.addEventListener("submit", (evt) => {
      evt.preventDefault();
      checkInputs(signUpForm);
      postData(signUpPopup, signUpForm);
    });

  // Subscribe form logic

  nextBtn.addEventListener('click', showNextStep);
  backBtn.addEventListener('click', showPrevStep);

  subscribeForm && subscribeForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    checkInputs(subscribeForm);
    postData('', subscribeForm);
  });

  function showNextStep() {
    checkInputs(step1);
    if (result) {
      step1.classList.add('hide');
      step2.classList.remove('hide');
    }
  }

  function showPrevStep() {
    step2.classList.add('hide');
    step1.classList.remove('hide');
  }
});
