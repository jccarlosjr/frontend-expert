<template>
  <div>
    <div class="text-center mb-3"> 
      <button class="btn btn-outline-primary btn-sm me-2" @click="activeForm = 'form1'">
        Roteiro com Saldo 
      </button>
      <button class="btn btn-outline-info btn-sm me-2" @click="activeForm = 'form2'">
        Roteiro com Extrato 
      </button>
      <button class="btn btn-outline-success btn-sm me-2" @click="activeForm = 'form3'">
        Roteiro Siape 
      </button>
    </div>

    <SimulationForm v-if="activeForm === 'form1'" />
    <SimulationForm2 v-if="activeForm === 'form2'" />
    <SimulationFormSiape v-if="activeForm === 'form3'" />

  </div>
</template>
<script>
import SimulationForm from '../components/SimulationFormINSS.vue'
import SimulationForm2 from '../components/SimulationFormINSS2.vue'
import SimulationFormSiape from '../components/SimulationFormSiape.vue'

export default { 
  name: 'SimulationsView', 
  components: { 
    SimulationForm, 
    SimulationForm2,
    SimulationFormSiape
  }, 
  data() { 
    return { activeForm: null } 
  } 
} 
</script>
