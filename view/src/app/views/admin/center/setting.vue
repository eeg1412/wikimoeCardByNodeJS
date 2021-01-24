<template>
  <div class="wmcard_admincenter_common_right_body">
    <el-form ref="form" :model="form" label-width="180px">
      <el-form-item label="每日抽卡次数">
        <el-input-number
          v-model="form.dailyChance"
          label="请设定每日抽卡次数"
          :min="1"
        ></el-input-number>
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
      <el-form-item label="屏蔽词汇(英语逗号隔开)">
        <el-input
          type="textarea"
          :rows="5"
          v-model="form.hiddenWords"
          placeholder="用于注册时的昵称屏蔽词"
        ></el-input>
      </el-form-item>
      <el-form-item label="底部信息">
        <el-input
          type="textarea"
          :rows="5"
          v-model="form.footer"
          placeholder="(支持html，可用于添加流量统计代码)"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { authApi } from "../../../api";
export default {
  data() {
    return {
      form: {
        sessionSecret: "", //session加密字符串
        JWTSecret: "", //JWT加密字符串
        dailyChance: "", //每日抽卡次数
        smtpHost: "", //邮件发送host
        smtpPort: "", //邮件发送端口
        smtpAuthUser: "",
        smtpAuthPass: "",
        robotCheckStar: "",
        robotCheckCanGetStar: "", //机器人可疑度低于这个值送星星
        deminingStarRatio: "", //挖矿获得星星的倍率
        deminingItemRatio: "", //挖矿获得宝石的倍率
        creatCardStar: "", //制卡审核通过后获得的星星
        creatCardWait: "", //单用户最多等待审核的制卡
        useMarketCardCount: "", //集齐多少种卡牌后能在市场交易
        battleRankGetItem: "", //竞技第一名额外获得结缘币的数量
        battleRankGetItemDecay: "", //后面陆续获得结缘币的衰减数量
        donateImgUrl: "", //捐赠图片URL地址
        creatCardExplainUrl: "", //制卡说明图片URL地址
        QQunURL: "", //加群链接
        courseURL: "", //教程链接
        browserTitle: "维基萌抽卡", //浏览器标签标题
        siteTitle: "维基萌抽卡", //网站标题
        footer: "",
        hiddenWords: ""
      },
      token: sessionStorage.getItem("adminToken")
        ? sessionStorage.getItem("adminToken")
        : localStorage.getItem("adminToken")
    };
  },
  mounted() {
    this.getSettingInfo();
  },
  methods: {
    getSettingInfo() {
      let params = {
        token: this.token,
        type: "get"
      };
      authApi.adminsetting(params).then(res => {
        console.log(res);
        if (res.data.code == 1) {
          let resData = res.data.data;
          this.form.sessionSecret = resData.sessionSecret; //session加密字符串
          this.form.JWTSecret = resData.JWTSecret; //JWT加密字符串
          this.form.dailyChance = resData.dailyChance; //每日抽卡次数
          this.form.smtpHost = resData.smtpHost; //邮件发送host
          this.form.smtpPort = resData.smtpPort; //邮件发送端口
          this.form.smtpAuthUser = resData.smtpAuth.user;
          this.form.smtpAuthPass = resData.smtpAuth.pass;
          this.form.robotCheckStar = resData.robotCheckStar || "25"; //机器人验证通过后送的星星
          this.form.robotCheckCanGetStar = resData.robotCheckCanGetStar || "25"; //机器人可疑度低于这个值送星星
          this.form.deminingStarRatio = resData.deminingStarRatio || "1"; //挖矿获得星星的倍率
          this.form.deminingItemRatio = resData.deminingItemRatio || "1"; //挖矿获得宝石的倍率
          this.form.creatCardStar = resData.creatCardStar || "100"; //制卡审核通过后获得的星星
          this.form.creatCardWait = resData.creatCardWait || "20"; //单用户最多等待审核的制卡
          this.form.useMarketCardCount = resData.useMarketCardCount || "30"; //集齐多少种卡牌后能在市场卖卡
          this.form.battleRankGetItem = resData.battleRankGetItem || "100"; //竞技第一名额外获得结缘币的数量
          this.form.battleRankGetItemDecay =
            resData.battleRankGetItemDecay || "10"; //后面陆续获得结缘币的衰减数量
          this.form.donateImgUrl = resData.donateImgUrl || ""; //捐赠图片URL地址
          this.form.creatCardExplainUrl = resData.creatCardExplainUrl || ""; //制卡说明图片URL地址
          this.form.QQunURL = resData.QQunURL || ""; //加群链接
          this.form.courseURL = resData.courseURL || ""; //教程链接
          this.form.browserTitle = resData.browserTitle || ""; //浏览器标签标题
          this.form.siteTitle = resData.siteTitle || ""; //网站标题
          this.form.footer = resData.footer || ""; //底部信息
          this.form.hiddenWords = resData.hiddenWords || ""; //屏蔽词汇
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    onSubmit() {
      let params = {
        token: this.token,
        type: "edit",
        config: this.form
      };
      authApi.adminsetting(params).then(res => {
        console.log(res);
        if (res.data.code == 1) {
          this.$message({
            message: "修改成功！",
            type: "success"
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped></style>
