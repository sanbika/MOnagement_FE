<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: #3c3d4a;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 90%;
  max-width: 500px;
  transition: transform 0.3s ease-out;
}

.modal-content h2 {
  margin: 0 0 20px;
  font-size: 1.5rem;
  color: white;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: white;
}

.form-group>input,
.form-group>select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  border-color: #007bff;
  outline: none;
}

.form-btns {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.submit-btn,
.cancel-btn {
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  color: white;
  transition: background-color 0.3s ease;
}

.submit-btn {
  background-color: #2c2c34;

}

.submit-btn:hover {
  background-color: #53535f;
}

.cancel-btn {
  background-color: red;
}

.cancel-btn:hover {
  background-color: darkred;
}
</style>

<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>Add New Type</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="typeName">Type Name:</label>
          <input v-model="typeName" id="typeName" type="text" required />
        </div>
        <div class="form-btns">
          <button class="submit-btn" type="submit" @click="submitForm">Add type</button>
          <button class="cancel-btn" type="button" @click="closeModal">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  isVisible: Boolean
})

const emit = defineEmits(['update:isVisible', 'postAddtypeRequest'])

const typeName = ref('')

const submitForm = () => {
  emit('postAddTypeRequest', {
    name: typeName.value
  })
  resetForm()
  emit('update:isVisible', false)
}

const resetForm = () => {
  typeName.value = ''
}

const closeModal = () => {
  emit('update:isVisible', false)
}
</script>
