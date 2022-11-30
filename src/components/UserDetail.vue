<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>用户信息</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="$router.back()">返回</el-button>
      </div>
      <div class="text item">
        <p>姓名：{{ userList.name }}</p>
        <p>年龄：{{ userList.age }}</p>
        <p>头衔：{{ userList.position }}</p>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'UserDetail',
  data() {
    return {
      userList: []
    }
  },
  props: ['id'],
  created() {
    this.getUserDetail()
  },
  methods: {
    async getUserDetail() {
      // console.log(this.id)
      const { data: res } = await this.$http.get('/api/users/' + this.id)
      if (res.status !== 0) return this.$message.error('获取用户详情失败')
      // console.log(res)
      this.userList = res.data
    }
  }
}
</script>

<style lang="less" scoped></style>
