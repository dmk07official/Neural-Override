//Slideshow
document.querySelectorAll('[data-slideshow]').forEach(wrapper => {
   const images = JSON.parse(wrapper.getAttribute('data-slideshow'));
   const img = wrapper.querySelector('.slide-img');
   const currentDisplay = wrapper.querySelector('.slide-counter .current');
   let index = 0;
   let isAnimating = false;

   function animateSlide(newIndex, direction) {
      if (isAnimating || newIndex === index) return;
      isAnimating = true;

      img.classList.add(direction === 'left' ? 'slide-out-left' : 'slide-out-right');

      img.addEventListener('transitionend', function handler() {
         img.removeEventListener('transitionend', handler);

         img.src = images[newIndex];
         if (currentDisplay) currentDisplay.textContent = newIndex + 1;

         img.classList.remove('slide-out-left', 'slide-out-right');
         img.classList.add(direction === 'left' ? 'slide-in-right' : 'slide-in-left');

         img.addEventListener('animationend', function handlerIn() {
            img.classList.remove('slide-in-left', 'slide-in-right');
            img.removeEventListener('animationend', handlerIn);
            isAnimating = false;
            index = newIndex;
         });
      });
   }

   wrapper.querySelector('[data-prev]').addEventListener('click', () => {
      const newIndex = (index - 1 + images.length) % images.length;
      animateSlide(newIndex, 'right');
   });

   wrapper.querySelector('[data-next]').addEventListener('click', () => {
      const newIndex = (index + 1) % images.length;
      animateSlide(newIndex, 'left');
   });

   img.src = images[index];
   if (currentDisplay) currentDisplay.textContent = index + 1;
});


//Suche
function searchFunction() {
   var input = document.getElementById("search").value.toLowerCase();

   var classes = ["images-item", "news-item"];

   classes.forEach(function (className) {
      var items = document.getElementsByClassName(className);

      for (var i = 0; i < items.length; i++) {
         var title = items[i].getElementsByTagName("h3")[0];
         var text = title.textContent || title.innerText;

         if (text.toLowerCase().indexOf(input) > -1) {
            items[i].style.display = "";
         } else {
            items[i].style.display = "none";
         }
      }
   });
}