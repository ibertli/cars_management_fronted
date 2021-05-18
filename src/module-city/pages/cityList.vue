<template>
  <div>
    <div class="cityList" style="margin:0 auto;  width:430px;  height:50px; margin-top:30px">
      <span>请输入查询内容：</span>
      <el-input placeholder="请输入城市" v-model="findName" clearable></el-input>
      <el-button
        type="success"
        @click="
          addFlag = true;
          dialogVisible = true;
        "
        icon="el-icon-circle-plus-outline"
        size="mini"
        round>新增</el-button>
    </div>

    <el-table :data="tableData" border stripe
    :default-sort = "{prop: 'city_id', order: 'ascending'}">
      <el-table-column label="ID" align="center" prop="city_id" width="200" sortable></el-table-column>
      <el-table-column label="Name" align="center" prop="name" width="300"></el-table-column>
      <el-table-column label="操作" align="center"  >
        <template width="200" slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)" >编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  <div  style="display: flex; justify-content: space-around">
    <el-pagination
      background
      pager-count="5"
      :current-page="pageCode"
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      @prev-click="handlePrePage"
      :total="totalCount"
      :page-size="pageSize" >
    </el-pagination>
  </div>
    <el-dialog
      :title="addFlag ? '新增城市' : '修改城市'"
      style="text-align:left !important"
      :visible.sync="dialogVisible"
      :before-close="handleClose">
      <el-form ref="form" label-width="80px">
        <el-form-item label="城市" style="width:300px">
          <div v-if="addFlag==true">
            <el-input v-model="newCity" placeholder="请输入城市"></el-input>
          </div>
          <div v-else>
            <el-input v-model="pageInfo.name" placeholder="请输入城市"></el-input>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" :disabled="addEnable" @click="submitCity()">提交</el-button>
        <el-button type="primary" @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      style="text-align:left !important"
      :visible.sync="dialog2Visible"
      :before-close="handleClose">
      <span>你确定要删除这个城市吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="submitDelete()">提交</el-button>
        <el-button type="primary" @click="dialog2Visible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  
  beforeMount: function getAllCity() {
    axios
      .get(this.Url + "city")
      .then(Response => {
        this.pageInfo = Response.data.data;
        this.pageCode = this.pageInfo.pageCode;
        this.pageSize = this.pageInfo.pageSize;
        this.totalCount = this.pageInfo.totalCount;
        this.totalPage = this.pageInfo.totalPage;
        this.tableData = this.pageInfo.beanList;
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  data() {
    return {
      tableData: [],
      pageInfo: {},
      pageCode: 0,
      pageSize: 0,
      totalCount: 0,
      totalPage: 0,

      findName: "",
      newCity: "",
      addEnable: false,
      dialogVisible: false,
      dialog2Visible: false,
      activeIndex2: "1",
      total: 0,
      size: 5,
      page: 1,
      addFlag: true,
      curId: ""
    };
  },
  watch: {
    findName: function() {
      axios
        .get(
          this.Url +
            "city?name=" +
            this.findName +
            "&pageCode=" +
            this.pageCode +
            "&pageSize=" +
            this.pageSize
        )
        .then(Response => {
          this.pageInfo = Response.data.data;
          this.pageCode = this.pageInfo.pageCode;
          this.pageSize = this.pageInfo.pageSize;
          this.totalCount = this.pageInfo.totalCount;
          this.totalPage = this.pageInfo.totalPage;
          this.tableData = this.pageInfo.beanList;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    newCity: function() {
      axios
        .get(this.Url + "city/ifExistCityName?name=" + this.newCity)
        .then(Response => {
          if (Response.data.data != "0") {
            this.addEnable = true;
            this.$message({
              message: "该城市已存在请重新输入",
              type: "fail",
              offset: "200"
            });
          } else if (Response.data.data == "0") {
            this.addEnable = false;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  methods: {
    handleEdit(row) {
      this.pageInfo = row;
      this.dialogVisible = true;
      this.addFlag = false;
      // this.curId = row.ID;
    },

    handleDelete(row) {
      this.pageInfo = row;
      this.dialog2Visible = true;
    },

    submitCity() {
      var that = this;
      if (this.addFlag) {
        if (this.newCity == null || this.newCity == "") {
          this.$message({
            showClose: true,
            message: "请输入城市名称",
            type: "warning",
            offset: "200"
          });
        } else {
          axios({
            method: "post",
            url: this.Url + "city?name=" + this.newCity
          })
            .then(res => {
              if (res.status == 200) {
                this.$message({
                  message: "添加成功",
                  type: "success",
                  offset: "200",
                  duration:1000,
                  // onClose: function() {
                  //   that.reload();
                  // }
                });
                this.newCity = "";
                this.dialogVisible = false;
                this.handleCurrentChange(this.pageCode);
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      } else {
        if (this.pageInfo.name == null || this.pageInfo.name == "") {
          this.$message({
            showClose: true,
            message: "请输入城市名称",
            type: "warning",
            offset: "200"
          });
        } else {
          axios({
            method: "put",
            url:
              this.Url +
              "city?city_id=" +
              this.pageInfo.city_id +
              "&name=" +
              this.pageInfo.name
          })
            .then(res => {
              if (res.status == 200) {
                // this.pageInfo.name = "";
                this.$message({
                  message: "修改成功",
                  type: "success",
                  offset: "200",
                  duration:1000,
                  // onClose: function() {
                  //   that.reload();
                  // }
                });
                this.dialogVisible = false;
                // this.handleCurrentChange(this.pageCode);
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      }
    },

    submitDelete() {
      let that = this;
      // console.log("submitDelete",this.pageCode);
      axios({
        method: "delete",
        url: this.Url + "city/" + this.pageInfo.city_id
      })
        .then(res => {
          if (res.status == 200) {
            this.$message({
              message: "删除成功",
              type: "success",
              offset: "200",
              duration:1000,
              // onClose: function() {
              //   that.reload();
              // }
            });
            this.dialog2Visible = false;
            this.handleCurrentChange(this.pageCode);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    handleCurrentChange(val) {
      axios
        .get(this.Url + "city/?pageCode=" + val)
        .then(Response => {
          this.pageInfo = Response.data.data;
          this.pageCode = this.pageInfo.pageCode;
          this.pageSize = this.pageInfo.pageSize;
          this.totalCount = this.pageInfo.totalCount;
          this.totalPage = this.pageInfo.totalPage;
          this.tableData = this.pageInfo.beanList;
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /* @import '../assents/style.css';  */
        .cityList {
          margin-top: 40px;
          margin-bottom: 20px;
      }
      .cityList .el-input {
          width: 200px;
          margin-right: 20px;
          font-size: 14px;
          color: #606266;
      }
      .el-table {
          margin-left:0;
          text-align:center;
          margin-top: 40px;
          margin-bottom: 20px;
      }

    
</style>
