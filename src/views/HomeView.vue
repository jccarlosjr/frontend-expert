<template>
  <div class="py-5">
    <div class="container text-center">
      <h2 class="display-5 fw-bold mb-3 text-primary" id="h2-title">
        Seu Roteiro Operacional Instantâneo
      </h2>
      <p class="lead text-secondary">
        Bem-vindo ao <span class="fw-semibold text-dark" id="ro-text">Roteiro de Bolso</span>, 
        todas as regras, sem dificuldade.
      </p>
      <hr class="my-4 w-50 mx-auto">

      <!-- Botão para abrir SimulationsView -->
      <router-link to="/simulations" class="btn btn-outline-primary btn-lg mt-3">
        Simular com roteiro operacional
      </router-link>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&family=Pacifico&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');


#ro-text{
  font-family: 'Pacifico', cursive;
  font-weight: lighter;
}
.container{
  font-family: 'Nunito Sans', sans-serif;
}
</style>

<script>
export default {
  name: 'HomeView',
  methods: {
    logout() {
      localStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>
