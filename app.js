// ANIMATE SLIDES

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
    slideTimeline.fromTo(navBar, {y: '-100%'}, {y: '0%'}, '-=1');

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

// ANIMATE CURSOR

const cursor = document.querySelector('.cursor');
const cursorText = cursor.querySelector('.cursor-text');

function cursorAnimation(e){
  cursor.style.top = `${e.pageY}px`;
  cursor.style.left = `${e.pageX}px`;
};

function hoverAnimation(e){
  const item = e.target;
  console.log(item);

  if(item.classList.contains('nav-header__logo') || item.classList.contains('nav-header__burger-menu')){
    cursor.classList.add('cursor-nav-active');
  } else {
    cursor.classList.remove('cursor-nav-active');
  }

  if(item.classList.contains('btn')){
    cursor.classList.add('cursor-explore-active');
    cursorText.innerText = 'Tap';
    gsap.to('.title-swipe', 1, {y: '0%'});
  } else {
    cursor.classList.remove('cursor-explore-active');
    cursorText.innerText = '';
    gsap.to('.title-swipe', 1, {y: '100%'});
  }
}

window.addEventListener('mousemove', cursorAnimation);
window.addEventListener('mouseover', hoverAnimation);


// NAVIGATION TOGGLE
const burgerMenu = document.querySelector('nav-header__burger-menu');

function toggleMenu(e){
  if(e.target.classList.contains('nav-header__burger-menu') && !e.target.classList.contains('active')){
    e.target.classList.add('active');
    document.body.classList.add('remove-scroll');

    gsap.to('.nav-header__burger-menu-line1', 0.5, {rotate: 45, y: 3, background: 'black'});
    gsap.to('.nav-header__burger-menu-line2', 0.5, {rotate: -45, y: -3, background: 'black'});
    gsap.to('.nav-container', 1, {clipPath: 'circle(2500px at 100% -10%)'});
    gsap.to('.nav-header__logo', 0.5, {color: 'black'});
  } else {
    e.target.classList.remove('active');
    document.body.classList.remove('remove-scroll');

    gsap.to('.nav-header__burger-menu-line1', 0.5, {rotate: 0, y: 0, background: 'white'});
    gsap.to('.nav-header__burger-menu-line2', 0.5, {rotate: 0, y: 0, background: 'white'});
    gsap.to('.nav-container', 1, {clipPath: 'circle(50px at 100% -10%)'});
    gsap.to('.nav-header__logo', 0.5, {color: 'white'});
  }
}

window.addEventListener('click', toggleMenu);


// BARBA PARGE TRANSITIONS
barba.init({
  views: [
    {
      namespace: 'home-page',

      beforeEnter(){
        animateSlides();
      },

      beforeLeave(){
        controller.destroy(),
        slideScene.destroy(),
        pageScene.destroy()
      }
    },
    {
      namespace: 'fashion-page',
      beforeEnter(){
        // gsap.fromTo('.nav-header', 3.5, {y: '-100%'}, {y: '0%', ease: 'power2-inOut'});
      }
    }
  ],

  transitions: [
    {
      leave({current, next}){
        let done = this.async();

        const timeline = gsap.timeline({
          defaults: {
            ease: 'power2-inOut'
          }
        });

        timeline.fromTo(current.container, 1, {opacity: 1}, {opacity: 0, onComplete: done});
        timeline.fromTo('.loading-swipe', 0.5, {x: '-100%'}, {x: '0%', onComplete: done}, '-=0.5')
      },

      enter({current, next}){
        let done = this.async();

        // scroll to the top of the page you're going
        window.scroll(0, 0);

        const timeline = gsap.timeline({
          defaults: {
            ease: 'power2-inOut'
          }
        });

        timeline.fromTo('.loading-swipe', 1, {x: '0%'}, {x: '100%', stagger: 0.5, onComplete: done})
        timeline.fromTo(next.container, 0.5, {opacity: 0}, {opacity: 1, onComplete: done});
        timeline.fromTo('.nav-header', 1.1, {y: '-100%'}, {y: '0%'});
      }
    }
  ]
})