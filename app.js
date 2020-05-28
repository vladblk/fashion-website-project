let controller;

function animateSlides(){
  // init controller
  controller = new ScrollMagic.Controller();

  // selectors
  const sliders = document.querySelectorAll('.slide');
  const navBar = document.querySelector('.nav-header');

  // loop over all sliders
  sliders.forEach( (slide) => {
    // slide selectors
    const revealImg = slide.querySelector('.reveal-img');
    const img = slide.querySelector('.img');
    const revealText = slide.querySelector('.reveal-text');

    // GSAP
    // create timeline
    const slideTimeline = gsap.timeline({
      defaults: {
        duration: 1,
        ease: 'power2-inOut',
      }
    });
    slideTimeline.fromTo(revealImg, {x: '0%'}, {x: '100%'});
    slideTimeline.fromTo(img, {scale: 2}, {scale: 1}, '-=1');
    slideTimeline.fromTo(revealText, {x: '0%'}, {x: '100%'}, '-=0.6');
    slideTimeline.fromTo(navBar, {y: '-100%'}, {y: '0%'}, '-=0.6');
  });
};

animateSlides();