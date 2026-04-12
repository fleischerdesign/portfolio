
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void;
  (e: 'upload', file: File): void;
}>();

defineProps<{
  modelValue?: string | null;
  label?: string;
  helperText?: string;
  uploading?: boolean;
}>();

const { showToast } = useToast();
const isLoading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

function triggerFileSelect() {
    fileInput.value?.click();
}

async function onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    // Validate locally first
    if (!file.type.startsWith('image/')) {
        showToast('Only images are allowed', { type: 'error' });
        return;
    }

    // Limit size to 5MB locally
    if (file.size > 5 * 1024 * 1024) {
        showToast('Image is too large (max 5MB)', { type: 'error' });
        return;
    }

    isLoading.value = true;
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await $fetch('/api/media/upload', {
            method: 'POST',
            body: formData
        });

        emit('update:modelValue', response.url);
        showToast('Image uploaded successfully', { type: 'success' });
    } catch (error) {
        console.error('Upload failed:', error);
        showToast('Upload failed', { type: 'error' });
    } finally {
        isLoading.value = false;
        // Reset input so the same file can be selected again
        target.value = '';
    }
}
</script>

<template>
  <div class="space-y-2">
    <label v-if="label" class="block text-sm font-medium text-primary-700 dark:text-primary-300">
        {{ label }}
    </label>
    
    <div class="flex items-center gap-4">
        <div 
            v-if="modelValue" 
            class="group relative h-20 w-32 shrink-0 overflow-hidden rounded-xl border border-primary-200 bg-primary-100 dark:border-primary-800 dark:bg-primary-900"
        >
            <NuxtImg :src="modelValue" sizes="200px" class="h-full w-full object-cover" />
            <div class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <button class="p-1 text-white hover:text-red-400" @click="emit('update:modelValue', null)">
                    <Icon name="heroicons:trash" size="20" />
                </button>
            </div>
        </div>
        
        <div 
            v-else 
            class="flex h-20 w-32 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-primary-200 bg-primary-50/50 text-primary-400 dark:border-primary-800 dark:bg-primary-900/30"
        >
            <Icon name="heroicons:photo" size="24" />
        </div>

        <div class="flex-1 space-y-2">
            <div class="flex items-center gap-2">
                <UiButton size="sm" :is-loading="isLoading" @click="triggerFileSelect">
                    <Icon name="heroicons:arrow-up-tray" class="mr-2" />
                    {{ modelValue ? 'Change Image' : 'Upload Image' }}
                </UiButton>
                <UiButton v-if="modelValue" variant="ghost" size="sm" @click="emit('update:modelValue', null)">
                    Remove
                </UiButton>
            </div>
            <p v-if="helperText" class="text-[10px] font-bold uppercase tracking-widest text-primary-500">
                {{ helperText }}
            </p>
        </div>
    </div>

    <!-- Hidden File Input -->
    <input 
        ref="fileInput"
        type="file" 
        class="hidden" 
        accept="image/*"
        @change="onFileChange"
    />
  </div>
</template>
