<style scoped>
@import url(../assets/tableView.css);
</style>

<template>
  <div class="container">
    <!-- Display Table -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" v-model="selectAll" /></th>
            <th v-for="head in heads" :key="head">{{ head }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id" :class="{ focused: focusId === row.id }">
            <td><input type="checkbox" :value="row.id" v-model="selectedIds" /></td>
            <td
              v-for="(head, headIndex) in heads"
              :key="headIndex"
              @click="beforeUpdate(row.id, head)"
            >
              <!-- Editable check -->
              <template v-if="editableHeads.includes(head)">
                <!-- Check input type -->
                <!-- text -->
                <input
                  v-if="headConfig[head] === 'text'"
                  v-model="row[fieldMap[head]]"
                  type="text"
                  @blur="emitUpdate(row.id, fieldMap[head], row[fieldMap[head]])"
                />
                <!-- select -->
                <select
                  ref="selectTag"
                  v-else-if="headConfig[head] === 'select'"
                  :value="row[fieldMap[head]].id"
                  v-model="row[fieldMap[head]].id"
                  @blur="emitUpdate(row.id, fieldMap[head], $event.target.value)"
                >
                  <option v-for="option in options" :key="option.id" :value="option.id">
                    {{ option.name }}
                  </option>
                </select>
                <!-- date -->
                <input
                  ref="dateTag"
                  v-if="headConfig[head] == 'date'"
                  v-model="row[fieldMap[head]]"
                  type="date"
                  @blur="emitUpdate(row.id, fieldMap[head], $event.target.value)"
                />
                <!-- number -->
                <input
                  v-if="headConfig[head] === 'number'"
                  v-model="row[fieldMap[head]]"
                  type="number"
                  @blur="emitUpdate(row.id, fieldMap[head], $event.target.value)"
                />
              </template>
              <span v-else>{{ row[fieldMap[head]] }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Buttons -->
    <div class="buttons">
      <button class="remove-btn" @click="emitDelete" v-if="hasSelected">
        <i class="bi bi-trash-fill"></i>
      </button>
      <button class="add-btn" @click="emitCreate"><i class="bi bi-plus"></i></button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch, computed, isReactive } from 'vue'

const props = defineProps({
  heads: Array, // array of strings representing column headers
  rows: Array, // data for the rows
  editableHeads: Array, //array of strings representing editable columns
  headConfig: Object, // configuration for input types
  fieldMap: Object, // key: displayed head, value:exact field name in data
  options: Object // options for select fields
})

let focusId = ref(null) // current editing row
let focusFiled = ref(null) // current editing field

let oldValue // record value before update
let dateTag = ref('')
let selectTag = ref('')

const selectOpen = ref(false)

const beforeUpdate = (id, field) => {
  // if (selectOpen.value) return
  // if (Object.values(selectTag.value).includes(event.target)) selectOpen.value = true
  // console.log(isReactive(props.rows))

  //  If user click the same row and the same field many times during one focused event, only recording the old value at the first click time
  if (!focusId.value && !focusFiled.value) {
    focusId.value = id // current editing row (control (1)style; (2)oldValue recording)
    focusFiled.value = field // current editing field (control oldValue recording)

    // no need to use "props.rows.value" as rows here is "reactive" instead of "ref"
    oldValue = props.rows.filter((row) => row.id === id)[0] // corresponding row data
    oldValue = oldValue[props.fieldMap[field]] // coresponding field value of the row

    console.log('oldValue in beforeUpdate', oldValue)
    // console.log('field in beforeUpdate', field)

    // e.g. item['type'] = {id:, name:,}, but only need to pass id to api
    if (props.headConfig[field] === 'select') {
      oldValue = oldValue.id

      console.log('oldValue in beforeUpdate in select condition', oldValue)

      // nextTick is called when DOM has updated
      nextTick(() => {
        selectTag.value[0].focus()
      })
    }

    if (props.headConfig[field] === 'date') {
      // dateTag.value is an array with only 1 element (if use v-show, the array will have the same length of items list)
      // nextTick is called when DOM has updated
      nextTick(() => {
        dateTag.value[0].focus()
      })
    }
  }
}

const emit = defineEmits(['create', 'update', 'delete'])
// just pass true to parent component to let it invoke the modal
const emitCreate = () => {
  emit(`create`, true)
}

const emitUpdate = (id, field, newValue) => {
  selectOpen.value = false
  console.log('oldValue in emitUpdate', oldValue)
  console.log('newValue in emitUpdate', newValue)
  // console.log('type of oldValue', typeof oldValue)
  // console.log('type of newValue', typeof newValue)

  // only emit when the value has changed, oldValue is recorded in beforeUpdate, here uses != because the type of them is different but we only care about value
  if (oldValue != newValue) {
    // console.log('oldValue not equal to newValue, emit')
    emit(`update`, id, field, newValue)
  }

  // restore focused row and field to null
  focusId.value = null
  focusFiled.value = null
}

// process selectAll
const selectAll = ref(false)
const selectedIds = ref([])
watch(selectAll, (newValue) => {
  if (newValue) {
    selectedIds.value = props.rows.value.map((i) => i.id)
  } else {
    selectedIds.value = []
  }
})

// control the apperance of remove btn, if at least 1 checkbox is selected, show remove btn
const hasSelected = computed(() => selectedIds.value.length > 0)

const emitDelete = () => {
  emit(`delete`, selectedIds.value)
  selectedIds.value = []
}
</script>
