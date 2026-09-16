/* DMac Builds — light interactions, no dependencies */
(function () {
  "use strict";

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") nav.classList.remove("open");
    });
  }

  // Gallery lightbox
  var lb = document.getElementById("lightbox");
  if (lb) {
    var lbImg = lb.querySelector("img");
    document.querySelectorAll("[data-lightbox]").forEach(function (el) {
      el.addEventListener("click", function () {
        var full = el.getAttribute("data-full") || el.querySelector("img").src;
        var alt = el.querySelector("img") ? el.querySelector("img").alt : "";
        lbImg.src = full; lbImg.alt = alt; lb.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });
    function closeLb() { lb.classList.remove("open"); lbImg.src = ""; document.body.style.overflow = ""; }
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("lb__close")) closeLb(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLb(); });
  }

  // Contact form -> compose an email to DMac Builds (no backend required)
  var form = document.getElementById("enquiry-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements;
      var name = (f.name && f.name.value || "").trim();
      var phone = (f.phone && f.phone.value || "").trim();
      var email = (f.email && f.email.value || "").trim();
      var service = (f.service && f.service.value || "").trim();
      var area = (f.area && f.area.value || "").trim();
      var message = (f.message && f.message.value || "").trim();

      var subject = "Website enquiry" + (service ? " - " + service : "") + (area ? " (" + area + ")" : "");
      var lines = [
        "Name: " + name,
        "Phone: " + phone,
        "Email: " + email,
        "Service: " + service,
        "Area: " + area,
        "",
        message
      ];
      var href = "mailto:dmacbuilds@gmail.com?subject=" + encodeURIComponent(subject) +
                 "&body=" + encodeURIComponent(lines.join("\n"));
      window.location.href = href;

      var ok = document.getElementById("form-ok");
      if (ok) ok.hidden = false;
    });
  }

  // Mark current nav link active
  var path = location.pathname.replace(/index\.html$/, "").replace(/\/$/, "") || "/";
  document.querySelectorAll("#primary-nav a").forEach(function (a) {
    var href = a.getAttribute("href") || "";
    var norm = href.replace(/index\.html$/, "").replace(/\.\.\//g, "/").replace(/\/$/, "");
    if ((path === "/" && (href === "index.html" || href === "/" )) ) a.classList.add("active");
  });
})();
