<template>
  <div class="fixed top-4 right-4 z-[1000] space-y-3">
    <TransitionGroup name="toast">
      <UiToast
        v-for="toast in toasts"
        :key="toast.id"
        :message="toast.message"
        :type="toast.type"
        :dismissible="toast.dismissible"
        @dismiss="dismissToast(toast.id)"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">

export interface ToastMessage extends ToastOptions {
  id: number;
  message: string;
}

const toasts = ref<ToastMessage[]>([]);
let toastId = 0;

const addToast = (message: string, options?: ToastOptions) => {
  const id = toastId++;
  const newToast: ToastMessage = {
    id,
    message,
    duration: 3000,
    ...options,
  };
  toasts.value.unshift(newToast);

  if (newToast.duration !== 0) {
    setTimeout(() => {
      dismissToast(id);
    }, newToast.duration);
  }
};

const dismissToast = (id: number) => {
  toasts.value = toasts.value.filter(toast => toast.id !== id);
};

defineExpose({
  addToast,
});
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.5s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.toast-move {
  transition: transform 0.3s ease;
}
</style>
