<template>
  <div class="d-flex align-items-center justify-content-center vh-100 bg-light" >
    

    <div class="card shadow-sm p-4" style="width: 380px;">
      <div class="text-center mb-3">
        <!-- <img src="https://placehold.co/80x80?text=Logo" class="rounded-circle mb-2" alt="logo"/> -->
        <div class="logo" id="title-logo-login">Roteiro de Bolso</div>
      </div>

      <form @submit.prevent="login">
        <div class="mb-3">
          <label class="form-label">Usuário</label>
          <input v-model="username" class="form-control" placeholder="Seu usuário" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Senha</label>
          <input v-model="password" type="password" class="form-control" placeholder="••••••••••••" required />
        </div>

        <div class="d-grid">
          <button class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Entrar
          </button>
        </div>
      </form>

      <div class="text-center mt-3">
        <small class="text-danger" v-if="error">{{ error }}</small>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/api.js'

export default {
  name: 'LoginView',
  data() {
    return {
      username: '',
      password: '',
      error: null,
      loading: false
    }
  },
  methods: {
    async login() {
      this.error = null
      this.loading = true
      try {
        const res = await api.post('authentication/token/', {
          username: this.username,
          password: this.password
        })
        localStorage.setItem('access', res.data.access)
        localStorage.setItem('refresh', res.data.refresh)
        this.$router.push('/')
      } catch (e) {
        this.error = 'Falha ao efetuar login, verifique seu usuário e senha.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');

#title-logo-login{
  font-family: 'Pacifico', cursive;
  font-weight: lighter;
  font-size: 30px;
  color: blue;
}

</style>