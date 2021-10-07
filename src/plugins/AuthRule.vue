<template>
<!-- <div>???===={{rowData}}</div> -->
  <el-button type="text" @click="dialogTableVisible = true">弹框配置数据规则</el-button>
  <button @click="alert1">xxxx</button>
  <el-dialog v-model="dialogTableVisible" title="获取的数据">
    <!-- <p>行排序索引={{this.rowData[0].$index}}</p>
    <p>数据={{this.rowData[0].row}}</p>
    <p>数据标识={{this.rowData[0]._self.props.currentRowKey}}</p> -->
    <p>数据标识={{this.currentRowKey}}</p>

<el-table :data="rowData">
      <el-table-column
        property="row.id"
        label="id"
        width="150"
      ></el-table-column>
      <el-table-column property="row.address" label="address" width="200"></el-table-column>
    </el-table>

  </el-dialog>

</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'//, reactive, toRefs

export default defineComponent({
  props: {
    // modelValue: any,
    rowData: Object,
    currentRowKey: String
  },
  // props: ['modelValue'],
  // emits: ['update:modelValue'],
  created () {
    console.log('传递的数据created=', this.rowData)
  },
  mounted () {
    console.log('传递的数据=', this.rowData)
  },
  methods: {
    alert1 (event) {
      // debugger
      console.log(event)
      window.alert(JSON.stringify(this.rowData[0].row))
    }
  },
  setup (props) {
    const state = reactive({
      gridData: [
        {
          date: '2016-05-02',
          name: 'John Smith',
          address: 'No.1518,  Jinshajiang Road, Putuo District'
        }

      ],
      dialogTableVisible: false
    })

    return {
      ...toRefs(state)
    }
  }
})
</script>
