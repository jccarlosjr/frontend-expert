<template>
  <div class="container py-3">
    <form class="row g-2 align-items-end mb-4" @submit.prevent="sendRequest">
      <div class="col-12 col-md-4">
        <label for="formFile" class="form-label fw-bold">Arquivo PDF</label>
        <input class="form-control" required type="file" id="formFile" ref="fileInput" @change="onChangeFile"
          accept="application/pdf" />
      </div>
      <div class="col-12 col-md-3">
        <label for="entityCodeInput" class="form-label fw-bold">Espécie</label>
        <select name="entityCodeInput" required class="form-control" id="entityCodeInput" v-model="entityCode"
          @change="validateDDB">
          <option value="" selected disabled>Selecione...</option>
          <option value="1">1 - Por morte do trabalhador rural</option>
          <option value="2">2 - Pensão por morte por acidente do trabalho do trabalhador rural</option>
          <option value="3">3 - Pensão por morte do empregador rural</option>
          <option value="4">4 - Por invalidez do trabalhador rural</option>
          <option value="5">5 - Aposentadoria por invalidez, por acidente do trabalhador rural</option>
          <option value="6">6 - Por invalidez do empregador rural</option>
          <option value="7">7 - Por idade do trabalhador rural</option>
          <option value="8">8 - Por idade do empregador rural</option>
          <option value="11">11 - Amparo previdenciário invalidez - Trab. rural</option>
          <option value="12">12 - Amparo previdenciário idade - Trab. rural</option>
          <option value="18">18 - Auxílio inclusão</option>
          <option value="19">19 - Pensão de estudante (Lei 7004/82)</option>
          <option value="20">20 - Pensão por morte de ex-diplomata</option>
          <option value="21">21 - Por morte previdenciária (LOPS)</option>
          <option value="22">22 - Por morte estatutária (EPU)</option>
          <option value="23">23 - Por morte de ex-combatente</option>
          <option value="24">24 - Pensão especial (ato institucional)</option>
          <option value="26">26 - Pensão especial (Lei 593/48) (EPU)</option>
          <option value="27">27 - Por morte do servidor público federal com dupla aposentadoria</option>
          <option value="28">28 - Por morte, do Regime Geral (Decreto 20465/31)</option>
          <option value="29">29 - Por morte de ex-combatente marítimo (Lei 1756/52)</option>
          <option value="30">30 - Renda mensal vitalícia por incapacidade</option>
          <option value="32">32 - Por invalidez previdenciária (LOPS)</option>
          <option value="33">33 - Por invalidez de aeronauta</option>
          <option value="34">34 - Por invalidez de ex-combatente marítimo</option>
          <option value="37">37 - Aposentadoria de extranumerário da União (EPU)</option>
          <option value="38">38 - Aposentadoria da extinta CAPIN (EPU)</option>
          <option value="40">40 - Renda mensal vitalícia por idade</option>
          <option value="41">41 - Por idade (LOPS)</option>
          <option value="42">42 - Por tempo de contribuição previdenciária</option>
          <option value="43">43 - Por tempo de contribuição de ex-combatente</option>
          <option value="44">44 - Por tempo de contribuição de aeronauta</option>
          <option value="45">45 - Por tempo de contribuição de jornalista profissional</option>
          <option value="46">46 - Por tempo de contribuição especial</option>
          <option value="49">49 - Por tempo de contribuição ordinária</option>
          <option value="51">51 - Aposentadoria por invalidez (Extinto Plano Básico)</option>
          <option value="52">52 - Por idade (Extinto plano Básico)</option>
          <option value="54">54 - Pensão especial vitalícia (Lei 9793/99) (EPU)</option>
          <option value="55">55 - Por morte (Extinto Plano Básico)</option>
          <option value="56">56 - Pensão mensal vitalícia (Talidomida)</option>
          <option value="57">57 - Por tempo de contribuição de professores</option>
          <option value="58">58 - Aposentadoria excepcional do anistiado</option>
          <option value="59">59 - Por morte excepcional do anistiado</option>
          <option value="60">60 - Pensão especial mensal vitalícia</option>
          <option value="72">72 - Contribuição de ex-combatente marítimo</option>
          <option value="78">78 - Idade de ex-combatente marítimo</option>
          <option value="81">81 - Idade compulsória (Ex-SASSE)</option>
          <option value="82">82 - Tempo contribuição (Ex-SASSE)</option>
          <option value="83">83 - Invalidez (Ex-SASSE)</option>
          <option value="84">84 - Morte (Ex-SASSE)</option>
          <option value="87">87 - Assistencial deficiência (LOAS)</option>
          <option value="88">88 - Assistencial idoso (LOAS)</option>
          <option value="89">89 - Vítimas hemodiálise</option>
          <option value="92">92 - Invalidez por acidente do trabalho</option>
          <option value="93">93 - Morte por acidente do trabalho</option>
          <option value="94">94 - Auxílio-acidente</option>
          <option value="96">96 - Hanseníase</option>
        </select>
      </div>
      <div v-if="showDDB" class="col-6 col-md-2">
        <label for="form-label fw-bold">Data Despacho (DDB)</label>
        <input id="ddbInput" type="text" class="form-control" v-model="ddb" @input="maskDate" @blur="validateDDBDate"
          maxlength="10" />
      </div>
      <div class="col-6 col-md-1">
        <label class="form-label fw-bold">Idade</label>
        <input type="text" required class="form-control" id="idadeInput" v-model="idade" maxlength="2"
          @input="onlyNumbers">
      </div>
      <div class="col-6 col-md-2">
        <input class="form-check-input me-2" type="checkbox" id="analfabetoCheck" v-model="analfabeto">
        <label class="form-label fw-bold">Analfabeto</label>
      </div>
      <div class="col-6 col-md-2">
        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Enviar
        </button>
      </div>
    </form>

    <div v-if="data && data.loans && data.loans.length" class="mt-4">
      <div class="row g-3">

        <!-- Margem disponível -->
        <div v-if="data?.available_margin" class="mt-4">
          <div class="row g-3">

            <!-- MARGEM -->
            <div class="col-12 col-sm-6 col-md-4">
              <div class="card p-3 shadow-sm h-100 text-center">
                <small class="text-muted text-uppercase">Margem Livre</small>

                <div class="fs-4 fw-semibold text-success gap-2">
                  <div class="card-body g-2">

                  <template v-if="!editingMargin">
                    {{ formatCurrency(availableMargin) }}
                    <button class="btn btn-outline-success btn-sm bi bi-pencil-square" @click="startEditMargin"
                      title="Editar margem"></button>
                  </template>

                  <template v-else>
                    <input type="text" class="form-control form-control-sm text-center" style="max-width: 140px"
                      v-model="availableMarginInput" @input="maskCurrency" @keyup.enter="confirmEditMargin"
                      @blur="confirmEditMargin" autofocus />
                  </template>
                  </div>

                  <div class="card-body row g-2 justify-content-center">
                    <div v-for="bank in margins" :key="bank.bank" class="col-4 col-sm-3 col-md-3 text-center">
                      <img v-if="bank.icon" :src="bank.icon" class="img-fluid img-bank bank-logo"
                        :id="'bank-' + bank.bank" :class="{ 'bank-disabled': !Array.isArray(bank.result) }"
                        :title="!Array.isArray(bank.result) ? bank.result : ''"
                        @click="Array.isArray(bank.result) && openMarginModal(bank)"
                        @error="e => e.target.src = '/static/images/banks/default.png'" />
                    </div>
                  </div>

                </div>
              </div>
            </div>

          <!-- RMC -->
            <div class="col-12 col-sm-6 col-md-4">
              <div class="card p-3 shadow-sm h-100 text-center">
                <small class="text-muted text-uppercase">RMC</small>

                <div class="fs-6 fw-semibold text-primary mt-1">
                  {{ formatCurrency(data.available_margin?.rmc) }}
                </div>

                <div class="card-body row g-2 justify-content-center mt-2">
                  <template v-if="rmcMargins.length">
                    <div v-for="bank in rmcMargins" :key="'rmc-' + bank.bank"
                      class="col-4 col-sm-3 col-md-3 text-center">
                      <img v-if="bank.icon" :src="bank.icon" class="img-fluid img-bank bank-logo"
                        :class="{ 'bank-disabled': !Array.isArray(bank.result) }"
                        :title="!Array.isArray(bank.result) ? bank.result : ''"
                        @click="Array.isArray(bank.result) && openMarginModal(bank)"
                        @error="e => e.target.src = '/static/images/banks/default.png'" />
                    </div>
                  </template>

                  <div v-else class="text-muted small">
                    Nenhuma oferta disponível
                  </div>
                </div>
              </div>
            </div>

            <!-- RCC -->
            <div class="col-12 col-sm-6 col-md-4">
              <div class="card p-3 shadow-sm h-100 text-center">
                <small class="text-muted text-uppercase">RCC</small>

                <div class="fs-6 fw-semibold text-warning mt-1">
                  {{ formatCurrency(data.available_margin?.rcc) }}
                </div>

                <div class="card-body row g-2 justify-content-center mt-2">
                  <template v-if="rccMargins.length">
                    <div v-for="bank in rccMargins" :key="'rcc-' + bank.bank"
                      class="col-4 col-sm-3 col-md-3 text-center">
                      <img v-if="bank.icon" :src="bank.icon" class="img-fluid img-bank bank-logo"
                        :class="{ 'bank-disabled': !Array.isArray(bank.result) }"
                        :title="!Array.isArray(bank.result) ? bank.result : ''"
                        @click="Array.isArray(bank.result) && openMarginModal(bank)"
                        @error="e => e.target.src = '/static/images/banks/default.png'" />
                    </div>
                  </template>

                  <div v-else class="text-muted small">
                    Nenhuma oferta disponível
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <h5 class="fw-bold text-center mt-5">Empréstimos Ativos</h5>
        <template v-for="(loan, idx) in data.loans" :key="loan.contract + '-' + idx">
          <div class="col-12 col-md-6 col-lg-4">
            <div class="card shadow-lg border-0 rounded-3 h-100">

              <!-- HEADER -->
              <div class="card-head text-center mt-3">
                <h5 class="card-title">
                  Port + Refin – Parcela
                  <span class="text-primary fw-semibold">
                    {{ formatCurrency(loan.installment) }}
                  </span>
                </h5>
                <p class="mb-1">
                  <small>Contrato: {{ loan.contract }}</small>
                </p>
              </div>

              <!-- DADOS DO CONTRATO -->
              <div class="card-body pt-2">
                <table class="table table-sm table-hover align-middle mb-0 responsive-table">
                  <thead>
                    <tr>
                      <th>Banco</th>
                      <th>Resta/Total</th>
                      <th>Taxa</th>
                      <th>Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td data-label="Banco">
                        {{ loan.original_bank }}
                      </td>
                      <td data-label="Resta/Total">
                        {{ loan.remaining_terms }}/{{ loan.paids_terms + loan.remaining_terms }}
                      </td>
                      <td data-label="Taxa">
                        {{ formatNumber(loan.rate, 2) }}%
                      </td>
                      <td data-label="Saldo" class="fw-semibold text-primary">
                        {{ formatCurrency(loan.ballance) }}
                      </td>
                    </tr>
                  </tbody>
                </table>

              </div>
              <!-- RESULTADO DOS BANCOS -->
              <div class="card-body pt-0" v-if="loanResults[idx]">
                <div class="row g-2 justify-content-center">
                  <div v-for="bank in loanResults[idx]" :key="bank.bank" class="col-4 col-sm-3 col-md-2 text-center">
                    <img v-if="bank.icon" :src="bank.icon" class="img-fluid img-bank bank-logo"
                      :id="'bank-' + bank.bank" :class="{ 'bank-disabled': !Array.isArray(bank.result) }"
                      :title="!Array.isArray(bank.result) ? bank.result : ''"
                      @click="Array.isArray(bank.result) && openBankModal(bank, loan)"
                      @error="e => e.target.src = '/static/images/banks/default.png'" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

      </div>
    </div>


    <!-- Nenhum empréstimo -->
    <div v-else-if="data && (!data.loans || !data.loans.length)" class="mt-4">
      <div class="alert alert-info text-center">Nenhum empréstimo encontrado.</div>
    </div>

    <!-- Mensagem de erro -->
    <div v-if="message" class="mt-4">
      <div :class="`alert alert-${messageType} text-center`">{{ message }}</div>
    </div>

  </div>

  <teleport to="body">
    <div class="modal fade" id="bankModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">

          <!-- HEADER -->
          <div class="modal-header">
            <h5 class="modal-title w-100 text-center">
              Tabelas de Refinanciamento {{ selectedBank?.bank_name }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <!-- BODY -->
          <div class="modal-body">

            <!-- RESUMO DO CONTRATO -->
            <div class="card mb-3 shadow-sm" v-if="selectedLoan">
              <div class="card-head text-center">
                <small class="text-muted d-block">Nº do Contrato</small>
                {{ selectedLoan.contract }}
              </div>
              <div class="card-body py-2">
                <div class="row text-center g-2">

                  <div class="col-6 col-md-3">
                    <small class="text-muted d-block">Banco</small>
                    <span class="fw-semibold">
                      {{ selectedLoan.original_bank }}
                    </span>
                  </div>

                  <div class="col-6 col-md-3">
                    <small class="text-muted d-block">Parcela</small>
                    <span class="fw-semibold text-primary">
                      {{ formatCurrency(selectedLoan.installment) }}
                    </span>
                  </div>

                  <div class="col-6 col-md-3">
                    <small class="text-muted d-block">Saldo</small>
                    <span class="fw-semibold">
                      {{ formatCurrency(selectedLoan.ballance) }}
                    </span>
                  </div>

                  <div class="col-6 col-md-3">
                    <small class="text-muted d-block">Resta / Total</small>
                    <span class="fw-semibold">
                      {{ selectedLoan.remaining_terms }}/{{ selectedLoan.remaining_terms + selectedLoan.paids_terms }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- TABELA SELECIONADA -->
            <div v-if="selectedTable" class="card mb-3 border-success shadow-sm">
              <div class="card-body py-2">
                <div class="row text-center g-2 align-items-center">

                  <div class="col-12 col-md-4">
                    <small class="text-muted d-block">Tabela Selecionada</small>
                    <span class="fw-semibold">{{ selectedTable.name }}</span>
                  </div>

                  <div class="col-6 col-md-4">
                    <small class="text-muted d-block">Prazo</small>
                    <span class="fw-semibold">{{ selectedTable.terms }}x</span>
                  </div>

                  <div class="col-6 col-md-4">
                    <small class="text-muted d-block">Troco</small>
                    <span class="fw-bold text-success">
                      {{ formatCurrency(selectedTable.exchange) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="d-grid mt-3">
              <button class="btn btn-success" :disabled="!selectedTable || isAlreadyInWallet" @click="addToWallet">
                {{ isAlreadyInWallet ? 'Contrato já adicionado à carteira' : 'Adicionar à carteira' }}
              </button>
            </div>

            <!-- TABELAS DE REFIN -->
            <table class="table text-center align-middle mb-0">
              <thead>
                <tr>
                  <th>Tabela</th>
                  <th>Prazo</th>
                  <th>Troco</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(table, idx) in (Array.isArray(selectedBank?.result) ? selectedBank.result : [])" :key="idx"
                  :class="{ 'table-success': selectedTable === table }">
                  <td>{{ table.name }}</td>
                  <td>{{ table.terms }}x</td>
                  <td class="fw-semibold">
                    {{ formatCurrency(table.exchange) }}
                  </td>
                  <td>
                    <button class="btn btn-sm" :class="selectedTable === table ? 'btn-success' : 'btn-outline-primary'"
                      @click="selectedTable = table">
                      {{ selectedTable === table ? 'Selecionada' : 'Selecionar' }}
                    </button>
                  </td>
                </tr>

                <tr v-if="!Array.isArray(selectedBank?.result)">
                  <td colspan="4" class="text-muted py-3">
                    Nenhuma tabela disponível
                  </td>
                </tr>
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </div>

    <!-- MODAL DE MARGEM -->
    <div class="modal fade" id="marginModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">

          <!-- HEADER -->
          <div class="modal-header">
            <h5 class="modal-title w-100 text-center">
              Tabelas {{ selectedMarginBank?.bank_name }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <!-- BODY -->
          <div class="modal-body">

            <!-- TABELA SELECIONADA -->
            <div v-if="selectedMarginTable" class="card mb-3 border-success shadow-sm">
              <div class="card-body py-2">
                <div class="row text-center g-2 align-items-center">

                  <div class="col-12 col-md-6">
                    <small class="text-muted d-block">Tabela Selecionada</small>
                    <span class="fw-semibold">
                      {{ selectedMarginTable.name }}
                    </span>
                  </div>

                  <div class="col-6 col-md-3">
                    <small class="text-muted d-block">Prazo</small>
                    <span class="fw-semibold">
                      {{ selectedMarginTable.terms }}x
                    </span>
                  </div>

                  <div class="col-6 col-md-3">
                    <small class="text-muted d-block">Troco</small>
                    <span class="fw-bold text-success">
                      {{ formatCurrency(selectedMarginTable.exchange) }}
                    </span>
                  </div>

                </div>
              </div>
            </div>

            <div class="d-grid mb-3">
              <button class="btn btn-success" :disabled="!selectedMarginTable" @click="addMarginToWallet">
                Adicionar à carteira
              </button>
            </div>

            <!-- TABELAS -->
            <table class="table text-center align-middle mb-0">
              <thead>
                <tr>
                  <th>Tabela</th>
                  <th>Prazo</th>
                  <th>Troco</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(table, idx) in (Array.isArray(selectedMarginBank?.result) ? selectedMarginBank.result : [])"
                  :key="idx" :class="{ 'table-success': selectedMarginTable === table }">
                  <td>{{ table.name }}</td>
                  <td>{{ table.terms }}x</td>
                  <td class="fw-semibold">
                    {{ formatCurrency(table.exchange) }}
                  </td>
                  <td>
                    <button class="btn btn-sm"
                      :class="selectedMarginTable === table ? 'btn-success' : 'btn-outline-primary'"
                      @click="selectedMarginTable = table">
                      {{ selectedMarginTable === table ? 'Selecionada' : 'Selecionar' }}
                    </button>
                  </td>
                </tr>

                <tr v-if="!Array.isArray(selectedMarginBank?.result)">
                  <td colspan="4" class="text-muted py-3">
                    Nenhuma tabela disponível
                  </td>
                </tr>
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import api from '../api/api.js'
import { useWalletStore } from "@/stores/walletStore";

import { useToast } from "@/composables/useToast";
const { showToast } = useToast();

export default {
  data() {
    return {
      toastMessage: "",
      toastInstance: null,
      file: null,
      data: null,
      loading: false,
      message: null,
      messageType: 'info',
      loanResults: {},
      loadingSim: {},
      hover: null,
      idade: "",
      entityCode: "",
      analfabeto: false,
      selectedBank: null,
      selectedLoan: null,
      selectedTable: null,
      selectedMarginBank: null,
      selectedMarginTable: null,
      entityCode: "",
      ddb: "",
      showDDB: false,
      inv: ["32", "92", "04", "06", "33", "34", "37", "38", "51", "83", "96"],
      loas: ["88", "87"],
      margins: [],
      loadingMargins: false,
      editingMargin: false,
      availableMargin: 0,
      availableMarginInput: "",
      rmcMargins: [],
      rccMargins: [],
    }
  },

  setup() {
    const walletStore = useWalletStore();
    return { walletStore };
  },

  computed: {
    totalExchange() {
      return this.walletStore.wallet.reduce((total, item) => {
        return total + Number(item.table.exchange || 0)
      }, 0)
    },

    isAlreadyInWallet() {
      if (!this.selectedLoan) return false;

      return this.walletStore.wallet.some(w =>
        w.type !== "margin" &&
        w.loan &&
        w.loan.contract === this.selectedLoan.contract
      );
    }
  },

  mounted() {
    const saved = localStorage.getItem("wallet");
    this.walletStore.wallet = saved ? JSON.parse(saved) : [];
  },

  methods: {
    onChangeFile(event) {
      this.file = event.target.files[0];
      this.data = null;
      this.message = null;
    },
    showToast(message, type = "warning") {
      const toastEl = this.$refs.toast;

      toastEl.classList.remove(
        "text-bg-warning",
        "text-bg-success",
        "text-bg-danger"
      );

      toastEl.classList.add(`text-bg-${type}`);

      this.toastMessage = message;

      this.$nextTick(() => {
        if (!this.toastInstance) {
          this.toastInstance = new bootstrap.Toast(toastEl, { delay: 3000 });
        }
        this.toastInstance.show();
      });
    },
    saveWallet() {
      localStorage.setItem("wallet", JSON.stringify(this.walletStore.wallet));
    },
    openWalletModal() {
      const modalEl = document.getElementById("walletModal");
      if (!modalEl) return;
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    },
    removeFromWallet(id) {
      this.walletStore.wallet = this.walletStore.wallet.filter(item => item.id !== id);
      this.saveWallet();
    },
    addToWallet() {
      if (!this.selectedLoan || !this.selectedBank || !this.selectedTable) return;

      const alreadyExists = this.walletStore.wallet.some(
        item =>
          item.type !== "margin" &&
          item.loan &&
          item.loan.contract === this.selectedLoan.contract
      );

      if (alreadyExists) {
        return;
      }

      const item = {
        id: Date.now(),
        created_at: new Date().toISOString(),

        loan: {
          contract: this.selectedLoan.contract,
          original_bank: this.selectedLoan.original_bank,
          installment: this.selectedLoan.installment,
          ballance: this.selectedLoan.ballance,
          remaining_terms: this.selectedLoan.remaining_terms,
          total_terms:
            this.selectedLoan.remaining_terms + this.selectedLoan.paids_terms
        },

        bank: {
          bank: this.selectedBank.bank,
          bank_name: this.selectedBank.bank_name,
          icon: this.selectedBank.icon,
        },

        table: {
          name: this.selectedTable.name,
          terms: this.selectedTable.terms,
          exchange: this.selectedTable.exchange,
          rate: this.selectedTable.rate
        },
      };

      this.walletStore.wallet.push(item);
      this.saveWallet();

      showToast("Oferta adicionada à carteira.", "success");


      const modalEl = document.getElementById("bankModal");
      bootstrap.Modal.getInstance(modalEl)?.hide();
    },
    addMarginToWallet() {
      if (!this.selectedMarginBank || !this.selectedMarginTable) return;
      const item = {
        id: Date.now(),
        created_at: new Date().toISOString(),
        loan: null,
        bank: {
          bank: this.selectedMarginBank.bank,
          bank_name: this.selectedMarginBank.bank_name,
          icon: this.selectedMarginBank.icon
        },
        table: {
          name: this.selectedMarginTable.name,
          terms: this.selectedMarginTable.terms,
          exchange: this.selectedMarginTable.exchange,
          rate: this.selectedMarginTable.rate
        },
        margin: {
          installment: this.availableMargin
        },
        type: "margin"
      };

      this.walletStore.wallet.push(item);
      this.saveWallet();

      showToast("Margem adicionada à carteira.", "success");

      const modalEl = document.getElementById("marginModal");
      bootstrap.Modal.getInstance(modalEl)?.hide();
    },
    openBankModal(bank, loan) {
      this.selectedBank = bank;
      this.selectedLoan = loan;
      this.selectedTable = null;

      const modal = new bootstrap.Modal(
        document.getElementById("bankModal")
      );
      modal.show();
    },
    openMarginModal(bank) {
      this.selectedMarginBank = bank;
      this.selectedMarginTable = null;

      const modal = new bootstrap.Modal(
        document.getElementById("marginModal")
      );
      modal.show();
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(Number(value ?? 0));
    },
    formatNumber(value, digits = 2) {
      return Number(value ?? 0).toFixed(digits);
    },
    async sendRequest() {
      if (!this.file) {
        this.message = 'Selecione um arquivo PDF primeiro.';
        this.messageType = 'warning';
        return;
      }

      this.loading = true;
      this.message = null;

      const formData = new FormData();
      formData.append("pdf_file", this.file);
      try {
        const r = await api.post(
          "/extrato/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            }
          }
        );

        if (r.data.success) {
          this.data = r.data.json_data;
          console.log(this.data);
          if (this.data[0] === 'Cliente com margem negativa, realize o cálculo manualmente') {
            this.message = r.data.message || 'Cliente com margem negativa, realize o cálculo manualmente';
            this.messageType = "warning";
            showToast(this.message, "warning");
            return;
          }
          this.availableMargin = Number(
            this.data.available_margin?.margem ?? 0
          );
          this.availableMarginInput = this.availableMargin.toFixed(2);
          this.autoSimulateAllLoans();
          this.getMargins();
          this.getCardMargins(
            this.data.available_margin?.rmc,
            "rmcMargins"
          );

          this.getCardMargins(
            this.data.available_margin?.rcc,
            "rccMargins"
          );

          this.entityCode = this.data.loans[0].entity_code;
        } else {
          this.data = null;
          this.message = r.data.message || "Erro ao processar PDF.";
          this.messageType = "danger";
        }

      } catch (e) {
        console.error(e);
        this.data = null;

        if (e.response?.status === 403) {
          this.message = "Você não tem permissão para acessar essa ferramenta.";
        } else if (e.response?.status === 400) {
          this.message = e.response.data?.message || "Requisição inválida.";
        } else {
          this.message = "Erro ao enviar o arquivo.";
        }

        this.messageType = "danger";

      } finally {
        this.loading = false;
      }
    },
    async simulateLoan(loan, idx) {
      this.loadingSim[idx] = true;
      this.loanResults[idx] = null;

      function convertDateToISO(dateBR) {
        if (!dateBR || dateBR.length !== 10) return null;
        const [day, month, year] = dateBR.split("/");
        if (!day || !month || !year) return null;
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }

      const payload = {
        age: Number(this.idade),
        original_bank: parseInt(loan.original_bank),
        rate: Number(loan.rate),
        original_terms: Number(loan.paids_terms + loan.remaining_terms),
        remaining_terms: Number(loan.remaining_terms),
        installment: Number(loan.installment),
        ballance: Number(loan.ballance),
        entity_code: Number(this.entityCode),
        illiterate: this.analfabeto,
        negative: false,
        user_room: 1,
        initial_date: convertDateToISO(this.ddb)
      };

      try {
        const r = await api.post("/operations/", payload);
        this.loanResults[idx] = r.data.results;

      } catch (e) {
        console.error(e);
      } finally {
        this.loadingSim[idx] = false;
      }
    },
    async getMargins() {
      if (!this.data?.loans?.length) return;

      this.loadingMargins = true;
      this.margins = [];

      function convertDateToISO(dateBR) {
        if (!dateBR || dateBR.length !== 10) return null;
        const [day, month, year] = dateBR.split("/");
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }

      const margem = this.data.available_margin['margem'];

      const payload = {
        age: Number(this.idade),
        installment: Number(margem),
        entity_code: Number(this.entityCode),
        illiterate: this.analfabeto,
        negative: false,
        user_room: 1,
        initial_date: convertDateToISO(this.ddb)
      };

      try {
        const r = await api.post(
          "/operations/new/",
          payload,

        );

        if (r.data.status === "success") {
          this.margins = r.data.results || [];
        }

      } catch (e) {
        console.error("Erro ao buscar margens:", e);
      } finally {
        this.loadingMargins = false;
      }
    },
    async getCardMargins(installment, target) {
      if (!installment || installment <= 0) {
        this[target] = [];
        return;
      }

      const convertDateToISO = (dateBR) => {
        if (!dateBR || dateBR.length !== 10) return null;
        const [d, m, y] = dateBR.split("/");
        return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
      };

      const payload = {
        age: Number(this.idade),
        installment: Number(installment),
        entity_code: Number(this.entityCode),
        illiterate: this.analfabeto,
        negative: false,
        user_room: 1,
        initial_date: convertDateToISO(this.ddb),
      };

      try {
        const r = await api.post("/operations/card/", payload);

        if (r.data.status === "success") {
          this[target] = r.data.results || [];
        }
      } catch (e) {
        console.error("Erro ao buscar cartão:", e);
        this[target] = [];
      }
    },
    async autoSimulateAllLoans() {
      if (!this.data?.loans?.length) return;

      for (let i = 0; i < this.data.loans.length; i++) {
        const loan = this.data.loans[i];
        await this.simulateLoan(loan, i);
      }
    },
    validateDDB() {
      if (this.inv.includes(this.entityCode) || this.loas.includes(this.entityCode)) {
        this.showDDB = true;
      } else {
        this.showDDB = false;
        this.ddb = "";
      }
    },
    validateDDBDate() {
      if (!this.ddb || this.ddb.length !== 10) return;
      if (this.isFutureDate(this.ddb)) {
        showToast("A data do despacho não pode ser superior à data atual", "danger");
        this.ddb = "";
      }
    },
    isFutureDate(dateBR) {
      const [day, month, year] = dateBR.split("/");

      const selected = new Date(year, month - 1, day);
      const today = new Date();

      selected.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      return selected > today;
    },
    maskDate() {
      let value = this.ddb.replace(/\D/g, "");
      if (value.length > 8) value = value.slice(0, 8);
      if (value.length >= 5) {
        value = value.replace(/^(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3");
      } else if (value.length >= 3) {
        value = value.replace(/^(\d{2})(\d{0,2})/, "$1/$2");
      }
      this.ddb = value;
    },
    startEditMargin() {
      this.availableMarginInput = this.availableMargin.toFixed(2);
      this.editingMargin = true;
    },
    confirmEditMargin() {
      let value = this.availableMarginInput
        .replace(/\./g, "")
        .replace(",", ".");

      value = Number(value);

      if (isNaN(value) || value < 0) {
        showToast("Valor de margem inválido", "danger");
        return;
      }

      this.availableMargin = value;

      if (this.data?.available_margin) {
        this.data.available_margin.margem = value;
      }

      this.editingMargin = false;

      this.getMargins();
    },
    maskCurrency() {
      let v = this.availableMarginInput.replace(/\D/g, "");
      v = (Number(v) / 100).toFixed(2);
      v = v.replace(".", ",");
      this.availableMarginInput = v;
    },
  }
}
</script>

<style scoped>
.card {
  border-radius: 10px;
}

#bank-707 {
  background-color: rgb(0, 0, 88);
}

.img-bank {
  cursor: pointer;
  transition: .2s;
  border-radius: 3px;
  height: 2.5vh;
}

.bank-disabled {
  filter: brightness(0.3) blur(2px) grayscale(100%);
  cursor: not-allowed !important;
}


table td {
  white-space: nowrap;
}

@media (max-width: 576px) {

  /* melhora leitura no mobile */
  table td {
    font-size: 0.85rem;
  }

  table th {
    font-size: 0.8rem;
  }
}

.bank-disabled {
  filter: brightness(0.3) blur(2px) grayscale(100%);
  transition: 0.2s;
}

/* mobile */
@media (max-width: 576px) {

  .responsive-table thead {
    display: none;
  }

  .responsive-table,
  .responsive-table tbody,
  .responsive-table tr,
  .responsive-table td {
    display: block;
    width: 100%;
  }

  .responsive-table tr {
    margin-bottom: 0.75rem;
    border: 1px solid #e9ecef;
    border-radius: 10px;
    padding: 0.5rem;
    background: #fff;
  }

  .responsive-table td {
    text-align: right;
    padding: 0.4rem 0.75rem;
    position: relative;
  }

  .responsive-table td::before {
    content: attr(data-label);
    position: absolute;
    left: 0.75rem;
    font-weight: 600;
    text-align: left;
    color: #6c757d;
  }
}
</style>
