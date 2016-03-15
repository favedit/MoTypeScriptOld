import {FE3rObject} from './FE3rObject';

//==========================================================
// <T>渲染几何体。</T>
//
// @author maocy
// @history 150106
//==========================================================
export abstract class FE3rBitmapPack extends FE3rObject {
   // 纹理
   protected _texture = null;
   // 数据准备好
   protected _dataReady = false;
   // 准备好
   protected _ready = false;

   //==========================================================
   // <T>构造处理。</T>
   //==========================================================
   public constructor() {
      super();
   }

   //==========================================================
   // <T>获得纹理。</T>
   //==========================================================
   public get texture() {
      return this._texture;
   }

   //==========================================================
   // <T>测试是否准备好。</T>
   //
   // @return Boolean 是否准备好
   //==========================================================
   public testReady() {
      if (this._dataReady) {
         this._ready = this._texture.isValid();
      }
      return this._ready;
   }

   //==========================================================
   // <T>数据加载处理。</T>
   //==========================================================
   public abstract onLoad();

   //==========================================================
   // <T>释放处理。</T>
   //==========================================================
   public dispose() {
      this._ready = false;
      this._dataReady = false;
      super.dispose();
   }
}