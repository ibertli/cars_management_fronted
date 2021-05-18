<template>
  <div class="routeList">
    <div class="cityList" style="margin:0 auto;  width:560px;  height:50px; margin-top:30px">
      <span>请输入查询内容：</span>
      <el-input placeholder="请输入项目名" v-model="projectName" clearable></el-input>
      <el-input placeholder="请输入路线名" v-model="routeName" clearable></el-input>
    </div>

    <el-table :data="tableData" border stripe
    :default-sort = "{prop: 'route_id', order: 'ascending'}">
      <el-table-column label="ID" align="center" prop="route_id" sortable></el-table-column>
      <el-table-column label="项目" align="center" prop="project_name"></el-table-column>
      <el-table-column label="名称" align="center" prop="route_name"></el-table-column>
      <el-table-column label="路线起点" align="center" prop="start_point" width="207"></el-table-column>
      <el-table-column label="路线终点" align="center" prop="end_point" width="207"></el-table-column>
      <el-table-column label="操作" align="center" width="225">
        <template width="200" slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleLook(scope.row)">查看</el-button>
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
<div style="display: flex; justify-content: space-around">
    <el-pagination
      @size-change="handleSizeChange"
      :page-sizes="[5, 10, 15, 20]"
      background
      pager-count="5"
      :current-page="pageCode"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
      @prev-click="handlePrePage"
      :total="totalCount"
      :page-size="pageSize">
      </el-pagination>
</div>
    <el-dialog title="路线修改" :visible.sync="dialogFormVisible">
      <div style="margin-left:140px;width:400px">
        <el-form  :model="dialogFormData" label-position="right" label-width="80px" :rules="rules" ref="editRoute"> 
            <el-form-item label="所属项目">
                <el-select v-model="dialogFormData.project_id" placeholder="选择项目">
                  <el-option  v-for="item in project"  :key="item.project_id"  v-bind:label="item.name"  v-bind:value="item.project_id">  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="路线名称">
               <el-input v-model.trim="dialogFormData.name" placeholder="请输入路线名称"></el-input>
            </el-form-item>
            <el-form-item label="路线数据">
                <el-input type="textarea" style="width:300px" :rows="9"  v-model="dialogFormData.route_point"  placeholder="请输入路线数据">  </el-input>
            </el-form-item>
            <el-form-item label="提示">输入的数据样式为"31 121,32 122,...,33 123"纬度+空格+经度+逗号为一小组数据</el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRoute()">修改</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="提示"
      style="text-align:left !important"
      :visible.sync="dialogDeleteVisible"
      :before-close="handleClose">
      
      <span>你确定要删除这条路线吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="submitDelete()">提交</el-button>
        <el-button type="primary" @click="dialogDeleteVisible = false">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="地图" style="text-align:left !important" :visible.sync="dialogMapVisible">
      <div class="amap-page-container">
        <el-amap vid="amap" :zoom="16" :center="center" class="amap-demo">
          <el-amap-polyline :path="polyline"></el-amap-polyline>
        </el-amap>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name:'routeList',
  
  beforeMount: function() {
    axios
      .get(this.Url + "route")
      .then(Response => {
        this.pageInfo = Response.data.data;
        console.log(this.pageInfo);
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
      projectName: "",
      routeName: "",
      tableData: [],
      pageInfo: {},
      pageCode: 0,
      pageSize: 0,
      totalCount: 0,
      totalPage: 0,
      dialogFormVisible: false,
      dialogDeleteVisible: false,
      dialogMapVisible: false,
      center: [121.5273285, 31.25515044],
      polyline: [
        [121.5389385, 31.21515044],
        [121.5389385, 31.29615044],
        [121.5273285, 31.21515044]
      ],
      dialogFormData: {
        name: "",
        project_id: 0,
        route_id: 0,
        route_line: "",
        route_point: "",
        start_point: "",
        end_point: ""
      },
      delete_id: 0,
      project: []
    };
  },

  watch: {
    routeName: function() {
      var that=this;
      axios
        .get(  this.Url + "route?route_name=" + this.routeName +"&project_name=" +
            this.projectName+ "&pageCode=" +  this.pageCode + "&pageSize=" + this.pageSize
        )
        .then(Response => {
           if(this.pageCode>Response.data.data.totalPage)
          { 
                axios.get(this.Url+"route?route_name="+this.routeName+"&project_name=" +
            this.projectName+"&pageCode=1&pageSize=" + this.pageSize
            ).then(Response => {
              that.pageInfo = Response.data.data;
                that.pageCode = that.pageInfo.pageCode;
                that.pageSize = that.pageInfo.pageSize;
                that.totalCount = that.pageInfo.totalCount;
                that.totalPage = that.pageInfo.totalPage;
                that.tableData = that.pageInfo.beanList;
            }
            ).catch(function(error) {
              console.log(error);
            });
          }else
           {
            this.pageInfo = Response.data.data;
            this.pageCode = this.pageInfo.pageCode;
            this.pageSize = this.pageInfo.pageSize;
            this.totalCount = this.pageInfo.totalCount;
            this.totalPage = this.pageInfo.totalPage;
            this.tableData = this.pageInfo.beanList;
           }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    projectName: function() {
      var that=this;
      axios
        .get(  this.Url + "route?route_name=" + this.routeName +"&project_name=" +
            this.projectName+ "&pageCode=" +  this.pageCode + "&pageSize=" + this.pageSize
        )
        .then(Response => {
           if(this.pageCode>Response.data.data.totalPage)
          { 
                axios.get(this.Url+"route?route_name="+this.routeName+"&project_name=" +
            this.projectName+"&pageCode=1&pageSize=" + this.pageSize
            ).then(Response => {
              that.pageInfo = Response.data.data;
                that.pageCode = that.pageInfo.pageCode;
                that.pageSize = that.pageInfo.pageSize;
                that.totalCount = that.pageInfo.totalCount;
                that.totalPage = that.pageInfo.totalPage;
                that.tableData = that.pageInfo.beanList;
            }
            ).catch(function(error) {
              console.log(error);
            });
          }else
           {
            this.pageInfo = Response.data.data;
            this.pageCode = this.pageInfo.pageCode;
            this.pageSize = this.pageInfo.pageSize;
            this.totalCount = this.pageInfo.totalCount;
            this.totalPage = this.pageInfo.totalPage;
            this.tableData = this.pageInfo.beanList;
           }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  methods: {
    handleLook(data) {
      let numArr = data.route_point.match(/\d+(.\d+)?/g);
      let total = [];
      for (let i = 0; i < numArr.length; i+=2) {
        let temp = [];
        temp.push(numArr[i+1]);
        temp.push(numArr[i]);
        total.push(temp);
      }
      this.polyline = total;
      this.center = total[0];
      this.dialogMapVisible = true;
    },

    checkRoute(data) {
      let temp_str = data.split(",");
      this.point_num = temp_str.length;
      if (this.point_num == 1) {
        this.$message({
          message: "路线数据点个数不能为1或0",
          type: "fail",
          offset: "200",
          duration:1000,
        });
        return 0;
      } else {
        for (let i = 0; i < this.point_num; i++) {
          let temp = temp_str[i].split(" ");
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
              duration:1000,
            });
            return 1;
          } else {
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
                duration:1000,
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
                duration:1000,
              });
              return 3;
            }
          }
        }
      }
      return 200;
    },

    handleEdit(datas) {
      let numArr = datas.route_point.match(/\d+(.\d+)?/g); 
      let total = "";
      for (let i = 0; i < numArr.length; i += 2) {
        total+=numArr[i];
        total+=" ";
        total+=numArr[i + 1];
        if (i != (numArr.length  -2)) {
          total+=",";
        }
      } 
      this.dialogFormData.route_point = total;
      this.dialogFormData.name = datas.route_name;
      this.dialogFormData.project_id = datas.project_id;
      this.dialogFormData.route_id = datas.route_id;
      this.dialogFormData.route_line = datas.route_point;
      // this.dialogFormData.route_point = datas.route_point;
      this.dialogFormData.start_point = datas.start_point;
      this.dialogFormData.end_point = datas.end_point;

      axios
        .get(this.Url + "project?pageSize=1000")
        .then(Response => {
          this.project = Response.data.data.beanList;
        })
        .catch(function(error) {
          console.log(error);
        });
      this.dialogFormVisible = true;
    },

    submitRoute() {
      let error = this.checkRoute(this.dialogFormData.route_point);
      if (error == 200) {
        let temp_str = this.dialogFormData.route_point.split(",");
        this.dialogFormData.start_point = temp_str[0];
        this.dialogFormData.end_point = temp_str[temp_str.length - 1];
        this.dialogFormData.route_line = this.dialogFormData.route_point;

        axios({
          method: "put",
          url: this.Url + "route",
          data: this.dialogFormData
        })
          .then(res => {
            console.log(res);
            if (res.status == 200) {
              this.$message({
                message: "修改成功",
                type: "success",
                offset: "200",
                duration:1000,
                // onClose: function() {
                //   this.reload();
                // }
              });
              this.dialogFormVisible = false;
              this.handleCurrentChange(this.pageCode);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },

    handleDelete(datas) {
      this.delete_id = datas.route_id;
      this.dialogDeleteVisible = true;
    },

    submitDelete() {
      // console.log("submitDelete",this.pageCode);
      axios({
        method: "delete",
        url: this.Url + "route/" + this.delete_id
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
            this.dialogDeleteVisible = false;
            this.handleCurrentChange(this.pageCode);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    handleCurrentChange(val) {
      axios
        .get(
          this.Url + "route?route_name=" + this.routeName +"&project_name=" +
            this.projectName+ "&pageCode=" +  val + "&pageSize=" + this.pageSize
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
    handleSizeChange(val) {
      this.pageSize = val;
      axios
        .get(
         this.Url + "route?route_name=" + this.routeName +"&project_name=" +
            this.projectName+ "&pageCode=" +  this.pageCode + "&pageSize=" + this.pageSize
        )
        .then(Response => {
          this.pageInfo = Response.data.data;
          this.pageCode = 1;
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
  .el-input {
      width: 200px;
      margin-right: 20px;
      font-size: 14px;
      color: #606266;
  }
    .routeList .el-table {
        margin-left:0;
        text-align:center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .amap-demo {
        height: 300px;
    }
</style>