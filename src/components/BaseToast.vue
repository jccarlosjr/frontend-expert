<template>
  <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999">
    <div
      class="toast align-items-center border-0 show"
      :class="`text-bg-${variant}`"
      role="alert"
    >
      <div class="d-flex">
        <div class="toast-body">
          {{ message }}
        </div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          @click="visible = false"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  message: String,
  variant: {
    type: String,
    default: "primary" // success | danger | warning | info
  }
});

const visible = ref(true);

watch(
  () => props.message,
  () => {
    visible.value = true;
  }
);
</script>
