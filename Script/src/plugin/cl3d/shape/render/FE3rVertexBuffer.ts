import {FWglVertexBuffer} from '../../graphic/wgl/FWglVertexBuffer';

//==========================================================
// <T>渲染顶点缓冲。</T>
//
// @class
// @author maocy
// @history 150512
//==========================================================
export class FE3rVertexBuffer extends FWglVertexBuffer {
   // 资源对象
   public resource: any = null;

   //==========================================================
   // <T>释放处理。</T>
   //==========================================================
   public dispose() {
      this.resource = null;
      super.dispose();
   }
}