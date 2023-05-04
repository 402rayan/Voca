<template>
  <div id="app">
    <Navbar />
    <router-view></router-view>
  </div>
  <canvas id="particles" style="position: fixed; top: 0; left: 0; z-index: -1;"></canvas>
  <footer>
    <div class="ligne-footer"></div>
    <div class="footer-content">
      <p>Website made by DESPLANQUE-HAMADACHE Rayan</p>
      <div class="social-icons">
        <div class="social-icon" style="background-color: var(--main-beige);"></div>
        <div class="social-icon" style="background-color: var(--secondary-violet);"></div>
        <div class="social-icon" style="background-color: var(--primary-violet);"></div>
        <div class="social-icon" style="background-color: var(--main-violet);"></div>
      </div>
    </div>
  </footer>
</template>

<script>
import Navbar from "./components/Navbar.vue";

export default {
  name: 'App',
  components: {
    Navbar,
  },
  mounted() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particlesArray = [];

    class Particle {
      constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        this.y += 0.5;
        if (this.y > canvas.height) {
          this.y = 0;
          this.x = Math.random() * canvas.width;
        }
        this.draw();
      }
    }

    function initParticles() {
      const numberOfParticles = 40;
      for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 5 + 1;
        const color = `rgba(${Math.random() * 30},${Math.random() * 30},${Math.random() * 30},0.2)`;
        particlesArray.push(new Particle(x, y, size, color));
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
  },
};
</script>

<style>
:root {
    --light-beige: #fef8f0;
    --main-violet: #9384D1;
    --main-violet-dark : #7A6AB3;
    --primary-violet: #C9A7EB;
    --secondary-violet: #ECC9EE;
    --main-beige: #FFDCB6;
    --dark-gris: #282828;

}
@font-face {
  font-family: 'DIN Pro-Bold';
  src: url('./assets/fonts/DINPro-Bold.eot') format('embedded-opentype'),
    url('./assets/fonts/DINPro-Bold.woff') format('woff'),
    url('./assets/fonts/DINPro-Bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: 'DIN Pro-Medium';
  src: url('./assets/fonts/DINPro-Medium.eot') format('embedded-opentype'),
    url('./assets/fonts/DINPro-Medium.woff') format('woff'),
    url('./assets/fonts/DINPro-Medium.ttf') format('truetype');
  font-weight: 500;
  font-style: normal;
}

@font-face {
  font-family: 'Whyte Medium';
  src: url('./assets/fonts/Whyte-Medium.eot') format('embedded-opentype'),
    url('./assets/fonts/Whyte-Medium.woff') format('woff'),
    url('./assets/fonts/Whyte-Medium.ttf') format('truetype');
}

@font-face {
  font-family: 'DIN Round Pro';
  src: url('./assets/fonts/DINRoundPro.eot') format('embedded-opentype'),
    url('./assets/fonts/DINRoundPro.woff') format('woff'),
    url('./assets/fonts/DINRoundPro.ttf') format('truetype');
}

@font-face {
  font-family: 'DINRoundPro-Bold';
  src: url('./assets/fonts/DINRoundPro-Bold.eot') format('embedded-opentype'),
    url('./assets/fonts/DINRoundPro-Bold.woff') format('woff'),
    url('./assets/fonts/DINRoundPro-Bold.ttf') format('truetype');
  font-weight: 300;
  font-style: normal;
}

@font-face {
  font-family: 'DIN Pro-Bold';
  src: url('./assets/fonts/DINPro-Bold.eot') format('embedded-opentype'),
    url('./assets/fonts/DINPro-Bold.woff') format('woff'),
    url('./assets/fonts/DINPro-Bold.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: 'DINRoundPro-Light';
  src: url('./assets/fonts/DINRoundPro-Light.eot') format('embedded-opentype'),
    url('./assets/fonts/DINRoundPro-Light.woff') format('woff'),
    url('./assets/fonts/DINRoundPro-Light.ttf') format('truetype');
  font-weight: 300;
  font-style: normal;
}
@font-face {
  font-family: 'DINPro-Light';
  src: url('./assets/fonts/DINPro-Light.eot') format('embedded-opentype'),
    url('./assets/fonts/DINPro-Light.woff') format('woff'),
    url('./assets/fonts/DINPro-Light.ttf') format('truetype');
  font-weight: 300;
  font-style: normal;
}
@font-face {
  font-family: 'DINRoundPro-Medium';
  src: url('./assets/fonts/DINRoundPro-Medi.eot') format('embedded-opentype'),
    url('./assets/fonts/DINRoundPro-Medi.woff') format('woff'),
    url('./assets/fonts/DINRoundPro-Medi.ttf') format('truetype');
  font-weight: 300;
  font-style: normal;
}


@font-face {
  font-family: 'DINPro-MediumItalic';
  src: url('./assets/fonts/DINPro-MediumItalic.eot') format('embedded-opentype'),
    url('./assets/fonts/DINPro-MediumItalic.woff') format('woff'),
    url('./assets/fonts/DINPro-MediumItalic.ttf') format('truetype');
  font-weight: 300;
  font-style: normal;
}


.fil-arianne {
    font-family: "DINRoundPro-Medium";
    font-size: 29px;
    color : #9E9E9E;
    text-align: center;
    left: 0;
    position: block;
    width: 100%;
    padding: 0 10%;
    text-align: initial;

}
.fil-arianne a {
  text-decoration: underline;
  text-decoration-color: rgb(227, 227, 227);
  color : #9E9E9E;
}
.fil-arianne a:hover {
  text-decoration: underline;
  color : #7a7a7a;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.footer-content p {
  flex-grow: 1;
  margin: 0;
  font-family : 'DINRoundPro-Light';
  color : black;
  font-size: 19px;
}

.ligne-footer {
  border-bottom: 1px solid #BEBEBE;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  width: 50%;
  margin: 0 auto;
}

footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  background-color: #F7F7F7;
}

.social-icons {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  align-items: center;
}

.social-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-left: 10px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.social-icon:hover {
  transform: scale(1.2);
}</style>
