<template>
  <teleport to="body">
    <div class="modal fade" id="walletModal" tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">

          <!-- HEADER -->
          <div class="modal-header">
            <h5 class="modal-title">Carteira de Ofertas</h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <!-- BODY -->
          <div class="modal-body">

            <!-- DADOS DO CLIENTE -->
            <div class="card mb-4 shadow-sm">
              <div class="card-body">
                <div class="row g-3">

                  <div class="col-12 col-md-4">
                    <label class="form-label fw-semibold">CPF</label>
                    <input
                      v-model="cpf"
                      type="text"
                      class="form-control"
                      maxlength="14"
                      placeholder="123.456.789-01"
                      @input="onCpfInput"
                    />
                  </div>

                  <div class="col-12 col-md-5">
                    <label class="form-label fw-semibold">Nome</label>
                    <input
                      v-model="nome"
                      type="text"
                      class="form-control"
                      placeholder="Nome do cliente"
                    />
                  </div>

                  <div class="col-12 col-md-3">
                    <label class="form-label fw-semibold">Benefício</label>
                    <input
                      v-model="entityNumber"
                      type="text"
                      class="form-control"
                      maxlength="13"
                      placeholder="123.456.789-0"
                      @input="onEntityInput"
                    />
                  </div>

                </div>
              </div>
            </div>

            <!-- WALLET VAZIA -->
            <div v-if="!walletStore.wallet.length" class="text-center text-muted py-4">
              Nenhuma oferta adicionada.
            </div>

            <!-- ITENS DA WALLET -->
            <div
              v-for="item in walletStore.wallet"
              :key="item.id"
              class="card mb-3 shadow-sm"
            >

              <!-- HEADER DO CARD -->
              <div class="card-header">
                <div class="row g-3 justify-content-center text-center align-items-center">

                  <!-- PORTABILIDADE -->
                  <template v-if="item.type !== 'margin'">
                    <div class="col-6 col-md-2">
                      <small class="text-muted">Operação</small>
                      <div class="fw-semibold">Port + Refin</div>
                    </div>

                    <div class="col-6 col-md-2">
                      <small class="text-muted">Contrato</small>
                      <div class="fw-semibold">{{ item.loan.contract }}</div>
                    </div>

                    <div class="col-6 col-md-2">
                      <small class="text-muted">Banco Origem</small>
                      <div>{{ item.loan.original_bank }}</div>
                    </div>

                    <div class="col-6 col-md-2">
                      <small class="text-muted">Parcela</small>
                      <div>{{ formatCurrency(item.loan.installment) }}</div>
                    </div>

                    <div class="col-6 col-md-2">
                      <small class="text-muted">Resta / Total</small>
                      <div>
                        {{ item.loan.remaining_terms }}/{{ item.loan.total_terms }}
                      </div>
                    </div>
                    <div class="col-6 col-md-2">
                      <small class="text-muted">Saldo Devedor</small>
                      <div>{{ formatCurrency(item.loan.ballance) }}</div>
                    </div>
                  </template>

                  <!-- MARGEM -->
                  <template v-else>
                    <div class="col-12 col-md-6">
                      <small class="text-muted">Tipo de Operação</small>
                      <div class="fw-semibold text-primary">Margem/RMC/RCC</div>
                    </div>
                  </template>

                </div>
              </div>

              <!-- BODY DO CARD -->
              <div class="card-body">
                <div class="row g-3 justify-content-center align-items-center text-center">

                  <div class="col-12 col-md-2">
                    <img
                      :src="item.bank.icon"
                      :id="'id-bank-' + item.bank.bank"
                      class="img-fluid mb-2 bank-logo"
                      style="max-height: 40px"
                    >
                  </div>

                  <div class="col-12 col-md-5">
                    <small class="text-muted">Tabela</small>
                    <div class="fw-semibold">
                      {{ item.table.name }} - {{ item.table.terms }}x
                    </div>
                  </div>

                  <div class="col-12 col-md-2">
                    <small class="text-muted">Troco</small>
                    <div class="fw-bold text-success fs-5">
                      {{ formatCurrency(item.table.exchange) }}
                    </div>
                  </div>

                  <!-- REMOVER -->
                  <div class="col-12 col-md-1 justify-content-CENTER">
                    <button
                      class="btn btn-outline-danger btn-sm d-flex"
                      @click="removeFromWallet(item.id)"
                    >
                      <i class="bi bi-trash me-1"></i>
                      Remover
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>

          <!-- FOOTER -->
          <div class="modal-footer d-flex justify-content-between align-items-center">

            <div>
              <small class="text-muted">Troco total para o cliente</small>
              <div class="fw-bold fs-5 text-success">
                {{ formatCurrency(totalExchange) }}
              </div>
            </div>

            <button
              class="btn btn-primary"
              :disabled="!walletStore.wallet.length || loading"
              @click="saveWallet"
            >
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              Salvar carteira
            </button>

          </div>

        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "../api/api.js";
import { useWalletStore } from "@/stores/walletStore";

import { useToast } from "@/composables/useToast";
const { showToast } = useToast();

const walletStore = useWalletStore();

const cpf = ref("");
const nome = ref("");
const entityNumber = ref("");
const loading = ref(false);

const totalExchange = computed(() =>
  walletStore.wallet.reduce(
    (total, item) => total + Number(item.table.exchange || 0),
    0
  )
);

function onlyNumbers(value) {
  return value.replace(/\D/g, "");
}

function maskCpf(value) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function maskEntity(value) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)$/, "$1-$2");
}

function onCpfInput(e) {
  cpf.value = maskCpf(e.target.value);
}

function onEntityInput(e) {
  entityNumber.value = maskEntity(e.target.value);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(Number(value ?? 0));
}

function removeFromWallet(id) {
  walletStore.wallet = walletStore.wallet.filter(item => item.id !== id);
  localStorage.setItem("wallet", JSON.stringify(walletStore.wallet));
}

function validateForm() {
  if (onlyNumbers(cpf.value).length !== 11) {
    showToast("Informe um CPF válido", "danger");
    return false;
  }
  if (!nome.value.trim()) {
    showToast("Informe o nome do cliente", "danger");
    return false;
  }
  if (onlyNumbers(entityNumber.value).length !== 10) {
    showToast("Informe um Benefício válido", "danger");
    return false;
  }
  if (!walletStore.wallet.length) {
    showToast("A carteira está vazia", "danger");
    return false;
  }
  return true;
}

function toTwoDecimals(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

async function saveWallet() {
  if (!validateForm()) return;

  loading.value = true;

  try {
    const payload = {
      cpf: onlyNumbers(cpf.value),
      nome: nome.value,
      entity_number: onlyNumbers(entityNumber.value),
      wallet: walletStore.wallet.map(item => ({
        type: item.type || "loan",

        contract: item.type !== "margin" ? item.loan.contract : null,
        original_bank: item.type !== "margin" ? item.loan.original_bank : null,

      installment:
        item.type === "margin"
          ? toTwoDecimals(item.margin.installment)
          : toTwoDecimals(item.loan.installment),

        ballance: item.type !== "margin" ? item.loan.ballance : null,
        remaining_terms: item.type !== "margin" ? item.loan.remaining_terms : null,
        total_terms: item.type !== "margin" ? item.loan.total_terms : null,

        bank: item.bank.bank,
        bank_name: item.bank.bank_name,
        bank_icon: item.bank.icon,

        table_name: item.table.name,
        table_terms: item.table.terms,
        table_exchange: toTwoDecimals(item.table.exchange),
      }))
    };

    await axios.post("/simulations/wallet/", payload);

    walletStore.clear();
    cpf.value = "";
    nome.value = "";
    entityNumber.value = "";

    showToast("Carteira salva com sucesso!", "success");

  } catch (error) {
    console.error(error);
    showToast("Erro ao salvar carteira", "danger");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.bank-logo {
  border-radius: 5px;
}

#id-bank-707{
  background-color: rgb(0, 0, 88);
}
</style>