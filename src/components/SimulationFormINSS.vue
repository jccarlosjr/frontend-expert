<template> 
  <teleport to="body">
    <div class="modal fade" id="bankModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">

          <div class="modal-header justify-content-center text-center">
            <h5 class="modal-title w-100 text-center">
              Tabelas de Refinanciamento {{ selectedBank?.bank_name }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">

            <!-- Tabela ÚNICA -->
            <table class="table text-center">
              <thead>
                <tr>
                  <th>Tabela</th>
                  <th>Prazo</th>
                  <th>Troco</th>
                </tr>
              </thead>

              <tbody>
                <!-- SOMENTE AS LINHAS -->
                <tr v-for="(table, idx) in selectedBank?.result || []" :key="idx">
                  <td>{{ table.name }}</td>
                  <td>{{ table.terms }}x</td>
                  <td>{{ table.exchange }}</td>
                </tr>
              </tbody>
            </table>

          </div>

        </div>
      </div>
    </div>
  </teleport>

  <div class="d-flex justify-content-center">
    <div class="container" style="max-width: 900px;">
      <div class="mb-3">
        <div class="row g-3 justify-content-center">
          <!-- COLUNA 1 -->
          <div class="col-12 col-md-6 col-lg-3">
            <div class="form-floating mb-3">
              <input type="text" class="form-control" id="idadeInput" placeholder="Idade" maxlength="2"
                @input="onlyNumbers">
              <label for="idadeInput">Idade</label>
            </div>
            <div class="form-floating mb-3">
              <input type="text" class="form-control" id="prazoOriginalInput" placeholder="Prazo Original" maxlength="3"
                @input="onlyNumbers">
              <label for="prazoOriginalInput">Prazo Original</label>
            </div>
            <div class="form-floating mb-3">
              <input type="text" class="form-control" id="prazoRestanteInput" placeholder="Prazo Restante" maxlength="3"
                @input="onlyNumbers">
              <label for="prazoRestanteInput">Prazo Restante</label>
            </div>
          </div>

          <!-- COLUNA 2 -->
          <div class="col-12 col-md-6 col-lg-3">
            <div class="form-floating mb-3">
              <input type="text" class="form-control" id="bancoOrigemInput" placeholder="Banco Origem" maxlength="3"
                @input="onlyNumbers">
              <label for="bancoOrigemInput">Banco Origem</label>
            </div>
            <div class="form-floating mb-3">
              <input type="text" class="form-control" id="parcelaInput" placeholder="Parcela" maxlength="7"
                @input="floatFormat">
              <label for="parcelaInput">Parcela</label>
            </div>
            <div class="form-floating mb-3">
              <input type="text" class="form-control" id="saldoInput" placeholder="Saldo Devedor" maxlength="9"
                @input="floatFormat">
              <label for="saldoInput">Saldo Devedor</label>
            </div>
          </div>
        </div>
        <div class="row g-3 justify-content-center">
          <div class="col-12 col-md-6 col-lg-6">
            <div class="mb-3">
              <select class="form-control" id="entityCodeInput"
                required 
                v-model="entityCode"
                @change="validateDDB"
                >
                <option selected disabled>Espécie</option>
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
                <option value="27">27 - Por morte do de servidor público federal com dupla aposentadoria</option>
                <option value="28">28 - Por morte, do Regime Geral (Decreto 20465/31)</option>
                <option value="29">29 - Por morte de ex-combatente marítimo (Lei 1756/52)</option>
                <option value="30">30 - Renda mensal vitalícia por incapacidade</option>
                <option value="32">32 - Por invalidez previdenciária (LOPS)</option>
                <option value="33">33 - Por invalidez de aeronauta</option>
                <option value="34">34 - Por invalidez de ex-combatente marítimo (Lei 1.756/52)</option>
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
                <option value="56">56 - Pensão mensal vitalícia por síndrome de talidomida (Lei 7070/82)</option>
                <option value="57">57 - Por tempo de contribuição de professores (EC/CF 18/81)</option>
                <option value="58">58 - Aposentadoria excepcional do anistiado (Lei 6683/79) (EPU)</option>
                <option value="59">59 - Por morte excepcional do anistiado (Lei 6683/79) (EPU)</option>
                <option value="60">60 - Pensão especial mensal vitalícia (Lei 10.923/04)</option>
                <option value="72">72 - Por tempo de contribuição de ex-combatente marítimo (Lei 1756/52)</option>
                <option value="78">78 - Por idade de ex-combatente marítimo (Lei 1.756/52)</option>
                <option value="81">81 - Por idade compulsória (Ex-SASSE)</option>
                <option value="82">82 - Por tempo de contribuição (Ex-SASSE)</option>
                <option value="83">83 - Aposentadoria por invalidez (Ex-SASSE)</option>
                <option value="84">84 - Por morte (Ex-SASSE)</option>
                <option value="87">87 - Amparo assistencial ao portador de deficiência (LOAS)</option>
                <option value="88">88 - Amparo assistencial ao idoso (LOAS)</option>
                <option value="89">89 - Pensão especial aos dependentes de vítimas fatais por contaminação na
                  hemodiálise (EPU)</option>
                <option value="92">92 - Aposentadoria por invalidez por acidente do trabalho</option>
                <option value="93">93 - Pensão por morte por acidente do trabalho</option>
                <option value="94">94 - Auxílio-acidente por acidente do trabalho</option>
                <option value="96">96 - Pensão especial para pessoas atingidas por Hanseníase</option>
              </select>
            </div>
          </div>
        </div>
        <div v-if="showDDB" class="row g-3 justify-content-center text-center">
          <div class="form-floating mb-3 col-12 col-md-6 col-lg-6">
            <input
              id="ddbInput"
              type="text"
              class="form-control text-center"
              placeholder="dd/mm/aaaa"
              v-model="ddb"
              @input="maskDate"
              @blur="validateDDBDate"
              maxlength="10"
            />
            <label for="ddbInput">Data Despacho (DDB)</label>
          </div>
        </div>

        <div class="row g-3 justify-content-center">
          <div class="col-6 col-md-2">
            <div class="form-check mt-2">
              <input class="form-check-input" type="checkbox" id="analfabetoCheck">
              <label class="form-check-label" for="analfabetoCheck">
                Analfabeto
              </label>
            </div>
          </div>

          <div class="col-6 col-md-2">
            <div class="form-check mt-2">
              <input class="form-check-input" type="checkbox" id="negativoCheck">
              <label class="form-check-label" for="negativoCheck">
                Negativo
              </label>
            </div>
          </div>
        </div>
        <div class="text-center">
          <button class="btn btn-success btn-sm mt-3 mb-5" @click="loadData">
            Consultar Roteiro Operacional
          </button>
        </div>
      </div>

      <!-- LOADING ICON -->
      <div v-if="loading" class="text-center my-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
      </div>
      <!-- LISTA DE BANCOS -->
      <div v-if="!loading && data && data.results" class="mt-5">
        <div class="row g-4 justify-content-center">

          <div v-for="(item, index) in data.results" :key="index" class="col-6 col-md-4 col-lg-2 text-center">

            <!-- Banco APROVADO (result é array e tem itens) -->
            <div v-if="Array.isArray(item.result) && item.result.length > 0" class="bank-card approved"
              @click="openBankModal(item)" :id="`bank-${item.bank}`">
              <img :src="item.icon" class="img-fluid bank-icon" />
            </div>

            <!-- Banco REPROVADO (não é array OU está vazio) -->
            <div v-else class="bank-card rejected" data-bs-toggle="tooltip"
              :data-bs-title="item.result || 'Operação não permitida para este banco.'"
              :id="`bank-${item.bank}-rejected`">
              <img :src="item.icon" :title="item.result" class="img-fluid bank-icon bank-disabled" />
            </div>

          </div>

        </div>
      </div>


    </div>
  </div>

  <!-- Toast container -->
  <div aria-live="polite" aria-atomic="true" class="position-fixed top-0 end-0 p-3" style="z-index: 1080;">
    <div id="toastContainer"></div>
  </div>
</template>


<style scoped>
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.input-error {
  border: 2px solid #dc3545 !important;
}

.bank-card {
  cursor: pointer;
  transition: 0.2s;
}

.bank-icon {
  max-height: 70px;
  object-fit: contain;
}

.approved:hover {
  transform: scale(1.05);
}

.rejected {
  cursor: not-allowed;
}

.bank-disabled {
  filter: brightness(0.3) blur(2px) grayscale(100%);
  transition: 0.2s;
}

.rejected:hover .bank-disabled {
  filter: brightness(0.3) blur(2px) grayscale(100%);
}

.bank-icon {
  border-radius: 5px;
  height: 50px;
}

#bank-707 {
  background-color: rgb(0, 0, 66);
  border-radius: 5px;
}
</style>

<script>
import api from '../api/api.js'
import { useToast } from "@/composables/useToast";
const { showToast } = useToast();

export default {
  name: 'SimulationsView',
  data() {
    return {
      data: null,
      selectedBank: null,
      tooltips: [],
      loading: false,
      entityCode: "",
      ddb: "",
      showDDB: false,
      inv: ["32", "92", "04", "06", "33", "34", "37", "38", "51", "83", "96"],
      loas: ["88", "87"]
    }
  },
  methods: {
    onlyNumbers(event) {
      const input = event.target;
      input.value = input.value.replace(/\D/g, "");
    },
    openBankModal(bank) {
      this.selectedBank = bank;
      const modal = new bootstrap.Modal(document.getElementById("bankModal"));
      modal.show();
    },
    initTooltips() {
      this.tooltips.forEach(t => t.dispose());
      this.tooltips = [];
      const els = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      els.forEach(el => {
        this.tooltips.push(new bootstrap.Tooltip(el));
      });
    },
    updated() {
      this.initTooltips();
    },
    setFieldError(id, hasError) {
      const el = document.getElementById(id);

      if (!el) return;

      if (hasError) {
        el.classList.add("input-error");
        el.focus();
      } else {
        el.classList.remove("input-error");
      }
    },
    floatFormat(event) {
      let input = event.target;
      let value = input.value.replace(/\D/g, '');

      if (value.length >= 2) {
        const decimalPart = value.slice(-2);
        const integerPart = value.slice(0, -2);
        input.value = `${integerPart}.${decimalPart}`;
      } else {
        input.value = value;
      }
    },
    async loadData() {
      const idade = document.getElementById("idadeInput").value.trim();
      const bancoOrigem = document.getElementById("bancoOrigemInput").value.trim();
      const prazoOriginal = document.getElementById("prazoOriginalInput").value.trim();
      const saldo = document.getElementById("saldoInput").value.trim();
      const parcela = document.getElementById("parcelaInput").value.trim();
      const prazoRestante = document.getElementById("prazoRestanteInput").value.trim();
      const entityCode = document.getElementById("entityCodeInput").value;
      const analfabeto = document.getElementById("analfabetoCheck").checked;
      const negativo = document.getElementById("negativoCheck").checked;
      const ddb = document.getElementById("ddbInput")?.value?.trim() || 0;
      function isNumber(value) {
        return /^\d+$/.test(value);
      }

      function getRate(amountFinanced, installment, terms) {
        const precision = 0.00001;
        let minRate = 0.01;
        let maxRate = 0.04;
        const maxIterations = 1000;
        const defaultValue = 0.01;

        for (let iter = 0; iter < maxIterations; iter++) {
          const rate = (minRate + maxRate) / 2;
          let futureAmount = amountFinanced;
          for (let t = 0; t < terms; t++) {
            futureAmount = futureAmount * (1 + rate) - installment;
          }
          if (Math.abs(futureAmount) < precision) {
            return rate;
          }
          if (futureAmount > 0) {
            maxRate = rate;
          } else {
            minRate = rate;
          }
        }
        return defaultValue;
      }

      function convertDateToISO(dateBR) {
        if (!dateBR || dateBR.length !== 10) return null;
        const [day, month, year] = dateBR.split("/");
        if (!day || !month || !year) return null;
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }


      function isFloat(value) {
        return /^(\d+|\d+\.\d{1,2})$/.test(value);
      }

      function isLesserThan() {
        return prazoRestante <= prazoOriginal;
      }

      const validations = [
        { value: idade, name: "Idade", rule: isNumber },
        { value: bancoOrigem, name: "Banco Origem", rule: isNumber },
        { value: prazoOriginal, name: "Prazo Original", rule: isNumber },
        { value: prazoRestante, name: "Prazo Restante", rule: isNumber },
        { value: prazoRestante, name: "Prazo Restante", rule: isLesserThan },
        { value: parcela, name: "Parcela", rule: isFloat },
        { value: saldo, name: "Saldo Devedor", rule: isFloat },
      ];

      if (prazoRestante > prazoOriginal) {
        showToast("O prazo restante deve ser menor que o prazo original.", 'danger');
        return;
      }

      for (let v of validations) {
        if (!v.value || !v.rule(v.value)) {
          showToast(`Campo inválido: ${v.name}`, 'danger');
          setFieldError(v.name.replace(/\s/g, '') + 'Input', true);
          return;
        }
      }

      if (!entityCode || entityCode === "Espécie") {
        showToast("Selecione uma espécie válida.", 'danger');
        return;
      }
      let rate = getRate(parseFloat(saldo.replace(",", ".")), parseFloat(parcela.replace(",", ".")), parseInt(prazoRestante))
      if (rate === 0.01){
        showToast("Não foi possível calcular uma taxa válida.\nVerifique prazo restante, saldo devedor e parcela.", 'danger');
        return;
      }
      rate = rate * 100

      const payload = {
        age: Number(idade),
        original_bank: Number(bancoOrigem),
        rate: rate,
        original_terms: Number(prazoOriginal),
        remaining_terms: Number(prazoRestante),
        installment: Number(parcela.replace(",", ".")),
        ballance: Number(saldo.replace(",", ".")),
        entity_code: Number(entityCode),
        illiterate: analfabeto,
        negative: negativo,
        user_room: 1,
        initial_date: convertDateToISO(ddb)
      };
      this.loading = true;
      this.data = null;
      try {
        const r = await api.post("http://127.0.0.1:8000/api/v1/operations/", payload);
        this.data = r.data;
      } catch (e) {
        console.error(e);
        if(e.message === "Network Error") {
          showToast("Erro ao conectar ao servidor.", 'danger');
        } else {
          showToast(`Erro ao carregar dados.`, 'danger');
        }
      } finally {
        this.loading = false;
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
    logout() {
      localStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>
