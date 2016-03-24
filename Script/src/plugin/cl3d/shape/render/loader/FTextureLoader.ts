import {Fatal} from '../../../runtime/common/lang/Fatal';
import {ProcessLoader} from '../../../runtime/core/service/ProcessLoader';
import {FPhongMaterial} from '../../material/FPhongMaterial';

//==========================================================
// <T>材质加载器。</T>
//
// @author maocy
// @history 160323
//==========================================================
export class FTextureLoader extends ProcessLoader {
   // 图形环境
   public graphicContext;
   // 资源
   public resource;
   // 纹理
   public texture;

   //==========================================================
   // <T>处理加载</T>
   //
   // @param 处理结果
   //==========================================================
   public processLoad(): boolean {
      var ready = this.ready;
      if (!ready) {
         var resource = this.resource;
         if (resource.testReady()) {
            // 创建材质
            var texture = null;
            if (resource.className == 'phong') {
               texture = new FPhongMaterial();
            } else {
               throw new Fatal(this, 'Unknown texture.');
            }
            texture.linkGraphicContext(this.graphicContext);
            texture.loadResource(resource);
            // 加载完成
            this.texture = texture;
            this.ready = true;
         }
      }
      return ready;
   }
}