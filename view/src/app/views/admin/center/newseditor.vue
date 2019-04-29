<template>
<div class="wmcard_admincenter_common_right_body">
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="标题">
      <el-input v-model="form.title" placeholder="请输入标题"></el-input>
    </el-form-item>
    <el-form-item label="内容">
      <el-input
        type="textarea"
        :rows="20"
        placeholder="请输入内容"
        v-model="form.text">
      </el-input>
    </el-form-item>
    <el-form-item label="首页显示">
      <el-switch v-model="form.top"></el-switch>
    </el-form-item>
    <el-form-item label="发布时间">
      <el-date-picker
        v-model="form.time"
        type="datetime"
        value-format="timestamp"
        placeholder="选择发布时间">
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">发布</el-button>
      <el-button @click="backIndex">返回</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import {authApi} from "../../../api";
import {mailCheck} from "../../../../utils/utils";
export default {
  data() {
    return {
      form:{
        text:'',
        title:'',
        top:false,
        time:new Date().getTime()
      },
      id:null,
      token:sessionStorage.getItem("adminToken")?sessionStorage.getItem("adminToken"):localStorage.getItem("adminToken")
    }
  },
  created() {
    this.id = this.$route.query._id;
  },
  mounted() {
  },
  methods: {
    backIndex(){
      this.$router.push({ path:'/cardadmin/center/newslist'});
    },
    getKey(){
      let params = {
        type:'get',
        token:this.token
      }
      authApi.adminsecretkey(params).then(res => {
          console.log(res);
          if(res.data.code==1){
            this.key.key = res.data.secretkey || '';
          }else{
            this.$message.error(res.data.msg);
          }
        });
    },
    onSubmit(){
      let params = {
        type:'add',
        token:this.token,
      }
      params = Object.assign(params, this.form);
      authApi.adminNews(params).then(res => {
        console.log(res);
        if(res.data.code==1){
          this.$message({
            message: '新闻发布成功！',
            type: 'success'
          });
        }else{
          this.$message.error(res.data.msg);
        }
      });
    }
  },
}
</script>

<style>
.wm_admin_sk_copy{
  border-radius: 3px;
  border:1px solid #bebebe;
  padding: 5px 10px;
  height: 24px;
  line-height: 24px;
}
</style>
