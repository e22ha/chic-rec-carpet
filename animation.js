console.log("Hello");

gsap.registerPlugin(ScrollToPlugin);

document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    var target = document.querySelector(this.getAttribute("href"));
    gsap.to(window, {
      duration: 1,
      scrollTo: {
        y: target,
        autoKill: false,
      },
      ease: "power2.out",
    });
  });
});
