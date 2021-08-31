<template lang="">
  <div class="common_body">
    <CreatCard />
  </div>
</template>
<script>
import { ref, computed } from 'vue'
import CreatCard from '@/components/CreatCard.vue'

export default {
  components: { CreatCard },
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

    // 卡牌种类
    const cardType = ref('0')
    return {
      title,
      titleList,
      searchTitle,
      name,
      nameList,
      searchName,
      cardTitle,
      cardName,
      cardType,
    }
  },
}
</script>
<style lang=""></style>
