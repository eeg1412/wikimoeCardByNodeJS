<template>
<div class="wmcard_admincenter_common_right_body">
  <div class="clearfix"><el-button class="fr" type="primary" @click="newPackage">创建卡包</el-button></div>
  <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column
      prop="name"
      label="卡包名">
    </el-table-column>
    <el-table-column
      prop="packageId"
      label="卡包ID">
    </el-table-column>
    <el-table-column
      prop="oneStar"
      label="一星卡">
    </el-table-column>
    <el-table-column
      prop="twoStar"
      label="二星卡">
    </el-table-column>
    <el-table-column
      prop="threeStar"
      label="三星卡">
    </el-table-column>
    <el-table-column
      prop="fourStar"
      label="四星卡">
    </el-table-column>
    <el-table-column
      prop="fiveStar"
      label="五星卡">
    </el-table-column>
    <el-table-column
      prop="sixStar"
      label="六星卡">
    </el-table-column>
    <el-table-column
      label="合计">
      <template slot-scope="scope">
        <div>{{scope.row.oneStar+scope.row.twoStar+scope.row.threeStar+scope.row.fourStar+scope.row.fiveStar+scope.row.sixStar}}</div>
      </template>
    </el-table-column>
    <el-table-column
      label="日常">
      <template slot-scope="scope">
        <div>
          <el-switch
            :value="scope.row.open"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="openPackage(scope.row.open,scope.row._id,'daily')"
            >
          </el-switch>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      label="星星商店">
      <template slot-scope="scope">
        <div>
          <el-switch
            :value="scope.row.starShopOpen"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="openPackage(scope.row.starShopOpen,scope.row._id,'shop')"
            >
          </el-switch>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      label="猜卡">
      <template slot-scope="scope">
        <div>
          <el-switch
            :value="scope.row.guessOpen"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="openPackage(scope.row.guessOpen,scope.row._id,'guess')"
            >
          </el-switch>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      label="星币">
      <template slot-scope="scope">
        <div>
          <el-switch
            :value="scope.row.starCoinOpen"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="openPackage(scope.row.starCoinOpen,scope.row._id,'starCoin')"
            >
          </el-switch>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-button type="text" size="small" @click="goEditor(scope.row._id,scope.row.name)">改名</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="30%">
    <div>
      <el-input v-model="name" placeholder="请输入卡包名"></el-input>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="sendCardPackage">确定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import {authApi} from "../../../api";
export default {
  data() {
    return {
      name:'',
      dialogVisible:false,
      id:'',
      type:'',
      tableData: [],
      token:sessionStorage.getItem("adminToken")?sessionStorage.getItem("adminToken"):localStorage.getItem("adminToken"),
    }
  },
  mounted() {
    this.getCardPackage();
  },
  filters:{

  },
  methods: {
    openPackage(open,id,type){
      let paramas = {
        token:this.token,
        open:!open,
        type:type,
        _id:id
      }
      authApi.renamecardpackage(paramas).then(res => {
          console.log(res);
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.getCardPackage();
            this.dialogVisible = false;
          }
      });
    },
    sendCardPackage(){
      let paramas = {
        name:this.name,
        token:this.token,
        type:this.type,
        _id:this.id
      }
      authApi.renamecardpackage(paramas).then(res => {
          console.log(res);
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.getCardPackage();
            this.dialogVisible = false;
          }
      });
    },
    newPackage(){
      this.id = '';
      this.type = 'add';
      this.name = '';
      this.dialogVisible = true;
    },
    goEditor(id,name){
      this.id = id;
      this.type = 'edit';
      this.name = name;
      this.dialogVisible = true;
    },
    getCardPackage(){
      authApi.searchcardpackage({all:true}).then(res => {
          console.log(res);
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
            this.tableData = res.data.data;
          }
      });
    },
  },
}
</script>

