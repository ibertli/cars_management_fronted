<template>
  <div class="carList">
    <div class="cityList" style="margin:0 auto;  width:800px;  height:50px; margin-top:30px">
      <span>请输入查询内容：</span>
      <el-input placeholder="请输入车标" v-model="type" clearable></el-input>
      <el-input placeholder="请输入项目名" v-model="projectName" clearable></el-input>
      <el-input placeholder="请输入城市名" v-model="cityName" clearable></el-input>
    </div>

    <el-table :data="tableData" border stripe :default-sort="{prop: 'car_id', order: 'ascending'}">
      <el-table-column label="ID" align="center" prop="car_id" sortable></el-table-column>
      <el-table-column label="车标" align="center" prop="type"></el-table-column>
      <el-table-column label="账号" align="center" prop="name"></el-table-column>
      <el-table-column label="密码" align="center" prop="pwd"></el-table-column>
      <el-table-column label="项目" align="center" prop="project" width="105"></el-table-column>
      <el-table-column label="城市" align="center" prop="city"></el-table-column>
      <el-table-column label="载客量" align="center" prop="capacity"></el-table-column>
      <el-table-column label="图片" align="center" width="190">
        <template slot-scope="scope">
          <img class="carImage" :src="'http://itdipdhmi.hirain.com/hmiPhoto/'+scope.row.photo_path" />
          <el-button size="mini" @click="eiditPhotoDialog(scope)" class="editImage">修改</el-button>
          <!--模态框 -->
          <el-dialog title="修改图片" :visible.sync="dialogPhotoVisible">
            <el-upload
              class="upload-demo"
              ref="upload"
              action
              :auto-upload="false"
              :before-upload="beforeupload"
              accept="image/png, image/jpg, image/jpeg"
              list-type="picture"
              limit="1"
              :show-file-list="true"
              :on-change="changeUpload"
              :before-remove="beforeRemove"
            >
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png/jpeg文件，且不超过500kb</div>
            </el-upload>
            <!-- 显示裁剪后的图片 -->
            <div
              class="file-image"
              v-if="fileImg"
              style="width:320px;height:140px;background-color:fff;margin-left:10px;"
            >
              <el-tag type="success">裁剪后图样(若要删除请于原图处点击)</el-tag>
              <img :src="fileImg" alt="头像" style="width:100px;height:100px;margin-left:10px" />
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogPhotoVisible =false">取消</el-button>
              <el-button type="primary" @click="uploadPhoto()">确定</el-button>
            </div>
          </el-dialog>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="warnDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- vueCropper 剪裁图片实现-->
    <el-dialog
      title="图片剪裁"
      :visible.sync="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="cropper-content">
        <div class="cropper" style="text-align:center">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.size"
            :outputType="option.outputType"
            :info="true"
            :canScale="option.canScale"
            :autoCrop="option.autoCrop"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :fixedBox="option.fixedBox"
            :fixed="option.fixed"
            :fixedNumber="option.fixedNumber"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :centerBox="option.centerBox"
            :infoTrue="option.infoTrue"
            :full="option.full"
          ></vueCropper>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="finish" :loading="loading">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog title="车辆修改" :visible.sync="dialogFormVisible">
      <div style="margin-left:25%;width:400px">
        <el-form
          :model="dialogFormData"
          label-position="right"
          label-width="80px"
          :rules="rules"
          ref="editCar"
        >
          <el-form-item label="车标" prop="type">
            <el-input v-model.trim="dialogFormData.type" placeholder="请输入城市名称"></el-input>
          </el-form-item>
          <el-form-item label="账号" prop="name">
            <el-input v-model.trim="dialogFormData.name" placeholder="请输入城市名称"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pwd">
            <el-input v-model.trim="dialogFormData.pwd" placeholder="请输入城市名称"></el-input>
          </el-form-item>

          <el-form-item label="载客量" prop="capacity">
            <el-input v-model.number="dialogFormData.capacity" placeholder="请输入载客量"></el-input>
          </el-form-item>
          <el-form-item label="所属项目" prop="project_id">
            <el-select v-model="dialogFormData.project_id" placeholder="选择项目">
              <el-option
                v-for="item in project"
                :key="item.project_id"
                v-bind:label="item.name"
                v-bind:value="item.project_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属城市" prop="city_id">
            <el-select v-model="dialogFormData.city_id" placeholder="选择城市">
              <el-option
                v-for="item in city"
                :key="item.city_id"
                v-bind:label="item.name"
                v-bind:value="item.city_id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editForm()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      style="text-align:left !important"
      :visible.sync="dialogDeleteVisible"
      :before-close="handleClose">
      <span>你确定要删除这个车辆吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="submitDelete()">提交</el-button>
        <el-button type="primary" @click="dialogDeleteVisible = false">取消</el-button>
      </span>
    </el-dialog>
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
        :page-size="pageSize"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  beforeMount: function() {
    axios
      .get(this.Url + "car")
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
    var checkName = (rule, value, callback) => {
      var that = this;
      var name = /^[a-zA-Z0-9_]{3,15}$/;
      if (!name.test(value)) {
        return callback(new Error("账号应由3-15位字母、数字或者下划线构成"));
      } else if (value != that.currentName) {
        axios
          .get(that.Url + "car/ifExistCarName?name=" + value)
          .then(response => {
            if (response.data.data == 1) {
              return callback(new Error("该账号已存在"));
            }

            return callback();
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        return callback();
      }
    };
    var checkPwd = (rule, value, callback) => {
      var name = /^[a-zA-Z0-9_]{3,15}$/;
      if (!name.test(value)) {
        return callback(new Error("密码应由3-15位字母、数字或者下划线构成"));
      }
      return callback();
    };
    var checkType = (rule, value, callback) => {
      var that = this;
      if (value != that.currentType) {
        axios
          .get(that.Url + "car/ifExistCarType?type=" + value)
          .then(response => {
            if (response.data.data == 1) {
              return callback(new Error("该车辆标识已存在"));
            } else {
              return callback();
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        return callback();
      }
    };
    return {
      type: "",
      cityName: "",
      projectName: "",
      tableData: [],
      pageInfo: {},
      pageCode: 0,
      pageSize: 0,
      totalCount: 0,
      totalPage: 0,
      dialogPhotoVisible: false,
      dialogFormVisible: false,
      dialogDeleteVisible: false,
      dialogFormData: {
        car_id: "",
        type: "",
        name: "",
        pwd: "",
        capacity: "",
        city_id: "",
        project_id: ""
      },
      currentName: "",
      currentType: "",
      city: [],
      project: [],
      photoCarId: 0,
      formData: new FormData(),
      rules: {
        type: [
          { required: true, message: "请输入标识名称", trigger: "blur" },
          { validator: checkType, trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符" }
        ],
        name: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { validator: checkName, trigger: "blur" }
        ],
        pwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: checkPwd, trigger: "blur" }
        ],
        city_id: [
          { required: true, message: "请选择城市名称", trigger: "change" }
        ],
        project_id: [
          { required: true, message: "请选择项目名称", trigger: "change" }
        ],
        capacity: [{ required: true, message: "请输入载客量", trigger: "blur" }]
      },
      dialogVisible: false,
      // 裁剪组件的基础配置option
      option: {
        img: "", // 裁剪图片的地址
        outputSize: 0.8,
        outputType: "jpeg",
        info: true,
        canScale: true,
        autoCrop: true,
        autoCropWidth: 950,
        autoCropHeight: 950,
        fixedBox: false,
        fixed: true,
        fixedNumber: [1, 1],
        canMove: true,
        canMoveBox: true,
        original: false,
        centerBox: true,
        infoTrue: true,
        full: false
      },
      delete_id: 0,
      fileImg: "",
      // 防止重复提交
      loading: false,
      fileInfo: ""
    };
  },
  watch: {
    type: function() {
      var that = this;
      axios
        .get(
          this.Url +
            "car?type=" +
            this.type +
            "&cityName=" +
            this.cityName +
            "&projectName=" +
            this.projectName +
            "&pageCode=" +
            this.pageCode +
            "&pageSize=" +
            this.pageSize
        )
        .then(Response => {
          if (this.pageCode > Response.data.data.totalPage) {
            axios
              .get(
                that.Url +
                  "car?type=" +
                  that.type +
                  "&cityName=" +
                  that.cityName +
                  "&projectName=" +
                  that.projectName +
                  "&pageCode=1&pageSize=" +
                  that.pageSize
              )
              .then(Response => {
                that.pageInfo = Response.data.data;
                that.pageSize = that.pageInfo.pageSize;
                that.totalCount = that.pageInfo.totalCount;
                that.totalPage = that.pageInfo.totalPage;
                that.tableData = that.pageInfo.beanList;
                that.pageCode = that.pageInfo.pageCode;
              })
              .catch(function(error) {
                console.log(error);
              });
          } else {
            this.pageInfo = Response.data.data;
            this.pageSize = this.pageInfo.pageSize;
            this.totalCount = this.pageInfo.totalCount;
            this.totalPage = this.pageInfo.totalPage;
            this.tableData = this.pageInfo.beanList;
            this.pageCode = this.pageInfo.pageCode;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    cityName: function() {
      var that = this;
      axios
        .get(
          this.Url +
            "car?type=" +
            this.type +
            "&cityName=" +
            this.cityName +
            "&projectName=" +
            this.projectName +
            "&pageCode=" +
            this.pageCode +
            "&pageSize=" +
            this.pageSize
        )
        .then(Response => {
          if (this.pageCode > Response.data.data.totalPage) {
            axios
              .get(
                that.Url +
                  "car?type=" +
                  that.type +
                  "&cityName=" +
                  that.cityName +
                  "&projectName=" +
                  that.projectName +
                  "&pageCode=1&pageSize=" +
                  that.pageSize
              )
              .then(Response => {
                that.pageInfo = Response.data.data;
                that.pageSize = that.pageInfo.pageSize;
                that.totalCount = that.pageInfo.totalCount;
                that.totalPage = that.pageInfo.totalPage;
                that.tableData = that.pageInfo.beanList;
                that.pageCode = that.pageInfo.pageCode;
              })
              .catch(function(error) {
                console.log(error);
              });
          } else {
            this.pageInfo = Response.data.data;
            this.pageSize = this.pageInfo.pageSize;
            this.totalCount = this.pageInfo.totalCount;
            this.totalPage = this.pageInfo.totalPage;
            this.tableData = this.pageInfo.beanList;
            this.pageCode = this.pageInfo.pageCode;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    projectName: function() {
      var that = this;
      axios
        .get(
          this.Url +
            "car?type=" +
            this.type +
            "&cityName=" +
            this.cityName +
            "&projectName=" +
            this.projectName +
            "&pageCode=" +
            this.pageCode +
            "&pageSize=" +
            this.pageSize
        )
        .then(Response => {
          if (this.pageCode > Response.data.data.totalPage) {
            axios
              .get(
                that.Url +
                  "car?type=" +
                  that.type +
                  "&cityName=" +
                  that.cityName +
                  "&projectName=" +
                  that.projectName +
                  "&pageCode=1&pageSize=" +
                  that.pageSize
              )
              .then(Response => {
                that.pageInfo = Response.data.data;
                that.pageSize = that.pageInfo.pageSize;
                that.totalCount = that.pageInfo.totalCount;
                that.totalPage = that.pageInfo.totalPage;
                that.tableData = that.pageInfo.beanList;
                that.pageCode = that.pageInfo.pageCode;
              })
              .catch(function(error) {
                console.log(error);
              });
          } else {
            this.pageInfo = Response.data.data;
            this.pageSize = this.pageInfo.pageSize;
            this.totalCount = this.pageInfo.totalCount;
            this.totalPage = this.pageInfo.totalPage;
            this.tableData = this.pageInfo.beanList;
            this.pageCode = this.pageInfo.pageCode;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  methods: {
    handleEdit(datas) {
      let that = this;
      axios
        .get(that.Url + "city?pageSize=1000")
        .then(Response => {
          that.city = Response.data.data.beanList;
        })
        .catch(function(error) {
          console.log(error);
        });
      axios
        .get(this.Url + "project?pageSize=1000")
        .then(Response => {
          that.project = Response.data.data.beanList;
        })
        .catch(function(error) {
          console.log(error);
        });
      that.dialogFormData.type = datas.type;
      that.currentType = datas.type;
      that.dialogFormData.name = datas.name;
      that.currentName = datas.name;
      that.dialogFormData.pwd = datas.pwd;
      that.dialogFormData.capacity = datas.capacity;
      that.dialogFormData.city_id = datas.city_id;
      that.dialogFormData.project_id = datas.project_id;
      that.dialogFormData.car_id = datas.car_id;
      that.dialogFormVisible = true;
    },
    editForm() {
      let that = this;
      that.$refs.editCar.validate(valid => {
        if (valid) {
          axios
            .put(that.Url + "car", that.dialogFormData)
            .then(function(res) {
              that.dialogFormVisible = false;
              that.$message({
                message: "修改成功",
                type: "success",
                offset: "200",
                duration: 1000,
                showClose: true
                // onClose:function(){
                // that.$router.go(0);
                // }
              });
              that.handleCurrentChange(that.pageCode);
            })
            .catch(function(error) {
              console.log(error);
            });
        }
      });
    },

    warnDelete(datas) {
      console.log(datas);
      this.delete_id = datas.car_id;
      this.dialogDeleteVisible = true;
    },

    submitDelete() {
      let that = this;
      axios
        .delete(that.Url + "car/" + that.delete_id)
        .then(function(res) {
          that.$message({
            message: "删除成功",
            type: "success",
            offset: "200",
            duration: 1000,
            showClose: true,
            // onClose: function() {
            //   that.$router.go(0);
            // }
          });
          that.dialogDeleteVisible = false;
          that.handleCurrentChange(that.pageCode);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    eiditPhotoDialog(scope) {
      this.dialogPhotoVisible = true;
      this.photoCarId = scope.row.car_id;
    },
    beforeupload(file) {
      //this.formData.append('car-image-file', file)
      return false;
    },
    beforeRemove(file, fileList) {
      this.fileImg = "";
    },
    changeUpload(file, fileList) {
      // 选中后将图片地址赋值给裁剪框显示图片
      this.$nextTick(() => {
        console.log(file);
        this.fileInfo = file.name;
        this.fileImg = file.url;
        this.option.img = file.url;
        this.dialogVisible = true;
      });
    },
    finish() {
      this.$refs.cropper.getCropBlob(data => {
        this.fileImg = window.URL.createObjectURL(data);
        this.formData.delete("car-image-file");
        this.formData.append("car-image-file", data, this.fileInfo);
        this.dialogVisible = false;
      });
    },
    uploadPhoto() {
      let that = this;
      that.$refs.upload.submit();
      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      axios
        .put(
          that.Url + "car/updatePhoto?car_id=" + that.photoCarId,
          that.formData,
          config
        )
        .then(function(res) {
          that.dialogPhotoVisible = false;
          that.$message({
            message: "修改成功",
            type: "success",
            offset: "200",
            duration: 1000,
            showClose: true,
            // onClose: function() {
            //   that.$router.go(0);
            // }
          });
          that.handleCurrentChange(that.pageCode);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    handleCurrentChange(val) {
      axios
        .get(
          this.Url +
            "car?type=" +
            this.type +
            "&cityName=" +
            this.cityName +
            "&projectName=" +
            this.projectName +
            "&pageCode=" +
            val +
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
    handleSizeChange(val) {
      this.pageSize = val;
      axios
        .get(
          this.Url +
            "car?type=" +
            this.type +
            "&cityName=" +
            this.cityName +
            "&projectName=" +
            this.projectName +
            "&pageCode=" +
            this.pageCode +
            "&pageSize=" +
            this.pageSize
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
.carList .el-table {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
}
.carImage {
  width: 100px;
  height: 80px;
  margin-top: 10px;
}
.editImage {
  display: block;
  float: right;
  margin-top: 35px;
}
.cropper {
  width: auto;
  height: 500px;
}
</style>
