// Inicialização quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  createFloatingHearts()
  setupThemeToggle()
  setupMusicPlayer()
  calculateDaysTogether()
  setupVideoPlayers()
  setupScrollAnimations()
  setupShareButton()
}

// Criar partículas de corações flutuantes
function createFloatingHearts() {
  const heartsContainer = document.getElementById("floating-hearts")

  function createHeart() {
    const heart = document.createElement("div")
    heart.className = "heart-particle"
    heart.innerHTML = "❤️"

    // Posição aleatória
    heart.style.left = Math.random() * 100 + "%"
    heart.style.animationDuration = Math.random() * 3 + 4 + "s"
    heart.style.animationDelay = Math.random() * 2 + "s"

    heartsContainer.appendChild(heart)

    // Remover após a animação
    setTimeout(() => {
      if (heart.parentNode) {
        heart.parentNode.removeChild(heart)
      }
    }, 7000)
  }

  // Criar corações periodicamente
  setInterval(createHeart, 2000)

  // Criar alguns corações iniciais
  for (let i = 0; i < 5; i++) {
    setTimeout(createHeart, i * 500)
  }
}

// Configurar alternância de tema
function setupThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle")
  const body = document.body

  // Verificar tema salvo
  const savedTheme = localStorage.getItem("theme") || "light"
  body.setAttribute("data-theme", savedTheme)
  updateThemeIcon(savedTheme)

  themeToggle.addEventListener("click", function () {
    const currentTheme = body.getAttribute("data-theme")
    const newTheme = currentTheme === "dark" ? "light" : "dark"

    body.setAttribute("data-theme", newTheme)
    localStorage.setItem("theme", newTheme)
    updateThemeIcon(newTheme)

    // Animação do botão
    this.style.transform = "scale(0.9)"
    setTimeout(() => {
      this.style.transform = "scale(1)"
    }, 150)
  })
}

function updateThemeIcon(theme) {
  const icon = document.querySelector("#theme-toggle i")
  icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon"
}

// Configurar player de música
function setupMusicPlayer() {
  const musicToggle = document.getElementById("music-toggle")
  const audio = document.getElementById("background-music")
  const icon = musicToggle.querySelector("i")

  let isPlaying = false

  musicToggle.addEventListener("click", function () {
    if (isPlaying) {
      audio.pause()
      icon.className = "fas fa-play"
      this.classList.remove("playing")
    } else {
      audio.play().catch((e) => {
        console.log("Erro ao reproduzir áudio:", e)
        alert("Não foi possível reproduzir a música. Verifique se o arquivo de áudio existe.")
      })
      icon.className = "fas fa-pause"
      this.classList.add("playing")
    }
    isPlaying = !isPlaying

    // Animação do botão
    this.style.transform = "scale(0.9)"
    setTimeout(() => {
      this.style.transform = "scale(1)"
    }, 150)
  })

  // Eventos do áudio
  audio.addEventListener("ended", () => {
    icon.className = "fas fa-play"
    musicToggle.classList.remove("playing")
    isPlaying = false
  })

  audio.addEventListener("error", () => {
    console.log("Erro no arquivo de áudio")
  })
}

// Calcular dias juntos
function calculateDaysTogether() {
  const startDate = new Date("2023-02-14") // Data de início do relacionamento
  const today = new Date()
  const diffTime = Math.abs(today - startDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  const counter = document.getElementById("days-together")

  // Animação de contagem
  let currentCount = 0
  const increment = Math.ceil(diffDays / 50)

  const countAnimation = setInterval(() => {
    currentCount += increment
    if (currentCount >= diffDays) {
      currentCount = diffDays
      clearInterval(countAnimation)
    }
    counter.textContent = currentCount.toLocaleString()
  }, 30)
}

// Configurar players de vídeo
function setupVideoPlayers() {
  const videoCards = document.querySelectorAll(".video-card")

  videoCards.forEach((card) => {
    const thumbnail = card.querySelector(".video-thumbnail")
    const video = card.querySelector("video")
    const playButton = card.querySelector(".play-button")
    const thumbnailImg = card.querySelector(".video-thumbnail img")

    thumbnail.addEventListener("click", () => {
      if (video.style.display === "none") {
        // Mostrar vídeo
        thumbnailImg.style.display = "none"
        playButton.style.display = "none"
        video.style.display = "block"
        video.play().catch((e) => {
          console.log("Erro ao reproduzir vídeo:", e)
          // Voltar ao estado inicial se houver erro
          thumbnailImg.style.display = "block"
          playButton.style.display = "flex"
          video.style.display = "none"
          alert("Não foi possível reproduzir o vídeo. Verifique se o arquivo existe.")
        })
      }
    })

    // Voltar ao thumbnail quando o vídeo terminar
    video.addEventListener("ended", () => {
      thumbnailImg.style.display = "block"
      playButton.style.display = "flex"
      video.style.display = "none"
    })
  })
}

// Configurar animações de scroll
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-up")
      }
    })
  }, observerOptions)

  // Observar elementos para animação
  const elementsToAnimate = document.querySelectorAll(
    ".photo-card, .video-card, .letter-card, .timeline-item, .section-title",
  )

  elementsToAnimate.forEach((el) => {
    observer.observe(el)
  })
}

// Configurar botão de compartilhamento
function setupShareButton() {
  const shareBtn = document.querySelector(".share-btn")

  shareBtn.addEventListener("click", function () {
    if (navigator.share) {
      navigator
        .share({
          title: "João & Maria - Nossa História de Amor",
          text: "Confira nossa história de amor! ❤️",
          url: window.location.href,
        })
        .catch((err) => console.log("Erro ao compartilhar:", err))
    } else {
      // Fallback para navegadores que não suportam Web Share API
      const url = window.location.href
      navigator.clipboard
        .writeText(url)
        .then(() => {
          // Feedback visual
          const originalText = this.innerHTML
          this.innerHTML = '<i class="fas fa-check"></i> Link Copiado!'
          this.style.background = "#10b981"

          setTimeout(() => {
            this.innerHTML = originalText
            this.style.background = ""
          }, 2000)
        })
        .catch(() => {
          alert("Link: " + url)
        })
    }

    // Animação do botão
    this.style.transform = "scale(0.95)"
    setTimeout(() => {
      this.style.transform = "scale(1)"
    }, 150)
  })
}

// Função para adicionar efeito parallax (opcional)
function setupParallaxEffect() {
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const parallaxElements = document.querySelectorAll(".hero-section")

    parallaxElements.forEach((element) => {
      const speed = 0.5
      element.style.transform = `translateY(${scrolled * speed}px)`
    })
  })
}

// Função para criar efeito de pétalas caindo (opcional)
function createFallingPetals() {
  const petalsContainer = document.createElement("div")
  petalsContainer.className = "falling-petals"
  petalsContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    `
  document.body.appendChild(petalsContainer)

  function createPetal() {
    const petal = document.createElement("div")
    petal.innerHTML = "🌸"
    petal.style.cssText = `
            position: absolute;
            top: -50px;
            left: ${Math.random() * 100}%;
            font-size: ${Math.random() * 10 + 15}px;
            animation: fall ${Math.random() * 3 + 4}s linear forwards;
            opacity: ${Math.random() * 0.5 + 0.3};
        `

    petalsContainer.appendChild(petal)

    setTimeout(() => {
      if (petal.parentNode) {
        petal.parentNode.removeChild(petal)
      }
    }, 7000)
  }

  // Adicionar CSS para animação de queda
  const style = document.createElement("style")
  style.textContent = `
        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(360deg);
            }
        }
    `
  document.head.appendChild(style)

  // Criar pétalas periodicamente
  setInterval(createPetal, 3000)
}

// Ativar efeito de pétalas (descomente se desejar)
// createFallingPetals();

// Função para smooth scroll (rolagem suave)
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Função para detectar dispositivo móvel
function isMobile() {
  return window.innerWidth <= 768
}

// Otimizações para mobile
if (isMobile()) {
  // Reduzir número de partículas em dispositivos móveis
  const originalCreateHeart = createFloatingHearts
  createFloatingHearts = () => {
    const heartsContainer = document.getElementById("floating-hearts")

    function createHeart() {
      const heart = document.createElement("div")
      heart.className = "heart-particle"
      heart.innerHTML = "❤️"
      heart.style.left = Math.random() * 100 + "%"
      heart.style.animationDuration = Math.random() * 3 + 4 + "s"
      heart.style.animationDelay = Math.random() * 2 + "s"

      heartsContainer.appendChild(heart)

      setTimeout(() => {
        if (heart.parentNode) {
          heart.parentNode.removeChild(heart)
        }
      }, 7000)
    }

    // Menos corações em mobile
    setInterval(createHeart, 4000)

    for (let i = 0; i < 3; i++) {
      setTimeout(createHeart, i * 1000)
    }
  }
}
