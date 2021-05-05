'use strict';

document.documentElement.classList.remove('nojs');

// Оптимизация ресайза окна
(function () {
  var throttle = function (type, name, obj) {
    obj = obj || window;
    var running = false;

    var func = function () {
      if (running) {
        return;
      }

      running = true;

      requestAnimationFrame(function () {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };

    obj.addEventListener(type, func);
  };

  throttle('resize', 'optimizedResize');
})();

// Переключаетль меню
(function () {
  var MAX_WIDTH = 1023;

  var toggle = document.querySelector('.burger');
  var menu = document.querySelector('.header__menu');

  var changeButtonLabel = function () {
    if (toggle.classList.contains('burger__active')) {
      toggle.children[0].innerText = 'Закрыть меню';
    } else {
      toggle.children[0].innerText = 'Открыть меню';
    }
  };

  var showerMenu = function () {
    document.documentElement.classList.toggle('page--menu-open');
    toggle.classList.toggle('burger__active');
    menu.classList.toggle('header__menu-open');

    changeButtonLabel();
  };

  var onMenuLinkClick = function (evt) {
    if (evt.target.tagName === 'A') {
      showerMenu();
    }
  };

  var onMenuButtonClick = function () {
    showerMenu();
  };

  var menuToggleHandlers = function () {
    if (window.innerWidth > MAX_WIDTH) {
      toggle.removeEventListener('click', onMenuButtonClick);
      menu.removeEventListener('click', onMenuLinkClick);
    } else {
      toggle.addEventListener('click', onMenuButtonClick);
      menu.addEventListener('click', onMenuLinkClick);
    }
  };

  toggle.addEventListener('click', onMenuButtonClick);
  menu.addEventListener('click', onMenuLinkClick);

  menuToggleHandlers();

  window.addEventListener('optimizedResize', function () {
    menuToggleHandlers();
  });
})();


// Плавная прокрутка по якорям
(function () {
  var pageAnchors = document.querySelectorAll('a[href^="#block-"]');

  pageAnchors.forEach(function (link) {

    link.addEventListener('click', function (evt) {
      evt.preventDefault();

      var blockID = link.getAttribute('href');
      document.querySelector(blockID).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  });
})();

// Переключение табов
(function () {

  var tourCountries = document.querySelector('.tour-countries');
  var tourTabsSection = document.querySelector('.tour-tabs');
  var tourCardList = document.querySelector('.tours__card-list');
  var tourTabsLink = tourTabsSection.querySelectorAll('a[href*="#"]');
  var tourCardsLink = tourCardList.querySelectorAll('a[href*="#"]');
  var tourElements = tourCountries.querySelectorAll('.tour-countries__item');

  var onCountryTabClick = function (link) {

    link.addEventListener('click', function (evt) {
      evt.preventDefault();

      var linkHashID = evt.target.hash.substr(1);

      tourElements.forEach(function (item) {
        var itemID = item.id;

        item.classList.remove('tour-countries__item--active');

        if (itemID === linkHashID) {
          item.classList.add('tour-countries__item--active');
        }
      });
    });
  };

  var onCountryCardClick = function (link) {
    link.addEventListener('click', function (evt) {
      evt.preventDefault();

      var linkID = evt.target.id.substr(5);

      tourElements.forEach(function (item) {
        var itemID = item.id;

        item.classList.remove('tour-countries__item--active');

        if (itemID === linkID) {
          item.classList.add('tour-countries__item--active');
        }
      });
    });
  };

  tourTabsLink.forEach(function (link) {
    onCountryTabClick(link);
  });

  tourCardsLink.forEach(function (link) {
    onCountryCardClick(link);
  });

})();

// Показ модального окна
(function () {
  // var toursSection = document.querySelector('.tours');
  var toursCountries = document.querySelector('.tour-countries');
  var priceSection = document.querySelector('.price');
  var buyModal = document.querySelector('#modal-buy');
  var successModal = document.querySelector('#modal-success');
  var closeModalButtons = document.querySelectorAll('.modal__close-button');
  var modalForm = buyModal.querySelector('.modal__form');
  var feedbackForm = document.querySelector('.feedback-form');
  var telField = document.querySelector('#feedback-phone');
  var emailField = document.querySelector('#feedback-email');

  var isStorageSupport = true;
  var storageTel = '';
  var storageEmail = '';

  try {
    storageTel = localStorage.getItem('tel');
    storageEmail = localStorage.getItem('email');
  } catch (err) {
    isStorageSupport = false;
  }

  var showModal = function (element) {
    document.body.classList.add('page--modal-open');
    element.classList.add('active-modal');
    element.classList.remove('hidden');
    document.addEventListener('keydown', onModalEscPress);
    element.addEventListener('click', onOverlayClick);
  };

  // Закрытие модального окна
  var closeModal = function () {
    var element = document.querySelector('.active-modal');

    document.body.classList.remove('page--modal-open');
    element.classList.remove('active-modal');
    element.classList.add('hidden');
    document.removeEventListener('keydown', onModalEscPress);
  };

  var onOverlayClick = function (evt) {
    if (evt.target.classList.contains('modal')) {
      closeModal();
    }
  };

  // Нажатие на Esc закрывает окно
  var onModalEscPress = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeModal();
    }
  };

  var showBuyModal = function () {
    showModal(buyModal);
    var userTel = buyModal.querySelector('input[type=tel]');

    if (storageTel && storageEmail) {
      telField.value = storageTel;
      emailField.value = storageEmail;
      buyModal.focus();
    } else {
      userTel.focus();
    }
  };

  var showSuccessModal = function () {
    showModal(successModal);
  };

  var onFormModalSubmit = function (evt) {
    evt.preventDefault();

    closeModal();
    showSuccessModal(evt);
  };

  var onFormSubmit = function (evt) {
    evt.preventDefault();
    showSuccessModal(evt);
  };

  toursCountries.addEventListener('click', function (evt) {
    evt.preventDefault();
    var isBuyButton = evt.target.classList.contains('tour-countries__button');

    if (isBuyButton) {
      showBuyModal(evt);
    }
  });

  priceSection.addEventListener('click', function (evt) {
    evt.preventDefault();
    var isBuyButton = evt.target.classList.contains('package__button');

    if (isBuyButton) {
      showBuyModal(evt);
    }
  });

  closeModalButtons.forEach(function (element) {
    element.addEventListener('click', function () {
      closeModal();
    });
  });

  modalForm.addEventListener('submit', onFormModalSubmit);
  feedbackForm.addEventListener('submit', onFormSubmit);

})();
