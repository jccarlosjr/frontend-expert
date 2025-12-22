<template>
  <div class="app-layout">
    <Navbar @open-wallet="openWalletModal" />

    <main class="content">
      <router-view />
      <WalletModal />
      <BaseToast
        v-if="show"
        :message="toastMessage"
        :variant="toastVariant"
      />
    </main>
  </div>
</template>

<script setup>
import BaseToast from "@/components/BaseToast.vue";
import { useToast } from "@/composables/useToast";

const { toastMessage, toastVariant, show } = useToast();
</script>

<script>
import Navbar from "@/components/Navbar.vue";
import WalletModal from "@/components/WalletModal.vue";

export default {
  components: { Navbar, WalletModal },
  methods: {
    openWalletModal() {
      const modal = new bootstrap.Modal(
        document.getElementById("walletModal")
      );
      modal.show();
    },
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

body{
    font-family: "Montserrat", sans-serif;
    font-optical-sizing: auto;
    font-style: normal;
}

.app-layout {
  display: flex;
  flex-direction: column; /* IMPORTANTE! */
  min-height: 100vh;
}

.content {
  flex: 1;
  padding: 2rem;
}
</style>
