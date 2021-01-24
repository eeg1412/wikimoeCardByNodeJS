<template>
  <div class="common_body">
    <h5 class="common_title">初始化安装</h5>
    <el-form ref="form" :model="form" label-width="180px">
      <el-form-item label="管理员账号">
        <el-input
          v-model="form.account"
          placeholder="请设定管理员账号"
        ></el-input>
      </el-form-item>
      <el-form-item label="管理员密码">
        <el-input
          v-model="form.password"
          show-password
          placeholder="请设定管理员密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="每日抽卡次数">
        <el-input
          v-model="form.dailyChance"
          placeholder="请设定每日抽卡次数"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮件发送host">
        <el-input
          v-model="form.smtpHost"
          placeholder="请设定邮件发送host地址"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮件发送端口">
        <el-input
          v-model="form.smtpPort"
          placeholder="请设定邮件发送端口"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱账户">
        <el-input
          v-model="form.smtpAuthUser"
          placeholder="请设定邮箱账户"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱密码">
        <el-input
          v-model="form.smtpAuthPass"
          show-password
          placeholder="请设定邮箱密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="session">
        <el-input
          v-model="form.sessionSecret"
          placeholder="用于session加密的字符串"
        ></el-input>
      </el-form-item>
      <el-form-item label="JWTSecret">
        <el-input
          v-model="form.JWTSecret"
          placeholder="用于JWT加密字符串"
        ></el-input>
      </el-form-item>
      <el-form-item label="机器人验证送的神秘碎片">
        <el-input-number
          v-model="form.robotCheckStar"
          label="机器人验证通过后送的神秘碎片"
          :min="1"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="低于该可疑度送神秘碎片">
        <el-input-number
          v-model="form.robotCheckCanGetStar"
          label="机器人可疑度低于这个值送神秘碎片"
          :min="1"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="挖矿得星星倍率">
        <el-input-number
          v-model="form.deminingStarRatio"
          label="挖矿获得星星的倍率"
          :min="1"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="挖矿得宝石倍率">
        <el-input-number
          v-model="form.deminingItemRatio"
          label="挖矿获得宝石的倍率"
          :min="1"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="制卡审核通过送的星星">
        <el-input-number
          v-model="form.creatCardStar"
          label="制卡审核通过后获得的星星"
          :min="1"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="单用户最多等待审核的制卡">
        <el-input-number
          v-model="form.creatCardWait"
          label="单用户最多等待审核的制卡"
          :min="1"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="使用市场卡种量限制">
        <el-input-number
          v-model="form.useMarketCardCount"
          label="集齐多少种卡牌后能使用市场"
          :min="1"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="竞技榜单结缘币基数">
        <el-input-number
          v-model="form.battleRankGetItem"
          label="竞技第一名额外获得结缘币的数量"
          :min="1"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="竞技榜单结缘币基数衰减">
        <el-input-number
          v-model="form.battleRankGetItemDecay"
          label="竞技榜单结缘币基数衰减"
          :min="1"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="捐赠图片URL地址">
        <el-input
          v-model="form.donateImgUrl"
          placeholder="捐赠图片URL地址（选填）"
        ></el-input>
      </el-form-item>
      <el-form-item label="制卡说明图片URL地址">
        <el-input
          v-model="form.creatCardExplainUrl"
          placeholder="制卡说明图片URL地址（选填）"
        ></el-input>
      </el-form-item>
      <el-form-item label="加群链接">
        <el-input
          v-model="form.QQunURL"
          placeholder="加群链接（选填）"
        ></el-input>
      </el-form-item>
      <el-form-item label="教程链接">
        <el-input
          v-model="form.courseURL"
          placeholder="教程链接（选填）"
        ></el-input>
      </el-form-item>
      <el-form-item label="浏览器标签标题">
        <el-input
          v-model="form.browserTitle"
          placeholder="浏览器标签标题"
        ></el-input>
      </el-form-item>
      <el-form-item label="网站标题">
        <el-input v-model="form.siteTitle" placeholder="网站标题"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">安装</el-button>
        <el-button @click="backIndex">返回首页</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { authApi } from "../../api";
export default {
  data() {
    return {
      form: {
        account: "",
        password: "",
        dailyChance: "",
        smtpHost: "",
        smtpPort: "",
        smtpAuthUser: "",
        smtpAuthPass: "",
        sessionSecret: "",
        JWTSecret: "",
        robotCheckStar: "25",
        robotCheckCanGetStar: "25", //机器人可疑度低于这个值送星星
        deminingStarRatio: "1", //挖矿获得星星的倍率
        deminingItemRatio: "1", //挖矿获得宝石的倍率
        creatCardStar: "100", //制卡审核通过后获得的星星
        creatCardWait: "20", //单用户最多等待审核的制卡
        useMarketCardCount: "30", //集齐多少种卡牌后能在市场交易
        battleRankGetItem: "100", //竞技第一名额外获得结缘币的数量
        battleRankGetItemDecay: "10", //后面陆续获得结缘币的衰减数量
        donateImgUrl: "", //捐赠图片URL地址
        creatCardExplainUrl: "", //制卡说明图片URL地址
        QQunURL: "", //加群链接
        courseURL: "", //教程链接
        browserTitle: "维基萌抽卡", //浏览器标签标题
        siteTitle: "维基萌抽卡" //网站标题
      }
    };
  },
  mounted() {
    this.chekInstall();
  },
  methods: {
    chekInstall() {
      authApi.admincheckinstall().then(res => {
        if (res.data.code != 1) {
          this.$router.replace({ path: "/" });
        }
      });
    },
    onSubmit() {
      // 校验数据
      let params = { config: this.form };
      authApi.admininstall(params).then(res => {
        console.log(res);
        if (res.data.code == 1) {
          this.$alert("恭喜您，安装成功！", "提示", {
            confirmButtonText: "确定",
            showClose: false,
            callback: action => {
              this.$router.push({ path: "/" });
            }
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    backIndex() {
      this.$router.push({ path: "/" });
    }
  }
};
</script>

<style lang="stylus" scoped></style>
