<style scoped>
@import url(../assets/tableView.css);
</style>
<template>
  <div class="container">
    <!-- Notification -->
    <div v-if="notificationMessage" :class="['notification', notificationType]">
      {{ notificationMessage }}
    </div>
    <!-- Table -->
    <div class="table-container">
      <!-- Display Table -->
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" v-model="selectAll"></th>
            <th>Subtype</th>
            <th>Belong to</th>
            <th># of Items</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="subtype in subTypes" :key="subtype.id" :class="{ focused: focusStatus === subtype.id }">
            <td><input type="checkbox" v-model="selectedIds" :value="subtype.id"></td>
            <td @click="beforeUpdate(subtype.id, 'name')">
              <input type="text" v-model="subtype.name" @blur="update(subtype.id, 'name', subtype.name)" />
            </td>
            <td @click="beforeUpdate(subtype.id, 'type_id')">
              <select v-model="subtype.type_id" @change="update(subtype.id, 'type_id', $event.target.value)">
                <option v-for="type in types" :value="type.id" :key="type.id">
                  {{ type.name }}
                </option>
              </select>
            </td>
            <td>{{ subtype.sumItemsQuantity }}</td>
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
    <!-- Add Item Modal -->
    <AddSubTypeModal v-model:isVisible="isModalVisible" :types="types" :subTypes="subTypes"
      @postAddSubTypeRequest="postAddSubTypeRequest">
    </AddSubTypeModal>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { subTypeService, typeService } from '@/services/api.js'
import AddSubTypeModal from '@/components/AddSubTypeModal.vue';

// get data
const subTypes = ref([])
const types = ref([])

const getSubTypes = async () => {
  subTypes.value = await subTypeService.getSubTypesWithCount()
  // console.log('fetched subtypes', subTypes.value)
}

const getTypes = async () => {
  types.value = await typeService.getTypesWithCount()
  // console.log('types', types.value)
}

// updates
let oldValue
const focusStatus = ref('') // td focus styles

const beforeUpdate = (id, field) => {
  console.log('id is ', id, 'field is ', field)
  oldValue = subtypes.value.filter((type) => type.id === id)[0][field]
  console.log('old Value is ', oldValue)
  focusStatus.value = id
}

const update = async (id, field, newValue) => {
  console.log('in update')
  if (oldValue != newValue) {
    console.log('invoke api')
    const status = await subTypeService.updateSubType(id, {
      [field]: newValue
    })

    // update current list
    getSubTypes()

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

//create
const isModalVisible = ref(false)

// Methods to handle button actions
const clickAddBtn = () => {
  isModalVisible.value = true
}

const postAddSubTypeRequest = async (subType) => {
  // console.log(subType)
  const status = await subTypeService.createSubType(subType)
  // update current page's data immediately
  getSubTypes()

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
    selectedIds.value = subTypes.value.map((i) => i.id)
  } else {
    selectedIds.value = []
  }
})
// Computed property to check if there are selected items
const hasSelected = computed(() => selectedIds.value.length > 0)

const remove = async () => {
  const ids = selectedIds.value
  console.log('selected id', selectedIds.value)
  console.log('ids', ids)
  const status = await subTypeService.deleteSubTypes(ids)

  // update current page's data immediately
  getSubTypes()
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
  getSubTypes(), getTypes()
})
</script>
