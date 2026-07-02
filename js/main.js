/*global $, jQuery*/
$(document).ready(function () {

  'use strict';

  // Layout constants (pixels / milliseconds).
  const FIXED_HEADER_OFFSET = 80;
  const SMOOTH_SCROLL_DURATION = 500;
  const NAVBAR_REVEAL_SCROLL = 200;
  const NAVBAR_SLIDE_DURATION = 700;
  const MOBILE_BREAKPOINT = 768;
  const TYPING_SPEED = 100;
  const POPUP_REMOVAL_DELAY = 300;
  const POPUP_ZOOM_DURATION = 300;

  // Anchor links scroll smoothly to their target and mark themselves active.
  function initSmoothScroll() {
    $('a[href^="#"]').on('click', function (event) {
      event.preventDefault();

      $('a').removeClass('active');
      $(this).addClass('active');

      if ($(window).width() < MOBILE_BREAKPOINT) {
        $('.nav-menu').slideUp();
      }

      const targetHash = this.hash;
      const target = $(targetHash);
      $('html, body').stop().animate(
        { scrollTop: target.offset().top - FIXED_HEADER_OFFSET },
        SMOOTH_SCROLL_DURATION,
        'swing',
        function () {
          window.location.hash = targetHash;
        }
      );
    });
  }

  // Reveal the sticky navbar once the user scrolls past the hero area.
  function initNavbarReveal() {
    $(window).scroll(function () {
      const scrolledPastHero = $(window).scrollTop() > NAVBAR_REVEAL_SCROLL;
      if (scrolledPastHero) {
        $('#main-nav, #main-nav-subpage').slideDown(NAVBAR_SLIDE_DURATION);
        $('#main-nav-subpage').removeClass('subpage-nav');
      } else {
        $('#main-nav').slideUp(NAVBAR_SLIDE_DURATION);
        $('#main-nav-subpage').hide().addClass('subpage-nav');
      }
    });
  }

  // Toggle the collapsed navigation menu on small screens.
  function initResponsiveMenu() {
    $('.responsive').on('click', function () {
      $('.nav-menu').slideToggle();
    });
  }

  // Animated typing effect for the hero heading.
  function initTypedHeading() {
    $('.typed').typed({
      strings: ['Dr. Rea Nkhumise', 'A Scientist', 'An Engineer'],
      typeSpeed: TYPING_SPEED,
      loop: true
    });
  }

  // Responsive services carousel.
  function initServicesCarousel() {
    $('.services-carousel').owlCarousel({
      autoplay: true,
      loop: true,
      margin: 20,
      dots: true,
      nav: false,
      responsiveClass: true,
      responsive: { 0: { items: 1 }, 768: { items: 2 }, 900: { items: 4 } }
    });
  }

  // Zoomable image lightbox gallery.
  function initImagePopup() {
    $('.popup-img').magnificPopup({
      type: 'image',
      removalDelay: POPUP_REMOVAL_DELAY,
      mainClass: 'mfp-with-zoom',
      gallery: { enabled: true },
      zoom: {
        enabled: true,
        duration: POPUP_ZOOM_DURATION,
        easing: 'ease-in-out',
        opener: function (openerElement) {
          return openerElement.is('img') ? openerElement : openerElement.find('img');
        }
      }
    });
  }

  // Keep the footer copyright year current without a build step.
  function initCopyrightYear() {
    $('.year').text(new Date().getFullYear());
  }

  initCopyrightYear();
  initSmoothScroll();
  initNavbarReveal();
  initResponsiveMenu();
  initTypedHeading();
  initServicesCarousel();
  initImagePopup();

});

// Portfolio grid layout and category filtering (needs images loaded for sizing).
$(window).load(function () {

  'use strict';

  const portfolioIsotope = $('.portfolio-container').isotope({
    itemSelector: '.portfolio-thumbnail',
    layoutMode: 'fitRows'
  });

  $('#portfolio-flters li').on('click', function () {
    $('#portfolio-flters li').removeClass('filter-active');
    $(this).addClass('filter-active');
    portfolioIsotope.isotope({ filter: $(this).data('filter') });
  });

});
