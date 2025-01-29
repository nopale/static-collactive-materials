(function () {
  'use strict';

  var lazyload = {
    init() {
      function lazyLoad() {
        if (document.body.contains(document.querySelector('img[loading="lazy"]'))) {
          let lazyImages = document.querySelectorAll('img[loading="lazy"]');

          lazyImages.forEach(image => {
            let imageSrc = image.getAttribute('data-src');
            let imageSrcset = image.getAttribute('data-srcset');

            if (isInViewport(image)) {
              image.addEventListener('load', onImageLoad);

              if(image.complete && image.naturalHeight !== 0) {
                // Already loaded
                image.setAttribute('loading', 'loaded');
              }

              if (imageSrc !== null) {
                image.setAttribute('src', imageSrc);
                image.removeAttribute('data-src');
              }

              if( (imageSrcset !== null)) {
                image.setAttribute('srcset', imageSrcset);
                image.removeAttribute('data-srcset');
              }
            }
          });
        }
      }

      lazyLoad();
      window.addEventListener('touchmove', lazyLoad);
      window.addEventListener('focus', lazyLoad);
      document.addEventListener('scroll', lazyLoad);
      document.addEventListener('trigger-lazyload', lazyLoad);

      function onImageLoad(evt) {
        evt.currentTarget.setAttribute('loading', 'loaded');
        evt.currentTarget.removeEventListener('load', onImageLoad);

        // check if all images have been loaded
        let lazyImages = document.querySelectorAll('img[loading="lazy"]');

        if (lazyImages.length === 0) {
          window.removeEventListener('load', lazyLoad);
          window.removeEventListener('touchmove', lazyLoad);
          document.removeEventListener('scroll', lazyLoad);
        }
      }

      function isInViewport(element) {
        let rect = element.getBoundingClientRect();

        return (
          rect.bottom >= 0 &&
          rect.right >= 0 &&
          (rect.top - 400) <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.left <= (window.innerWidth || document.documentElement.clientWidth)
        );
      }
    }
  };

  var lazyvideo = {
    init() {
      if (document.body.contains(document.querySelector('video.lazy'))) {

        function loadVideos() {

          if(document.body.contains(document.querySelector('video.lazy'))) {
            const lazyVideos = document.querySelectorAll('video.lazy');
            
            lazyVideos.forEach(video => {
              if (isInViewport(video)) {   
                let videoSrcTag = video.querySelector('source');        
                let videoSrc = videoSrcTag.getAttribute('data-src');
                videoSrcTag.setAttribute('src', videoSrc);
                videoSrcTag.removeAttribute('data-src');

                video.load();
                video.classList.remove('lazy');
              }
            });
          } else {
            document.removeEventListener('scroll', loadVideos);
          }
        }

        loadVideos();
        document.addEventListener('scroll', loadVideos);
        window.addEventListener('focus', loadVideos);
      }
      
      // checking for partial visibility
      function isInViewport(element) {
        let position = element.getBoundingClientRect();
        
        if(position.top < window.innerHeight && position.bottom >= 0) {
          return true
        }
      }
    }
  };

  var animate = {
    init() {
      if (document.body.contains(document.querySelector('.launimation'))) {
        
        // Usage in .section HTML element:
        // data-delay - for sequencing animations, set 0 for animating all at the same time
        // data-offset - used for the offset visibility of section, so for 300 it would animate 300px before the top part of section touches the end of the browser website display area
        
        // Animation types for inner elements in section - see _animate.scss file
        // Set the element you wish to animate with a class `launimation` and additionaly animation type e.g. `slideLeft`
        // For example <h1 class="section__heading launimation slideLeft">Heading</h1>
        
        let throttleTimer = false;
        
        const throttle = (callback, time) => {
          // don't run the function while throttle timer is true 
          if (throttleTimer) return
          
          // first set throttle timer to true so the function doesn't run 
          throttleTimer = true;
          
          setTimeout(() => {
            // call the callback function in the setTimeout and set the throttle timer to false after the indicated time has passed 
            callback();
            throttleTimer = false;
          }, time);
        };
        
        const launimations = document.querySelectorAll('.launimation');
        const sections = document.querySelectorAll('.section, .header, .block-wrapper');
        
        const canweseeit = (el, offset) => {
          let rect = el.getBoundingClientRect();

          return ((
            // if element is in viewport and top border reaches the upper 2/3s
            rect.bottom >= 0 &&
            rect.right >= 0 &&
            (rect.top - offset) <= ((window.innerHeight / 1.3) || (document.documentElement.clientHeight / 1.3)) &&
            rect.left <= (window.innerWidth || document.documentElement.clientWidth))
            ||
            // or if element is visible completely
            (rect.bottom <= window.innerHeight &&
            rect.right >= 0 &&
            rect.left <= (window.innerWidth || document.documentElement.clientWidth)
            ))
        };
            
        const laureanimate = (el) => {
          const reAnimate = el.querySelectorAll('.launimate');
          reAnimate.forEach(el => {
            el.classList.remove('launimate');
          });
          launimate();
        };
        
        const launimate = () => {
          sections.forEach(section => {
            let delay = section.getAttribute('data-delay');
            if(!delay) {
              delay = 50;
            }
            let offset = section.getAttribute('data-offset');
            if(!offset) {
              offset = 0;
            }
            if(canweseeit(section, offset) == true) {
              const startAnimation = section.querySelectorAll('.launimation');
              
              for (let i = 0; i < startAnimation.length; i++) {
                setTimeout(() => {
                  startAnimation[i].classList.add('launimate');
                }, i * delay);
              }
            }
          });
        };
        
        launimations.forEach(el => {
          el.classList.add('launimation--enabled');
        });
        
        launimate();
        
        window.addEventListener('touchmove', launimate);
        window.addEventListener('focus', launimate);
        
        document.addEventListener('laureanimate', (evt) => {
          laureanimate(evt.detail);
        });
        
        document.addEventListener('scroll', () => {
          throttle(launimate, 250);
        }, {passive: true});
      }
    }
  };

  var executer = {
    init () {
      if (document.body.contains(document.querySelector('#framework_main'))) {
        let frameworkMain = document.querySelector('#framework_main');
        if (frameworkMain.getAttribute('src')) {
          return
        }

        function loadScript(src, onload) {
          let script = document.createElement('script');
          script.type = 'module';
          script.onload = onload ? onload : function(e) {
            console.log(e.target.src + ' is loaded.');
          };
          script.src = src;
          document.body.appendChild(script);
        }

        const loadAppScript = () => {
          frameworkMain = document.querySelector('#framework_main');
          if (!frameworkMain || frameworkMain.getAttribute('src')) {
            return
          }

          let frameworkMainSrc = frameworkMain.getAttribute('srcset');
          frameworkMain.remove();
          loadScript(frameworkMainSrc, () => {
            document.dispatchEvent(new Event('DOMContentLoaded'), { bubbles: true });
          });
        };

        // load script on user interaction
        document.addEventListener('scroll', loadAppScript, { once: true });
        window.addEventListener('touchmove', loadAppScript, { once: true });

        // check if window is scrolled already when loaded and trigger scroll event immediately
        if (window.scrollY > 0) {
          document.dispatchEvent(new Event('scroll'));
          window.dispatchEvent(new Event('touchmove'));
        }

        // if nobody scrolls within a second just call the events manually to
        setTimeout(() => {
          document.dispatchEvent(new Event('scroll'));
          window.dispatchEvent(new Event('touchmove'));
        }, 1000);
      }
    }
  };

  // MODULES_IMPORT

  const initPreloadModules = () => {
    // MODULES_INIT
    lazyload.init();
    lazyvideo.init();
    animate.init();
    executer.init();
  };

  // On DOM load we initialize the modules scripts
  document.addEventListener('DOMContentLoaded', function () {
    initPreloadModules();
    if(window.acf) {
      window.acf.addAction('render_block_preview', initPreloadModules);
    }
  }, { once: true });

})();
