<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>限时砍价</el-breadcrumb-item>
        <el-breadcrumb-item>发布活动</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">

      <el-form label-width="120px" width="900px" center style="width: 1000px" :rules="rules" ref="newgood" :model="newgood">

        <el-form-item label="商品分类：" prop="type_id">
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

        <el-form-item label="选择商品：" prop="origin_price">
          <el-table :data="goodData"style="width: 100%" border empty-text="请先选择分类" size="mini" stripe>
            <el-table-column prop="name" label="名称" min-width="150" align="center">
            </el-table-column>
            <el-table-column prop="cover" label="图片" min-width="150" align="center">
              <template slot-scope="scope">
                <img :src="scope.row.cover" style="max-width:60px;max-height:60px;" />
              </template>
            </el-table-column>
            <el-table-column prop="norm" label="规格" min-width="150" align="center">
              <template slot-scope="scope">
                <el-tag type="success" v-show="scope.row.norm=='fixed'">统一规格</el-tag>
                <el-tag type="primary" v-show="scope.row.norm=='change'">多规格</el-tag>
                <el-tag type="primary" v-show="scope.row.norm!=='fixed' && scope.row.norm!=='change'">{{ goodguige }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="操作" min-width="150" align="center">
             <template slot-scope="scope">
              <el-button type="primary" size="small" @click="handleSelect(scope.$index, scope.row)">选择规格</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination v-show="selectgood" style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
        </el-pagination>
      </el-form-item>

      <el-form-item label="活动标题：" prop="description">
        <el-input v-model="newgood.description" placeholder="请输入活动标题（10字以内）" maxlength="10" style="width:500px;"></el-input>
      </el-form-item>

      <el-form-item label="商品数量：" prop="number">
        <el-input v-model="newgood.number" type="number" min="0" placeholder="请输入商品数量" style="width:500px;"></el-input>
      </el-form-item>

      <el-form-item label="活动时间：" prop="date">
        <el-date-picker v-model="date" type="datetimerange" :picker-options="pickerOptions" range-separator="-" value-format="yyyy-MM-dd HH:mm:ss" @change="getSTime" style="width:500px;" :editable=false start-placeholder="开始时间" end-placeholder="结束时间">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="砍价次数：" prop="clickNum">
        <el-input v-model="newgood.clickNum" type="number" min="0" placeholder="请输入砍价次数" style="width:500px;"></el-input>
      </el-form-item>

      <el-form-item label="原价：" prop="origin">
        <el-input v-model="newgood.origin" type="number" min="0" placeholder="请输入原价" style="width:500px;"></el-input>
      </el-form-item>

      <el-form-item label="底价：" prop="min">
        <el-input v-model="newgood.min" type="number" min="0" placeholder="请输入底价" style="width:500px;"></el-input>
      </el-form-item>



      <el-form-item style=";margin-top: 20px;">
        <el-button type="primary" @click="save()" size="medium">提交审核</el-button>
        <el-button @click="golist()" size="medium">取 消</el-button>
      </el-form-item>
    </el-form>


  </el-col>


  <el-col>
    <el-dialog title="选择规格" :visible.sync="dialogVisible" width="1000">
      <el-table :data="guigelist" style="width: 100%" border size="mini" stripe>
        <el-table-column prop="detail" label="规格名称" min-width="150" align="center">
          <template slot-scope="scope">
            <el-tag type="success" size="small" v-show="scope.row.product_detail=='fixed'">统一规格</el-tag>
            <el-tag type="primary" size="small" v-show="scope.row.product_detail!=='fixed'">{{ scope.row.detail }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cover" label="图片" min-width="150" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.cover" style="max-width:60px;max-height:60px;" />
          </template>
        </el-table-column>
        <el-table-column prop="price" label="现价" min-width="150" align="center">
        </el-table-column>
        <el-table-column prop="origin_price" label="原价" min-width="150" align="center">
        </el-table-column>
        <el-table-column prop="id" label="操作" min-width="150" align="center">
         <template slot-scope="scope">
          <el-button type="primary" size="small" @click="guigeSelect(scope.$index, scope.row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</el-col>



</el-row>
</template>



<script>

  import { typeGet } from '../../api/api';

  import { CardgoodGet } from '../../api/api';
  import { CardtypeGet } from '../../api/api';
  import { KanshopPost } from '../../api/api';

  import { Message } from 'element-ui';


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

      var checkvalue1 = (rule, value, callback) => {
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
         callback();
       } else if(Math.sign(value) == -1) {
        callback(new Error('请输入正数'));
      }else{
        callback(new Error('请输入数字'));
      }
    }, 100);
      };

      return {

        newgood:{
          stock_id:'',
          description:'',
          number:'',
          clickNum:'',
          start:'',
          end:'',
          origin:'',
          min:''
        },

        type_id:'',

        dialogVisible:false,
        goodguige:'',
        date:'',
        pickerOptions:{
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },

        guigelist:[],

        typeArr1:[],
        type1:'',
        typeArr2:[],
        type2:'',
        typeArr3:[],

        goodData:[],

        selectgood:true,

        checkOptions:[],
        checkList:[],
        checkList1:[],
        checkList2:[],

        dialogVisible:false,



        rules:{
          description: [
          {required: true, message: '请输入活动标题', trigger: 'blur'},
          ],
          number: [
          {required: true, validator: checkvalue, trigger: 'blur'},
          ],
          min: [
          {required: true, validator: checkvalue1, trigger: 'blur'},
          ],
          origin: [
          {required: true, validator: checkvalue, trigger: 'blur'},
          ],
          clickNum: [
          {required: true, validator: checkvalue, trigger: 'blur'},
          ],
        },

        currentPage:1,
        limit:10,
        count:0,

        allParams:null,
      };
    },


    methods:{

      // 分类
      gettype1(){
        var allParams = '?level=1';
        typeGet(allParams).then((res) => {
          this.typeArr1=res.data.data;
        });
      },

      gettype2(e){
        this.type2='';
        this.type_id='';
        
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
        this.getgood()
      },


      getgood(){
        var allParams = '?page='+ this.currentPage + '&limit=' + this.limit+ '&type=' + this.type_id;
        CardgoodGet(allParams).then((res) => {
          this.goodData=res.data.data;
          this.count=res.data.count
        });
      },

      getSTime(val){
        console.log(val[0])
        // var arr = val.split(",")
        this.newgood.start=val[0];
        this.newgood.end=val[1];
      },

      handleSelect(index, row){
        var allParams = '?product_id='+ row.id;
        CardtypeGet(allParams).then((res) => {
          console.log(res)
          this.goodname=row.name
          this.guigelist=res.data
          this.dialogVisible=true
        });
      },

      guigeSelect(index, row){
        // console.log(row)
        this.goodData=[{
          name:this.goodname,
          cover:row.cover,
          id:row.product_id
        }]
        if(row.product_detail=='fixed'){
          this.goodData[0].norm='fixed'
        }
        this.goodguige=row.detail
        this.selectgood=false
        this.newgood.stock_id=row.id
        this.dialogVisible=false
      },



      save(){
        if(this.newgood.stock_id==''){
          this.$message.error(`请选择商品`);
          return
        }
        
        if(this.newgood.start=='' || this.newgood.end==''){
          this.$message.error(`请选择活动时间`);
          return
        }

        this.$refs.newgood.validate((valid) => {
          if (valid) {
            var allParams = {
              stock_id:this.newgood.stock_id,
              description:this.newgood.description,
              number:this.newgood.number,
              offer:this.newgood.offer,
              clickNum:this.newgood.clickNum,
              start:this.newgood.start,
              end:this.newgood.end,
              min_price:this.newgood.min,
              origin_price:this.newgood.origin,
            };
            
            KanshopPost(allParams).then((res) => {
              console.log(res)
              if (res.msg === "ok") {
               this.$message({
                message: '提交成功',
                type: 'success'
              });
               this.$router.push({ path: '/Kan/Kangood' });

             } else {
               this.$message({
                message: res.msg,
                type: 'error'
              });
             }
           });
          }else{
            return false;
          }
        })
      },

      golist(){
       this.$router.push({ path: '/Kan/Kangood' });
     },


     handleCurrentChange(val) {
      this.currentPage = val;
      this.getgood();
    },


    handleSizeChange(val){
      this.limit = val;
      this.getgood();
    },
  },


  mounted: function () {
    this.gettype1()
  }
}
</script>



<style scope>

</style>
