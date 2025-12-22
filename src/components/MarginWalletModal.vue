<template>
  <teleport to="body">
    <div class="modal fade" id="marginWalletModal" tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">

          <!-- HEADER -->
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-wallet2 me-2"></i>
              Contratos de Margem
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <!-- BODY -->
          <div class="modal-body">

            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary"></div>
            </div>

            <div v-else-if="!operations.length" class="text-center text-muted py-5">
              Nenhuma operação de margem disponível
            </div>

            <!-- BANKS -->
            <div v-for="bank in operations" :key="bank.bank" class="mb-4">

              <div class="d-flex align-items-center mb-2">
                <img :src="bank.icon" class="me-2 rounded" width="32">
                <strong>{{ bank.bank_name }}</strong>
              </div>

              <!-- CONTRACTS -->
              <div class="row g-3">
                <div
                  v-for="item in bank.result"
                  :key="item.contract"
                  class="col-12 col-md-6 col-lg-4"
                >
                  <div class="card h-100 shadow-sm">
                    <div class="card-body">

                      <small class="text-muted">Contrato</small>
                      <div class="fw-semibold mb-2">{{ item.contract }}</div>

                      <div class="d-flex justify-content-between">
                        <span>Parcela</span>
                        <strong>R$ {{ format(item.installment) }}</strong>
                      </div>

                      <div class="d-flex justify-content-between">
                        <span>Prazo</span>
                        <strong>{{ item.term }}x</strong>
                      </div>

                      <div class="d-flex justify-content-between mb-3">
                        <span>Valor Liberado</span>
                        <strong class="text-success">
                          R$ {{ format(item.released_value) }}
                        </strong>
                      </div>

                      <button
                        class="btn w-100"
                        :class="inWallet(item.contract) ? 'btn-warning' : 'btn-success'"
                        :disabled="inWallet(item.contract)"
                        @click="addToWallet(bank, item)"
                      >
                        <span v-if="inWallet(item.contract)">
                          Já está na carteira
                        </span>
                        <span v-else>
                          Adicionar à carteira
                        </span>
                      </button>

                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- FOOTER -->
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" data-bs-dismiss="modal">
              Fechar
            </button>
          </div>

        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  name: "MarginWalletModal",

  props: {
    operations: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    format(value) {
      return Number(value).toLocaleString("pt-BR", {
        minimumFractionDigits: 2
      })
    },

    inWallet(contract) {
      const wallet = JSON.parse(localStorage.getItem("wallet")) || []
      return wallet.some(w => w.contract === contract)
    },

    addToWallet(bank, item) {
      const wallet = JSON.parse(localStorage.getItem("wallet")) || []

      wallet.push({
        type: "MARGEM",
        bank: bank.bank,
        bank_name: bank.bank_name,
        icon: bank.icon,
        ...item
      })

      localStorage.setItem("wallet", JSON.stringify(wallet))
      this.$emit("wallet-updated")
    }
  }
}
</script>
