function initEventListeners() {
  const btnHamburger = document.getElementById("btn-hamburger");
  const responsiveMenu = document.getElementById("responsive-menu");
  const desktopStateQuery = window.matchMedia("(min-width: 700px)");

  btnHamburger.addEventListener("click", () => {
    if (responsiveMenu.classList.contains("active")) {
      responsiveMenu.classList.remove("active");
    } else {
      responsiveMenu.classList.add("active");
    }
  });

  desktopStateQuery.addEventListener("change", () => {
    responsiveMenu.classList.remove("active");
  });
}

window.onload = () => {
  initEventListeners();
};
