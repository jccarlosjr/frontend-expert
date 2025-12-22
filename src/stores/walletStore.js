import { defineStore } from "pinia";

export const useWalletStore = defineStore("wallet", {
  state: () => ({
    wallet: loadWallet(),
  }),

  getters: {
    totalExchange(state) {
      return state.wallet.reduce(
        (total, item) => total + Number(item.table.exchange || 0),
        0
      );
    },
    count(state) {
      return state.wallet.length;
    },
  },

  actions: {
    add(item) {
      const exists = this.wallet.some(
        w => w.loan.contract === item.loan.contract
      );

      if (exists) {
        return false;
      }

      this.wallet.push(item);
      this.persist();
      return true;
    },

    remove(id) {
      this.wallet = this.wallet.filter(item => item.id !== id);
      this.persist();
    },

    clear() {
      this.wallet = [];
      this.persist();
    },

    persist() {
      try {
        localStorage.setItem("wallet", JSON.stringify(this.wallet));
      } catch (e) {
        console.error("Erro ao salvar wallet no localStorage", e);
      }
    },
  },
});

function loadWallet() {
  try {
    const stored = localStorage.getItem("wallet");
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Erro ao carregar wallet do localStorage", e);
    return [];
  }
}
