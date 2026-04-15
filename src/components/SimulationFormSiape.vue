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
            <table class="table text-center align-middle">
              <thead>
                <tr>
                  <th>Tabela</th>
                  <th>Prazo</th>
                  <th>Troco</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(table, idx) in selectedBank?.result || []" :key="idx">
                  <td>{{ table.name }}</td>
                  <td>{{ table.terms }}x</td>
                  <td>{{ table.exchange }}</td>
                  <td>
                    <button class="btn btn-outline-primary btn-sm" @click="addToWallet(table)">
                      <i class="bi bi-plus-circle me-1"></i>
                      Carteira
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>


          </div>

        </div>
      </div>
    </div>

    <div class="modal fade" id="entityModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">

          <div class="modal-header justify-content-center text-center">
            <h5 class="modal-title w-100 text-center">
              Buscar Orgão
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <div class="d-flex mb-2">
              <input 
                type="text" 
                class="form-control form-control-sm" 
                placeholder="Nome da Entidade..." 
                v-model="entityName"
              >
            </div>

            <ul class="list-group">
              <li 
                v-for="(o, index) in filteredOrgaos" 
                :key="o.codigo + '-' + index"
                class="list-group-item list-group-item-action"
                @click="selectOrgao(o)"
                style="cursor: pointer;"
              >
                <strong>{{ o.codigo }}</strong> - {{ o.orgao }}
                <span v-if="o.sigla">({{ o.sigla }})</span>
              </li>
            </ul>

            <div v-if="filteredOrgaos.length === 0 && entityName">
              <small>Nenhum resultado encontrado.</small>
            </div>
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
            <div class="mb-3 text-center">
              <label for="functionSituations">Situação Funcional</label>
              <select class="form-select form-select-sm text-center" id="functionSituations" required>
                    <option selected value="1">Ativo Permanente</option>
                    <option selected value="1">Pensão Permanente</option>
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
          </div>
        </div>
        <div class="row g-3 justify-content-center">
          <div class="col-12 col-md-6 col-lg-6">
            <div class="mb-3 text-center">
              <div class="d-flex">
                <input type="text" 
                  class="form-control form-control-sm text-center" 
                  placeholder="Buscar Orgão..." 
                  id="entityCodeInput" 
                  v-model="entityCode"
                  readonly>
                <button class="btn btn-sm btn-outline-primary" id="entityCodeSearch"
                @click="openEntitySearchModal">
                  <i class="bi bi-search"></i>
                </button>
              </div>

            </div>
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
            <div v-if="Array.isArray(item.result) && item.result.length > 0" class="bank-card approved"
              @click="openBankModal(item)" :id="`bank-${item.bank}`">
              <img :src="item.icon" class="img-fluid bank-icon" />
            </div>
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
import { useWalletStore } from "@/stores/walletStore";


export default {
  name: 'SimulationsView',
  data() {
    return {
      data: null,
      selectedBank: null,
      tooltips: [],
      loading: false,
      entityName: "",
      entityCode: "",
      ddb: "",
      showDDB: false,
      inv: ["32", "92", "04", "06", "33", "34", "37", "38", "51", "83", "96"],
      loas: ["88", "87"],
      walletStore: null,
      orgaoOriginal: [],
      orgao: [
          {"codigo": 13000, "orgao": "MINIST. DA AGRICULTURA, PECUARIA E ABAST.", "sigla": "MAPA"},
          {"codigo": 13100, "orgao": "MIN DO DESENV AGR E AGRIC FAMILIAR", "sigla": ""},
          {"codigo": 13200, "orgao": "MINISTERIO DA PESCA E AQUICULTURA", "sigla": ""},
          {"codigo": 14000, "orgao": "MINISTERIO DA INFRA-ESTRUTURA", "sigla": ""},
          {"codigo": 15000, "orgao": "MINISTERIO DA EDUCACAO", "sigla": "MEC"},
          {"codigo": 16000, "orgao": "COMANDO DO EXERCITO", "sigla": "C EX"},
          {"codigo": 16100, "orgao": "FUNDACAO OSORIO", "sigla": "F OSORIO"},
          {"codigo": 17000, "orgao": "MINISTERIO DA ECONOMIA", "sigla": "MF"},
          {"codigo": 17200, "orgao": "MINISTERIO DOS POVOS INDIGENAS", "sigla": ""},
          {"codigo": 17201, "orgao": "SUPERINTENDENCIA NAC. DE ABASTECIMENTO", "sigla": ""},
          {"codigo": 17300, "orgao": "MINISTERIO DO PLANEJAMENTO E ORCAMENTO", "sigla": ""},
          {"codigo": 17400, "orgao": "MIN DESENVOLV IND COMERCIO E SERVICOS", "sigla": ""},
          {"codigo": 17500, "orgao": "MIN GESTAO E INOV EM SERV PUBLICOS", "sigla": ""},
          {"codigo": 17600, "orgao": "MINISTERIO DA FAZENDA", "sigla": ""},
          {"codigo": 20000, "orgao": "MINIST. DA JUSTICA E SEGURANCA PUBLICA", "sigla": "MJ"},
          {"codigo": 20101, "orgao": "PRESIDENCIA DA REPUBLICA", "sigla": "PR"},
          {"codigo": 20102, "orgao": "VICE-PRESIDENCIA DA REPUBLICA", "sigla": "VPR"},
          {"codigo": 20104, "orgao": "SECRETARIA DE ASSUNTOS ESTRATEGICOS / P", "sigla": ""},
          {"codigo": 20112, "orgao": "SECRETARIA DE PROJETOS ESPECIAIS - PR", "sigla": ""},
          {"codigo": 20113, "orgao": "MINISTERIO DO PLANEJ. DESENV. E GESTAO", "sigla": "MP"},
          {"codigo": 20114, "orgao": "AGENCIA BRASILEIRA DE INTELIGENCIA", "sigla": "ABIN"},
          {"codigo": 20115, "orgao": "DEPARTAMENTO DE POLICIA FEDERAL", "sigla": "DPF"},
          {"codigo": 20125, "orgao": "CONTROLADORIA-GERAL DA UNIAO", "sigla": "CGU/PR"},
          {"codigo": 20224, "orgao": "AGENCIA NACIONAL DO CINEMA", "sigla": "ANCINE"},
          {"codigo": 20302, "orgao": "NUCLEBRAS EQUIPAMENTOS PESADOS", "sigla": "NUCLEP"},
          {"codigo": 20415, "orgao": "EMPRESA BRASIL DE COMUNICACAO", "sigla": "EBC"},
          {"codigo": 20605, "orgao": "COMPANHIA DE DESENVOLV. DE BARCAREMA", "sigla": "CODEBAR"},
          {"codigo": 21000, "orgao": "COMANDO DA AERONAUTICA", "sigla": "C.AER"},
          {"codigo": 21201, "orgao": "CAIXA DE FINANCIAMENTO IMOB. AERONAUTICA", "sigla": "CFIA"},
          {"codigo": 21300, "orgao": "AGENCIA ESPACIAL BRASILEIRA", "sigla": "AEB"},
          {"codigo": 22109, "orgao": "MINISTERIO DA INFRA-ESTRUTURA", "sigla": ""},
          {"codigo": 22000, "orgao": "MINISTERIO DA INFRA-ESTRUTURA", "sigla": ""},
          {"codigo": 22200, "orgao": "COMPANHIA NACIONAL DE ABASTECIMENTO", "sigla": "CONAB"},
          {"codigo": 22202, "orgao": "EMPRESA BRASILEIRA DE PESQ. AGROPECUARIA", "sigla": ""},
          {"codigo": 22203, "orgao": "COMPANHIA DESENV. DO VALE SAO FRANCISCO", "sigla": "CODEVASF"},
          {"codigo": 22207, "orgao": "COMPANHIA DE COLONIZACAO DO NORDESTE", "sigla": ""},
          {"codigo": 23000, "orgao": "MINISTERIO DA PREVIDENCIA SOCIAL", "sigla": "MPS"},
          {"codigo": 24100, "orgao": "TELEBRAS - TELECOM. BRASILEIRAS S.A", "sigla": ""},
          {"codigo": 24203, "orgao": "FUNDACAO NACIONAL DE ARTES", "sigla": "FUNARTE"},
          {"codigo": 24204, "orgao": "INSTITUTO DO PATRIM. HIST. E ART. NACIONAL", "sigla": "IPHAN"},
          {"codigo": 24205, "orgao": "FUNDACAO BIBLIOTECA NACIONAL", "sigla": "FBN"},
          {"codigo": 24206, "orgao": "FUNDACAO NACIONAL DE ARTES CENICAS", "sigla": ""},
          {"codigo": 24207, "orgao": "FUNDACAO DO CINEMA BRASILEIRO", "sigla": ""},
          {"codigo": 24209, "orgao": "CENTRO NAC.TECNO.ELETRONICA AVANCADA S.", "sigla": "CEITEC"},
          {"codigo": 25000, "orgao": "MINISTERIO DA SAUDE", "sigla": "MS"},
          {"codigo": 25201, "orgao": "BANCO CENTRAL DO BRASIL", "sigla": "BACEN"},
          {"codigo": 25202, "orgao": "CONS. DE CONTROLE DE ATIV. FINANCEIRAS", "sigla": ""},
          {"codigo": 25207, "orgao": "SERVICO FED. DE PROCESSAMENTO DE DADOS", "sigla": "SERPRO"},
          {"codigo": 25801, "orgao": "RECEITA FEDERAL DO BRASIL", "sigla": ""},
          {"codigo": 26000, "orgao": "MINISTERIO DO TRABALHO E EMPREGO", "sigla": "MTB"},
          {"codigo": 26104, "orgao": "INSTITUTO NACIONAL DE EDUCACAO DE SURDO", "sigla": "INES"},
          {"codigo": 26105, "orgao": "INSTITUTO BENJAMIN CONSTANT", "sigla": "I.B.CONST"},
          {"codigo": 26106, "orgao": "FUNDO NACIONAL DE DESENVOLV. DA EDUCACAO", "sigla": "FNDE"},
          {"codigo": 26107, "orgao": "INST. NACIONAL DE EST. E PESQ. EDUCACIONAI", "sigla": "INEP"},
          {"codigo": 26201, "orgao": "COLEGIO PEDRO II", "sigla": "C.PEDROII"},
          {"codigo": 26202, "orgao": "CENTRO FED DE EDUC TECNOL DE ALAGOAS", "sigla": ""},
          {"codigo": 26203, "orgao": "CENTRO FED. EDUC. TECNOLOGICA DO AMAZONAS", "sigla": ""},
          {"codigo": 26204, "orgao": "CENTRO FED. DE EDUC. TECNOL. DA BAHIA", "sigla": ""},
          {"codigo": 26205, "orgao": "CENTRO FED.DE EDUC.TECNOL. DE CAMPOS", "sigla": ""},
          {"codigo": 26206, "orgao": "CENTRO FED.DE EDUC.TECNOL.DO CEARA", "sigla": ""},
          {"codigo": 26207, "orgao": "CENTRO FED.DE EDUC.TECNOL.ESPIRITO SANT", "sigla": ""},
          {"codigo": 26208, "orgao": "CENTRO FED.DE EDUC.TECNOL. DE GOIAS", "sigla": ""},
          {"codigo": 26209, "orgao": "CENTRO FED. DE EDUC. TECNOL. DO MARANHAO", "sigla": ""},
          {"codigo": 26210, "orgao": "CENTRO FED DE EDUC TEC DE MATO GROSSO", "sigla": ""},
          {"codigo": 26211, "orgao": "CENTRO FED.DE EDUC.TECNOL. DE OURO PRET", "sigla": ""},
          {"codigo": 26212, "orgao": "CENTRO FED.DE EDUC.TECNOL.DO PARA", "sigla": ""},
          {"codigo": 26213, "orgao": "CENTRO FED.DE EDUC.TECNOL.DA PARAIBA", "sigla": ""},
          {"codigo": 26214, "orgao": "CENTRO FED.DE EDUC.TECNOL.DE PELOTAS", "sigla": ""},
          {"codigo": 26215, "orgao": "CENTRO FED. DE EDUC. TECNOL. DE PERNAMBUC", "sigla": ""},
          {"codigo": 26216, "orgao": "CENTRO FED.DE EDUC.TECNOL.DO PIAUI", "sigla": ""},
          {"codigo": 26217, "orgao": "CEFET DE QUIMICA DE NILOPOLIS-RJ", "sigla": ""},
          {"codigo": 26218, "orgao": "CENTRO FED. EDUC.TECNOL.DO R. G. DO NORTE", "sigla": ""},
          {"codigo": 26219, "orgao": "CENTRO FED EDUC TEC DE SANTA CATARINA", "sigla": ""},
          {"codigo": 26220, "orgao": "CENTRO FED.DE EDUC.TECNOL.DE SAO PAULO", "sigla": ""},
          {"codigo": 26221, "orgao": "CENTRO FEDERAL DE EDUC TEC DE SERGIPE", "sigla": ""},
          {"codigo": 26222, "orgao": "CENTRO FED.DE EDUC.TECNOL. DE RORAIMA", "sigla": ""},
          {"codigo": 26223, "orgao": "ESCOLA TECNICA FEDERAL DE PALMAS", "sigla": ""},
          {"codigo": 26227, "orgao": "ESCOLA TECNICA FEDERAL DE RONDONIA", "sigla": ""},
          {"codigo": 26230, "orgao": "FUND.UNIV.FED.DO VALE DO SAO FRANCISCO", "sigla": "UNIVASF"},
          {"codigo": 26231, "orgao": "UNIVERSIDADE FEDERAL DE ALAGOAS", "sigla": "UFAL"},
          {"codigo": 26232, "orgao": "UNIVERSIDADE FEDERAL DA BAHIA", "sigla": "UFBA"},
          {"codigo": 26233, "orgao": "UNIVERSIDADE FEDERAL DO CEARA", "sigla": "UFCE"},
          {"codigo": 26234, "orgao": "UNIVERSIDADE FEDERAL DO ESPIRITO SANTO", "sigla": "UFES"},
          {"codigo": 26235, "orgao": "UNIVERSIDADE FEDERAL DE GOIAS", "sigla": "UFGO"},
          {"codigo": 26236, "orgao": "UNIVERSIDADE FEDERAL FLUMINENSE", "sigla": "UFF"},
          {"codigo": 26237, "orgao": "UNIVERSIDADE FEDERAL DE JUIZ DE FORA", "sigla": "UFJF"},
          {"codigo": 26238, "orgao": "UNIVERSIDADE FEDERAL DE MINAS GERAIS", "sigla": "UFMG"},
          {"codigo": 26239, "orgao": "UNIVERSIDADE FEDERAL DO PARA", "sigla": "UFPA"},
          {"codigo": 26240, "orgao": "UNIVERSIDADE FEDERAL DA PARAIBA", "sigla": "UFPB"},
          {"codigo": 26241, "orgao": "UNIVERSIDADE FEDERAL DO PARANA", "sigla": "UFPR"},
          {"codigo": 26242, "orgao": "UNIVERSIDADE FEDERAL DE PERNAMBUCO", "sigla": "UFPE"},
          {"codigo": 26243, "orgao": "UNIVERSIDADE FED. DO RIO GRANDE DO NORTE", "sigla": "UFRN"},
          {"codigo": 26244, "orgao": "UNIVERSIDADE FED. DO RIO GRANDE DO SUL", "sigla": "UFRGS/RS"},
          {"codigo": 26245, "orgao": "UNIVERSIDADE FEDERAL DO RIO DE JANEIRO", "sigla": "UFRJ"},
          {"codigo": 26246, "orgao": "UNIVERSIDADE FEDERAL DE SANTA CATARINA", "sigla": "UFSC"},
          {"codigo": 26247, "orgao": "UNIVERSIDADE FEDERAL DE SANTA MARIA", "sigla": "UFSM/RS"},
          {"codigo": 26248, "orgao": "UNIVERSIDADE RURAL DE PERNAMBUC", "sigla": "UFRPE"},
          {"codigo": 26249, "orgao": "UNIV. FEDERAL RURAL DO RIO DE JANEIRO", "sigla": "UFRRJ"},
          {"codigo": 26250, "orgao": "UNIVERSIDADE FEDERAL DE RORAIMA", "sigla": "UFRR"},
          {"codigo": 26251, "orgao": "FUNDAÇAO UNIVERSIDADE FED. DO TOCANTINS", "sigla": "FUTF"},
          {"codigo": 26252, "orgao": "UNIVERSIDADE FEDERAL DE CAMPINA GRANDE", "sigla": "UFCG"},
          {"codigo": 26253, "orgao": "UNIVERSIDADE FEDERAL RURAL DA AMAZONIA", "sigla": "UFRA"},
          {"codigo": 26254, "orgao": "UNIVERSIDADE FED.DO TRIANGULO MINEIRO", "sigla": "UFTM"},
          {"codigo": 26255, "orgao": "UNI.FED.VALES DO JEQUITINHONHA E MUCURI", "sigla": "UFVJM"},
          {"codigo": 26256, "orgao": "CENTRO FED.EDUC.TECNOL.CELSO S. FONSECA", "sigla": "CEFET/RJ"},
          {"codigo": 26257, "orgao": "CENTRO FED.DE EDUC.TECNOL.MINAS GERAIS", "sigla": "CEFET/MG"},
          {"codigo": 26258, "orgao": "UNIVERS. TECNOLOGICA FEDERAL DO PARANA", "sigla": "UTFPR"},
          {"codigo": 26259, "orgao": "CENTRO DE EDUC. TECNOLOGICA DA BAHIA", "sigla": "CEFET/BA"},
          {"codigo": 26260, "orgao": "UNIVERSIDADE FEDERAL DE ALFENAS", "sigla": "UNIFAL-MG"},
          {"codigo": 26261, "orgao": "UNIVERSIDADE FEDERAL DE ITAJUBA", "sigla": "UNIFEI"},
          {"codigo": 26262, "orgao": "UNIVERSIDADE FEDERAL DE SAO PAULO", "sigla": "UNIFESP"},
          {"codigo": 26263, "orgao": "UNIVERSIDADE FEDERAL DE LAVRAS", "sigla": "UFLA"},
          {"codigo": 26264, "orgao": "UNIVERSIDADE FED. RURAL DO SEMI-ARIDO", "sigla": "UFERSA-RN"},
          {"codigo": 26266, "orgao": "FUNDAÇAO UNIVERSIDADE FEDERAL DO PAMPA", "sigla": "UNIPAMPA"},
          {"codigo": 26267, "orgao": "UNIV.FED. DA INTEGRACAO LATINO-AMERICAN", "sigla": "UNILA"},
          {"codigo": 26268, "orgao": "FUND. UNIVERSIDADE FEDERAL DE RONDONIA", "sigla": "UNIR"},
          {"codigo": 26269, "orgao": "UNIVERSIDADE DO RIO DE JANEIRO", "sigla": "UNIRIO"},
          {"codigo": 26270, "orgao": "FUNDAÇAO UNIVERSIDADE DO AMAZONAS", "sigla": "FUAM"},
          {"codigo": 26271, "orgao": "FUNDAÇÃO UNIVERSIDADE DE BRASÍLIA", "sigla": "UNB"},
          {"codigo": 26272, "orgao": "FUNDAÇÃO UNIVERSIDADE DO MARANHÃO", "sigla": "FUMA"},
          {"codigo": 26273, "orgao": "UNIVERSIDADE FEDERAL DO RIO GRANDE", "sigla": "FURG"},
          {"codigo": 26274, "orgao": "FUNDAÇÃO UNIVERSIDADE FEDERAL DE UBERLÂNDIA", "sigla": "UFU"},
          {"codigo": 26275, "orgao": "UNIVERSIDADE FEDERAL DO ACRE", "sigla": "UFAC"},
          {"codigo": 26276, "orgao": "UNIVERSIDADE FEDERAL DE MATO GROSSO", "sigla": "UFMT"},
          {"codigo": 26277, "orgao": "FUNDAÇÃO UNIVERSIDADE FEDERAL DE OURO PRETO", "sigla": "UFOP"},
          {"codigo": 26278, "orgao": "FUNDAÇÃO UNIVERSIDADE FEDERAL DE PELOTAS", "sigla": "UFPEL"},
          {"codigo": 26279, "orgao": "UNIVERSIDADE FEDERAL DO PIAUÍ", "sigla": "UFPI"},
          {"codigo": 26280, "orgao": "UNIVERSIDADE FEDERAL DE SÃO CARLOS", "sigla": "UFSCAR"},
          {"codigo": 26281, "orgao": "FUNDAÇÃO UNIVERSIDADE FEDERAL DE SERGIPE", "sigla": "FUFS"},
          {"codigo": 26282, "orgao": "UNIVERSIDADE FEDERAL DE VIÇOSA", "sigla": "UFV"},
          {"codigo": 26283, "orgao": "UNIVERSIDADE FEDERAL DE MATO GROSSO DO SUL", "sigla": "UFMS"},
          {"codigo": 26284, "orgao": "FUNDAÇÃO UNIVERSIDADE FEDERAL DE CIÊNCIAS DA SAÚDE DE PORTO ALEGRE", "sigla": "UFCSPA"},
          {"codigo": 26285, "orgao": "FUNDAÇÃO UNIVERSIDADE DE SÃO JOÃO DEL REI", "sigla": "FUNREI"},
          {"codigo": 26286, "orgao": "FUNDAÇÃO UNIVERSIDADE FEDERAL DO AMAPÁ", "sigla": "UNIFAP"},
          {"codigo": 26287, "orgao": "ESCOLA AGROTÉCNICA FEDERAL DE MARABÁ", "sigla": ""},
          {"codigo": 26292, "orgao": "FUNDAÇÃO JOAQUIM NABUCO", "sigla": "FJN"},
          {"codigo": 26293, "orgao": "FUNDAÇÃO ROQUETE PINTO", "sigla": ""},
          {"codigo": 26295, "orgao": "INSTITUTO NACIONAL DE DESENVOLVIMENTO DO DESPORTO", "sigla": ""},
          {"codigo": 26296, "orgao": "FUNDACAO EDUCAR", "sigla": ""},
          {"codigo": 26297, "orgao": "FUNDACAO DE ASSISTENCIA AO ESTUDANTE", "sigla": ""},
          {"codigo": 26298, "orgao": "FUND COORD APERF PESSOAL NIVEL SUPERIOR", "sigla": "CAPES"},
          {"codigo": 26300, "orgao": "ESCOLA AGROTECNICA FEDERAL DE SATUBA", "sigla": ""},
          {"codigo": 26301, "orgao": "ESCOLA AGROTECNICA FEDERAL DE MANAUS", "sigla": ""},
          {"codigo": 26302, "orgao": "ESCOLA AGROTECNICA FEDERAL DE CATU", "sigla": ""},
          {"codigo": 26303, "orgao": "ESCOLA AGROTECNICA FEDERAL DE CRATO", "sigla": ""},
          {"codigo": 26304, "orgao": "ESCOLA AGROTECNICA FEDERAL DE IGUATU", "sigla": ""},
          {"codigo": 26305, "orgao": "ESCOLA AGROTECNICA FEDERAL DE ALEGRE", "sigla": ""},
          {"codigo": 26306, "orgao": "CENTRO FEDERAL DE EDUC TECNOL RIO VERDE", "sigla": ""},
          {"codigo": 26307, "orgao": "ESCOLA AGROTECNICA FEDERAL DE SAO LUIS", "sigla": ""},
          {"codigo": 26308, "orgao": "CENTRO FED. DE EDUC. TECNOL. DE BAMBUÍ", "sigla": ""},
          {"codigo": 26309, "orgao": "ESCOLA AGROTECNICA FEDERAL DE BARBACENA", "sigla": ""},
          {"codigo": 26310, "orgao": "CENTRO FED. DE EDUC. TECNOL. DE JANUÁRIA", "sigla": ""},
          {"codigo": 26311, "orgao": "ESCOLA AGROTECNICA FEDERAL DE MUZAMBINH", "sigla": ""},
          {"codigo": 26312, "orgao": "CENTRO FED. DE EDUC. TECNOL. DE RIO POMB", "sigla": ""},
          {"codigo": 26313, "orgao": "CENTRO FEDERAL EDUC. TECNOL. DE UBERABA", "sigla": ""},
          {"codigo": 26314, "orgao": "ESCOLA AGROTECNICA FEDERAL DE UBERLANDI", "sigla": ""},
          {"codigo": 26315, "orgao": "ESCOLA AGROTECNICA FEDERAL DE CASTANHAL", "sigla": ""},
          {"codigo": 26316, "orgao": "ESCOLA AGROTECNICA FEDERAL DE SOUSA", "sigla": ""},
          {"codigo": 26317, "orgao": "ESCOLA AGROTECNICA FEDERAL DE BARREIROS", "sigla": ""},
          {"codigo": 26318, "orgao": "ESCOLA AGROTECNICA FED. DE BELO JARDIM", "sigla": ""},
          {"codigo": 26319, "orgao": "ESCOLA AGROT. FED. DE VIT. DE S. ANTAO", "sigla": ""},
          {"codigo": 26320, "orgao": "ESCOLA AGROTECNICA FED. DE SAO CRISTOVA", "sigla": ""},
          {"codigo": 26321, "orgao": "CENTRO FED EDUC TEC. DE BENTO GONCALVES", "sigla": ""},
          {"codigo": 26322, "orgao": "ESCOLA AGROTECNICA FEDERAL DE CONCORDIA", "sigla": ""},
          {"codigo": 26323, "orgao": "ESCOLA AGROTECNICA FEDERAL DE SERTAO", "sigla": ""},
          {"codigo": 26324, "orgao": "ESCOLA AGROTECNICA FEDERAL DE COLATINA", "sigla": ""},
          {"codigo": 26325, "orgao": "CENTRO FEDERAL DE EDUC. TECNOL. DE URUTAI", "sigla": ""},
          {"codigo": 26326, "orgao": "CENTRO FEDERAL DE EDUC. TECNOL. DE CUIAB", "sigla": ""},
          {"codigo": 26327, "orgao": "ESCOLA AGROTECNICA FEDERAL DE INCONFIDENTE", "sigla": ""},
          {"codigo": 26328, "orgao": "ESCOLA AGROTECNICA FEDERAL DE MACHADO", "sigla": ""},
          {"codigo": 26329, "orgao": "ESCOLA AGROTECNICA FEDERAL DE SALINAS", "sigla": ""},
          {"codigo": 26330, "orgao": "ESCOLA AGROT. FED. DE S. J. EVANGELISTA", "sigla": ""},
          {"codigo": 26331, "orgao": "ESCOLA AGROTECNICA FEDERAL DE ARAGUATINS", "sigla": ""},
          {"codigo": 26332, "orgao": "ESCOLA AGROTECNICA FEDERAL DE CÁCERES", "sigla": ""},
          {"codigo": 26333, "orgao": "ESCOLA AGROTECNICA FEDERAL DE ALEGRETE", "sigla": ""},
          {"codigo": 26334, "orgao": "ESCOLA AGROTECNICA FEDERAL DE STA. TERESA", "sigla": ""},
          {"codigo": 26336, "orgao": "CENTRO FED. DE EDUC. TEC. DE PETROLINA", "sigla": ""},
          {"codigo": 26337, "orgao": "ESCOLA AGROTECNICA FEDERAL DE CERES", "sigla": ""},
          {"codigo": 26338, "orgao": "CENTRO FED. EDUC. TEC. VICENTE DO SUL", "sigla": ""},
          {"codigo": 26339, "orgao": "ESCOLA AGROT. FED. COLORADO DO OESTE", "sigla": ""},
          {"codigo": 26340, "orgao": "ESCOLA AGROT. FED. S. GABRIEL DA CACHOEIRA", "sigla": ""},
          {"codigo": 26341, "orgao": "ESCOLA AGROTECNICA FEDERAL DE SOMBRIO", "sigla": ""},
          {"codigo": 26342, "orgao": "ESCOLA AGROTECNICA FEDERAL DE RIO DO SU", "sigla": ""},
          {"codigo": 26343, "orgao": "ESCOLA AGROTEC. FED. ANTONIO JOSE TEIXEIR", "sigla": ""},
          {"codigo": 26344, "orgao": "ESCOLA AGROTEC. FEDERAL DE SANTA INES/B", "sigla": ""},
          {"codigo": 26345, "orgao": "ESCOLA AGROTECNICA FEDERAL DE CODO/MA", "sigla": ""},
          {"codigo": 26346, "orgao": "ESCOLA AGROT. FEDERAL SENHOR DO BONFIM/B", "sigla": ""},
          {"codigo": 26350, "orgao": "FUND. UNIV FEDERAL DA GRANDE DOURADOS", "sigla": "UFGD"},
          {"codigo": 26351, "orgao": "UNIV. FEDERAL DO RECONCAVO DA BAHIA", "sigla": "UFRB"},
          {"codigo": 26352, "orgao": "FUNDACAO UNIVERSIDADE FEDERAL DO ABC", "sigla": "UFABC"},
          {"codigo": 26353, "orgao": "ESCOLA TECNICA FEDERAL DO ACRE", "sigla": ""},
          {"codigo": 26354, "orgao": "ESCOLA TECNICA FEDERAL DO AMAPA", "sigla": ""},
          {"codigo": 26356, "orgao": "INST. FED. ED. CIENCIA E TEC. DE BRASILIA", "sigla": ""},
          {"codigo": 26357, "orgao": "ESCOLA TECNICA FEDERAL DE CANOAS", "sigla": ""},
          {"codigo": 26401, "orgao": "INSTITUTO FEDERAL DO ACRE", "sigla": "IFAC"},
          {"codigo": 26402, "orgao": "INSTITUTO FEDERAL DE ALAGOAS", "sigla": "IFAL"},
          {"codigo": 26403, "orgao": "INSTITUTO FEDERAL DO AMAZONAS", "sigla": "IFAM"},
          {"codigo": 26404, "orgao": "INSTITUTO FEDERAL BAIANO", "sigla": "IFBAIANO"},
          {"codigo": 26405, "orgao": "INSTITUTO FEDERAL DO CEARA", "sigla": "IFCE"},
          {"codigo": 26406, "orgao": "INSTITUTO FEDERAL DO ESPIRITO SANTO", "sigla": "IFES"},
          {"codigo": 26407, "orgao": "INSTITUTO FEDERAL GOIANO", "sigla": "IFGOIANO"},
          {"codigo": 26408, "orgao": "INSTITUTO FEDERAL DO MARANHAO", "sigla": "IFMA"},
          {"codigo": 26409, "orgao": "INSTITUTO FEDERAL DE MINAS GERAIS", "sigla": "IFMG"},
          {"codigo": 26410, "orgao": "INSTITUTO FED. DO NORTE DE MINAS GERAIS", "sigla": "IFNORTEMG"},
          {"codigo": 26411, "orgao": "INSTITUTO FED. DO SUDESTE DE MINAS GERAIS", "sigla": "IFSUDEMG"},
          {"codigo": 26412, "orgao": "INSTITUTO FEDERAL DO SUL DE MINAS GERAIS", "sigla": "IFSULMG"},
          {"codigo": 26413, "orgao": "INSTITUTO FEDERAL DO TRIANGULO MINEIRO", "sigla": "IFTRIANG"},
          {"codigo": 26414, "orgao": "INSTITUTO FEDERAL DE MATO GROSSO", "sigla": "IFMT"},
          {"codigo": 26415, "orgao": "INSTITUTO FEDERAL DE MATO GROSSO DO SUL", "sigla": "IFMS"},
          {"codigo": 26416, "orgao": "INSTITUTO FEDERAL DO PARA", "sigla": "IFPA"},
          {"codigo": 26417, "orgao": "INSTITUTO FEDERAL DA PARAIBA", "sigla": "IFPB"},
          {"codigo": 26418, "orgao": "INSTITUTO FEDERAL DE PERNAMBUCO", "sigla": "IFPE"},
          {"codigo": 26419, "orgao": "INSTITUTO FEDERAL DO RIO GRANDE DO SUL", "sigla": "IFRS"},
          {"codigo": 26420, "orgao": "INSTITUTO FEDERAL FARROUPILHA", "sigla": "IFFARROUP"},
          {"codigo": 26421, "orgao": "INSTITUTO FEDERAL CATARINENSE", "sigla": "IFCATARINA"},
          {"codigo": 26423, "orgao": "INSTITUTO FEDERAL DE SERGIPE", "sigla": "IFSE"},
          {"codigo": 26424, "orgao": "INSTITUTO FEDERAL DO TOCANTINS", "sigla": "IFTO"},
          {"codigo": 26426, "orgao": "INSTITUTO FEDERAL DO AMAPA", "sigla": "IFAP"},
          {"codigo": 26427, "orgao": "INSTITUTO FEDERAL DA BAHIA", "sigla": "IFBA"},
          {"codigo": 26428, "orgao": "INSTITUTO FEDERAL DE BRASILIA", "sigla": "IFBRASILIA"},
          {"codigo": 26429, "orgao": "INSTITUTO FEDERAL DE GOIAS", "sigla": "IFGO"},
          {"codigo": 26430, "orgao": "INSTITUTO FEDERAL DO SERTAO PERNAMBUCANO", "sigla": "IFSERTPE"},
          {"codigo": 26431, "orgao": "INSTITUTO FEDERAL DO PIAUI", "sigla": "IFPI"},
          {"codigo": 26432, "orgao": "INSTITUTO FEDERAL DO PARANA", "sigla": "IFPR"},
          {"codigo": 26433, "orgao": "INSTITUTO FEDERAL DO RIO DE JANEIRO", "sigla": "IFRJ"},
          {"codigo": 26434, "orgao": "INSTITUTO FEDERAL FLUMINENSE", "sigla": "IFFLU"},
          {"codigo": 26435, "orgao": "INSTITUTO FEDERAL DO RIO GRANDE DO NORTE", "sigla": "IFRN"},
          {"codigo": 26436, "orgao": "INSTITUTO FEDERAL SUL RIO-GRANDENSE", "sigla": "IFSRIORGRAN"},
          {"codigo": 26437, "orgao": "INSTITUTO FEDERAL DE RORAIMA", "sigla": "IFRR"},
          {"codigo": 26438, "orgao": "INSTITUTO FEDERAL DE SANTA CATARINA", "sigla": "IFSC"},
          {"codigo": 26439, "orgao": "INSTITUTO FEDERAL DE SAO PAULO", "sigla": "IFSP"},
          {"codigo": 26440, "orgao": "UNIVERSIDADE FEDERAL DA FRONTEIRA SUL", "sigla": "UFFS"},
          {"codigo": 26441, "orgao": "UNIVERSIDADE FEDERAL DO OESTE DO PARA", "sigla": "UFOPA"},
          {"codigo": 26442, "orgao": "UN. INT. INTERN. LUSOFONIA AFROBRASILEIR", "sigla": "UNILAB"},
          {"codigo": 26443, "orgao": "EMPRESA BRAS. DE SERVICOS HOSPITALARES", "sigla": "EBSERH"},
          {"codigo": 26447, "orgao": "UNIVERSIDADE FEDERAL DO OESTE DA BAHIA", "sigla": "UFOB"},
          {"codigo": 26448, "orgao": "UNIVERSIDADE FED. SUL SUDESTE DO PARA", "sigla": "UNIFESSPA"},
          {"codigo": 26449, "orgao": "UNIVERSIDADE FEDERAL DO CARIRI", "sigla": ""},
          {"codigo": 26450, "orgao": "UNIVERSIDADE FEDERAL DO SUL DA BAHIA", "sigla": "UFESBA"},
          {"codigo": 26452, "orgao": "UNIVERSIDADE FEDERAL DE CATALAO", "sigla": ""},
          {"codigo": 26453, "orgao": "UNIVERSIDADE FEDERAL DE JATAI", "sigla": ""},
          {"codigo": 26454, "orgao": "UNIVERSIDADE FEDERAL DE RONDONOPOLIS", "sigla": ""},
          {"codigo": 26455, "orgao": "UNIVERSIDADE FEDERAL DO DELTA DO PARNAIBA", "sigla": ""},
          {"codigo": 26457, "orgao": "UNIVERSIDADE FEDERAL NORTE DO TOCANTINS", "sigla": ""},
          {"codigo": 27000, "orgao": "MINISTERIO DA INFRA-ESTRUTURA", "sigla": ""},
          {"codigo": 28000, "orgao": "MINISTERIO IND. COM. EXTERIOR E SERVIÇO", "sigla": "MDIC"},
          {"codigo": 29000, "orgao": "MINISTERIO DO ESPORTE", "sigla": "ME"},
          {"codigo": 29202, "orgao": "SUP. DE DESENVOLVIMENTO DO CENTRO OESTE", "sigla": ""},
          {"codigo": 29203, "orgao": "EMPRESA BRAS. DE PLANEJ. DE TRANSPORTES", "sigla": ""},
          {"codigo": 29205, "orgao": "EMPRESA DE TRENS URBANOS DE PORTO ALEGRE", "sigla": "TRENSURB"},
          {"codigo": 30102, "orgao": "IMPRENSA NACIONAL", "sigla": ""},
          {"codigo": 30202, "orgao": "FUNDACAO NACIONAL DO INDIO", "sigla": "FUNAI"},
          {"codigo": 30203, "orgao": "INST. NAC. METROLOGIA, NORM. E QUAL. INDL.", "sigla": "INMETRO"},
          {"codigo": 30204, "orgao": "INSTITUTO NAC. DA PROPRIEDADE INDUSTRIA", "sigla": "INPI"},
          {"codigo": 30802, "orgao": "DEPTO. DE POLICIA RODOVIARIA FEDERAL", "sigla": "DPRF"},
          {"codigo": 31000, "orgao": "MINIST. ECONOMIA, FAZENDA E PLANEJAMENT", "sigla": ""},
          {"codigo": 31203, "orgao": "INSTITUTO BRASILEIRO DO CAFE", "sigla": ""},
          {"codigo": 32000, "orgao": "MINISTERIO DE MINAS E ENERGIA", "sigla": "MME"},
          {"codigo": 32100, "orgao": "DEPARTAMENTO NAC. DE PRODUCAO MINERAL", "sigla": "DNPM"},
          {"codigo": 32200, "orgao": "AGENCIA NACIONAL DE ENERGIA ELETRICA", "sigla": "ANEEL"},
          {"codigo": 32300, "orgao": "AGENCIA NAC. PETROLEO GAS NAT BIOCOMBUST", "sigla": "ANP"},
          {"codigo": 32314, "orgao": "EMPRESA DE PESQUISA ENERGETICA", "sigla": "EPE"},
          {"codigo": 32396, "orgao": "AGENCIA NACIONAL DE MINERACAO", "sigla": ""},
          {"codigo": 33000, "orgao": "MINISTERIO DO TRABALHO E PREVIDENCIA", "sigla": ""},
          {"codigo": 33062, "orgao": "SUPERINT. NAC. DE PREVIDENCIA COMPLEMENTA", "sigla": "PREVIC"},
          {"codigo": 34000, "orgao": "SECRETARIA DA CULTURA / PR", "sigla": ""},
          {"codigo": 35000, "orgao": "MINISTERIO DAS RELACOES EXTERIORES", "sigla": ""},
          {"codigo": 35201, "orgao": "FUNDACAO ALEXANDRE DE GUSMAO", "sigla": "FAG"},
          {"codigo": 36101, "orgao": "FUNDACAO NACIONAL DE SAUDE", "sigla": ""},
          {"codigo": 36103, "orgao": "CENTRAL DE MEDICAMENTOS", "sigla": ""},
          {"codigo": 36201, "orgao": "FUNDACAO OSWALDO CRUZ", "sigla": "FIOCRUZ"},
          {"codigo": 36203, "orgao": "INST. NACIONAL DE ALIMENTACAO E NUTRICA", "sigla": ""},
          {"codigo": 36204, "orgao": "FUNDACAO DAS PIONERIAS SOCIAIS", "sigla": ""},
          {"codigo": 36205, "orgao": "FUNDACAO NACIONAL DE SAUDE", "sigla": "FUNASA"},
          {"codigo": 36206, "orgao": "EX-INST. NAC. DE ASS. MED. DA PREV. SOCIA", "sigla": ""},
          {"codigo": 36207, "orgao": "AGENCIA NACIONAL DE VIGILANCIA SANITARI", "sigla": "ANVS"},
          {"codigo": 36208, "orgao": "AGENCIA NACIONAL DE SAUDE SUPLEMENTAR", "sigla": "ANS"},
          {"codigo": 36209, "orgao": "HOSPITAL FEMINA", "sigla": "HF"},
          {"codigo": 26423, "orgao": "INSTITUTO FEDERAL DE SERGIPE", "sigla": "IFSE"},
          {"codigo": 26424, "orgao": "INSTITUTO FEDERAL DO TOCANTINS", "sigla": "IFTO"},
          {"codigo": 26426, "orgao": "INSTITUTO FEDERAL DO AMAPA", "sigla": "IFAP"},
          {"codigo": 26427, "orgao": "INSTITUTO FEDERAL DA BAHIA", "sigla": "IFBA"},
          {"codigo": 26428, "orgao": "INSTITUTO FEDERAL DE BRASILIA", "sigla": "IFBRASILIA"},
          {"codigo": 26429, "orgao": "INSTITUTO FEDERAL DE GOIAS", "sigla": "IFGO"},
          {"codigo": 26430, "orgao": "INSTITUTO FEDERAL DO SERTAO PERNAMBUCANO", "sigla": "IFSERTPE"},
          {"codigo": 26431, "orgao": "INSTITUTO FEDERAL DO PIAUI", "sigla": "IFPI"},
          {"codigo": 26432, "orgao": "INSTITUTO FEDERAL DO PARANA", "sigla": "IFPR"},
          {"codigo": 26433, "orgao": "INSTITUTO FEDERAL DO RIO DE JANEIRO", "sigla": "IFRJ"},
          {"codigo": 26434, "orgao": "INSTITUTO FEDERAL FLUMINENSE", "sigla": "IFFLU"},
          {"codigo": 26435, "orgao": "INSTITUTO FEDERAL DO RIO GRANDE DO NORTE", "sigla": "IFRN"},
          {"codigo": 26436, "orgao": "INSTITUTO FEDERAL SUL RIO-GRANDENSE", "sigla": "IFSRIORGRAN"},
          {"codigo": 26437, "orgao": "INSTITUTO FEDERAL DE RORAIMA", "sigla": "IFRR"},
          {"codigo": 26438, "orgao": "INSTITUTO FEDERAL DE SANTA CATARINA", "sigla": "IFSC"},
          {"codigo": 26439, "orgao": "INSTITUTO FEDERAL DE SAO PAULO", "sigla": "IFSP"},
          {"codigo": 26440, "orgao": "UNIVERSIDADE FEDERAL DA FRONTEIRA SUL", "sigla": "UFFS"},
          {"codigo": 26441, "orgao": "UNIVERSIDADE FEDERAL DO OESTE DO PARA", "sigla": "UFOPA"},
          {"codigo": 26442, "orgao": "UNIVERSIDADE INTERNACIONAL LUSOFONIA AFROBRASILEIRA", "sigla": "UNILAB"},
          {"codigo": 26443, "orgao": "EMPRESA BRASILEIRA DE SERVICOS HOSPITALARES", "sigla": "EBSERH"},
          {"codigo": 26447, "orgao": "UNIVERSIDADE FEDERAL DO OESTE DA BAHIA", "sigla": "UFOB"},
          {"codigo": 26448, "orgao": "UNIVERSIDADE FEDERAL DO SUL SUDESTE DO PARA", "sigla": "UNIFESSPA"},
          {"codigo": 26449, "orgao": "UNIVERSIDADE FEDERAL DO CARIRI", "sigla": ""},
          {"codigo": 26450, "orgao": "UNIVERSIDADE FEDERAL DO SUL DA BAHIA", "sigla": "UFESBA"},
          {"codigo": 26452, "orgao": "UNIVERSIDADE FEDERAL DE CATALAO", "sigla": ""},
          {"codigo": 26453, "orgao": "UNIVERSIDADE FEDERAL DE JATAI", "sigla": ""},
          {"codigo": 26454, "orgao": "UNIVERSIDADE FEDERAL DE RONDONOPOLIS", "sigla": ""},
          {"codigo": 26455, "orgao": "UNIVERSIDADE FEDERAL DO DELTA DO PARNAIBA", "sigla": ""},
          {"codigo": 26457, "orgao": "UNIVERSIDADE FEDERAL DO NORTE DO TOCANTINS", "sigla": ""},
          {"codigo": 27000, "orgao": "MINISTERIO DA INFRA-ESTRUTURA", "sigla": ""},
          {"codigo": 28000, "orgao": "MINISTERIO DA INDUSTRIA, COMERCIO EXTERIOR E SERVICOS", "sigla": "MDIC"},
          {"codigo": 29000, "orgao": "MINISTERIO DO ESPORTE", "sigla": "ME"},
          {"codigo": 29202, "orgao": "SUPERINTENDENCIA DE DESENVOLVIMENTO DO CENTRO-OESTE", "sigla": ""},
          {"codigo": 29203, "orgao": "EMPRESA BRASILEIRA DE PLANEJAMENTO DE TRANSPORTES", "sigla": ""},
          {"codigo": 29205, "orgao": "EMPRESA DE TRENS URBANOS DE PORTO ALEGRE", "sigla": "TRENSURB"},
          {"codigo": 30102, "orgao": "IMPRESSA NACIONAL", "sigla": ""},
          {"codigo": 30202, "orgao": "FUNDACAO NACIONAL DO INDIO", "sigla": "FUNAI"},
          {"codigo": 30203, "orgao": "INSTITUTO NACIONAL DE METROLOGIA, NORMALIZACAO E QUALIDADE INDUSTRIAL", "sigla": "INMETRO"},
          {"codigo": 30204, "orgao": "INSTITUTO NACIONAL DA PROPRIEDADE INDUSTRIAL", "sigla": "INPI"},
          {"codigo": 30802, "orgao": "DEPARTAMENTO DE POLICIA RODOVIARIA FEDERAL", "sigla": "DPRF"},
          {"codigo": 31000, "orgao": "MINISTERIO DA ECONOMIA, FAZENDA E PLANEJAMENTO", "sigla": ""},
          {"codigo": 31203, "orgao": "INSTITUTO BRASILEIRO DO CAFE", "sigla": ""},
          {"codigo": 32000, "orgao": "MINISTERIO DE MINAS E ENERGIA", "sigla": "MME"},
          {"codigo": 32100, "orgao": "DEPARTAMENTO NACIONAL DE PRODUCAO MINERAL", "sigla": "DNPM"},
          {"codigo": 32200, "orgao": "AGENCIA NACIONAL DE ENERGIA ELETRICA", "sigla": "ANEEL"},
          {"codigo": 32300, "orgao": "AGENCIA NACIONAL DO PETROLEO, GAS NATURAL E BIOCOMBUSTIVEIS", "sigla": "ANP"},
          {"codigo": 32314, "orgao": "EMPRESA DE PESQUISA ENERGETICA", "sigla": "EPE"},
          {"codigo": 32396, "orgao": "AGENCIA NACIONAL DE MINERACAO", "sigla": ""},
          {"codigo": 33000, "orgao": "MINISTERIO DO TRABALHO E PREVIDENCIA", "sigla": ""},
          {"codigo": 33026, "orgao": "SUPERINTENDENCIA NACIONAL DE PREVIDENCIA COMPLEMENTAR", "sigla": "PREVIC"},
          {"codigo": 34000, "orgao": "SECRETARIA DA CULTURA", "sigla": ""},
          {"codigo": 35000, "orgao": "MINISTERIO DAS RELACOES EXTERIORES", "sigla": ""},
          {"codigo": 35201, "orgao": "FUNDACAO ALEXANDRE DE GUSMAO", "sigla": "FAG"},
          {"codigo": 36101, "orgao": "FUNDACAO NACIONAL DE SAUDE", "sigla": "FUNASA"},
          {"codigo": 36103, "orgao": "CENTRAL DE MEDICAMENTOS", "sigla": ""},
          {"codigo": 36201, "orgao": "FUNDACAO OSWALDO CRUZ", "sigla": "FIOCRUZ"},
          {"codigo": 36203, "orgao": "INSTITUTO NACIONAL DE ALIMENTACAO E NUTRICAO", "sigla": ""},
          {"codigo": 36204, "orgao": "FUNDACAO DAS PIONEIRAS SOCIAIS", "sigla": ""},
          {"codigo": 36205, "orgao": "FUNDACAO NACIONAL DE SAUDE", "sigla": "FUNASA"},
          {"codigo": 36206, "orgao": "EX-INSTITUTO NACIONAL DE ASSISTENCIA MEDICA DA PREVIDENCIA SOCIAL", "sigla": ""},
          {"codigo": 36207, "orgao": "AGENCIA NACIONAL DE VIGILANCIA SANITARIA", "sigla": "ANVS"},
          {"codigo": 36208, "orgao": "AGENCIA NACIONAL DE SAUDE SUPLEMENTAR", "sigla": "ANS"},
          {"codigo": 36209, "orgao": "HOSPITAL FEMINA", "sigla": "HF"},
          {"codigo": 36210, "orgao": "HOSPITAL NOSSA SENHORA DA CONCEICAO", "sigla": "HNSC"},
          {"codigo": 36211, "orgao": "HOSPITAL CRISTO REDENTOR", "sigla": ""},
          {"codigo": 37000, "orgao": "DEFENSORIA PUBLICA DA UNIAO", "sigla": "DPU"},
          {"codigo": 38000, "orgao": "CONSELHO ADMINISTRATIVO DE DEFESA ECONOMICA", "sigla": "CADE"},
          {"codigo": 39250, "orgao": "AGENCIA NACIONAL DE TRANSPORTES TERRESTRES", "sigla": "ANTT"},
          {"codigo": 39251, "orgao": "AGENCIA NACIONAL DE TRANSPORTES AQUAVIARIOS", "sigla": "ANTAQ"},
          {"codigo": 39252, "orgao": "DEPARTAMENTO NACIONAL DE INFRAESTRUTURA DE TRANSPORTES", "sigla": "DNIT"},
          {"codigo": 39253, "orgao": "EMPRESA DE PLANEJAMENTO E LOGISTICA S.A.", "sigla": "EPL"},
          {"codigo": 40100, "orgao": "MINISTERIO DA INTEGRACAO E DO DESENVOLVIMENTO REGIONAL", "sigla": ""},
          {"codigo": 40103, "orgao": "MINISTERIO DA ADMINISTRACAO FEDERAL E REFORMA DO ESTADO", "sigla": ""},
          {"codigo": 40105, "orgao": "MINISTERIO DA DEFESA", "sigla": "MD"},
          {"codigo": 40106, "orgao": "ADVOCACIA-GERAL DA UNIAO", "sigla": "AGU"},
          {"codigo": 40107, "orgao": "MINISTERIO DA CULTURA", "sigla": "MINC"},
          {"codigo": 40108, "orgao": "MINISTERIO DA CIENCIA, TECNOLOGIA E INOVACAO", "sigla": "MCTI"},
          {"codigo": 40109, "orgao": "EX-MINISTERIO DA INTEGRACAO REGIONAL", "sigla": ""},
          {"codigo": 40110, "orgao": "SECRETARIA DE DESPORTOS / PR", "sigla": ""},
          {"codigo": 40111, "orgao": "MINISTERIO DO MEIO AMBIENTE", "sigla": "MMA"},
          {"codigo": 40112, "orgao": "MINISTERIO DO DESENVOLVIMENTO REGIONAL", "sigla": "MIN"},
          {"codigo": 40200, "orgao": "MINISTERIO DAS CIDADES", "sigla": ""},
          {"codigo": 40202, "orgao": "FUNDACAO ESCOLA NACIONAL DE ADMINISTRACAO PUBLICA", "sigla": "ENAP"},
          {"codigo": 40403, "orgao": "FUNDACAO CASA DE RUI BARBOSA", "sigla": "FCRB"},
          {"codigo": 40408, "orgao": "FUNDACAO CULTURAL PALMARES", "sigla": "FCP"},
          {"codigo": 40501, "orgao": "CONSELHO NACIONAL DE DESENVOLVIMENTO CIENTIFICO E TECNOLOGICO", "sigla": "CNPQ"},
          {"codigo": 40503, "orgao": "FUNDACAO CENTRO TECNOLOGICO PARA INFORMATICA", "sigla": ""},
          {"codigo": 40601, "orgao": "SUPERINTENDENCIA DO DESENVOLVIMENTO DO NORDESTE", "sigla": ""},
          {"codigo": 40602, "orgao": "SUPERINTENDENCIA DO DESENVOLVIMENTO DA AMAZONIA", "sigla": ""},
          {"codigo": 40603, "orgao": "SUPERINTENDENCIA DA ZONA FRANCA DE MANAUS", "sigla": "SUFRAMA"},
          {"codigo": 40604, "orgao": "INSTITUTO BRASILEIRO DE TURISMO", "sigla": "EMBRATUR"},
          {"codigo": 40701, "orgao": "INSTITUTO BRASILEIRO DO MEIO AMBIENTE E DOS RECURSOS NATURAIS RENOVAVEIS", "sigla": "IBAMA"},
          {"codigo": 40801, "orgao": "GOVERNO DO EX-TERRITORIO DO AMAPA", "sigla": "EX-TER/AP"},
          {"codigo": 40802, "orgao": "GOVERNO DO EX-TERRITORIO DO ACRE", "sigla": "EX-TER/AC"},
          {"codigo": 40803, "orgao": "GOVERNO DO EX-TERRITORIO DE RONDONIA", "sigla": "EX-TER/RO"},
          {"codigo": 40804, "orgao": "GOVERNO DO EX-TERRITORIO DE RORAIMA", "sigla": "EX-TER/RR"},
          {"codigo": 40805, "orgao": "ANTIGO ESTADO DA GUANABARA E DISTRITO FEDERAL", "sigla": "ANT.GB/DF"},
          {"codigo": 40806, "orgao": "DEPARTAMENTO DE CENTRALIZACAO DE SERVICOS DE INATIVOS E PENSIONISTAS", "sigla": ""},
          {"codigo": 41000, "orgao": "MINISTERIO DAS COMUNICACOES", "sigla": ""},
          {"codigo": 41100, "orgao": "MINISTERIO DAS COMUNICACOES", "sigla": ""},
          {"codigo": 41200, "orgao": "EMPRESA BRASILEIRA DE COMUNICACAO S.A.", "sigla": ""},
          {"codigo": 41231, "orgao": "AGENCIA NACIONAL DE TELECOMUNICACOES", "sigla": "ANATEL"},
          {"codigo": 42000, "orgao": "MINISTERIO DO DESENVOLVIMENTO AGRARIO", "sigla": "MDA"},
          {"codigo": 42102, "orgao": "COMISSAO EXECUTIVA DO PLANO DA LAVOURA CACAU", "sigla": ""},
          {"codigo": 42201, "orgao": "INSTITUTO NACIONAL DE COLONIZACAO E REFORMA AGRARIA", "sigla": "INCRA"},
          {"codigo": 42204, "orgao": "DEPARTAMENTO NACIONAL DE OBRAS CONTRA AS SECAS", "sigla": "DNOCS"},
          {"codigo": 42207, "orgao": "INSTITUTO BRASILEIRO DE MUSEUS", "sigla": "IBRAM"},
          {"codigo": 43000, "orgao": "EX-MINISTERIO DO BEM-ESTAR SOCIAL", "sigla": ""},
          {"codigo": 43201, "orgao": "EX-FUND.CENTRO BRAS. P.INFANC./ADOLESC", "sigla": ""},
          {"codigo": 43202, "orgao": "EX-FUNDACAO LEGIAO BRAS. DE ASSISTENCIA", "sigla": ""},
          {"codigo": 44205, "orgao": "AGENCIA NACIONAL DE AGUAS", "sigla": "ANA"},
          {"codigo": 44206, "orgao": "INSTITUTO DE PESQ. JARDIM BOTANICO DO R", "sigla": "JBRJ"},
          {"codigo": 44207, "orgao": "INSTITUTO CHICO MENDES CONSERV.BIODIVER", "sigla": "ICMBIO"},
          {"codigo": 45203, "orgao": "COMISSAO DE VALORES MOBILIARIOS", "sigla": "CVM"},
          {"codigo": 45205, "orgao": "FUND. INST. BRASIL. GEOG. E ESTATISTICA", "sigla": "IBGE"},
          {"codigo": 45206, "orgao": "INSTITUTO DE PESQUISA ECONOMICA APLICAD", "sigla": "IPEA"},
          {"codigo": 45208, "orgao": "SUPERINTENDENCIA DE SEGUROS PRIVADOS", "sigla": "SUSEP"},
          {"codigo": 46000, "orgao": "MICT", "sigla": ""},
          {"codigo": 49000, "orgao": "MINISTERIO DA INFRAESTRUTURA", "sigla": "MT"},
          {"codigo": 49100, "orgao": "MINISTERIO DE PORTOS E AEROPORTOS", "sigla": ""},
          {"codigo": 49201, "orgao": "DEPARTAMENTO NAC. DE ESTRADAS DE RODAGE", "sigla": ""},
          {"codigo": 49300, "orgao": "VALEC ENG.CONSTRUCOES E FERROVIAS S/A", "sigla": "VALEC"},
          {"codigo": 51000, "orgao": "AUTORIDADE.DE GOVER.DO LEGADO OLIMPICO", "sigla": ""},
          {"codigo": 52201, "orgao": "AGENCIA NACIONAL DE AVIACAO CIVIL", "sigla": "ANAC"},
          {"codigo": 53202, "orgao": "AMAZONIA AZUL TECNOLOGIAS DE DEFESA SA", "sigla": "AMAZUL"},
          {"codigo": 53203, "orgao": "SUPERINTENDENCIA DO DESENV. DA AMAZONIA", "sigla": "SUDAM"},
          {"codigo": 53205, "orgao": "AGENCIA DE DESENVOLVIMENTO DA AMAZONIA", "sigla": ""},
          {"codigo": 53206, "orgao": "AGENCIA DE DESENVOLVIMENTO DO NORDESTE", "sigla": ""},
          {"codigo": 53297, "orgao": "SUP.DE DESENVOLVIMENTO DO CENTRO OESTE", "sigla": "SUDECO"},
          {"codigo": 54000, "orgao": "MINISTERIO DO TURISMO", "sigla": "MTUR"},
          {"codigo": 54100, "orgao": "MINISTERIO DA CULTURA", "sigla": ""},
          {"codigo": 55000, "orgao": "MINISTERIO DA CIDADANIA", "sigla": "MDSCF"},
          {"codigo": 56000, "orgao": "MINISTERIO DAS CIDADES", "sigla": "MCID"},
          {"codigo": 57201, "orgao": "FUND.JORGE DUPRAT FIG. SEG. MED.TRABALH", "sigla": "F.CENTRO"},
          {"codigo": 57202, "orgao": "INSTITUTO NACIONAL DE SEGURO SOCIAL", "sigla": "INSS"},
          {"codigo": 57203, "orgao": "EMPR.DE PROCESS.DE DADOS DA PREV.SOCIAL", "sigla": ""},
          {"codigo": 58000, "orgao": "MINISTERIO DE PESCA E AQUICULTURA", "sigla": ""},
          {"codigo": 59000, "orgao": "CONTROLADORIA-GERAL DA UNIAO", "sigla": ""},
          {"codigo": 70000, "orgao": "COMANDO DA MARINHA", "sigla": "CM"},
          {"codigo": 70101, "orgao": "MINISTERIO DA MARINHA II", "sigla": ""},
          {"codigo": 70102, "orgao": "TRIBUNAL MARITIMO", "sigla": ""},
          {"codigo": 77000, "orgao": "FUND PREV COMPL SERV PUBL FED EXECUTIVO", "sigla": "FUNPRESP"},
          {"codigo": 80101, "orgao": "INST.DE PREV.SOC. DO SERVIDOR PUBLICO", "sigla": ""},
          {"codigo": 80203, "orgao": "SUPERINTENDENCIA DO DES. DA REGIAO SUL", "sigla": ""},
          {"codigo": 80204, "orgao": "DEPART. NAC. DE D. DE SANEAMENTO ( EXT.", "sigla": ""},
          {"codigo": 80204, "orgao": "INSTITUTO DO ACUCAR E DO ALCOOL", "sigla": ""},
          {"codigo": 81000, "orgao": "MIN. DA MULHER, FAMILIA E DIR. HUMANOS", "sigla": ""},
          {"codigo": 90150, "orgao": "MINISTERIO PUBLICO DA UNIAO", "sigla": ""},
          {"codigo": 91241, "orgao": "AUTORIDADE PUBLICA OLIMPICA", "sigla": "APO"},
          {"codigo": 93400, "orgao": "COMPANHIA DE NAVEGACAO SAO FRANCISCO", "sigla": ""},
          {"codigo": 99009, "orgao": "EMPRESA DE NAVEGACAO DA AMAZONIA", "sigla": ""},
          {"codigo": 99010, "orgao": "COMPANHIA DE PESQUISA DE REC. MINERAIS", "sigla": "CPRM"},
          {"codigo": 99013, "orgao": "HOSPITAL DE CLINICAS DE PORTO ALEGRE", "sigla": "HCPA"},
          {"codigo": 99016, "orgao": "SENADO FEDERAL", "sigla": ""},
          {"codigo": 99072, "orgao": "GOVERNO DO DISTRITO FEDERAL", "sigla": ""},
          {"codigo": 99074, "orgao": "GOVERNO DO DISTRITO FEDERAL", "sigla": ""},
          {"codigo": 99901, "orgao": "CONSELHO DE JUSTICA FEDERAL", "sigla": ""},
          {"codigo": 99991, "orgao": "ESTADOS / MUNICIPIOS / EMPRESAS", "sigla": ""},
          {"codigo": 40100, "orgao": "MINISTERIO DA INTEGRAÇÃO E DO DESENVOLVIMENTO REGIONAL", "sigla": ""},
          {"codigo": 13300, "orgao": "MINISTERIO DA AGRICULTURA E PECUARIA", "sigla": ""},
          {"codigo": 17700, "orgao": "MIN EMPREEND MICROEMP EMP PEQUENO PORTE", "sigla": ""},
          {"codigo": 22107, "orgao": "MINISTERIO DA INFRA-ESTRUTURA", "sigla": ""},
          {"codigo": 26456, "orgao": "UNIVER. FEDERAL DO AGRESTE DE PERNAMBUCO", "sigla": ""},
          {"codigo": 28000, "orgao": "MINISTERIO IND. COM. EXTERIOR E SERVI O", "sigla": ""},
          {"codigo": 33100, "orgao": "MINISTERIO DA PREVIDENCIA SOCIAL", "sigla": ""},
          {"codigo": 33200, "orgao": "MINISTERIO DO TRABALHO E EMPREGO", "sigla": ""},
          {"codigo": 40108, "orgao": "MINISTERIO CIENCIA TECNOLOGIA INOVA", "sigla": ""},
          {"codigo": 40115, "orgao": "MINISTERIO DA DEFESA", "sigla": ""},
          {"codigo": 40116, "orgao": "ADVOCACIA-GERAL DA UNIAO", "sigla": ""},
          {"codigo": 40211, "orgao": "MINISTERIO DO MEIO AMBIENTE", "sigla": ""},
          {"codigo": 49200, "orgao": "MINISTERIO DOS TRANSPORTES", "sigla": ""},
          {"codigo": 55100, "orgao": "MIN DESENV ASSIS SOCI FAMIL COMBATE FOM", "sigla": ""},
          {"codigo": 55200, "orgao": "MINISTERIO DO ESPORTE", "sigla": ""},
          {"codigo": 81100, "orgao": "MIN DOS DIR HUM E DA CIDADANIA", "sigla": ""},
          {"codigo": 81200, "orgao": "MINISTERIO DAS MULHERES", "sigla": ""},
          {"codigo": 81300, "orgao": "MINISTERIO DA IGUALDADE RACIAL", "sigla": ""},
          {"codigo": 99172, "orgao": "POLICIA MILITAR DO DISTRITO FEDERAL", "sigla": ""},
          {"codigo": 99174, "orgao": "POLICIA CIVIL DO DISTRITO FEDERAL", "sigla": ""},
          {"codigo": 99172, "orgao": "CORPO DE BOMBEIROS MILITAR DO DISTRITO FEDERAL", "sigla": ""},
      ]
    }
  },
  created() {
    this.walletStore = useWalletStore();
  },
  updated() {
    this.initTooltips();
  },
  methods: {
    onlyNumbers(event) {
      const input = event.target;
      input.value = input.value.replace(/\D/g, "");
    },
    addToWallet(table) {
      if (!this.selectedBank) return;

      const item = {
        id: Date.now(),
        type: "loan",

        bank: {
          bank: this.selectedBank.bank,
          bank_name: this.selectedBank.bank_name,
          icon: this.selectedBank.icon
        },

        table: {
          name: table.name,
          terms: table.terms,
          exchange: Number(table.exchange)
        },

        loan: {
          contract: null,
          original_bank: document.getElementById("bancoOrigemInput")?.value || null,
          installment: Number(
            document.getElementById("parcelaInput")?.value || 0
          ),
          ballance: Number(
            document.getElementById("saldoInput")?.value || 0
          ),
          remaining_terms: Number(
            document.getElementById("prazoRestanteInput")?.value || 0
          ),
          total_terms: Number(
            document.getElementById("prazoOriginalInput")?.value || 0
          )
        }
      };

      const exists = this.walletStore.wallet.some(
        w =>
          w.bank.bank === item.bank.bank &&
          w.table.name === item.table.name &&
          w.table.terms === item.table.terms
      );

      if (exists) {
        showToast("Essa tabela já está na carteira", "warning");
        return;
      }

      this.walletStore.wallet.push(item);
      localStorage.setItem("wallet", JSON.stringify(this.walletStore.wallet));

      showToast("Oferta adicionada à carteira", "success");
    },
    openBankModal(bank) {
      this.selectedBank = bank;
      const modal = new bootstrap.Modal(document.getElementById("bankModal"));
      modal.show();
    },
    openEntitySearchModal() {
      this.entityName = "";
      this.$nextTick(() => {
        const modal = new bootstrap.Modal(document.getElementById("entityModal"));
        modal.show();
      });
    },
    selectOrgao(orgao) {
      this.entityCode = `${orgao.codigo} - ${orgao.orgao}`;
      this.entityName = ""; 
      const modal = bootstrap.Modal.getInstance(document.getElementById('entityModal'));
      modal.hide();
    },
    initTooltips() {
      this.tooltips.forEach(t => t.dispose());
      this.tooltips = [];
      const els = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      els.forEach(el => {
        this.tooltips.push(new bootstrap.Tooltip(el));
      });
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
      const entityCode = document.getElementById("entityCodeInput").value.split("-")[0].trim();
      const functionSituation = document.getElementById("functionSituations").value;
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
        showToast("Selecione um orgão válido.", 'danger');
        return;
      }
      let rate = getRate(parseFloat(saldo.replace(",", ".")), parseFloat(parcela.replace(",", ".")), parseInt(prazoRestante))
      if (rate === 0.01) {
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
        function_code: Number(functionSituation),
        illiterate: analfabeto,
        negative: negativo,
        user_room: 1,
      };
      this.loading = true;
      this.data = null;
      try {
        const r = await api.post("/operations/federal/", payload);
        this.data = r.data;
      } catch (e) {
        console.error(e);
        if (e.message === "Network Error") {
          showToast("Erro ao conectar ao servidor.", 'danger');
        } else {
          showToast(`Erro ao carregar dados.`, 'danger');
        }
      } finally {
        this.loading = false;
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
  },
  mounted() {
    this.orgaoOriginal = [...this.orgao];

    const modalEl = document.getElementById('entityModal');
    modalEl.addEventListener('hidden.bs.modal', () => {
      this.entityName = "";
    });
  },
  computed: {
  filteredOrgaos() {
    const term = this.entityName.toLowerCase().trim();

    if (!term) return [];

    return this.orgao.filter(o =>
      o.orgao.toLowerCase().includes(term) ||
      (o.sigla || "").toLowerCase().includes(term)
    );
  }
  },
}
</script>
