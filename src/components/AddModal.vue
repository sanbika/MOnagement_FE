<style scoped>
@import url(../assets/addModal.css);
</style>

<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>{{ title }}</h2>
      <form @submit.prevent="submitForm">
        <!-- Iterate over fields to dynamically generate form inputs -->
        <div class="form-group" v-for="(field, fieldIndex) in fields" :key="fieldIndex">
          <label :for="field">{{ fieldDisplay[field] }}</label>

          <!-- Text input -->
          <input
            v-if="fieldConfig[field] === 'text'"
            v-model="formData[field]"
            :id="field"
            type="text"
            required
          />

          <!-- Number input -->
          <input
            v-else-if="fieldConfig[field] === 'number'"
            v-model="formData[field]"
            :id="field"
            type="number"
            min="1"
            required
          />

          <!-- Date input -->
          <input
            v-else-if="fieldConfig[field] === 'date'"
            v-model="formData[field]"
            :id="field"
            type="date"
            required
          />

          <!-- Select dropdown -->
          <select
            v-else-if="fieldConfig[field] === 'select'"
            :id="field"
            v-model="formData[field]"
            required
          >
            <option v-for="option in options" :key="option.id" :value="option.id">
              {{ option.name }}
            </option>
          </select>
        </div>
        <div class="form-btns">
          <button class="cancel-btn" type="button" @click="closeModal">Cancel</button>
          <button class="submit-btn" type="submit">Add</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
  title: String,
  fields: Array, // Array of field names like ['itemName', 'itemQuantity', 'itemDate', 'itemType']
  fieldDisplay: Object, // Mapping of field names to their labels, e.g., { itemName: 'Item Name', ... }
  fieldConfig: Object, // Mapping of field names to input types, e.g., { itemName: 'text', itemQuantity: 'number', ... }
  isVisible: Boolean,
  options: Array // Array of options for the select dropdown
})

const emit = defineEmits(['update:isVisible', 'emitAddRequest'])

// Dynamically create a reactive object for form data
const formData = reactive({})

// Function to initialize or reset the form data
const initializeField = (field) => {
  if (props.fieldConfig[field] === 'select') {
    formData[field] = props.options.length ? props.options[0].id : null // Default to first option if available
  } else if (props.fieldConfig[field] === 'number') {
    formData[field] = 1 // Default for numbers
  } else {
    formData[field] = '' // Default for text and date
  }
}

// Initialize formData
const initializeForm = () => {
  props.fields.forEach(initializeField)
}

// Call initializeForm to set the initial state
initializeForm()

const submitForm = () => {
  emit('emitAddRequest', { ...formData }) // Spread formData into emitted event
  resetForm()
  emit('update:isVisible', false)
}

// Reset form after submission
const resetForm = () => {
  initializeForm() // Re-initialize form to reset values
}

const closeModal = () => {
  emit('update:isVisible', false)
}
</script>
