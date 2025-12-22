import { ref } from "vue";

const toastMessage = ref("");
const toastVariant = ref("");
const show = ref(false);

export function useToast() {
  function showToast(message, variant = "primary") {
    toastMessage.value = message;
    toastVariant.value = variant;
    show.value = true;

    setTimeout(() => {
      show.value = false;
    }, 3000);
  }

  return {
    toastMessage,
    toastVariant,
    showToast,
    show
  };
}
