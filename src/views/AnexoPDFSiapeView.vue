<template>
  <div class="container py-3">
    <form class="row g-2 align-items-end mb-4" @submit.prevent="sendRequest">
      <div class="col-12 col-md-3">
        <label for="formFile" class="form-label fw-bold">Extrato de Consignação</label>
        <input class="form-control form-control-sm" required type="file" title="Extrato" id="formFile" ref="fileInput" @change="onChangeFile"
          accept="application/pdf" />
      </div>
      <div class="col-12 col-md-3">
        <label for="functionalSituationInput" class="form-label fw-bold">Situação Funcional</label>
        <select name="functionalSituationInput" required class="form-control form-control-sm" id="functionalSituationInput" v-model="functionalSituation">
            <option selected value="1">Ativo Permanente</option>
            <option value="1">Pensão Permanente</option>
            <option value="2">Inativos/Aposentados</option>
            <option value="3">Requisitado</option>
            <option value="4">Nomeado Cargo Comis</option>
            <option value="5">Sem Vínculo</option>
            <option value="6">Tabelista (Esp/Emerg.)</option>
            <option value="7">Natureza Especial</option>
            <option value="8">Cedido</option>
            <option value="10">Ativo Transitório</option>
            <option value="11">Excedente à Lotação</option>
            <option value="12">Contrato Temporário</option>
            <option value="13">Em Disponibilidade</option>
            <option value="14">Req. De outros órgãos</option>
            <option value="15">Instituidor Pensão</option>
            <option value="16">Reg. Militar</option>
            <option value="17">Aposentado TCU 733/94</option>
            <option value="18">Exerc Descent Carrei</option>
            <option value="19">Exercício Provisório</option>
            <option value="20">Celetista</option>
            <option value="21">Ativo Perm. L.8878/94</option>
            <option value="22">Anistiado ADCT CF</option>
            <option value="23">Celetistas/Empregado</option>
            <option value="24">Celetista/Empregado</option>
            <option value="25">CLT Ans Dec Judicial</option>
            <option value="26">CLT Ans Jud Cedido</option>
            <option value="27">CLT-APs Dec. Judicial</option>
            <option value="28">CLT-APs Cedido</option>
            <option value="29">CLT-APs Complemento</option>
            <option value="30">CLT-APs Dec. Judicial</option>
            <option value="31">Inst OS Dec Jud</option>
            <option value="32">Emprego Público</option>
            <option value="33">Ref Corpo de Bombeiro/Militar/Civil</option>
            <option value="34">Res Corpo de Bombeiro/Militar/Civil</option>
            <option value="35">Requisito Militar</option>
            <option value="36">Anist. Público L10559</option>
            <option value="37">Anist. Privado L10559</option>
            <option value="38">Ativo - Dec Judicial</option>
            <option value="39">Aposentado Dec Judic</option>
            <option value="40">Contrato Temporario</option>
            <option value="41">Colaborador PCCTAE</option>
            <option value="42">Colaborador ICT</option>
            <option value="43">CLT Ans-Dec 6657/08</option>
            <option value="44">Exerc.7 Artigo 93 8112</option>
            <option value="45">Cedido SUS/Lei 8270</option>
            <option value="46">Inst. Anist Privado</option>
            <option value="47">Decisão Judicial</option>
            <option value="51">Exc. Indisciplina</option>
            <option value="52">Cont. Prof. Substituto</option>
            <option value="66">Estagiário</option>
            <option value="84">Beneficiário Pensão e Pensionista</option>
            <option value="93">Beneficiário Pensão e Pensionista</option>
            <option value="96">QE/MRE - Cedido</option>
            <option value="97">Quadro Espec. QE/MeE</option>
            <option value="98">Excedente à Lot/MRE</option>
        </select>
      </div>
      <div class="col-6 col-md-2">
        <label class="form-label fw-bold">Nascimento</label>
        <input
          type="text"
          required
          class="form-control form-control-sm"
          v-model="birthDate"
          maxlength="10"
          placeholder="dd/mm/aaaa"
          @input="maskBirthDate"
          @blur="validateBirthDate"
        >
      </div>
      <div class="col-6 col-md-1">
        <input class="form-check-input  me-2" type="checkbox" id="analfabetoCheck" v-model="analfabeto">
        <small class="form-label fw-bold">Analfabeto</small>
      </div>
      <div class="col-6 col-md-2">
        <button type="submit" class="btn btn-sm btn-primary w-75" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Enviar
        </button>
      </div>
    </form>

    <div v-if="data && data.name" class="mt-4">
      <div class="text-center card p-3 shadow-sm h-100">

        
        <strong class="fw-heavyer strong h4">{{ data.name }}</strong>
        <small class="fw-bold text-muted">{{ entityCode }} - {{ data.entity_name }}</small>
        <small>Matrícula {{ data.nb_number }}</small>

        <div class="mt-3">
          <div
            v-if="data && data.bank"
            class="bg-secondary-subtle d-inline-flex gap-4 px-4 py-2 rounded mx-auto"
          >

            <div class="text-center">
              <div class="fw-semibold small">Banco</div>
              <div><small>{{ data.bank }}</small></div>
            </div>

            <div class="text-center">
              <div class="fw-semibold small">Agência</div>
              <div><small>{{ data.agency }}</small></div>
            </div>

            <div class="text-center">
              <div class="fw-semibold small">Conta</div>
              <div><small>{{ data.account }}</small></div>
            </div>

          </div>
        </div>

      </div>
    </div>


    <div v-if="data && data.loans && data.loans.length" class="mt-4">
      <div class="row g-3">

        <!-- Margem disponível -->
        <div v-if="data?.available_margin" class="mt-4">
          <div class="row g-3">

            <!-- MARGEM -->
            <div class="col-12 col-sm-6 col-md-4">
              <div class="card p-3 shadow-sm h-100 text-center">
                <small class="text-muted text-uppercase">Margem Livre</small>

                <div
                  class="fs-4 fw-semibold gap-2"
                  :class="availableMargin <= 0 ? 'text-danger' : 'text-success'"
                >
                  <div class="card-body g-2">

                  <template v-if="!editingMargin">
                    {{ formatCurrency(availableMargin) }}
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

                <div
                  class="fs-6 fw-semibold mt-1"
                  :class="data.available_margin?.rmc <= 0 ? 'text-danger' : 'text-primary'"
                >
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
                </div>
              </div>
            </div>

            <!-- RCC -->
            <div class="col-12 col-sm-6 col-md-4">
              <div class="card p-3 shadow-sm h-100 text-center">
                <small class="text-muted text-uppercase">RCC</small>

                <div
                  class="fs-6 fw-semibold mt-1"
                  :class="data.available_margin?.rcc <= 0 ? 'text-danger' : 'text-warning'"
                >
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
      birthDate: "",
      analfabeto: false,
      selectedBank: null,
      selectedLoan: null,
      selectedTable: null,
      selectedMarginBank: null,
      selectedMarginTable: null,
      entityCode: "",
      functionalSituationInput: "",
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
          "/extrato-siape/",
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

      if(loan.installment <= 19.99) return;

      const functionalSituationInput = document.getElementById("functionalSituationInput").value;

      const payload = {
        age: this.calculateAge(this.birthDate),
        original_bank: parseInt(loan.original_bank),
        rate: Number(loan.rate),
        original_terms: Number(loan.paids_terms + loan.remaining_terms),
        remaining_terms: Number(loan.remaining_terms),
        installment: Number(loan.installment),
        ballance: Number(loan.ballance),
        entity_code: Number(this.entityCode),
        function_code: Number(functionalSituationInput),
        illiterate: this.analfabeto,
        negative: false,
        user_room: 1,
        initial_date: convertDateToISO(this.ddb)
      };

      try {
        const r = await api.post("/operations/federal/", payload);
        this.loanResults[idx] = r.data.results;

      } catch (e) {
        console.error(e);
      } finally {
        this.loadingSim[idx] = false;
      }
    },
    async autoSimulateAllLoans() {
      if (!this.data?.loans?.length) return;

      for (let i = 0; i < this.data.loans.length; i++) {
        const loan = this.data.loans[i];
        await this.simulateLoan(loan, i);
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
    maskCurrency() {
      let v = this.availableMarginInput.replace(/\D/g, "");
      v = (Number(v) / 100).toFixed(2);
      v = v.replace(".", ",");
      this.availableMarginInput = v;
    },
    calculateAge(dateBR) {
      if (!dateBR || dateBR.length !== 10) return null;

      const [day, month, year] = dateBR.split("/");
      const birth = new Date(year, month - 1, day);
      const today = new Date();

      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    },
    maskBirthDate() {
      let value = this.birthDate.replace(/\D/g, "");
      if (value.length > 8) value = value.slice(0, 8);

      if (value.length >= 5) {
        value = value.replace(/^(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3");
      } else if (value.length >= 3) {
        value = value.replace(/^(\d{2})(\d{0,2})/, "$1/$2");
      }

      this.birthDate = value;
    },
    validateBirthDate() {
      if (!this.birthDate || this.birthDate.length !== 10) return;

      const [day, month, year] = this.birthDate.split("/");
      const birth = new Date(year, month - 1, day);
      const today = new Date();

      if (birth > today) {
        showToast("Data de nascimento inválida", "danger");
        this.birthDate = "";
        return;
      }

      const age = this.calculateAge(this.birthDate);

      if (age < 18) {
        showToast("Cliente deve ser maior de idade", "warning");
      }
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

#bank-756 {
  background-color: rgba(50, 50, 255, 1);
}

.img-bank {
  cursor: pointer;
  transition: .2s;
  border-radius: 3px;
  height: 4.5vh;
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
