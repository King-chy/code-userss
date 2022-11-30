<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="dialogVisible = true">添加新用户</el-button>
    <!-- 表格展示数据 -->
    <el-table :data="userList" style="width: 100%" stripe border>
      <el-table-column type="index" label="#"> </el-table-column>
      <el-table-column prop="name" label="姓名"> </el-table-column>
      <el-table-column prop="age" label="年龄"> </el-table-column>
      <el-table-column prop="position" label="头衔"> </el-table-column>
      <el-table-column label="创建时间">
        <template #default="scope">
          {{ scope.row.addtime | dateFormat }}
          <!-- {{ dayjs(scope.row.addtime).format('YYYY-MM-DD HH:mm:ss') }} -->
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <div>
            <router-link :to="'/users/' + row.id">详情</router-link>&nbsp;
            <a href="javascript:;" @click="open(row.id)">删除--{{ row.id }}</a>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加新用户" :visible.sync="dialogVisible" width="50%" @close="onDialogClosed">
      <!--  添加用户的表单 -->
      <el-form ref="form" :model="form" :rules="formRules">
        <!-- 采集用户的姓名  -->
        <el-form-item label="用户姓名" label-width="80px" prop="name">
          <el-input v-model.trim="form.name"></el-input>
        </el-form-item>
        <el-form-item label="用户年龄" label-width="80px" prop="age">
          <el-input v-model.trim.number="form.age"></el-input>
        </el-form-item>

        <el-form-item label="头衔" label-width="80px" prop="position">
          <el-input v-model.trim="form.position"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onAddNewUser()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UserList',
  data() {
    // 年龄的自定义规则
    // value：需要校验的值
    let checkAge = (rule, value, cb) => {
      if (!Number.isInteger(value)) return cb(new Error('请填写整数！'))
      if (value < 1 || value > 120) return cb(new Error('输入值的范围在1~100之间'))
      cb()
    }
    return {
      userList: [],
      // 控制对话框的显示与隐藏
      dialogVisible: false,
      form: {
        name: '',
        age: '',
        position: ''
      },
      // 表单的验证规则对象
      formRules: {
        // trigger: 'blur':表单失去焦点就开始验证
        name: [
          { required: true, message: '姓名是必填项', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '年龄是必填项', trigger: 'blur' },
          { validator: checkAge, trigger: 'blur' }
        ],
        position: [
          { required: true, message: '头衔是必填项', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('/api/users')
      // console.log(res)
      if (res.status !== 0) alert('接受数据失败')
      this.userList = res.data
    },
    // 补零函数
    padZero(n) {
      return n > 9 ? n : '0' + n
    },
    // 监听对话框关闭的事件

    onDialogClosed(e) {
      // console.log(e)
      console.log(this.$refs)
      this.$refs.form.resetFields()
    },
    // 确定按钮
    onAddNewUser() {
      // 先使用table组件提供的方法进行表单预验证
      this.$refs.form.validate(async (vaild) => {
        console.log(vaild)
        if (!vaild) return
        // 发起post请求，向服务器发送数据
        const { data: res } = await this.$http.post('/api/users', this.form)
        // if (res.status !== 0) return console.log('发送数据失败')
        if (res.status !== 0) return this.$message.error('添加失败')
        // 如果成功，先关闭对话框，再重新发起请求获取最新数据
        this.dialogVisible = false
        this.$message.success('添加成功')
        this.getUserList()
      })
    },
    // 点击删除按钮
    async open(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户信息，是否继续？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      console.log(confirmResult)

      if (confirmResult !== 'confirm') return this.$message.info('取消了删除！')
      const { data: res } = await this.$http.delete('/api/users/' + id)
      if (res.status !== 0) return this.$message.info('删除失败')
      this.$message.success('删除成功')
      this.getUserList()
    }
    // 点击详情页跳转
  },
  created() {
    this.getUserList()
  },
  filters: {
    dateFormat(dtStr) {
      const dt = new Date(dtStr)
      const y = dt.getFullYear()
      const m = dt.getMonth() + 1
      const d = dt.getDate()
      const hh = dt.getHours()
      const mm = dt.getMinutes()
      const ss = dt.getSeconds()
      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
  }
}
</script>

<style lang="less" scoped></style>
