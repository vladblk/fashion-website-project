let controller, slideScene, pageScene;

function animateSlides(){
  // init controller
  controller = new ScrollMagic.Controller();

  // selectors
  const sliders = document.querySelectorAll('.slide');
  const navBar = document.querySelector('.nav-header');

  // loop over all sliders
  sliders.forEach( (slide, index, slidersArr) => {
    // slide selectors
    const revealImg = slide.querySelector('.reveal-img');
    const img = slide.querySelector('.img');
    const revealText = slide.querySelector('.reveal-text');

    // GSAP
    // create slide timeline
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

    // create slide scene
    slideScene =  new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
      reverse: false,
    }).addIndicators({
        colorStart: 'white',
        colorTrigger: 'white',
        name: 'slide'
    }).setTween(slideTimeline)
      .addTo(controller);

    // create page animation
    const pageTimeline = gsap.timeline();

    // get the next slide
    let nextSlide = slidersArr.length - 1 === index ? 'end' : slidersArr[index + 1];

    pageTimeline.fromTo(nextSlide, {y: '0%'}, {y: '50%'});
    pageTimeline.fromTo(slide, {opacity: 1, scale: 1}, {opacity: 0, scale: 0});
    pageTimeline.fromTo(nextSlide, {y: '50%'}, {y: '0%'}, '-=0.5');
    
    // create page screne
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      // starts at the top of the slide
      triggerHook: 0,
      // the duration of the animation will be 100% height of the slide
      duration: '100%'
    }).addIndicators({
        colorStart: 'white',
        colorTrigger: 'white',
        name: 'page',
        indent: '100'
    })
      .setTween(pageTimeline)
      .setPin(slide, {pushFollowers: false})
      .addTo(controller);
  });
};

animateSlides();