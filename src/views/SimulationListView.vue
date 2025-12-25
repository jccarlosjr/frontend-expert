<template>
    <div class="container py-4">

        <h4 class="fw-bold mb-4">Simulações Salvas</h4>

        <!-- LOADING -->
        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
        </div>

        <!-- ERRO -->
        <div v-else-if="error" class="alert alert-danger text-center">
            Houve um problema ao solicitar os dados ao servidor.
            <br />
            Tente novamente mais tarde.
        </div>

        <!-- VAZIO -->
        <div v-else-if="!simulations.length" class="alert alert-info text-center">
            Nenhuma simulação encontrada.
        </div>

        <div v-else class="accordion w-100" id="simulationsAccordion">

            <div v-for="simulation in simulations" :key="simulation.id" class="accordion-item mb-3">
                <!-- HEADER -->
                <h2 class="accordion-header">
                    <div class="d-flex w-100 align-items-center ">

                        <button class="accordion-button collapsed fw-semibold flex-grow-1" type="button"
                            data-bs-toggle="collapse" :data-bs-target="`#sim-${simulation.id}`">
                            {{ simulation.nome }} — {{ maskCpf(simulation.cpf) }} — {{ simulation.entity_number }}
                            <span class="ms-3 badge bg-primary">
                                {{ simulation.items.length }} ofertas
                            </span>
                            <span class="text-muted small ms-3">
                                em, {{ formatDate(simulation.created_at) }}
                            </span>
                        </button>

                        <button
                        class="btn btn-outline-secondary btn-sm me-2"
                        title="Imprimir ofertas"
                        @click.stop="printSimulation(simulation.id)"
                        >
                            <i class="bi bi-printer"></i>
                        </button>


                        <!-- BOTÃO DELETE -->
                        <button class="btn btn-outline-danger btn-sm ms-2 me-2" title="Excluir simulação"
                            @click.stop="deleteSimulation(simulation.id)">
                            <i class="bi bi-trash"></i>
                        </button>

                    </div>
                </h2>

                <!-- BODY -->
                <div :id="`sim-${simulation.id}`" class="accordion-collapse collapse"
                    data-bs-parent="#simulationsAccordion">
                    <div class="accordion-body" :id="`print-sim-${simulation.id}`">
                        <!-- ITENS -->
                        <div v-for="item in simulation.items" :key="item.contract" class="card mb-1 shadow-lg">
                            <!-- HEADER -->
                            <div class="card-header">
                                <div v-if="item.original_bank ?? false" class="row text-center justify-content-center gy-3">
                                    <div class="col-6 col-md-4 col-lg-4 mb-1">
                                        <strong class="text-muted d-block">Dados do Contrato Original</strong>
                                    </div>
                                </div>

                                <div class="row text-center justify-content-center gy-3">

                                    <!-- Banco Origem -->
                                    <div v-if="item.original_bank ?? false" class="col-6 col-md-3 col-lg-2">
                                        <small class="text-muted d-block">Banco Origem</small>
                                        <span class="fw-semibold">{{ item.original_bank }}</span>
                                    </div>

                                    <!-- Resta / Total -->
                                    <div v-if="(item.remaining_terms ?? null) !== null && (item.total_terms ?? null) !== null"
                                        class="col-6 col-md-3 col-lg-2">
                                        <small class="text-muted d-block">Resta / Total</small>
                                        <span>{{ item.remaining_terms }}/{{ item.total_terms }}</span>
                                    </div>

                                    <!-- Contrato -->
                                    <div v-if="item.contract ?? false" class="col-6 col-md-3 col-lg-2">
                                        <small class="text-muted d-block">Contrato</small>
                                        <span class="fw-bold">{{ item.contract }}</span>
                                    </div>

                                    <!-- Saldo -->
                                    <div v-if="item.ballance ?? false" class="col-6 col-md-3 col-lg-2">
                                        <small class="text-muted d-block">Saldo</small>
                                        <span class="fw-semibold">
                                            {{ formatCurrency(item.ballance) }}
                                        </span>
                                    </div>

                                </div>
                            </div>


                            <!-- BODY -->
                            <div class="card-body">
                                <div class="row text-center justify-content-center gy-3">
                                    <div class="col-6 col-md-4 col-lg-4 mb-1">
                                        <strong class="text-muted d-block">Dados da Proposta</strong>
                                    </div>
                                </div>
                                <div class="row text-center justify-content-center gy-3">
                                    <div class="col-6 col-md-3 col-lg-2">
                                        <small class="text-muted d-block">Banco</small>
                                        <span>{{ item.bank_name }}</span>
                                    </div>

                                    <div class="col-6 col-md-3 col-lg-2">
                                        <small class="text-muted d-block">Parcela</small>
                                        <span>{{ formatCurrency(item.installment) }}</span>
                                    </div>

                                    <div class="col-6 col-md-3 col-lg-3">
                                        <small class="text-muted d-block">Tabela</small>
                                        <span>
                                            {{ item.table_name }} ({{ item.table_terms }}x)
                                        </span>
                                    </div>

                                    <div class="col-6 col-md-3 col-lg-2">
                                        <small class="text-muted d-block">Troco</small>
                                        <span class="fw-bold text-success">
                                            {{ formatCurrency(item.table_exchange) }}
                                        </span>
                                    </div>

                                    <div class="col-12 col-md-6 col-lg-3">
                                        <small class="text-muted d-block">Valor Financiado</small>
                                        <span class="fw-bold">
                                            {{ formatCurrency(
                                                Number(item.table_exchange ?? 0) +
                                                Number(item.ballance ?? 0)
                                            ) }}

                                        </span>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div class="card-footer bg-light rounded-5">
                            <div class="d-flex justify-content-end align-items-center">

                                <div class="text-end me-5">
                                    <small class="text-muted">Troco total para o cliente</small>
                                    <div class="fw-bold fs-5 text-success">
                                        {{ formatCurrency(totalExchange(simulation)) }}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { useToast } from "@/composables/useToast";
const { showToast } = useToast();
import { ref, onMounted } from "vue";
import api from "@/api/api";

const simulations = ref([]);
const loading = ref(true);
const error = ref(false);

onMounted(async () => {
    try {
        const { data } = await api.get("/simulations/");
        simulations.value = data;
    } catch (e) {
        console.error(e);
        error.value = true;
        showToast(
            "Houve um problema ao solicitar os dados ao servidor.",
            "danger"
        );
    } finally {
        loading.value = false;
    }
});

function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(Number(value));
}

function totalExchange(simulation) {
    return simulation.items.reduce(
        (total, item) => total + Number(item.table_exchange || 0),
        0
    );
}

function formatDate(date) {
    return new Date(date).toLocaleString("pt-BR");
}

function maskCpf(cpf) {
    return cpf.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        "$1.$2.$3-$4"
    );
}

async function deleteSimulation(id) {
    const confirmed = confirm("Deseja realmente excluir esta simulação?");
    if (!confirmed) return;

    try {
        await api.delete(`/simulations/${id}/`);

        simulations.value = simulations.value.filter(
            sim => sim.id !== id
        );

        showToast("Oferta excluida com sucesso", "success");

    } catch (error) {
        console.error(error);
        showToast("Erro ao excluir oferta", "danger");
    }
}

function printSimulation(simulationId) {
  const container = document.getElementById(
    `print-sim-${simulationId}`
  );

  if (!container) return;

  const clone = container.cloneNode(true);

  // Remove botões, ações e accordion leftovers
  clone.querySelectorAll(
    "button, .btn, .accordion-button"
  ).forEach(el => el.remove());

  const printWindow = window.open(
    "",
    "_blank",
    "width=1200,height=900"
  );

  printWindow.document.write(`
    <html>
      <head>
        <title>Proposta Comercial</title>

        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />

        <style>
          @page {
            size: A2 portrait;
            margin: 20mm;
          }

          body {
            background: white;
            font-size: 16px;
            padding: 20px;
          }

          .card {
            page-break-inside: avoid;
            box-shadow: none;
          }

          .accordion-body {
            padding: 0;
          }

          .card-footer {
            border-top: 1px solid #ddd;
          }

          .bank-logo {
            max-height: 60px;
          }

          h4, h5 {
            font-size: 26px;
          }
        </style>
      </head>

      <body>
        ${clone.outerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
}

</script>
