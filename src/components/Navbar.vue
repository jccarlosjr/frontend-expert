<template>
  <header class="navbar">
    <div class="logo" id="title-logo">Roteiro de Bolso</div>

    <nav :class="['nav-links', { open: isOpen }]">
      
      <router-link
        v-for="item in menu"
        :key="item.label"
        :to="item.route"
        class="nav-item"
        @click="handleClick(item)"
      >
        <i v-if="item.icon" :class="item.icon"></i>
        <span style="margin-left: 6px">{{ item.label }}</span>
      </router-link>

      <!-- BOTÃO CARTEIRA -->
      <a
        href="#"
        class="nav-item position-relative"
        @click.prevent="openWallet"
      >
        <i class="bi bi-wallet2"></i>
        <span style="margin-left: 6px">Carteira</span>

        <span
          v-if="walletStore.count"
          class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
        >
          {{ walletStore.count }}
        </span>
      </a>

    </nav>

    <div class="hamburger" @click="isOpen = !isOpen">
      <span :class="{ open: isOpen }"></span>
      <span :class="{ open: isOpen }"></span>
      <span :class="{ open: isOpen }"></span>
    </div>
  </header>
</template>

<script>
import { mapStores } from "pinia";
import { useWalletStore } from "@/stores/walletStore";

export default {
  name: "Navbar",

  data() {
    return {
      isOpen: false,
      menu: [
        { label: "Home", route: "/", icon: "bi bi-house" },
        { label: "Simuladores", route: "/simulations", icon: "bi bi-calculator" },
        { label: "Subir PDF", route: "/anexo-pdf", icon: "bi bi-upload" },
        { label: "Simulações", route: "/my-simulations", icon: "bi-folder" },
        { label: "Sair", route: "/sair", icon: "bi bi-door-open" },
      ],
    };
  },

  computed: {
    ...mapStores(useWalletStore),
  },

  methods: {
    handleClick(item) {
      this.isOpen = false;

      if (item.label === "Sair") {
        this.logout();
      }
    },

    openWallet() {
      this.isOpen = false;
      this.$emit("open-wallet");
    },

    logout() {
      localStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
/* ===== GENERAL NAVBAR DESIGN ===== */
@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');

#title-logo{
  font-family: 'Pacifico', cursive;
  font-weight: lighter;
  /* color: blue; */
}

.navbar {
  width: 100%;
  height: 50px;
  background-image: linear-gradient(to right, rgba(1, 51, 109, 0.747), rgb(0, 0, 90), rgb(0, 0, 90));
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  position: relative;
  box-sizing: border-box;
  left: 0;
  top: 0;
}

.logo {
  font-size: 1.6rem;
  font-weight: 600;
  color: #fff;
  letter-spacing: 1px;
}
/* ===== DESKTOP NAVIGATION ===== */

.nav-links {
  display: flex;
  gap: 2rem;
  transition: 0.3s ease;
}

.nav-links a {
  color: #ddd;
  text-decoration: none;
  font-size: 1rem;
  position: relative;
  cursor: pointer;
  padding: 5px 0;
  transition: 0.3s;
}

/* Linha animada */
.nav-links a::after {
  content: "";
  position: absolute;
  bottom: -3px;
  left: 0;
  height: 2px;
  width: 0%;
  background: #4da8ff;
  transition: 0.3s;
}

.nav-links a:hover::after,
.nav-links a.active::after {
  width: 100%;
}

.nav-links a.active {
  color: #fff;
}

/* ===== HAMBURGER BUTTON (MOBILE) ===== */

.hamburger {
  display: none;
  flex-direction: column;
  gap: 6px;
  cursor: pointer;
  z-index: 2000;
}

.hamburger span {
  width: 30px;
  height: 3px;
  background: #fff;
  border-radius: 3px;
  transition: 0.4s;
}

/* Animação do ícone */
.hamburger span.open:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}
.hamburger span.open:nth-child(2) {
  opacity: 0;
}
.hamburger span.open:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

/* ===== MOBILE NAV ===== */

@media (max-width: 820px) {
  .hamburger {
    display: flex;
  }

  .nav-links {
    position: absolute;
    top: 70px; /* altura da navbar */
    left: 0;
    right: 0;
    height: calc(100vh - 70px);
    width: 100%;
    background: rgba(15, 15, 15, 0.9);
    backdrop-filter: blur(12px);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2.5rem;
    transform: translateX(-100%);
    opacity: 0;
    pointer-events: none;
  }

  .nav-links.open {
    transform: translateX(0);
    opacity: 1;
    pointer-events: all;
  }

  .nav-links a {
    font-size: 1.4rem;
  }
}
</style>