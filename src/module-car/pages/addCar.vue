<template>
  <div>
    <div class="addCars">
      <el-form
        :model="formData"
        label-position="left"
        label-width="80px"
        :rules="rules"
        ref="addCar"
      >
        <el-form-item label="车标" prop="type">
          <el-input v-model.trim="formData.type" placeholder="请输入车标名称"></el-input>
        </el-form-item>

        <el-form-item label="账号" prop="name">
          <el-input v-model.trim="formData.name" placeholder="请输入帐号"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="pwd">
          <el-input v-model.trim="formData.pwd" placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item label="载客量" prop="capacity">
          <el-input v-model.number="formData.capacity" placeholder="请输入载客量"></el-input>
        </el-form-item>

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

        <el-form-item label="所属城市" prop="city_id">
          <el-select v-model="formData.city_id" placeholder="选择城市">
            <el-option
              v-for="item in city"
              :key="item.city_id"
              v-bind:label="item.name"
              v-bind:value="item.city_id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="上传图片" ref="uploadElement" prop="imageUrl">
            <el-upload  class="upload-demo"  ref="upload" action="" :auto-upload="false"
              :before-upload="beforeupload"  accept="image/png, image/jpg, image/jpeg"
              list-type="picture" limit=1 :show-file-list="true" :on-change='changeUpload' 
               :before-remove="beforeRemove">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png/jpeg文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>

        <!-- 显示裁剪后的图片 -->
        <div class="file-image" v-if="fileImg" style="width:320px;height:140px;background-color:fff;margin-left:80px;margin-bottom:50px" >
          <el-tag type="success">裁剪后图样(若要删除请于原图处点击)</el-tag>
          <img :src="fileImg" alt="头像" style="width:100px;height:100px;margin-left:10px">
        </div>

        <!-- vueCropper 剪裁图片实现-->
        <el-dialog title="图片剪裁" :visible.sync="dialogVisible" :close-on-press-escape="false" :close-on-click-modal="false" append-to-body>
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
              >
              </vueCropper>
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="finish">确认</el-button>
          </div>
        </el-dialog>

        <el-form-item>
          <el-button type="primary" @click="submitForm('formData')" :loading="loading">立即添加</el-button>
          <el-button type="warning" @click="resetForm('addCar')">选择重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { VueCropper }  from 'vue-cropper' 

export default {
  components: {
  VueCropper
  },
  beforeMount: function() {
    axios
      .get(this.Url + "city?pageSize=1000")
      .then(Response => {
        this.city = Response.data.data.beanList;
      })
      .catch(function(error) {
        console.log(error);
      });
    axios
      .get(this.Url + "project?pageSize=1000")
      .then(Response => {
        this.project = Response.data.data.beanList;
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
      } else {
        axios
          .get(that.Url + "car/ifExistCarName?name=" + value)
          .then(response => {
            if (response.data.data == 1) {
              return callback(new Error("该账号已存在"));
            } else {
              return callback();
            }
          })
          .catch(function(error) {
            console.log(error);
          });
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
      axios
        .get(that.Url + "car/ifExistCarType?type=" + value)
        .then(response => {
          if (response.data.data == 1) {
            return callback(new Error("该车辆标识已存在"));
          }
        })
        .catch(function(error) {
          console.log(error);
        });
      return callback();
    };
    // var checkCapacity=(rule, value, callback)=>{

    //      if(!name.test(value))
    //      {
    //        callback(new Error('密码应由3-15位字母、数字或者下划线构成'));
    //      }
    // };
    return {
      formData: {
        type: "",
        name: "",
        pwd: "",
        city_id: "",
        project_id: "",
        capacity: "",
        file: ""
      },
      city: "",
      project: "",
      form: new FormData(),
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
        img: '', // 裁剪图片的地址
        outputSize: 0.8, 
        outputType: 'jpeg', 
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
        full: false, 
      },
      fileImg:'',
      // 防止重复提交
      loading: false,
      fileInfo: '',  
    };
  },
  methods: {
    beforeupload(file) {
     // this.form.append("car-image-file", file);
      return false;
    },
    beforeRemove(file, fileList){
     
     this.fileImg='';
    },
     changeUpload (file, fileList) {
      // 选中后将图片地址赋值给裁剪框显示图片
      this.$nextTick(() => {
        console.log(file);
        this.fileInfo=file.name;
        this.fileImg=file.url;
        this.option.img = file.url;
        this.dialogVisible = true;
      })
     },
     finish(){
        this.$refs.cropper.getCropBlob((data) => {
        // this.loading = true;
        this.fileImg = window.URL.createObjectURL(data);
        this.form.delete("car-image-file");
        this.form.append("car-image-file", data,this.fileInfo);
       
        this.dialogVisible = false;
        })
     },
    submitForm(formName) {
      let that = this;
      that.loading = true;
      that.$refs.addCar.validate(valid => {
        if (valid) {
          that.form.append("type", that.formData.type);
          that.form.append("name", that.formData.name);
          that.form.append("pwd", that.formData.pwd);
          that.form.append("city_id", that.formData.city_id);
          that.form.append("project_id", that.formData.project_id);
          that.form.append("capacity", that.formData.capacity);
        
          that.$refs.upload.submit();

          let config = {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          };

          axios
            .post(this.Url + "car", that.form, config)
            .then(function(res) {
              that.$message({
                message: "添加成功",
                type: "success",
                showClose: true,
                offset: "200",
                duration: 1000,
                // onClose: function() {
                //   that.$router.go(0);
                // }
              });
              that.loading = false;
            })
            .catch(function(error) {
              that.loading = false;
              console.log(error);
            });
          //  that.form.forEach(
          //    (value,key)=>
          //    {
          //      console.log(key+'=>'+value);
          //    }
          //  )
        } else {
          that.loading = false;
          console.log("error submit!!");
          return false;
        }
      });
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
    .addCars{
        margin-top:100px;
        margin-left:50px;
        width:400px
    }
    .file-image{width: 100px; height: 100px; font-size: 14px; border: 1px solid #cccccc; margin: 15px 0;}

/* 截图 */
/* .cropper-content {} */
.cropper {width: auto; height: 500px;}

</style>
