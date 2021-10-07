<template>
  <div>
    <div class="pb20" v-show="step === 1">
      <h2 class="tc mb20">选择作品出处</h2>
      <div class="tc">
        <AutoComplete
          forceSelection
          v-model="titleObj"
          :suggestions="titleList"
          @complete="searchTitle($event)"
          @item-select="autoCompleteSelect"
          placeholder="输入关键词"
          field="title"
        >
          <template #item="slotProps">
            <div v-if="slotProps.item._id === '-1'">
              {{ `点击创建"${slotProps.item.title}"` }}
            </div>
            <div v-else>{{ `${slotProps.item.title}` }}</div>
          </template>
        </AutoComplete>
      </div>
    </div>
    <div class="pb20" v-show="step === 2">
      <h2 class="tc mb20">选择角色名</h2>
      <div class="tc">
        <AutoComplete
          forceSelection
          v-model="nameObj"
          :suggestions="nameList"
          @complete="searchName($event)"
          @item-select="autoCompleteSelect"
          placeholder="输入关键词"
          field="name"
        >
          <template #item="slotProps">
            <div v-if="slotProps.item._id === '-1'">
              {{ `点击创建"${slotProps.item.name}"` }}
            </div>
            <div v-else>{{ `${slotProps.item.name}` }}</div>
          </template>
        </AutoComplete>
      </div>
    </div>
    <div class="mb20" v-show="step === 3">
      <h2 class="tc mb20">属性设置</h2>
      <div class="p-grid creat-card-status-body">
        <div class="p-col-12 p-lg-6">
          <div class="tc">
            <div class="creat-card-canvas">
              <Card
                :title="cardShortTitle"
                :star="star"
                :name="cardShortName"
                :cry="cry"
                :leftType="leftType"
                :rightType="rightType"
                @title-change="onTitleChange"
                @name-change="onNameChange"
                :key="cardKey"
              />
            </div>

            <div class="tc pt10 creat-card-star-input auto-number-input">
              <div class="p-grid p-ai-center">
                <div class="p-col-fixed creat-card-input-form-label">
                  星级调整：
                </div>
                <div class="p-col">
                  <InputNumber
                    v-model.number="star"
                    showButtons
                    buttonLayout="horizontal"
                    :step="1"
                    incrementButtonIcon="pi pi-plus"
                    decrementButtonIcon="pi pi-minus"
                    :min="1"
                    :max="6"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="p-col-12 p-lg-6 creat-card-input-form-body">
          <div class="p-fluid">
            <div class="p-field">
              <div class="p-grid p-ai-center">
                <div class="p-col-fixed creat-card-input-form-label">
                  出自作品：
                </div>
                <div class="p-col">{{ cardTitle }}</div>
              </div>
            </div>
          </div>
          <div class="p-fluid">
            <div class="p-field">
              <div class="p-grid p-ai-center">
                <div class="p-col-fixed creat-card-input-form-label">
                  显示作品：
                </div>
                <div class="p-col">
                  <InputText
                    type="text"
                    v-model="cardShortTitleInput"
                    :disabled="cardTitleId !== '-1'"
                    placeholder="会显示在卡牌中"
                    @input="cardShortTitleInputChange"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="p-fluid">
            <div class="p-field">
              <div class="p-grid p-ai-center">
                <div class="p-col-fixed creat-card-input-form-label">
                  作品别名：
                </div>
                <div class="p-col">
                  <Tag
                    class="p-mr-2"
                    value="Primary"
                    v-for="(item, index) in cardTitleOtherName"
                    :key="index"
                    >{{ item
                    }}<i
                      v-if="newTitleList.indexOf(item) !== -1"
                      class="pi pi-times pl5 creat-card-input-tag-close"
                      @click="deleteNewTitleList(item)"
                    ></i></Tag
                  ><InputText
                    type="text"
                    v-model="newTitleInpt"
                    class="creat-card-input-tag-input"
                    placeholder="输入别名"
                    @keypress.enter="addNewTitle"
                  /><Button
                    icon="pi pi-pencil"
                    class="creat-card-input-tag-input-btn"
                    @click="addNewTitle"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="p-fluid">
            <div class="p-field">
              <div class="p-grid p-ai-center">
                <div class="p-col-fixed creat-card-input-form-label">
                  角色名字：
                </div>
                <div class="p-col">{{ cardName }}</div>
              </div>
            </div>
          </div>
          <div class="p-fluid">
            <div class="p-field">
              <div class="p-grid p-ai-center">
                <div class="p-col-fixed creat-card-input-form-label">
                  显示名字：
                </div>
                <div class="p-col">
                  <InputText
                    type="text"
                    v-model="cardShortNameInput"
                    :disabled="cardNameId !== '-1'"
                    @input="cardShortNameInputChange"
                    placeholder="会显示在卡牌中"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="p-fluid">
            <div class="p-field">
              <div class="p-grid p-ai-center">
                <div class="p-col-fixed creat-card-input-form-label">
                  角色别名：
                </div>
                <div class="p-col">
                  <Tag
                    class="p-mr-2"
                    value="Primary"
                    v-for="(item, index) in cardNameOtherName"
                    :key="index"
                    >{{ item
                    }}<i
                      v-if="newNameList.indexOf(item) !== -1"
                      class="pi pi-times pl5 creat-card-input-tag-close"
                      @click="deleteNewNameList(item)"
                    ></i></Tag
                  ><InputText
                    type="text"
                    v-model="newNameInpt"
                    class="creat-card-input-tag-input"
                    placeholder="输入别名"
                    @keypress.enter="addNewName"
                  /><Button
                    icon="pi pi-pencil"
                    class="creat-card-input-tag-input-btn"
                    @click="addNewName"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="p-fluid">
            <div class="p-field">
              <div class="p-grid p-ai-center">
                <div class="p-col-fixed creat-card-input-form-label">
                  水晶属性：
                </div>
                <div class="p-col">
                  <Dropdown
                    v-model="cry"
                    :options="cryList"
                    optionLabel="label"
                    optionValue="value"
                    :filter="false"
                    :showClear="false"
                    @change="addKey"
                  >
                    <template #option="slotProps">
                      <div class="p-grid p-ai-center">
                        <div class="p-col">
                          <img
                            :src="
                              `/img/creatcard/cry/${slotProps.option.value}.png`
                            "
                            class="creat-card-input-drop-img"
                          />
                        </div>
                        <div class="p-col">
                          <div>{{ slotProps.option.label }}</div>
                        </div>
                      </div>
                    </template>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
          <div class="p-fluid">
            <div class="p-field">
              <div class="p-grid p-ai-center">
                <div class="p-col-fixed creat-card-input-form-label">
                  卡牌类型：
                </div>
                <div class="p-col">
                  <Dropdown
                    v-model="leftType"
                    :options="leftTypeList"
                    optionLabel="label"
                    optionValue="value"
                    :filter="false"
                    :showClear="false"
                    @change="addKey"
                  >
                    <template #option="slotProps">
                      <div class="p-grid p-ai-center">
                        <div class="p-col">
                          <img
                            :src="
                              `/img/creatcard/leftType/${slotProps.option.value}.png`
                            "
                            class="creat-card-input-drop-img"
                          />
                        </div>
                        <div class="p-col">
                          <div>{{ slotProps.option.label }}</div>
                        </div>
                      </div>
                    </template>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
          <div class="p-fluid">
            <div class="p-field">
              <div class="p-grid p-ai-center">
                <div class="p-col-fixed creat-card-input-form-label">
                  主动技能：
                </div>
                <div class="p-col">
                  <Dropdown
                    v-model="rightType"
                    :options="rightTypeList"
                    optionLabel="label"
                    optionValue="value"
                    :filter="false"
                    :showClear="false"
                    @change="addKey"
                  >
                    <template #option="slotProps">
                      <div class="p-grid p-ai-center">
                        <div class="p-col">
                          <img
                            :src="
                              `/img/creatcard/rightType/${slotProps.option.value}.png`
                            "
                            class="creat-card-input-drop-img"
                          />
                        </div>
                        <div class="p-col">
                          <div>{{ slotProps.option.label }}</div>
                        </div>
                      </div>
                    </template>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pb20" v-show="step === 4">
      <h2 class="tc mb20">选择卡牌种类</h2>
      <div class="tc">
        <div class="dib mr10">
          <RadioButton
            id="1card"
            name="cardType"
            value="0"
            v-model="cardType"
          />
          <label for="1card">单立绘卡</label>
        </div>
        <div class="dib">
          <RadioButton
            id="6card"
            name="cardType"
            value="1"
            v-model="cardType"
          />
          <label for="6card">多立绘卡</label>
        </div>
      </div>
    </div>
    <div class="pb20" v-show="step === 6 || step === 5">
      <h2 class="tc mb20">编辑立绘</h2>
      <div class="tc">
        <FileUpload
          :customUpload="true"
          :multiple="false"
          accept="image/*"
          mode="basic"
          :auto="true"
          ref="cardSingleUploder"
          chooseLabel="选择文件"
          @uploader="(event) => uploadCG(event, -1)"
          v-if="cardType === '0'"
        />
      </div>
      <div class="tc">
        <div
          class="dib card-creat-preview-item"
          v-for="(item, index) in CGList"
          :key="index"
        >
          <Card
            :title="cardShortTitle"
            :star="index + 1"
            :name="cardShortName"
            :cry="cry"
            :leftType="leftType"
            :rightType="rightType"
            :CG="item"
            :key="cardKey"
          />
          <div class="mt10 mb10 tc">
            <FileUpload
              :customUpload="true"
              :multiple="false"
              accept="image/*"
              mode="basic"
              :auto="true"
              chooseLabel="选择文件"
              :ref="cardUploaderRef"
              @uploader="(event) => uploadCG(event, index)"
              v-show="cardType === '1'"
            />
          </div>
        </div>
      </div>
      <CardCGEditor
        :imageObj="imageObj"
        :imageUrl="imageUrl"
        :titleS="cardShortTitle"
        :star="selStar"
        :nameS="cardShortName"
        :cry="cry"
        :leftType="leftType"
        :rightType="rightType"
        @image="onGetImage"
        ref="CardCGEditorCOM"
      />
    </div>
    <div class="pb20" v-show="step === 6">
      <h2 class="tc mb20">是否与以下立绘有重复</h2>
    </div>
    <div class="pb20" v-show="step === 7">
      <h2 class="tc mb20">选择卡包</h2>
      <div class="tc">
        <MultiSelect
          v-model="selCardPackage"
          :options="packageList"
          optionLabel="name"
          optionValue="_id"
          placeholder="选择卡包"
        />
      </div>
    </div>
    <div class="tc pb20">
      <Button class="p-button-secondary" @click="preStep" v-show="step !== 1"
        >上一步</Button
      ><span class="pr10"></span><Button @click="nextStep">下一步</Button>
    </div>
  </div>
</template>
<script>
import { ref, computed, watch, nextTick } from 'vue'
import Card from '@/components/Card.vue'
import CardCGEditor from '@/components/CardCGEditor.vue'
import { useToast } from 'primevue/usetoast'

export default {
  components: {
    Card,
    CardCGEditor,
  },
  setup() {
    const toast = useToast()
    const star = ref(1)
    watch(star, (val) => {
      if (val >= 1 && val <= 6) {
        cardKey.value++
      }
    })
    const cardKey = ref(0)
    // 作品名
    const titleObj = ref()
    const titleList = ref()
    const searchTitle = (event) => {
      titleList.value = [
        {
          title: '东方Project',
          short: '东方',
          otherName: ['车万', '东方别名'],
          _id: '1',
        },
      ]
      const creatTitleContent = {
        title: `${event.query}`,
        query: event.query,
        short: event.query,
        otherName: [],
        _id: '-1',
      }
      titleList.value.push(creatTitleContent)
    }
    // 角色名
    const nameObj = ref()
    const nameList = ref()
    const searchName = (event) => {
      nameList.value = [
        {
          name: '蕾米莉亚·斯卡蕾特',
          short: '蕾米莉亚',
          otherName: ['蕾咪', '斯卡蕾特'],
          _id: '1',
        },
      ]
      const creatNameContent = {
        name: `${event.query}`,
        query: event.query,
        short: event.query,
        otherName: [],
        _id: '-1',
      }
      nameList.value.push(creatNameContent)
    }

    const cardTitle = computed(() => {
      const titleType = typeof titleObj.value
      if (titleType === 'object' && titleObj.value) {
        const id = titleObj.value._id
        if (id === '-1') {
          return titleObj.value.query
        } else {
          return titleObj.value.title
        }
      }
      return ''
    })
    const cardTitleOtherName = computed(() => {
      const titleType = typeof titleObj.value
      if (titleType === 'object' && titleObj.value) {
        return titleObj.value.otherName
      }
      return []
    })
    const cardTitleId = computed(() => {
      const titleType = typeof titleObj.value
      if (titleType === 'object' && titleObj.value) {
        const id = titleObj.value._id
        return id
      }
      return ''
    })
    const cardShortTitle = computed(() => {
      const titleType = typeof titleObj.value
      if (titleType === 'object' && titleObj.value) {
        return titleObj.value.short
      }
      return ''
    })
    const cardName = computed(() => {
      const nameType = typeof nameObj.value
      if (nameType === 'object' && nameObj.value) {
        const id = nameObj.value._id
        if (id === '-1') {
          return nameObj.value.query
        } else {
          return nameObj.value.name
        }
      }
      return ''
    })
    const cardNameOtherName = computed(() => {
      const nameType = typeof nameObj.value
      if (nameType === 'object' && nameObj.value) {
        return nameObj.value.otherName
      }
      return []
    })
    const cardNameId = computed(() => {
      const nameType = typeof nameObj.value
      if (nameType === 'object' && nameObj.value) {
        const id = nameObj.value._id
        return id
      }
      return ''
    })
    const cardShortName = computed(() => {
      const nameType = typeof nameObj.value
      if (nameType === 'object' && nameObj.value) {
        return nameObj.value.short
      }
      return ''
    })

    const autoCompleteSelect = () => {
      cardShortTitleInput.value = cardShortTitle.value
      cardShortNameInput.value = cardShortName.value
      newTitleList.value = []
      cardKey.value++
    }

    // 简称
    const cardShortTitleInput = ref('')
    const cardShortNameInput = ref('')
    let cardShortTitleInputChangeTimer = null
    const cardShortTitleInputChange = () => {
      clearTimeout(cardShortTitleInputChangeTimer)
      cardShortTitleInputChangeTimer = setTimeout(() => {
        titleObj.value.short = cardShortTitleInput.value
        cardKey.value++
      }, 300)
    }
    let cardShortNameInputChangeTimer = null
    const cardShortNameInputChange = () => {
      clearTimeout(cardShortNameInputChangeTimer)
      cardShortNameInputChangeTimer = setTimeout(() => {
        nameObj.value.short = cardShortNameInput.value
        cardKey.value++
      }, 300)
    }

    // 标签
    const newTitleInpt = ref('')
    const newTitleList = ref([])
    const addNewTitle = () => {
      if (newTitleInpt.value) {
        if (titleObj.value.otherName.indexOf(newTitleInpt.value) !== -1) {
          toast.add({
            severity: 'error',
            summary: '错误',
            detail: '别名不能重复',
            life: 3000,
          })
          return false
        }
        newTitleList.value.push(newTitleInpt.value)
        titleObj.value.otherName.push(newTitleInpt.value)
        newTitleInpt.value = ''
      }
    }
    const deleteNewTitleList = (item) => {
      newTitleList.value = newTitleList.value.filter((el) => {
        return el !== item
      })
      titleObj.value.otherName = titleObj.value.otherName.filter((el) => {
        return el !== item
      })
    }

    const newNameInpt = ref('')
    const newNameList = ref([])
    const addNewName = () => {
      if (newNameInpt.value) {
        if (nameObj.value.otherName.indexOf(newNameInpt.value) !== -1) {
          toast.add({
            severity: 'error',
            summary: '错误',
            detail: '别名不能重复',
            life: 3000,
          })
          return false
        }
        newNameList.value.push(newNameInpt.value)
        nameObj.value.otherName.push(newNameInpt.value)
        newNameInpt.value = ''
      }
    }
    const deleteNewNameList = (item) => {
      newNameList.value = newNameList.value.filter((el) => {
        return el !== item
      })
      nameObj.value.otherName = nameObj.value.otherName.filter((el) => {
        return el !== item
      })
    }
    // 水晶属性
    const cry = ref('1')
    const cryList = [
      {
        label: '火红',
        value: '1',
      },
      {
        label: '蓝水',
        value: '2',
      },
      {
        label: '绿叶',
        value: '3',
      },
      {
        label: '光明',
        value: '4',
      },
      {
        label: '暗黑',
        value: '5',
      },
    ]

    // 角色定位
    const leftType = ref('1')
    const leftTypeList = [
      {
        label: '输出',
        value: '1',
      },
      {
        label: '防御',
        value: '2',
      },
      {
        label: '敏捷',
        value: '3',
      },
    ]
    // 终极技能
    const rightType = ref('1')
    const rightTypeList = [
      {
        label: '攻',
        value: '1',
      },
      {
        label: '硕',
        value: '2',
      },
      {
        label: '支',
        value: '3',
      },
    ]

    let titleDrawInfo = {}
    let nameDrawInfo = {}
    const onTitleChange = (res) => {
      titleDrawInfo = res
    }
    const onNameChange = (res) => {
      nameDrawInfo = res
    }

    const addKey = () => {
      cardKey.value++
    }

    // 卡牌种类
    const cardType = ref('0')
    // 编辑立绘
    const cardSingleUploder = ref(null)
    const cardUploader = ref([])
    const cardUploaderRef = (el) => {
      cardUploader.value.push(el)
    }
    const CGList = ref(['', '', '', '', '', ''])
    const imageUrl = ref(null)
    const imageObj = ref(null)
    const selStar = ref(1)

    const uploadCG = (event, index) => {
      console.log(event, index)
      const file = event.files[0]
      imageUrl.value = URL.createObjectURL(file)
      imageObj.value = new Image()
      imageObj.value.src = imageUrl.value
      if (index >= 0) {
        selStar.value = index + 1
      } else {
        selStar.value = 1
      }
      imageObj.value.onload = () => {
        const w = imageObj.value.width
        const h = imageObj.value.height
        if (w < 396 || h < 556) {
          toast.add({
            severity: 'error',
            summary: '错误',
            detail:
              '选择的立绘尺寸过小，请重新选择！立绘宽度不能小于396px，高度不能小于556px！',
            life: 3000,
          })
        } else {
          CardCGEditorCOM.value.openDialog()
        }
      }
      if (index >= 0) {
        cardUploader.value[index].clear()
      } else {
        cardSingleUploder.value.clear()
      }
    }
    const CardCGEditorCOM = ref(null)

    const onGetImage = (uploadCardUrl, star) => {
      console.log(uploadCardUrl, star)
      if (cardType.value === '0') {
        for (let i = 0; i < CGList.value.length; i++) {
          CGList.value[i] = uploadCardUrl
        }
      } else {
        CGList.value[star - 1] = uploadCardUrl
      }
      addKey()
    }

    const selCardPackage = ref([])
    const packageList = ref([
      {
        _id: '1',
        name: '东方卡包',
      },
      {
        _id: '2',
        name: '萝莉卡包',
      },
    ])
    const step = ref(1)
    const checkNextStep = () => {
      let checkRes = true
      switch (step.value) {
        case 1:
          if (!cardTitle.value) {
            toast.add({
              severity: 'error',
              summary: '错误',
              detail: '请设置作品出处',
              life: 3000,
            })
            checkRes = false
          }
          break

        case 2:
          if (!cardName.value) {
            toast.add({
              severity: 'error',
              summary: '错误',
              detail: '请设置角色名',
              life: 3000,
            })
            checkRes = false
          }
          break

        case 3:
          if (!cardShortTitleInput.value) {
            toast.add({
              severity: 'error',
              summary: '错误',
              detail: '请设置显示作品',
              life: 3000,
            })
            checkRes = false
          }
          if (!cardShortNameInput.value) {
            toast.add({
              severity: 'error',
              summary: '错误',
              detail: '请设置显示名字',
              life: 3000,
            })
            checkRes = false
          }
          if (titleDrawInfo.width > 126) {
            toast.add({
              severity: 'error',
              summary: '错误',
              detail: '显示作品长度过大',
              life: 3000,
            })
            checkRes = false
          }
          if (nameDrawInfo.width > 328) {
            toast.add({
              severity: 'error',
              summary: '错误',
              detail: '显示名字长度过大',
              life: 3000,
            })
            checkRes = false
          }
          break

        case 5:
          for (let i = 0; i < CGList.value.length; i++) {
            const CGURL = CGList.value[i]
            if (!CGURL) {
              toast.add({
                severity: 'error',
                summary: '错误',
                detail: '请设置立绘',
                life: 3000,
              })
              checkRes = false
              break
            }
          }
          break

        case 7:
          if (selCardPackage.value.length === 0) {
            toast.add({
              severity: 'error',
              summary: '错误',
              detail: '请设置卡包',
              life: 3000,
            })
            checkRes = false
          }
          break

        default:
          break
      }
      return checkRes
    }
    const preStep = () => {
      step.value--
    }
    const nextStep = () => {
      nextTick(() => {
        const res = checkNextStep()
        if (res) {
          step.value++
        }
      })
    }
    return {
      nextStep,
      preStep,
      step,
      selCardPackage,
      packageList,
      titleObj,
      titleList,
      searchTitle,
      nameObj,
      nameList,
      searchName,
      cardTitle,
      cardName,
      cardType,
      cardKey,
      autoCompleteSelect,
      cardShortTitle,
      cardShortName,
      star,
      cardTitleId,
      cardNameId,
      cardShortTitleInput,
      cardShortNameInput,
      cardShortTitleInputChange,
      cardShortNameInputChange,
      cardTitleOtherName,
      cardNameOtherName,
      newTitleInpt,
      addNewTitle,
      newTitleList,
      deleteNewTitleList,
      newNameInpt,
      newNameList,
      addNewName,
      deleteNewNameList,
      cry,
      cryList,
      addKey,
      leftType,
      leftTypeList,
      rightType,
      rightTypeList,
      CGList,
      uploadCG,
      CardCGEditorCOM,
      cardUploaderRef,
      cardSingleUploder,
      imageObj,
      imageUrl,
      selStar,
      onGetImage,
      onTitleChange,
      onNameChange,
    }
  },
}
</script>
<style scoped>
.card-creat-preview-item {
  width: 33.3333%;
  box-sizing: border-box;
  padding: 15px;
  max-width: 396px;
  min-width: 200px;
}
.creat-card-canvas {
  width: 100%;
  max-width: 396px;
  height: auto;
  margin: 0 auto;
}
.creat-card-input-form-body {
  font-size: 16px;
}
.creat-card-input-form-label {
  width: 100px;
}
.creat-card-input-form-body .p-grid {
  min-height: 49px;
}
.creat-card-input-tag-input {
  width: 80px;
  height: 23px;
  padding: 0 26px 0 2px;
  font-size: 12px;
  line-height: 23px;
}
.creat-card-input-tag-input-btn {
  width: 23px;
  height: 23px;
  padding: 0 2px;
  margin-left: -24px;
}
.creat-card-input-tag-close {
  cursor: pointer;
  font-size: 12px;
}
.creat-card-input-drop-img {
  width: 25px;
  height: 25px;
}
.creat-card-star-input {
  width: 230px;
  margin: 0 auto;
}
@media screen and (max-width: 991px) {
  .creat-card-status-body {
    flex-direction: column-reverse;
  }
}
@media screen and (max-width: 642px) {
  .card-creat-preview-item {
    width: 100%;
  }
}
</style>
<style>
.creat-card-star-input .p-inputtext {
  text-align: center;
}
</style>
