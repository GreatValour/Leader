$(function () {
  $('div.form-error-message').css('display', 'none');
  if ($('.has-error').length) {
    $('div.form-error-message').css('display', 'block');
  }

  // For phone number validation
  $(".isNumber").on("keyup change", function () {
    if ($(this).inputmask('unmaskedvalue').trim().charAt(0) == "1") {
      $(this).inputmask("9 (999) 999-9999");
    }
    else {
      $(this).inputmask("(999) 999-9999");
    }
  });
  $(".isNumber").inputmask({
    showMaskOnHover: false,
    mask: '(999) 999-9999'
  }
  );

});

//Call Back Recaptcha Function..
function onRecaptchaSubmit() {
  var form_id = $(".ajaxform").attr("id");
  if ($(".hero__form").length > 0) {
    form_id = $(".hero__form").attr("id");
  }
  document.getElementById(form_id).submit();
  return false;
}

var $body = $('body');
$(function () {
  //Init lozad(Lazyload)
  const observer = lozad();
  observer.observe();

  // show get stated panel after 3 second
  setTimeout(function () {
    if ($('.get-started-panel').length) {
      $body.addClass('get-started-panel--open');
    }
  }, 3000);

  //Mobile Menu
  $('.menu-trigger').on('click', function () {
    $('body').toggleClass('menu--open');
    nav_height();
    $('.has-sub').removeClass('has--open');
    $('.sub-menu').slideUp();
    $body.removeClass('get-started-panel--open');
  });

  // Go to top
  $(".goto-top").on('click', function () {
    $("html, body").animate({ scrollTop: 0 }, 1000);
    return false;
  });

  //Mobile Menu
  $('.arrow').on('click', function () {
    $(this).parent('li').find('.has-sub').removeClass('has--open');
    $(this).parent().siblings('li').removeClass('has--open').find('ul.sub-menu').slideUp();
    $(this).parent().toggleClass('has--open').find('ul.sub-menu').first().slideToggle();
  });

  // Testimonial Slider
  var testimonialSlider = $('.testimonial-slider');
  if (testimonialSlider.length) {
    if (testimonialSlider.find('.testimonial-slider__slide').length > 1) {
      testimonialSlider.owlCarousel({
        items: 1,
        nav: true,
        dots: false,
        loop: true,
        autoHeight: true,
        autoplay: true,
        autoplayTimeout: 6000,
        autoplayHoverPause: true,
        smartSpeed: 800,
        onInitialize: function () {
          if (testimonialSlider.find('.testimonial-slider__slide').length === 1) {
            this.settings.loop = false;
            this.settings.nav = false;
          }
        }
      });
    } else {
      testimonialSlider.show();
    }
  }

  // hide/show get started panel
  $('.get-started-trigger').on('click', function () {
    $body.toggleClass('get-started-panel--open');
    setGetStartedPanelHeight();
  });
  $('.get-started-panel__close').on('click', function () {
    $body.removeClass('get-started-panel--open');
  });

  //Tabs
  $(".tab-wrapper").each(function () {
    if ($(this).find('.tab__link').length) {
      $(this).find(".tab__content").hide();
      $(this).find(".tab__content:first").addClass('tab__content--active').show();
      $(this).find(".tab__link li").on('click', function () {
        var activeTab = $(this).attr("rel");
        $("#" + activeTab).siblings(".tab__content").removeClass('tab__content--active').fadeOut(300);
        $("#" + activeTab).addClass('tab__content--active').fadeIn(300);
        $(this).addClass("active").siblings('li').removeClass("active");
      });

      /* if in responsive mode */
      $(this).find(".tab__link-responsive").on('click', function () {
        var d_activeTab = $(this).attr("rel");
        $("#" + d_activeTab).siblings(".tab__content").removeClass('tab__content--active').slideUp();
        $("#" + d_activeTab).addClass('tab__content--active').slideDown();
        $(this).addClass("active").siblings('.tab__link-responsive').removeClass("active");

        const scrollVal = $(this).parents('.tab__container').offset().top - header_height();
        $("html, body").animate({ scrollTop: scrollVal }, 1000);
      });
    }
  });
});

$(window).on('resize', function () {
  nav_height();
  setGetStartedPanelHeight();
});

var stickyOffset = $('header').height();
var previousScroll = 0;
$(window).on('scroll', function () {
  var scroll = $(window).scrollTop();

  // Fixed Menu
  if (scroll >= 50) {
    $('body').addClass('fixed-header');
  } else {
    $('body').removeClass('fixed-header');
  }

  /* for go to top arrow */
  var currentScroll = $(this).scrollTop();
  if (currentScroll > previousScroll) {
    if (scroll >= stickyOffset + 100) {
      $('.goto-top').addClass('visible');
    }
  } else {
    $('.goto-top').removeClass('visible');
  }
});

$(document).on("touchstart click", function (e) {
  const container = $('.navigation, .get-started-trigger');
  const contactInfo = $('.navigation, .get-started-panel, .menu-trigger');
  if (!container.is(e.target) // if the target of the click isn't the container...
    && container.has(e.target).length === 0 && !contactInfo.is(e.target) && contactInfo.has(e.target).length === 0) {
    $body.removeClass('menu--open');
    $body.removeClass('get-started-panel--open');
  }
});

var delay = 500, clicks = 0, timer = null;
function isTouchDevice() {
  return true == ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);
}
$(document).on("click", ".has-sub > a", function (e) {
  if (isTouchDevice() === true && (window.matchMedia('(min-width: 993px)').matches) && (window.matchMedia('(max-width: 1200px)').matches)) {
    clicks++;
    if (clicks === 1) {
      timer = setTimeout(function () {
        clicks = 0;
      }, delay);
      e.preventDefault();
    } else {
      clearTimeout(timer);
      clicks = 0;
    }
  }
}).on("dblclick", function (e) { });

function nav_height() {
  if (win_width() > 992) {
    $('.navigation').css('height', 'auto');
  } else {
    $('.navigation').css('height', win_height() - header_height() + 2);
  }
}
function win_height() {
  return $(window).outerHeight();
}
function win_width() {
  return $(window).width();
}
function header_height() {
  return $('header.page-header').outerHeight();
}
function setGetStartedPanelHeight() {
  if (win_width() < 767) {
    $('.get-started-panel .get-started-panel__content').css('height', win_height() - header_height());
  } else {
    $('.get-started-panel .get-started-panel__content').css('height', 'auto');
  }
}
