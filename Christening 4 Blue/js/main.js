document.addEventListener("DOMContentLoaded", () => {
  // Replace with your deployed Google Apps Script Web App URL
  const GOOGLE_SCRIPT_URL = "none";

  // =========================================================================
  // 0. Smart Fallback Resolver for Images (Church & Reception)
  // =========================================================================
  function resolveSmartImages() {
    const imgs = document.querySelectorAll("img[data-candidates]");
    imgs.forEach((img) => {
      const list = (img.getAttribute("data-candidates") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (!list.length) return;

      let idx = 0;
      const tryNext = () => {
        idx += 1;
        if (idx < list.length) {
          img.src = list[idx];
        } else {
          img.removeEventListener("error", tryNext);
        }
      };

      img.addEventListener("error", tryNext);
      img.src = list[0];
    });
  }
  resolveSmartImages();

  // =========================================================================
  // 1. Animated Blue Bears & White Clouds Background
  // =========================================================================
  const skyContainer = document.getElementById("sky-container");
  if (skyContainer) {
    const itemCount = window.innerWidth < 600 ? 16 : 26;

    const blueBearSVG = `
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="17" cy="18" r="9" fill="#7CC2F7"/>
        <circle cx="17" cy="18" r="4.5" fill="#E3F3FF"/>
        <circle cx="47" cy="18" r="9" fill="#7CC2F7"/>
        <circle cx="47" cy="18" r="4.5" fill="#E3F3FF"/>
        <circle cx="32" cy="34" r="20" fill="#9BD3FA"/>
        <ellipse cx="32" cy="39" rx="9" ry="7" fill="#FFFFFF"/>
        <circle cx="25" cy="30" r="2.2" fill="#235784"/>
        <circle cx="39" cy="30" r="2.2" fill="#235784"/>
        <ellipse cx="32" cy="36.5" rx="3" ry="2.2" fill="#2D6DA3"/>
        <path d="M28.5 41.5C30 43.2 34 43.2 35.5 41.5" stroke="#2D6DA3" stroke-width="1.8" stroke-linecap="round"/>
      </svg>`;

    const whiteCloudSVG = `
      <svg viewBox="0 0 84 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 42H64C72.2843 42 79 35.2843 79 27C79 19.2116 73.066 12.809 65.468 12.0736C62.3935 5.6033 55.7988 1.125 48.1667 1.125C39.2913 1.125 31.8384 7.1636 29.6693 15.3512C27.5861 14.3266 25.2423 13.75 22.7619 13.75C14.0569 13.75 7 20.8069 7 29.5119C7 36.4106 11.4301 42 22 42Z" fill="#FFFFFF"/>
      </svg>`;

    for (let i = 0; i < itemCount; i++) {
      const item = document.createElement("span");
      const isBear = i % 2 === 0;
      item.className = isBear ? "floating-sky-item floating-bear" : "floating-sky-item floating-cloud";
      const size = isBear
        ? (Math.random() * 18 + 24).toFixed(0)
        : (Math.random() * 28 + 38).toFixed(0);

      item.style.width = `${size}px`;
      item.style.height = isBear ? `${size}px` : `${Math.round(size * 0.62)}px`;
      item.style.left = `${(Math.random() * 96).toFixed(2)}%`;
      item.style.top = `${(Math.random() * 96).toFixed(2)}%`;
      item.style.setProperty("--dur", `${(Math.random() * 6 + 7).toFixed(1)}s`);
      item.style.setProperty("--delay", `${(Math.random() * 5).toFixed(1)}s`);
      item.style.setProperty("--max-op", isBear ? "0.72" : "0.88");
      item.innerHTML = isBear ? blueBearSVG : whiteCloudSVG;
      skyContainer.appendChild(item);
    }
  }

  // =========================================================================
  // 2. Wax Seal Envelope Open & Background Audio
  // =========================================================================
  const gate = document.getElementById("envelope-gate");
  const openBtn = document.getElementById("open-invitation-btn");
  const audioBar = document.getElementById("audio-bar");
  const audio = document.getElementById("bg-audio");
  const musicBtn = document.getElementById("music-toggle-btn");
  const musicStatus = document.getElementById("music-status-text");

  let userPausedMusic = false;
  let isOpeningEnvelope = false;

  const startMusic = () => {
    if (!audio || userPausedMusic) return;
    audio
      .play()
      .then(() => {
        if (musicStatus) musicStatus.textContent = "Pause Music";
      })
      .catch(() => {
        if (musicStatus) musicStatus.textContent = "Play Music";
      });
  };

  const revealInviteCard = () => {
    const gateTexts = document.querySelectorAll("#godparent-invite .text-reveal");
    gateTexts.forEach((el) => el.classList.add("in-view"));
  };

  if (openBtn && gate) {
    openBtn.addEventListener("click", () => {
      if (isOpeningEnvelope) return;
      isOpeningEnvelope = true;

      gate.classList.add("is-untied");

      setTimeout(() => {
        gate.classList.add("is-open");
        document.body.classList.remove("locked");
        if (audioBar) audioBar.classList.remove("hidden");
        userPausedMusic = false;
        startMusic();
        revealInviteCard();
      }, 780);
    });
  }

  const unlockOnce = () => {
    if (gate && audio && !gate.classList.contains("is-open") && audio.paused && !userPausedMusic) {
      startMusic();
    }
  };
  document.addEventListener("pointerdown", unlockOnce, { once: true });

  if (musicBtn && audio) {
    musicBtn.addEventListener("click", () => {
      if (audio.paused) {
        userPausedMusic = false;
        audio
          .play()
          .then(() => {
            if (musicStatus) musicStatus.textContent = "Pause Music";
          })
          .catch(() => {
            if (musicStatus) musicStatus.textContent = "Add MP3 to assets/audio";
          });
      } else {
        userPausedMusic = true;
        audio.pause();
        if (musicStatus) musicStatus.textContent = "Play Music";
      }
    });
  }

  // =========================================================================
  // 3. Ninong & Ninang Accept / Decline Interactive Flow
  // =========================================================================
  const acceptBtn = document.getElementById("accept-godparent-btn");
  const declineBtn = document.getElementById("decline-godparent-btn");
  const acceptedWrapper = document.getElementById("accepted-details-wrapper");
  const declinedWrapper = document.getElementById("declined-message-wrapper");
  const rsvpSection = document.getElementById("rsvp");

  const acceptRadio = document.querySelector('input[name="attendance"][value="Accepts as Ninong/Ninang & will attend."]');
  const declineRadio = document.querySelector('input[name="attendance"][value="Declines with regret."]');

  // Slideshow instances initialized below, started when accepted details reveal
  let startVenueSlideshowsFn = () => {};

  if (acceptBtn) {
    acceptBtn.addEventListener("click", () => {
      acceptBtn.classList.add("is-selected");
      if (declineBtn) declineBtn.classList.remove("is-selected");

      if (declinedWrapper) declinedWrapper.classList.add("hidden");
      if (acceptedWrapper) acceptedWrapper.classList.remove("hidden");
      if (rsvpSection) rsvpSection.classList.remove("hidden");

      if (acceptRadio) {
        acceptRadio.checked = true;
        updateRsvpFieldsVisibility();
      }

      startVenueSlideshowsFn();

      if (acceptedWrapper) {
        acceptedWrapper.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener("click", () => {
      declineBtn.classList.add("is-selected");
      if (acceptBtn) acceptBtn.classList.remove("is-selected");

      if (acceptedWrapper) acceptedWrapper.classList.add("hidden");
      if (declinedWrapper) declinedWrapper.classList.remove("hidden");
      if (rsvpSection) rsvpSection.classList.remove("hidden");

      if (declineRadio) {
        declineRadio.checked = true;
        updateRsvpFieldsVisibility();
      }

      if (declinedWrapper) {
        declinedWrapper.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  // =========================================================================
  // 4. Church & Reception Slideshows
  // =========================================================================
  function createSlideshow({
    containerId,
    dotsId,
    prevId,
    nextId,
    intervalMs = 3200,
    autoStart = false,
  }) {
    const container = document.getElementById(containerId);
    if (!container) return { start: () => {} };

    const slides = Array.from(container.querySelectorAll(".slide"));
    const dotsEl = dotsId ? document.getElementById(dotsId) : null;
    const prevBtn = prevId ? document.getElementById(prevId) : null;
    const nextBtn = nextId ? document.getElementById(nextId) : null;

    let current = 0;
    let timer = null;
    let isRunning = false;

    const dots = slides.map((_, idx) => {
      if (!dotsEl) return null;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "slide-dot" + (idx === 0 ? " active" : "");
      btn.setAttribute("aria-label", `Go to slide ${idx + 1}`);
      btn.addEventListener("click", () => {
        goTo(idx);
        restart();
      });
      dotsEl.appendChild(btn);
      return btn;
    });

    function goTo(index) {
      if (!slides.length) return;
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
      dots.forEach((dot, i) => dot && dot.classList.toggle("active", i === current));
    }

    function next() {
      goTo(current + 1);
    }

    function prev() {
      goTo(current - 1);
    }

    function start() {
      if (isRunning || slides.length <= 1) return;
      isRunning = true;
      timer = setInterval(next, intervalMs);
    }

    function restart() {
      clearInterval(timer);
      if (isRunning) {
        timer = setInterval(next, intervalMs);
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prev();
        restart();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        next();
        restart();
      });
    }

    goTo(0);
    if (autoStart) start();

    return { start };
  }

  const churchSlideshow = createSlideshow({
    containerId: "church-slideshow",
    dotsId: "church-dots",
    prevId: "church-prev",
    nextId: "church-next",
    intervalMs: 3200,
    autoStart: false,
  });

  const receptionSlideshow = createSlideshow({
    containerId: "reception-slideshow",
    dotsId: "reception-dots",
    prevId: "reception-prev",
    nextId: "reception-next",
    intervalMs: 3200,
    autoStart: false,
  });

  startVenueSlideshowsFn = () => {
    churchSlideshow.start();
    receptionSlideshow.start();
  };

  // =========================================================================
  // 5. Countdown to Sunday, December 27, 2026 at 10:00 AM (+08:00)
  // =========================================================================
  const eventDate = new Date("2026-12-27T10:00:00+08:00").getTime();
  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minsEl = document.getElementById("cd-minutes");
  const secsEl = document.getElementById("cd-seconds");

  function updateCountdown() {
    if (!daysEl) return;
    const now = Date.now();
    const diff = Math.max(0, eventDate - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(days).padStart(2, "0");
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
    if (minsEl) minsEl.textContent = String(minutes).padStart(2, "0");
    if (secsEl) secsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // =========================================================================
  // 6. Dynamic RSVP Form
  // =========================================================================
  const form = document.getElementById("rsvp-form");
  const statusEl = document.getElementById("rsvp-status");
  const submitBtn = document.getElementById("rsvp-submit-btn");
  const kidsSection = document.getElementById("kids-section");
  const companionSection = document.getElementById("companion-section");
  const kidsInputsList = document.getElementById("kids-inputs-list");
  const addKidBtn = document.getElementById("add-kid-btn");
  const attendanceRadios = document.querySelectorAll('input[name="attendance"]');

  function updateRsvpFieldsVisibility() {
    const selected = document.querySelector('input[name="attendance"]:checked');
    const val = selected ? selected.value : "";

    if (!kidsSection || !companionSection || !kidsInputsList) return;

    if (val === "Accepts as Ninong/Ninang & will attend with kid/s.") {
      kidsSection.classList.remove("hidden");
      companionSection.classList.remove("hidden");
      const firstKid = kidsInputsList.querySelector("input");
      if (firstKid) firstKid.required = true;
    } else if (val === "Declines with regret.") {
      kidsSection.classList.add("hidden");
      companionSection.classList.add("hidden");
      kidsInputsList.querySelectorAll("input").forEach((inp) => (inp.required = false));
    } else {
      kidsSection.classList.add("hidden");
      companionSection.classList.remove("hidden");
      kidsInputsList.querySelectorAll("input").forEach((inp) => (inp.required = false));
    }
  }

  attendanceRadios.forEach((radio) => {
    radio.addEventListener("change", updateRsvpFieldsVisibility);
  });

  function refreshKidPlaceholders() {
    if (!kidsInputsList) return;
    const rows = kidsInputsList.querySelectorAll(".kid-row");
    rows.forEach((row, index) => {
      const input = row.querySelector("input");
      if (input) input.placeholder = `Kid ${index + 1} Full Name`;
    });
  }

  if (addKidBtn && kidsInputsList) {
    addKidBtn.addEventListener("click", () => {
      const count = kidsInputsList.querySelectorAll(".kid-row").length + 1;
      const row = document.createElement("div");
      row.className = "kid-row";

      const input = document.createElement("input");
      input.type = "text";
      input.name = "kidName[]";
      input.placeholder = `Kid ${count} Full Name`;
      input.required = true;

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "remove-kid-btn";
      removeBtn.setAttribute("aria-label", "Remove kid");
      removeBtn.textContent = "×";
      removeBtn.addEventListener("click", () => {
        row.remove();
        refreshKidPlaceholders();
      });

      row.appendChild(input);
      row.appendChild(removeBtn);
      kidsInputsList.appendChild(row);
      input.focus();
    });
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const fullNameInput = document.getElementById("fullName");
      const companionInput = document.getElementById("companionName");
      const fullName = fullNameInput ? fullNameInput.value.trim() : "";
      const selectedRadio = document.querySelector('input[name="attendance"]:checked');
      const attendance = selectedRadio ? selectedRadio.value : "";

      if (!fullName || !attendance) {
        if (statusEl) {
          statusEl.textContent = "Please enter your full name and select an option.";
        }
        return;
      }

      const companionName =
        attendance === "Declines with regret." || !companionInput
          ? ""
          : companionInput.value.trim();

      const kids =
        attendance === "Accepts as Ninong/Ninang & will attend with kid/s." && kidsInputsList
          ? Array.from(kidsInputsList.querySelectorAll("input"))
              .map((inp) => inp.value.trim())
              .filter(Boolean)
          : [];

      const payload = {
        event: "Elijah Millan (Eli) - Christening & 1st Birthday",
        eventDate: "December 27, 2026",
        fullName,
        attendance,
        companionName,
        kids,
      };

      const originalBtnText = submitBtn ? submitBtn.textContent : "CONFIRM RSVP";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";
      }
      if (statusEl) statusEl.textContent = "Confirming and sending your RSVP...";

      try {
        const res = await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok || (data && data.status === "error")) {
          throw new Error((data && data.message) || "Server error while saving RSVP.");
        }

        if (statusEl) {
          statusEl.textContent = "Thank you! Your RSVP for Elijah (Eli)’s christening has been recorded.";
        }
        form.reset();
        if (kidsInputsList) {
          kidsInputsList.innerHTML = `
            <div class="kid-row">
              <input type="text" name="kidName[]" placeholder="Kid 1 Full Name" />
            </div>
          `;
        }
        updateRsvpFieldsVisibility();
      } catch (err) {
        console.error("RSVP error:", err);
        if (statusEl) {
          statusEl.textContent =
            "Unable to send RSVP right now. Please check your Web App deployment and try again.";
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  }
});