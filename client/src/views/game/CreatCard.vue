<template lang="">
  <div class="common_body">
    <div class="pb20">
      <h2 class="tc mb20">选择作品出处</h2>
      <div class="tc">
        <AutoComplete
          forceSelection
          v-model="title"
          :suggestions="titleList"
          @complete="searchTitle($event)"
          field="title"
        />
      </div>
    </div>
    <div class="pb20">
      <h2 class="tc mb20">选择角色名</h2>
      <div class="tc">
        <AutoComplete
          forceSelection
          v-model="name"
          :suggestions="nameList"
          @complete="searchName($event)"
          field="name"
        />
      </div>
    </div>
    <div>
      <div class="p-grid">
        <div class="p-col-12 p-lg-8">A</div>
        <div class="p-col-12 p-lg-4">
          <div class="p-fluid">
            <div class="p-field">
              <h5 class="mb5">出自作品：{{ cardTitle }}</h5>
            </div>
          </div>
          <div class="p-fluid">
            <div class="p-field">
              <h5 class="mb5">名字：{{ cardName }}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AutoComplete from 'primevue/autocomplete'
import { ref, computed } from 'vue'
export default {
  components: { AutoComplete },
  setup() {
    // 作品名
    const title = ref()
    const titleList = ref()
    const searchTitle = (event) => {
      titleList.value = [
        {
          title: '东方Project',
          _id: '1',
        },
      ]
      const creatTitleContent = {
        title: `创建"${event.query}"`,
        query: event.query,
        _id: '-1',
      }
      titleList.value.push(creatTitleContent)
    }
    // 角色名
    const name = ref()
    const nameList = ref()
    const searchName = (event) => {
      nameList.value = [
        {
          name: '蕾米莉亚',
          _id: '1',
        },
      ]
      const creatNameContent = {
        name: `创建"${event.query}"`,
        query: event.query,
        _id: '-1',
      }
      nameList.value.push(creatNameContent)
    }

    const cardTitle = computed(() => {
      const titleType = typeof title.value
      if (titleType === 'object' && title.value) {
        const id = title.value._id
        if (id === '-1') {
          return title.value.query
        } else {
          return title.value.title
        }
      }
      return ''
    })
    const cardName = computed(() => {
      const nameType = typeof name.value
      if (nameType === 'object' && name.value) {
        const id = name.value._id
        if (id === '-1') {
          return name.value.query
        } else {
          return name.value.name
        }
      }
      return ''
    })
    return {
      title,
      titleList,
      searchTitle,
      name,
      nameList,
      searchName,
      cardTitle,
      cardName,
    }
  },
}
</script>
<style lang=""></style>
