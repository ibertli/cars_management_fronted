<template>
  <div>
    <div class="addRoutes">
      <el-form
        :model="formData"
        label-position="right"
        label-width="80px"
        :rules="rules"
        ref="editRoute"
      >
        <el-form-item label="所属项目" prop="project_id">
          <el-select v-model="formData.project_id" placeholder="选择项目">
            <el-option
              v-for="item in project"
              :key="item.project_id"
              v-bind:label="item.name"
              v-bind:value="item.project_id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="路线名称" prop="name">
          <el-input v-model.trim="formData.name" placeholder="请输入路线名称"></el-input>
        </el-form-item>

        <el-form-item label="路线数据" prop="route_point">
          <el-input type="textarea" :rows="8" v-model="formData.route_point" placeholder="请输入路线数据"></el-input>
        </el-form-item>

        <!-- <el-form-item label="当前点数">
          <el-input :disabled="true" v-model="this.point_num"></el-input>
        </el-form-item>-->
        <el-form-item label="提示">输入的数据样式为"31 121,32 122,...,33 123"纬度+空格+经度+逗号为一小组数据</el-form-item>

        <!-- <div slot="footer" class="dialog-footer"> -->
        <el-form-item>
          <el-button type="warning" @click="resetForm('editRoute')">选择重置</el-button>
          <el-button type="primary" @click="submitRoute()" :loading="loading">立即添加</el-button>
        </el-form-item>
        <!-- </div> -->
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name:'addRoute',
  

  beforeMount: function() {
    axios
      .get(this.Url + "project?pageSize=1000")
      .then(Response => {
        console.log(Response);
        this.project = Response.data.data.beanList;
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  data() {
    var checkName = (rule, value, callback) => {
      var that = this;
      // var name = /^[a-zA-Z0-9_]{1,15}$/;
      // if (!name.test(value)) {
      //   return callback(new Error("路线名称应由1-15位字母、数字或者下划线构成"));
      if (!value) {
        return callback(new Error("路线名称不为空"));
      } else {
        axios
          .get(that.Url + "car/ifExistCarName?name=" + value)
          .then(response => {
            if (response.data.data == 1) {
              return callback(new Error("该路线名称已存在"));
            } else {
              return callback();
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    };
    return {
      formData: {
        end_point: "",
        name: "",
        city_id: "",
        project_id: "",
        route_line: "",
        route_point: "",
        start_point: ""
      },
      point_num: 0,
      project: "",
      rules: {
        name: [
          { required: true, message: "请输入路线名称", trigger: "blur" },
          { validator: checkName, trigger: "blur" }
        ],
        city_id: [
          { required: true, message: "请选择城市名称", trigger: "change" }
        ]
      },
      // 防止重复提交
      loading: false,
    };
  },
  // watch: {
  //   formData: {
  //     handler() {
  //     // 做点什么。。。
  //     this.point_num = formData.route_point.split(",").length;
  //   },
  //   deep: true
  //   }
  // },
  methods: {
    checkRoute(data) {
      let temp_str = data.split(",");
      console.log("temp_str", temp_str);
      this.point_num = temp_str.length;
      if (this.point_num == 1) {
        this.$message({
          message: "路线数据点个数不能为1或0",
          type: "fail",
          offset: "200",
          duration: 1000
        });
        return 0;
      } else {
        for (let i = 0; i < this.point_num; i++) {
          let temp = temp_str[i].split(" ");
          console.log("1");
          if (temp.length != 2) {
            this.$message({
              message:
                "当前点数:" +
                this.point_num +
                "路线在第" +
                (i + 1) +
                "个数据有误，坐标数量不为2",
              type: "fail",
              offset: "200",
              duration: 1000
            });
            return 1;
          } else {
            console.log("2");
            if (temp[0] > 90 || temp[0] < 0) {
              this.$message({
                message:
                  "当前点数:" +
                  this.point_num +
                  "路线在第" +
                  (i + 1) +
                  "个数据第1位有误，不合纬度规范",
                type: "fail",
                offset: "200",
                duration: 1000
              });
              return 2;
            } else if (temp[1] > 180 || temp[1] < 0) {
              this.$message({
                message:
                  "当前点数:" +
                  this.point_num +
                  "路线在第" +
                  (i + 1) +
                  "个数据第2位有误，不合经度规范",
                type: "fail",
                offset: "200",
                duration: 1000
              });
              return 3;
            }
          }
        }
      }
      return 200;
    },

    submitRoute() {
      this.loading = true;
      var that = this;
      let error = this.checkRoute(this.formData.route_point);
      console.log("check finish", error);
      if (error == 200) {
        let temp_str = this.formData.route_point.split(",");
        this.formData.start_point = temp_str[0];
        this.formData.end_point = temp_str[temp_str.length - 1];
        this.formData.route_line = this.formData.route_point;
        axios({
          method: "post",
          url: this.Url + "route",
          data: this.formData
        })
          .then(res => {
            console.log(res);
            if (res.status == 200) {
              this.loading = false;
              // this.pageInfo.name = "";
              this.$message({
                message: "添加成功",
                type: "success",
                offset: "200",
                duration: 1000,
                // onClose: function() {
                //   that.$router.go(0);
                // }
              });
              this.dialogVisible = false;
            }
          })
          .catch(err => {
            this.loading = false;
            console.log(err);
          });
      }
    },

    resetForm(refname) {
      this.$refs[refname].resetFields();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-table {
    margin-left:0;
    text-align:center;
    margin-top: 40px;
    margin-bottom: 20px;
}
.addRoutes{
  margin-top:100px;
    margin-left:50px;
    width:400px
}
</style>
