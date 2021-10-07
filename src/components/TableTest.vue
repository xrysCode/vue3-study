<template>
  <el-table :data="tableData" current-row-key="id" style="width: 100%">
    <el-table-column fixed prop="date" label="Date" width="150" />
    <el-table-column prop="name" label="Name" width="120" />
    <el-table-column prop="state" label="State" width="120" />
    <el-table-column prop="city" label="City" width="120" />
    <el-table-column prop="address" label="Address" width="600" />
    <el-table-column prop="zip" label="Zip" width="120" />
    <el-table-column fixed="right" label="Operations" width="120">
      <template #default>
        <el-button type="text" size="small" @click="handleClick">Detail</el-button>
        <el-button type="text" size="small">Edit</el-button>
        <!-- <el-button type="text" size="small">Edit</el-button>???????? -->
      </template>
    </el-table-column>
  </el-table>

</template>

<script lang="ts">
export default {
  data () {
    return {
      tableData: [
        {
          id: 10,
          date: '2016-05-03',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036',
          tag: 'Home'
        },
        {
          id: 20,
          date: '2016-05-02',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036',
          tag: 'Office'
        }
      ]
    }
  },
  methods: {
    handleClick () {
      console.log('click')
    }
  }
}
</script>
