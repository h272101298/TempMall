<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>编辑商品</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">

      <el-tabs v-model="activeName" type="card" @tab-click="clicktab">
        <el-tab-pane label="基本信息" name="base">
          <el-form label-width="120px" width="900px" center style="width: 1000px" :rules="rules1" ref="newgood1" :model="newgood1">
           <el-form-item label="商品名称：" prop="name">
            <el-input v-model="newgood1.name" placeholder="请输入商品名称(26字以内)"></el-input>
          </el-form-item> 

          <el-form-item label="分销佣金：" prop="brokerage">
            <el-input v-model="newgood1.brokerage" type="number" min="0" placeholder="请输入分销佣金(百分比)"></el-input>
          </el-form-item>

          <el-form-item label="商品描述：" prop="share_detail">
            <el-input v-model="newgood1.share_detail" placeholder="请输入商品描述"></el-input>
          </el-form-item>

          <el-form-item label="分享标题：" prop="share_title">
            <el-input v-model="newgood1.share_title" placeholder="请输入分享标题(10字以内)"></el-input>
          </el-form-item>

          <el-form-item label="商品详情：" prop="detail">
           <div class="edit_container">
            <quill-editor v-model="newgood1.detail" style="min-height:133px;" :options="editorOption" ref="myQuillEditor" class="editer"></quill-editor>
            <el-upload class="avatar-uploader quill-img" :action="upurl" :before-upload='beforeUpload' :data="uptoken" :on-success='quillImgSuccess' style="display: none">
              <el-button size="small" type="primary" id="imgInput" element-loading-text="插入中,请稍候">点击上传</el-button>
            </el-upload>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" style="color: #fff" @click="addattr">继续添加商品属性</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>

    <el-tab-pane label="商品属性" name="attributes" :disabled="attrtab">
      <el-form label-width="120px" width="900px" center style="width: 1000px" :rules="rules2" ref="newgood2" :model="newgood2">

        <el-form-item label="商品分类：" prop="type_id">
          <el-select v-model="type1" placeholder="请选择一级分类" filterable @change="gettype2">
            <el-option v-for="item in typeArr1" :label="item.title" :value="item.id" :key="item.id"></el-option>
          </el-select>
          <el-select v-model="type2" placeholder="请选择二级分类" filterable v-show="type1" @change="gettype3">
            <el-option v-for="item in typeArr2" :label="item.title" :value="item.id" :key="item.id"></el-option>
          </el-select>
          <el-select v-model="newgood2.type_id" placeholder="请选择三级分类" filterable v-show="type2" @change="confirmtype">
            <el-option v-for="item in typeArr3" :label="item.title" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品规格：" prop="sameornot" v-show="showradio">
          <el-radio-group v-model="sameornot" @change="changeguige">
            <el-radio label="1">统一规格</el-radio>
            <el-radio label="2">多规格</el-radio>
          </el-radio-group>
        </el-form-item>


        <el-table :data="goodid?aaa:pricearr" empty-text="请先选择规格" style="min-width:941px;margin-bottom: 20px;margin-left: 120px" border size="mini" v-show="showmore" @cell-mouse-enter="cellmouseenter" @cell-click="cellclick">
          <el-table-column type="index" label="序号" width="60" align="center">
          </el-table-column>
          <el-table-column prop="title" label="规格" width="120" align="center">
            <template slot-scope="scope">
              <div v-show="scope.row.title==1 ? false : true">
                <span v-for="(item,index) in scope.row.title" :v-key="item.index" @click="ggselect1(scope.$index,scope.row)">{{item}} </span>
              </div>
              <el-button v-show="scope.row.title==1 ? true : false" type="primary" @click="ggselect2(scope.$index,scope.row)" size="small">选择规格</el-button>
            </template>
          </el-table-column>
          <el-table-column label="商品缩略图" width="120" align="center" prop="cover">
           <template slot-scope="scope">
            <el-upload class="upload-demo" :action="upurl" :data="uptoken" :on-success="ggshandleSuccess" :show-file-list="false" accept="image/*">
              <img :src="scope.row.cover" class="pre-img" style="width:60px;height:60px;border:1px dashed #ccc;border-radius:5px;display: block;margin: auto 2px;;" @click="ggupcover(scope.$index)">
            </el-upload>
          </template>
        </el-table-column>
        <el-table-column label="相册" min-width="170" align="center" prop="images" >
          <template slot-scope="scope">
            <el-upload id="ggimglist" :action="upurl" :data="uptoken" list-type="picture-card" accept="image/*" :file-list="scope.row.images" :on-success="ggmshandleSuccess" :on-remove="ggmshandleRemove">
              <img src="../../../static/images/default1.png" class="pre-img" style="width:57px;height:57px;display: block;">
            </el-upload>
          </template>
        </el-table-column>
        <el-table-column label="原价" width="150" align="center">
         <template slot-scope="scope">
          <el-input placeholder="请输入原价" v-model="scope.row.origin_price" min="0" type="number" ></el-input>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column prop="" label="现价" width="150" align="center">
      <template slot-scope="scope">
        <el-input placeholder="请输入现价" v-model="scope.row.price" min="0" type="number"></el-input>
      </template>
    </el-table-column>


    <el-table-column prop="" label="操作" width="150" align="center">
      <template slot-scope="scope">
        <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">添加</el-button>
        <el-button type="danger" size="small" v-show="scope.$index==0 ? false : true" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>


  <el-form-item label="原价：" v-show="!showmore" prop="origin_price">
    <el-input v-model="newgood2.origin_price" type="number" min="0" placeholder="请输入原价"></el-input>
  </el-form-item>

  <el-form-item label="现价：" v-show="!showmore" prop="price">
    <el-input v-model="newgood2.price" type="number" min="0" placeholder="请输入现价"></el-input>
  </el-form-item>

  <el-form-item label="商品缩略图：" v-show="!showmore" prop="cover">
    <el-upload class="upload-demo" :action="upurl" :data="uptoken" :before-upload="beforeUpload" :on-success="handleSuccess" :show-file-list="false" accept="image/*">
      <img :src="newgood2.cover" class="pre-img" style="width:146px;height:146px;border:1px dashed #ccc;border-radius:6px;display: block">
      <p slot="tip" class="upload__tip">可上传JPG/PNG文件，建议图片长宽比为5:4</p>
    </el-upload>
  </el-form-item>

  <el-form-item label="商品相册：" v-show="!showmore" prop="images">
    <el-upload :action="upurl" :data="uptoken" list-type="picture-card" :on-remove="handleRemove" :on-success="handlelistSuccess" :file-list="newgood2.images" :multiple="true" accept="image/*">
      <img src="../../../static/images/default1.png" class="pre-img" style="width:145px;height:144px;display: block" >
      <p slot="tip" class="upload__tip">可上传JPG/PNG文件，建议图片长宽比为5:4</p>
    </el-upload>
  </el-form-item>

  <el-form-item>
    <el-button type="primary" @click="save()" size="medium">保 存</el-button>
    <el-button @click="golist()" size="medium">取 消</el-button>
  </el-form-item>
</el-form>
</el-tab-pane>
</el-tabs>


</el-col>


<el-col>
  <el-dialog title="选择规格" :visible.sync="dialogggVisible" width="30%" min-width="30%">
    <div style="border: 1px solid #eee;padding: 0 0 10px 10px;">
      <div v-for="(item,index) in checkOptions">
        <p style="margin: 10px;font-weight: 600;font-size: 16px;color:deepskyblue">{{item.title}}</p>
        <el-radio-group v-model="checkList[index]" @change=ggchange>
          <el-radio-button v-for="(items,index) in item.detailArray" :label="items.id+','+items.title" :true-label="items.title" :key="items.id" @click>{{items.title}}</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="ggsubmit()">确 定</el-button>
      <el-button @click="dialogggVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</el-col>

</el-row>
</template>



<script>

  import qiniu from '../../api/qiniu';

  import { typeGet } from '../../api/api';
  import { guigeGet } from '../../api/api';
  import { deliveryGet } from '../../api/api';

  import { goodPost } from '../../api/api';
  import { goodoneGet } from '../../api/api';

  import { Message } from 'element-ui';


  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';

  import { quillEditor } from 'vue-quill-editor' //调用编辑器

  export default {
    data() {
      var checkvalue = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('此项不能为空'));
        }
        setTimeout(() => {
          if (Math.sign(value) == 1) {
            if(value%1 === 0){
             callback();
           }else{
            callback();
          }
        } else if(Math.sign(value) == 0) {
          callback(new Error('不能为0'));
        } else if(Math.sign(value) == -1) {
          callback(new Error('请输入正数'));
        }else{
          callback(new Error('请输入数字'));
        }
      }, 100);
      };

      return {
        activeName:'base',
        // activeName:'attributes',
        attrtab:true,

        uptoken:{
          token:qiniu.token,
        },
        upurl:qiniu.upurl,

        editorOption:{
          placeholder: '请输入详细内容',
          theme: 'snow',
          modules: {
            toolbar: {
             container: [
             ['bold', 'italic', 'underline', 'strike'],
             ['blockquote', 'code-block'],
             [{ 'direction': 'rtl' }],
             [{ 'size': ['small', false, 'large', 'huge'] }],
             [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
             [{ 'color': [] }, { 'background': [] }],
             [{ 'font': [] }],
             [{ 'align': [] }],
             ['clean'],
             ['link', 'image']
             ],
             handlers: {
              'image': function (value) {
                if (value) {
                  document.querySelector('.quill-img input').click()
                } else {
                  this.quill.format('image', false);
                }
              }
            }
          }
        }
      },

      newgood1:{
        name:'',
        detail:'',
        brokerage:null,
        share_title:'',
        share_detail:''
      },

      newgood2:{
        cover:'../static/images/default1.png',
        images:[],
        origin_price:null,
        price:null,
        type_id:'',
        detail:[]
      },

      expressArr:[],

      typeArr1:[],
      type1:'',
      typeArr2:[],
      type2:'',
      typeArr3:[],

      sameornot:'1',
      showmore:'',

      checkOptions:[],
      checkList:[],
      checkList1:[],
      checkList2:[],


      dialogggVisible:false,
      ggcoverindex:null,
      ggimgindex:null,
      ggtitleindex:null,

      tempggarr:[],

      pricearr:[{
       index:0,
       detail:1,
       title:1,
       cover:'../static/images/default1.png',
       images:[],
       origin_price:null,
       price:null,
     }],

     aaa:[],

     rules1:{
      name: [
      {required: true, message: '请输入商品名称', trigger: 'blur'},
      ],
      detail: [
      {required: true, message: '请输入商品详情', trigger: 'blur'},
      ],
      brokerage: [
      {required: true, message: '请输入分销佣金', trigger: 'blur'},
      ],
      share_title: [
      {required: true, message: '请输入分享标题', trigger: 'blur'},
      ],
      share_detail: [
      {required: true, message: '请输入商品描述', trigger: 'blur'},
      ],
    },

    rules2:{
      origin_price: [
      {required: true, validator: checkvalue, trigger: 'blur'},
      ],
      price: [
      {required: true, validator: checkvalue, trigger: 'blur'},
      ],
    },

    showradio:true,

    allParams:null,

    goodid:''
  };
},

components: {
  quillEditor,
},

methods:{

  quillImgSuccess(res, file) {
    console.log(res)
    let quill = this.$refs.myQuillEditor.quill
    if (res.key) {
      let length = quill.getSelection().index;
      quill.insertEmbed(length, 'image', qiniu.showurl+ res.key)
      quill.setSelection(length + 1)
    } else {
      this.$message.error('图片插入失败')
    }
  },

  addattr(){
    this.$refs.newgood1.validate((valid) => {
      if (valid) {
        this.attrtab=false
        this.activeName="attributes"
      }else{
        this.attrtab=true
      }
    })
  },

  clicktab(res){
    if(res.name=="base"){
     this.attrtab=true
   }
 },

 checkgoodid(){
  var goodid=sessionStorage.getItem('goodeditid');
  this.goodid=goodid

  if(goodid){

    this.showradio=false

    var allParams = '?id='+ goodid;
    goodoneGet(allParams).then((res) => {

      this.newgood1={
        name:res.data.name,
        detail:res.data.detail,
        brokerage:res.data.brokerage,
        share_title:res.data.share_title,
        share_detail:res.data.share_detail
      }

      if(res.data.norm=="change"){
        this.sameornot='2'
        this.showmore=true
      }else{
       this.sameornot='1'
     }
     this.type1=res.data.typeArray[0]
     this.gettype2(this.type1)
     this.type2=res.data.typeArray[1]
     this.gettype3(this.type2)

     this.newgood2={
      cover:res.data.default.cover,
        // images:res.data.default.images,
        origin_price:res.data.default.origin_price,
        price:res.data.default.price,
        type_id:res.data.typeArray[2],
      }

      var images=[];
      for(var i=0;i<res.data.default.images.length;i++){
        images.push({
          uid:i,
          url:res.data.default.images[i],
          response:{
            key:1
          }
        })
      }
      this.newgood2.images=images

      if(res.data.norm=="fixed"){
        this.newgood2.id=res.data.default.id
      }
      if(res.data.norm=="change"){
        // console.log(this.pricearr)
        // console.log(res.data.stocks)
        var aaa=[]
        for(var i=0;i<res.data.stocks.length;i++){
          aaa.push({
            index:i,
            id:res.data.stocks[i].id,
            // detail:res.data.stocks[i].detail,
            title:res.data.stocks[i].product_detail,
            cover:res.data.stocks[i].cover,
            origin_price:res.data.stocks[i].origin_price,
            price:res.data.stocks[i].price
          })

          aaa[i].images=[];
          for(var j=0;j<res.data.stocks[i].images.length;j++){
            // console.log(res.data.stocks[i].images[j])
            aaa[i].images.push({
              uid:j,
              url:res.data.stocks[i].images[j]
            })
          }
        }
        // console.log(aaa)
        this.aaa=aaa

        this.pricearr=res.data.stocks
      }
    });
  }
},

      // 分类
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
        this.newgood2.type_id=e;
        this.getcategory()
      },

      // 规格
      changeguige(val){
        if(val=="1"){

          this.showmore=false
        }else if(val=="2"){

          this.getcategory()
          if(this.newgood2.type_id){
            this.showmore=true
          }
        }
      },

      getcategory(){
        if(this.newgood2.type_id){
          var allParams = '?page=1'+ '&limit=10000'+ '&typeid='+this.newgood2.type_id;
          guigeGet(allParams).then((res) => {
            this.checkOptions=res.data.data;
            if(this.sameornot==2){
              this.showmore=true
            }
          });
        }else{
          Message({
            message: "请先选择三级分类",
            type: 'error'
          });
        }
      },

      ggselect1(index,row){
        // console.log(row)
        this.checkList1=row.detail;
        this.checkList2=row.title;
        this.dialogggVisible=true;
        this.ggtitleindex=index;
      },

      ggselect2(index,row){  
        // console.log(row)
        this.checkList=[];
        this.dialogggVisible=true;
        this.ggtitleindex=index;
      },

      ggchange(val){
        // console.log(val)
        this.checkList1=[]
        this.checkList2=[]          
        // console.log(this.checkList)
        for(var i = 0;i<this.checkList.length;i++){
          if(this.checkList[i]){
            var ggitem=this.checkList[i].split(',')
            this.checkList1.push(ggitem[0]);
            this.checkList2.push(ggitem[1]);
          }else{
            // console.log(1)
          }
          // console.log(this.checkList)
          // var ggitem=this.checkList[i].split(',')
          // this.checkList1.push(ggitem[0]);
          // this.checkList2.push(ggitem[1]);
        }
        // console.log(this.checkList)
      },



      ggupcover(e){
        this.ggcoverindex=e
      },

      ggupimg(e){
        // console.log(e)
        this.ggimgindex=e
      },

      ggshandleSuccess(res, file) {
        this.pricearr[this.ggcoverindex].cover=qiniu.showurl+ res.key
      },

      ggmshandleSuccess(res, file,fileList){
        console.log(this.ggimgindex)
        this.pricearr[this.ggimgindex].images=[]
        for(var i=0;i<fileList.length;i++){
          if(fileList[i].response !== undefined){
            this.pricearr[this.ggimgindex].images.push(qiniu.showurl+ fileList[i].response.key)
          }else {
            this.pricearr[this.ggimgindex].images.push(fileList[i].url)
          }
        }
      },

      ggmshandleRemove(file, fileList){
        // console.log(file,fileList)
        this.pricearr[this.ggimgindex].images=[]
        for(var i=0;i<fileList.length;i++){
          this.pricearr[this.ggimgindex].images.push(qiniu.showurl+ fileList[i].response.key)
        }
      },

      cellmouseenter(row, column, cell, event){
        // console.log(row.index)
        // this.ggimgindex=row.index
      },

      cellclick(row, column, cell, event){
        console.log(row.index)
        this.ggimgindex=row.index
      },

      handleEdit(index, row){
        this.pricearr.push({
          index:index+1,
          detail:'',
          title:1,
          cover:'../static/images/default1.png',
          images:[],
          origin_price:null,
          price:null,
        })
      },

      handleDelete(index, row){
        console.log(this.pricearr)
        this.pricearr.splice(index,1)
      },


      ggsubmit(){          
        // console.log(this.ggtitleindex)
        // console.log(this.checkList)
        if(this.checkList.length==0){
          Message({
            message: "至少选择一个规格",
            type: 'error'
          });
        }else{
          this.dialogggVisible=false;
          this.pricearr[this.ggtitleindex].detail=this.checkList1;
          this.pricearr[this.ggtitleindex].title=this.checkList2;
          // console.log(this.checkList)
          // console.log(this.checkList1)
        }
      },

      //相册
      beforeUpload(file) {

      },

      handleSuccess(res, file) {
        this.newgood2.cover = qiniu.showurl+ res.key
      },

      handlelistSuccess(res, file,fileList){
        this.newgood2.images=[]
        for(var i=0;i<fileList.length;i++){
          if(fileList[i].response.key !== 1){
            this.newgood2.images.push(qiniu.showurl+ fileList[i].response.key)  
          }else {
            this.newgood2.images.push(fileList[i].url)
          }
        }
      },

      handleRemove(file, fileList) {
        this.newgood2.images=[]
        for(var i=0;i<fileList.length;i++){
          if(fileList[i].response.key !== 1){
            this.newgood2.images.push(qiniu.showurl+ fileList[i].response.key)
          }else {
            this.newgood2.images.push(fileList[i].url)
          }
        }
      },

      save(){

        // console.log(this.pricearr)
        // return

        var aaa =this.newgood2.images
        this.newgood2.images=[]
        for(var i=0; i<aaa.length; i++){
          if(typeof aaa[i] == 'object'){
            this.newgood2.images.push(aaa[i].url)
          }else {
            this.newgood2.images.push(aaa[i])
          }
        }
        // console.log(this.newgood2.images)


        this.$refs.newgood2.validate((valid) => {

          if(this.newgood2.type_id==null){
            Message({
              message: "请选择三级分类",
              type: 'error'
            });
            return
          }else{
            if(this.sameornot==1){
              if (valid) {
                if(this.newgood2.cover=="../static/images/default1.png"){
                  Message({
                    message: "请选择商品缩略图",
                    type: 'error'
                  });
                  return
                }else if(this.newgood2.images.length==0){
                  Message({
                    message: "请选择商品相册",
                    type: 'error'
                  });
                  return
                }else{

                  this.allParams = {
                    name:this.newgood1.name,
                    detail:this.newgood1.detail,
                    brokerage:this.newgood1.brokerage,
                    share_title:this.newgood1.share_title,
                    share_detail:this.newgood1.share_detail,
                    norm:'fixed',
                    type_id:this.newgood2.type_id,
                    stock:[this.newgood2]
                  };
                // console.log(this.allParams)
              }
            }else{
              return false;
            }
          }else{
           this.allParams = {
            name:this.newgood1.name,
            detail:this.newgood1.detail,
            brokerage:this.newgood1.brokerage,
            share_title:this.newgood1.share_title,
            share_detail:this.newgood1.share_detail,
            norm:'change',
            type_id:this.newgood2.type_id,
            stock:this.pricearr
          };
            // console.log(this.allParams)
          }
        }

        var goodeditid = window.sessionStorage.getItem('goodeditid')
        if(goodeditid){
          this.allParams.id=goodeditid;
        }
         // console.log(this.allParams)

         goodPost(this.allParams).then((res) => {
          console.log(res)

          Message({
            message: "提交成功",
            type: 'success'
          });
          this.$router.push({ path: '/Good/Goodlist' });
        });
       })
      },

      golist(){
        this.$router.push({ path: '/Good/Goodlist' });
      },


      test(){
       this.type1=68
       this.gettype2(this.type1)
       this.type2=69
       this.gettype3(this.type2) 
       this.newgood2.type_id=64
       this.newgood2.origin_price=64
       this.newgood2.price=64

       this.newgood1={
        name:'1',
        detail:'1',
        brokerage:1,
        share_title:'1',
        share_detail:'1'
      }
      this.activeName='attributes'
    },
  },

  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },

  mounted: function () {
    this.gettype1()
    this.checkgoodid()
    // this.test()
  }
}
</script>

<style scope>

#ggimglist .el-upload{
  width: 60px;
  height: 60px;  
  line-height: 60px;
}
#ggimglist .el-upload--picture-card{
  width: 60px;
  height: 60px;  
  line-height: 60px;
}
#ggimglist .el-upload-list__item-actions{
  width: 60px;
  height: 60px;  
  line-height: 60px;
}
#ggimglist .el-upload-list__item-thumbnail{
  width: 60px;
  height: 60px;  
  line-height: 60px;
}
#ggimglist .el-upload-list__item{
  width: 60px;
  height: 60px;  
  line-height: 60px;
}
#ggimglist .is-success{
  width: 60px;
  height: 60px;  
  line-height: 60px;
}
#ggimglist .el-icon-upload-success{
  position: relative;
  left: 1px;
  top: -14px;
}
#ggimglist .el-icon-check{
  position: relative;
  left: 1px;
  top: -14px;
}


.upload__tip{
  font-size: 12px;
  color: #606266;
}
</style>
