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
      <h2>Add New Item</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="itemName">Item Name:</label>
          <input v-model="itemName" id="itemName" type="text" required />
        </div>
        <div class="form-group">
          <label for="itemType">Item SubType:</label>
          <select id="itemType" v-model="itemType" required>
            <option v-for="type in types" :key="type.id" :value="type.id">{{ type.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="itemQuantity">Quantity:</label>
          <input v-model.number="itemQuantity" id="itemQuantity" type="number" min="1" required />
        </div>
        <div class="form-group">
          <label for="itemDate">Expire Date:</label>
          <input v-model="itemDate" id="itemDate" type="date" required />
        </div>
        <div class="form-btns">
          <button class="submit-btn" type="submit" @click="submitForm">Add Item</button>
          <button class="cancel-btn" type="button" @click="closeModal">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  isVisible: Boolean,
  types: Array
})

const emit = defineEmits(['update:isVisible', 'postAddItemRequest'])

const itemName = ref('')
const itemQuantity = ref(1)
const itemDate = ref('')
const itemType = ref(0)

const submitForm = () => {
  emit('postAddItemRequest', {
    name: itemName.value,
    sub_type_id: itemType.value,
    quantity: itemQuantity.value,
    expiryDate: itemDate.value
  })
  resetForm()
  emit('update:isVisible', false)
}

const resetForm = () => {
  itemName.value = ''
  itemQuantity.value = 1
  itemType.value = ''
  itemDate.value = ''
}

const closeModal = () => {
  emit('update:isVisible', false)
}
</script>
