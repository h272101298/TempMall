<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品规格</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
     <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" size="medium" @click="newone" v-show="checkper1">新增规格</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" border stripe style="width:1501px">
      <el-table-column prop="id" label="编号" width="100" align="center">
      </el-table-column>
      <el-table-column prop="title" label="名称" width="400" align="center">
      </el-table-column>

      <el-table-column prop="detail" label="详情" width="600" align="center">
      </el-table-column>

      <el-table-column label="操作" width="400" align="center">
       <template slot-scope="scope">
        <!-- <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
        <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)" v-show="checkper2">删除</el-button>
      </template>
    </el-table-column>

  </el-table>

  <el-pagination style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
  </el-pagination>
</el-col>




<el-col>
  <el-dialog :title="diatitle" :visible.sync="dialogNewVisible" width="500" center style="min-width: 500px">
    <el-form label-width="120px" width="800px" center >

      <el-form-item label="商品分类：" prop="type">
        <el-select v-model="type1" placeholder="请选择一级分类" filterable @change="gettype2">
          <el-option v-for="item in typeArr1" :label="item.title" :value="item.id" :key="item.id"></el-option>
        </el-select>
        <el-select v-model="type2" placeholder="请选择二级分类" filterable v-show="type1" @change="gettype3">
          <el-option v-for="item in typeArr2" :label="item.title" :value="item.id" :key="item.id"></el-option>
        </el-select>
        <el-select v-model="type_id" placeholder="请选择三级分类" filterable v-show="type2" @change="confirmtype">
          <el-option v-for="item in typeArr3" :label="item.title" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="添加规格：">
        <div v-for="(guige, index) in guige" style=""><!-- display: flex;justify-content: flex-start;align-items: center;flex-wrap: wrap; -->
          <el-input size="small" v-model="guige.title" style="display:block;width: 200px;margin:5px 5px 5px 0;" placeholder="规格名"></el-input>
          <div v-for="(item,index) in guige.detail" style="display:inline-block;"> 
            <el-input size="small" v-model="item.content" style="width: 130px;margin:5px 5px 5px 0;" placeholder="详细内容"></el-input>
          </div>
          <el-button @click.prevent="adddetail(index)" type="primary" size="mini" style="margin: 5px">新增详细</el-button>
          <el-button @click.prevent="removeguige(guige)" type="danger" size="mini" style="margin: 5px">删除规格</el-button>
        </div>
        <el-button @click.prevent="addguige()" type="primary" size="small" style="margin-top: 10px;">新增规格</el-button>
      </el-form-item>

      <el-form-item style="margin-left: calc(50% - 185px);">
        <el-button type="primary" @click="save()">保 存</el-button>
        <el-button @click="dialogNewVisible = false">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</el-col>


<el-col>
  <el-dialog title="删除不可恢复，是否确定删除？" :visible.sync="dialogDelVisible" width="30%">
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitdel()">确 定</el-button>
      <el-button @click="dialogDelVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</el-col>

</el-row>
</template>



<script>

  import { typeGet } from '../../api/api';

  import {guigeGet} from '../../api/api';
  import {guigePost} from '../../api/api';
  import {guigeDel} from '../../api/api';

  import { Message } from 'element-ui';

  export default {
    data() {
      return {
        guige:[{
          value:'',
          detail:[]
        }],

        currentPage: 1,
        list:[],
        count:0,
        limit:10,
        dialogNewVisible:false,
        dialogDelVisible:false,
        putorup:'up',
        diatitle:'新增规格',
        noone:false,
        editId:'',
        delId:'',


        type_id:null,

        typeArr1:[],
        type1:'',
        typeArr2:[],
        type2:'',
        typeArr3:[],

        checkper1:false,
        checkper2:false,
      }
    },

    methods:{
      checkPer(){
        var per = sessionStorage.getItem('permissions');
      // console.log(per)
      if(per.indexOf('productCategoryAdd')>-1){
        this.checkper1=true;
      }

      var per = sessionStorage.getItem('permissions');
      // console.log(per)
      if(per.indexOf('productCategoryDel')>-1){
        this.checkper2=true;
      }
    },



    getlist(){
      var allParams = '?page='+ this.currentPage + '&limit=' + this.limit;
      guigeGet(allParams).then((res) => {
        this.list=res.data.data;
        this.count=res.data.count
      });
    },


    gettype1(){
      var allParams = '?level=1';
      typeGet(allParams).then((res) => {
        this.typeArr1=res.data.data;
      });
    },

    gettype2(e){
      var allParams = '?parent='+ e;
      typeGet(allParams).then((res) => {
        this.typeArr2=[];
        this.typeArr2=res.data.data;
      });
    },

    gettype3(e){
      var allParams = '?parent='+ e;
      typeGet(allParams).then((res) => {
        this.typeArr3=res.data.data;
      });
    },

    confirmtype(e){
      this.type_id=e;
    },




    removeguige(item) {
      var index = this.guige.indexOf(item)
      if (index !== -1) {
        this.guige.splice(index, 1)
      }
    },

    adddetail(e) {
      this.guige[e].detail.push({
        content: '',
      });
    },

    addguige() {
      if(this.type_id==null){
        Message({
          message: "请先选择分类",
          type: 'error'
        });
      }else{
        this.guige.push({
          title: '',
          detail:[]
        });
      }
    },

    newone(){
     this.putorup='up';
     this.diatitle='新增规格',
     this.dialogNewVisible=true,

     this.guige=[]
   },




   save(){

      // console.log(this.guige)

      // if(this.newadv.logo==''){
      //   this.$message({
      //     message: '请上传分类logo',
      //     type: 'error'
      //   });
      // }else if(this.newadv.title==''){
      //   this.$message({
      //     message: '请输入分类名称',
      //     type: 'error'
      //   });
      // }
      // else{


        // if( this.putorup=='put'){
        //   var allParams = {
        //     title:this.guige.title,
        //     id:this.editId,
        //     detail:[]
        //   };
        // }else{
        //   var allParams = {
        //      title:this.guige.title,
        //     detail:this.guige.detail,
        //   };
        // }

        var allParams={
          type_id:this.type_id,
          categories:this.guige
        };
        guigePost(allParams).then((res) => {
          if (res.msg === "ok") {
           this.$message({
            message: '提交成功',
            type: 'success'
          });
           this.getlist();
           this.noone=true
           this.dialogNewVisible=false
         } else {
           this.$message({
            message: res.msg,
            type: 'error'
          });
         }
       });


      // }
    },


    handleDelete(index, row) {
      this.dialogDelVisible = true;
      this.delId = row.id;
    },

    submitdel(){
      this.dialogDelVisible = false;
      var allParams='?id='+this.delId
      guigeDel(allParams).then((res) => {
        // console.log(res)
        if (res.msg === "ok") {
         this.$message({
          message: '删除成功',
          type: 'success'
        });
         this.getlist();
         this.dialogDelVisible = false;
       } else {
         this.$message({
          message: res.msg,
          type: 'error'
        });
       }
     });
    },


    handleCurrentChange(val) {
      this.currentPage = val;
      this.getlist();
    },


    handleSizeChange(val){
      this.limit = val;
      this.getlist();
    },

  },

  mounted: function () {
    this.getlist();
    this.gettype1();
    this.checkPer();
  }
}
</script>


<style>

</style>
