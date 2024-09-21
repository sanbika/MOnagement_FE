<style scoped>
@import url(../assets/tableView.css);
</style>
<template>
  <div class="container">
    <div class="table-container">
      <!-- Notification -->
      <div v-if="notificationMessage" :class="['notification', notificationType]">
        {{ notificationMessage }}
      </div>
      <!-- Display Table -->
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" v-model="selectAll"></th>
            <th>Type</th>
            <th># of Subtypes</th>
            <th># of Items</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="type in types" :key="type.id" :class="{ focused: focusStatus === type.id }">
            <td><input type="checkbox" :value="type.id" v-model="selectedIds"></td>
            <td @click="beforeUpdate(type.id, 'name')">
              <input type="text" v-model="type.name" @blur="update(type.id, 'name', type.name)" />
            </td>
            <td>{{ type.sumSubTypesQuantity }}</td>
            <td>{{ type.sumItemsQuantity }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Buttons -->
    <div class="buttons">
      <button class="remove-btn" @click="remove" v-if="hasSelected">
        <i class="bi bi-trash-fill"></i>
      </button>
      <button class="add-btn" @click="clickAddBtn"><i class="bi bi-plus"></i></button>
    </div>
    <!-- Add Type Modal -->
    <AddTypeModal v-model:isVisible="isModalVisible" @postAddTypeRequest="postAddTypeRequest">
    </AddTypeModal>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { typeService } from '@/services/api.js'
import AddTypeModal from '@/components/AddTypeModal.vue'

// get data
const types = ref([])

const getTypes = async () => {
  types.value = await typeService.getTypesWithCount()
  // console.log(types.value)
}

// updates
let oldValue
const focusStatus = ref('') // td focus styles

const beforeUpdate = (id, field) => {
  oldValue = types.value.filter((type) => type.id === id)[0][field]
  focusStatus.value = id
}

const update = async (id, field, newValue) => {
  if (oldValue != newValue) {
    const status = await typeService.updateType(id, {
      [field]: newValue
    })

    // update current list
    getTypes()

    // show notification
    if (status === 200) {
      showNotification('success', `${field} update successfully`)
    } else {
      showNotification('fail', `failed to update ${field}`)
    }
  }
  // reset tr style
  focusStatus.value = null
}

// notification
const notificationMessage = ref('')
const notificationType = ref('') // 'success' or 'fail'

const showNotification = (status, message) => {
  notificationMessage.value = message
  notificationType.value = status

  // Hide notification after 2 seconds
  setTimeout(() => {
    notificationMessage.value = ''
    notificationType.value = ''
  }, 2000)
}

// create
const isModalVisible = ref(false)

// Methods to handle button actions
const clickAddBtn = () => {
  isModalVisible.value = true
}

const postAddTypeRequest = async (type) => {
  const status = await typeService.createType(type)
  // update current page's data immediately
  getTypes()

  // show notification
  if (status === 200) {
    showNotification('success', 'created successfully')
  } else {
    showNotification('fail', 'failed to create')
  }
}

//delete
const selectedIds = ref([]) // selected checkboxes
const selectAll = ref(false)

// process toggleAll when checkbox on table head is changed
watch(selectAll, (value) => {
  if (value) {
    selectedIds.value = types.value.map((i) => i.id)
  } else {
    selectedIds.value = []
  }
})
// Computed property to check if there are selected items
const hasSelected = computed(() => selectedIds.value.length > 0)

const remove = async () => {
  const ids = selectedIds.value
  const status = await typeService.deleteTypes(ids)

  // update current page's data immediately
  getTypes()
  selectedIds.value = []

  // show notification
  if (status === 200) {
    showNotification('success', 'removed successfully')
  } else {
    showNotification('fail', 'failed to remove')
  }
}


// mounted
onMounted(() => {
  getTypes()
})
</script>
