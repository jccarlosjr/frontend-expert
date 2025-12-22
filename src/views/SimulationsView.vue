<template>
  <div>
    <div class="text-center mb-3"> 
      <button class="btn btn-outline-primary btn-sm me-2" @click="activeForm = 'form1'">
        Buscar Roteiro com Saldo 
      </button> 
      <button class="btn btn-outline-info btn-sm" @click="activeForm = 'form2'">
        Buscar Roteiro com Extrato 
      </button> 
    </div>

    <SimulationForm v-if="activeForm === 'form1'" />
    <SimulationForm2 v-if="activeForm === 'form2'" />

  </div>
</template>
<script>
import SimulationForm from '../components/SimulationFormINSS.vue' 
import SimulationForm2 from '../components/SimulationFormINSS2.vue' 

export default { 
  name: 'SimulationsView', 
  components: { 
    SimulationForm, 
    SimulationForm2 
  }, 
  data() { 
    return { activeForm: null } 
  } 
} 
</script>
