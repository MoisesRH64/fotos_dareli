const NS = "http://www.w3.org/2000/svg";
const IMAGE_COUNT = 32;
const SONG_VIDEO_ID = "Mcj75l2gJcY";

const cover = document.getElementById("cover");
const openAlbum = document.getElementById("openAlbum");
const treeStage = document.getElementById("treeStage");
const treeSvg = document.getElementById("treeSvg");
const ytPlayerHost = document.getElementById("ytPlayerHost");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const closeLightbox = document.getElementById("closeLightbox");
const dedicationModal = document.getElementById("dedicationModal");
const openDedication = document.getElementById("openDedication");
const closeDedication = document.getElementById("closeDedication");
const musicStatus = document.getElementById("musicStatus");
const playMusicFallback = document.getElementById("playMusicFallback");

const photos = Array.from({ length: IMAGE_COUNT }, (_, i) => ({
  src: `imagenes/${i + 1}.jpeg`,
  year: Math.round((i / Math.max(1, IMAGE_COUNT - 1)) * 25),
  index: i,
}));

let activeNode = null;
let ytPlayer = null;
let ytReady = false;
let pendingUserPlay = false;
let apiLoadStarted = false;
let lastPlayToken = 0;

function loadYouTubeApi() {
  if (apiLoadStarted) {
    return;
  }

  apiLoadStarted = true;
  const script = document.createElement("script");
  script.src = "https://www.youtube.com/iframe_api";
  script.async = true;
  script.onerror = () => {
    musicStatus.textContent = "No se pudo cargar YouTube. Revisa conexion e intenta de nuevo.";
  };
  document.head.appendChild(script);
}

function startPlaybackVerified() {
  if (!ytPlayer || !ytReady) {
    return;
  }

  lastPlayToken += 1;
  const currentToken = lastPlayToken;
  musicStatus.textContent = "Iniciando cancion...";

  try {
    ytPlayer.stopVideo();
    ytPlayer.unMute();
    ytPlayer.setVolume(100);
    ytPlayer.playVideo();
  } catch {
    musicStatus.textContent = "No se pudo iniciar. Presiona Activar cancion otra vez.";
    return;
  }

  setTimeout(() => {
    if (currentToken !== lastPlayToken) {
      return;
    }

    const state = ytPlayer.getPlayerState();
    if (state !== YT.PlayerState.PLAYING) {
      musicStatus.textContent = "Reproduccion bloqueada por el navegador. Presiona Activar cancion.";
    }
  }, 1100);
}

function ensureAudiblePlayback() {
  if (!ytPlayer || !ytReady) {
    return;
  }

  try {
    if (ytPlayer.isMuted()) {
      ytPlayer.unMute();
      ytPlayer.setVolume(100);

      setTimeout(() => {
        if (ytPlayer.isMuted()) {
          musicStatus.textContent = "El navegador mantiene el audio en silencio. Presiona Activar cancion nuevamente.";
        } else {
          musicStatus.textContent = "Cancion reproduciendose.";
        }
      }, 500);
    } else {
      musicStatus.textContent = "Cancion reproduciendose.";
    }
  } catch {
    musicStatus.textContent = "No se pudo confirmar audio. Presiona Activar cancion.";
  }
}

function triggerMusic() {
  pendingUserPlay = true;
  musicStatus.textContent = "Preparando cancion...";

  if (ytReady && ytPlayer) {
    startPlaybackVerified();
    return;
  }

  loadYouTubeApi();
}

window.onYouTubeIframeAPIReady = () => {
  ytPlayerHost.innerHTML = '<div id="ytAudioPlayer"></div>';

  ytPlayer = new YT.Player("ytAudioPlayer", {
    height: "1",
    width: "1",
    videoId: SONG_VIDEO_ID,
    playerVars: {
      autoplay: 0,
      controls: 0,
      loop: 1,
      playlist: SONG_VIDEO_ID,
      rel: 0,
      modestbranding: 1,
      playsinline: 1,
      iv_load_policy: 3,
      disablekb: 1,
      fs: 0,
    },
    events: {
      onReady: () => {
        ytReady = true;
        if (pendingUserPlay) {
          startPlaybackVerified();
        } else {
          musicStatus.textContent = "La cancion iniciara al abrir el album.";
        }
      },
      onStateChange: (event) => {
        if (event.data === YT.PlayerState.PLAYING) {
          ensureAudiblePlayback();
        }
      },
      onError: () => {
        musicStatus.textContent = "YouTube bloqueo la reproduccion. Presiona Activar cancion.";
      },
    },
  });
};

function createSvg(name, attrs = {}) {
  const element = document.createElementNS(NS, name);
  Object.entries(attrs).forEach(([key, value]) => {
    element.setAttribute(key, String(value));
  });
  return element;
}

function createDefs() {
  const defs = createSvg("defs");

  const trunkGradient = createSvg("linearGradient", {
    id: "trunkGradient",
    x1: "0%",
    y1: "0%",
    x2: "0%",
    y2: "100%",
  });
  trunkGradient.appendChild(createSvg("stop", { offset: "0%", "stop-color": "#6f4d38" }));
  trunkGradient.appendChild(createSvg("stop", { offset: "45%", "stop-color": "#4f3528" }));
  trunkGradient.appendChild(createSvg("stop", { offset: "100%", "stop-color": "#2f221b" }));

  const canopyGradient = createSvg("radialGradient", {
    id: "canopyGradient",
    cx: "52%",
    cy: "35%",
    r: "72%",
  });
  canopyGradient.appendChild(createSvg("stop", { offset: "0%", "stop-color": "#7d9a6d" }));
  canopyGradient.appendChild(createSvg("stop", { offset: "100%", "stop-color": "#4f6b4b" }));

  const canopyLayerGradient = createSvg("radialGradient", {
    id: "canopyLayerGradient",
    cx: "50%",
    cy: "42%",
    r: "70%",
  });
  canopyLayerGradient.appendChild(createSvg("stop", { offset: "0%", "stop-color": "#8ca87d" }));
  canopyLayerGradient.appendChild(createSvg("stop", { offset: "100%", "stop-color": "#5a7654" }));

  const canopyShadowGradient = createSvg("linearGradient", {
    id: "canopyShadowGradient",
    x1: "0%",
    y1: "0%",
    x2: "0%",
    y2: "100%",
  });
  canopyShadowGradient.appendChild(createSvg("stop", { offset: "0%", "stop-color": "rgba(0,0,0,0)" }));
  canopyShadowGradient.appendChild(createSvg("stop", { offset: "100%", "stop-color": "rgba(28,35,25,0.5)" }));

  defs.appendChild(trunkGradient);
  defs.appendChild(canopyGradient);
  defs.appendChild(canopyLayerGradient);
  defs.appendChild(canopyShadowGradient);
  return defs;
}

function generateLeafPoints(total) {
  const points = [];
  const rows = [4, 5, 6, 6, 6, 5];
  const centerX = 600;
  const centerY = 370;
  const radiusXBase = 350;
  const radiusYBase = 250;

  for (let row = 0; row < rows.length; row += 1) {
    const count = rows[row];
    const t = row / (rows.length - 1);
    const radiusX = radiusXBase - t * 90;
    const radiusY = radiusYBase - t * 100;
    const y = centerY + 180 - row * 68;

    for (let i = 0; i < count; i += 1) {
      if (points.length >= total) {
        return points;
      }

      const ratio = count === 1 ? 0.5 : i / (count - 1);
      const spread = (ratio - 0.5) * 2;
      const x = centerX + spread * radiusX + Math.sin((row + 1) * (i + 1)) * 6;
      const wave = Math.sin((row + i) * 1.25) * 8;

      points.push({
        x,
        y: y + wave - Math.abs(spread) * 16,
      });
    }
  }

  while (points.length < total) {
    const n = points.length;
    points.push({ x: 300 + (n % 8) * 75, y: 250 + Math.floor(n / 8) * 45 });
  }

  return points;
}

function createTreeBase(container) {
  container.appendChild(createSvg("ellipse", { cx: 600, cy: 876, rx: 430, ry: 66, class: "ground" }));
  container.appendChild(createSvg("ellipse", { cx: 600, cy: 862, rx: 305, ry: 38, class: "ground-shadow" }));

  container.appendChild(
    createSvg("path", {
      class: "canopy",
      d: "M220 430 C205 320 295 210 402 180 C445 110 535 70 622 90 C690 78 760 112 804 164 C913 190 996 287 984 412 C982 512 905 590 796 608 C728 656 639 672 560 658 C506 686 429 688 366 650 C264 635 205 550 220 430 Z",
    })
  );

  container.appendChild(
    createSvg("path", {
      class: "canopy-layer",
      d: "M292 454 C274 354 338 274 422 248 C458 197 523 168 586 180 C650 165 720 192 757 238 C847 255 909 327 899 423 C886 498 839 548 754 568 C703 610 635 628 575 620 C520 648 459 646 409 617 C335 598 297 536 292 454 Z",
    })
  );

  container.appendChild(
    createSvg("path", {
      class: "canopy-shadow",
      d: "M260 452 C260 566 340 634 455 650 C522 680 688 680 752 640 C852 620 930 560 944 448 C934 530 884 618 744 664 C666 704 529 706 444 682 C320 664 254 576 260 452 Z",
    })
  );

  container.appendChild(
    createSvg("path", {
      class: "trunk",
      d: "M515 862 C510 766 522 678 546 578 C563 508 576 454 600 404 C624 454 637 508 654 578 C678 678 690 766 685 862 Z",
    })
  );

  container.appendChild(
    createSvg("path", {
      class: "trunk-shade",
      d: "M596 406 C615 456 627 510 642 580 C663 676 674 758 672 862 L688 862 C693 764 682 674 658 576 C641 505 629 451 602 398 Z",
    })
  );

  container.appendChild(createSvg("path", { class: "root", d: "M548 850 C500 842 444 850 402 874" }));
  container.appendChild(createSvg("path", { class: "root", d: "M652 850 C705 842 758 852 806 876" }));
  container.appendChild(createSvg("path", { class: "root", d: "M598 856 C584 868 566 876 542 884" }));
  container.appendChild(createSvg("path", { class: "root", d: "M612 856 C626 868 648 878 676 886" }));

  container.appendChild(createSvg("path", { class: "bark-line", d: "M575 510 C569 560 566 642 572 732" }));
  container.appendChild(createSvg("path", { class: "bark-line", d: "M604 485 C602 552 604 635 614 748" }));
  container.appendChild(createSvg("path", { class: "bark-line", d: "M632 520 C640 590 642 664 636 730" }));
}

function createBranch(group, point, index, isBack = false) {
  const startX = 600;
  const startY = 665 - Math.floor(index / 5) * 12;
  const curveOut = point.x < 600 ? -100 : 100;
  const control1X = startX + curveOut * 0.26;
  const control1Y = startY - 118;
  const control2X = point.x - curveOut * 0.38;
  const control2Y = point.y + 52;

  const path = createSvg("path", {
    class: isBack ? "branch-path back" : "branch-path",
    d: `M${startX} ${startY} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${point.x} ${point.y}`,
  });
  path.style.animationDelay = `${0.12 + index * 0.03}s`;
  group.appendChild(path);

  if (!isBack && index % 2 === 0) {
    const twig = createSvg("path", {
      class: "twig-path",
      d: `M${point.x} ${point.y} C ${point.x + (point.x < 600 ? -22 : 22)} ${point.y - 8}, ${point.x + (point.x < 600 ? -30 : 30)} ${point.y - 26}, ${point.x + (point.x < 600 ? -26 : 26)} ${point.y - 44}`,
    });
    twig.style.animationDelay = `${0.2 + index * 0.03}s`;
    group.appendChild(twig);
  }
}

function setActive(node) {
  if (activeNode) {
    activeNode.classList.remove("active");
  }
  node.classList.add("active");
  activeNode = node;
}

function openLightbox(src) {
  lightboxImg.src = src;
  lightbox.classList.add("show");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeImage() {
  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
}

function createLeaf(group, point, photo, index) {
  const leaf = createSvg("g", {
    class: "leaf-node",
    tabindex: "0",
    role: "button",
    "aria-label": `Abrir recuerdo ${photo.index + 1}`,
  });
  leaf.style.animationDelay = `${0.26 + index * 0.04}s`;

  const clipId = `clip-${index}`;
  const defs = treeSvg.querySelector("defs");
  const clipPath = createSvg("clipPath", { id: clipId });
  clipPath.appendChild(createSvg("circle", { cx: point.x, cy: point.y, r: 34 }));
  defs.appendChild(clipPath);

  const image = createSvg("image", {
    href: photo.src,
    x: point.x - 34,
    y: point.y - 34,
    width: 68,
    height: 68,
    preserveAspectRatio: "xMidYMid slice",
    "clip-path": `url(#${clipId})`,
  });

  const glow = createSvg("circle", { class: "glow", cx: point.x, cy: point.y, r: 41 });
  const ring = createSvg("circle", { class: "ring", cx: point.x, cy: point.y, r: 37 });
  const mask = createSvg("circle", { class: "mask", cx: point.x, cy: point.y, r: 34 });
  const label = createSvg("text", { x: point.x, y: point.y + 56 });
  label.textContent = `Ano ${photo.year}`;

  leaf.appendChild(glow);
  leaf.appendChild(ring);
  leaf.appendChild(image);
  leaf.appendChild(mask);
  leaf.appendChild(label);

  const activate = () => {
    setActive(leaf);
    openLightbox(photo.src);
  };

  leaf.addEventListener("click", activate);
  leaf.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate();
    }
  });

  group.appendChild(leaf);
}

function buildTree() {
  treeSvg.innerHTML = "";
  treeSvg.appendChild(createDefs());

  const swayGroup = createSvg("g", { class: "tree-sway" });
  const backBranchGroup = createSvg("g");
  const branchGroup = createSvg("g");
  const leafGroup = createSvg("g");

  createTreeBase(swayGroup);
  const points = generateLeafPoints(photos.length);
  points.forEach((point, index) => {
    createBranch(backBranchGroup, point, index, true);
    createBranch(branchGroup, point, index, false);
    createLeaf(leafGroup, point, photos[index], index);
  });

  swayGroup.appendChild(backBranchGroup);
  swayGroup.appendChild(branchGroup);
  swayGroup.appendChild(leafGroup);
  treeSvg.appendChild(swayGroup);
}

function openDedicationModal() {
  dedicationModal.classList.add("show");
  dedicationModal.setAttribute("aria-hidden", "false");
}

function closeDedicationModal() {
  dedicationModal.classList.remove("show");
  dedicationModal.setAttribute("aria-hidden", "true");
}

function openAlbumExperience() {
  cover.classList.add("hide");
  treeStage.classList.add("show");
  treeStage.setAttribute("aria-hidden", "false");
  triggerMusic();
}

closeLightbox.addEventListener("click", closeImage);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeImage();
  }
});

openAlbum.addEventListener("click", openAlbumExperience);
openDedication.addEventListener("click", openDedicationModal);
closeDedication.addEventListener("click", closeDedicationModal);
playMusicFallback.addEventListener("click", triggerMusic);

dedicationModal.addEventListener("click", (event) => {
  if (event.target === dedicationModal) {
    closeDedicationModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeImage();
    closeDedicationModal();
  }
});

loadYouTubeApi();
buildTree();
