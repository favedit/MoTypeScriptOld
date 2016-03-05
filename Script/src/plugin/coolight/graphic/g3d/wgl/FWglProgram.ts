import {RLogger} from '../../../../../runtime/common/lang/RLogger';
import {RClass} from '../../../../../runtime/common/reflect/RClass';
import {EShader} from '../EShader';
import {FProgram} from '../FProgram';
import {FProgramParameter} from '../FProgramParameter';
import {FProgramAttribute} from '../FProgramAttribute';
import {FProgramSampler} from '../FProgramSampler';
import {FVertexShader} from '../FVertexShader';
import {FFragmentShader} from '../FFragmentShader';
import {FWglVertexShader} from './FWglVertexShader';
import {FWglFragmentShader} from './FWglFragmentShader';

//==========================================================
// <T>WebGL渲染程序。</T>
//
// @author maocy
// @history 141230
//==========================================================
export class FWglProgram extends FProgram {
   // 句柄
   public handle = null;

   //==========================================================
   // <T>配置处理。</T>
   //
   // @method
   //==========================================================
   public setup() {
      var graphic = this.graphicContext.handle;
      this.handle = graphic.createProgram();
   }

   //==========================================================
   // <T>获得顶点渲染器。</T>
   //
   // @method
   // @return FVertexShader 顶点渲染器
   //==========================================================
   public vertexShader(): FVertexShader {
      var shader = this._vertexShader;
      if (!shader) {
         shader = this._vertexShader = RClass.create(FWglVertexShader);
         shader.linkGraphicContext(this.graphicContext);
         shader.setup();
      }
      return shader;
   }

   //==========================================================
   // <T>获得像素渲染器。</T>
   //
   // @method
   // @return FFragmentShader 顶点渲染器
   //==========================================================
   public fragmentShader(): FFragmentShader {
      var shader = this._fragmentShader;
      if (!shader) {
         shader = this._fragmentShader = RClass.create(FWglFragmentShader);
         shader.linkGraphicContext(this.graphicContext);
         shader.setup();
      }
      return shader;
   }

   //==========================================================
   // <T>上传内容处理。</T>
   //
   // @method
   // @param shaderCd 渲染程序类型
   // @param source 渲染代码
   //==========================================================
   public upload(shaderCd: EShader, source: string): void {
      if (shaderCd == EShader.Vertex) {
         this.vertexShader().upload(source);
      } else if (shaderCd == EShader.Fragment) {
         this.fragmentShader().upload(source);
      } else {
         throw new Error('Unknown type');
      }
   }

   //==========================================================
   // <T>构建内容处理。</T>
   //
   // @method
   //==========================================================
   public build() {
      var context = this.graphicContext;
      var graphic = context.handle;
      var handle = this.handle;
      // 设置顶点渲染器
      var vertexShader: any = this.vertexShader();
      graphic.attachShader(handle, vertexShader.handle);
      var result = context.checkError("attachShader", "Attach shader failure. (program_id=%d, shader_id=%d)", handle, vertexShader._handle);
      if (!result) {
         return result;
      }
      // 设置顶点渲染器
      var fragmentShader: any = this.fragmentShader();
      graphic.attachShader(handle, fragmentShader.handle);
      var result = context.checkError("attachShader", "Attach shader failure. (program_id=%d, shader_id=%d)", handle, fragmentShader._handle);
      if (!result) {
         return result;
      }
      // 设置属性集合
      if (this.hasAttribute()) {
         var attributes = this.attributes();
         var attributeCount = attributes.count();
         for (var n: number = 0; n < attributeCount; n++) {
            var attribute:FProgramAttribute = attributes.at(n);
            var attributeName = attribute.name;
            graphic.bindAttribLocation(handle, n, attributeName);
            result = context.checkError("bindAttribLocation", "Bind attribute location. (program_id=%d, slot=%d, name=%s)", handle, n, attributeName);
            if (!result) {
               return result;
            }
         }
      }
   }

   //==========================================================
   // <T>关联内容处理。</T>
   //
   // @method
   //==========================================================
   public link() {
      var context = this.graphicContext;
      var graphic = context.handle;
      var result = false;
      // 关联处理
      var handle = this.handle;
      graphic.linkProgram(handle);
      // 获得结果
      var pr = graphic.getProgramParameter(handle, graphic.LINK_STATUS);
      if (!pr) {
         var pi = graphic.getProgramInfoLog(handle);
         RLogger.fatal(this, null, "Link program failure. (status={1}, reason={2})", pr, pi);
         // 释放程序
         graphic.deleteProgram(this.handle);
         this.handle = null;
         return false;
      }
      //............................................................
      // 校验程序
      graphic.validateProgram(handle);
      // 获得结果
      var pr = graphic.getProgramParameter(handle, graphic.VALIDATE_STATUS);
      if (!pr) {
         var pi = graphic.getProgramInfoLog(handle);
         //MO.Logger.fatal(this, null, "Validate program failure. (reason={1})", pi);
         // 释放程序
         //g.deleteProgram(o._handle);
         //o._handle = null;
         //return false;
      }
      //............................................................
      // 结束处理
      graphic.finish();
      result = context.checkError("finish", "Finish program link faliure. (program_id={1})", handle);
      if (!result) {
         return result;
      }
      //............................................................
      // 关联常量集合
      if (this.hasParameter()) {
         var count = this._parameters.count();
         for (var n: number = 0; n < count; n++) {
            var parameter: FProgramParameter = this._parameters.at(n);
            var slot = graphic.getUniformLocation(handle, parameter.name);
            result = context.checkError("getUniformLocation", "Find parameter slot. (program_id=%d, name=%s, slot=%d)", handle, parameter.name, handle);
            if (!result) {
               return result;
            }
            parameter.slot = slot;
            if (slot != null) {
               parameter.statusUsed = true;
            }
         }
      }
      // 关联属性集合
      if (this.hasAttribute()) {
         var count = this._attributes.count();
         for (var n: number = 0; n < count; n++) {
            var attribute: FProgramAttribute = this._attributes.at(n);
            var slot = graphic.getAttribLocation(handle, attribute.name);
            result = context.checkError("getAttribLocation", "Find attribute slot. (program_id=%d, name=%s, slot=%d)", handle, attribute.name, handle);
            if (!result) {
               return result;
            }
            attribute.slot = slot;
            if (slot != -1) {
               attribute.statusUsed = true;
            }
         }
      }
      // 关联取样器集合
      if (this.hasSampler()) {
         var count = this._samplers.count();
         for (var n: number = 0; n < count; n++) {
            var sampler: FProgramSampler = this._samplers.at(n);
            var slot = graphic.getUniformLocation(handle, sampler.name);
            result = context.checkError("getUniformLocation", "Find sampler slot. (program_id=%d, name=%s, slot=%d)", handle, sampler.name, handle);
            if (!result) {
               return result;
            }
            sampler.slot = slot;
            if (slot != null) {
               sampler.statusUsed = true;
            }
         }
         var samplerIndex = 0;
         for (var n: number = 0; n < count; n++) {
            var sampler: FProgramSampler = this._samplers.value(n);
            if (sampler.statusUsed) {
               sampler.index = samplerIndex++;
            }
         }
      }
      return result;
   }

   //==========================================================
   // <T>释放处理。</T>
   //
   // @method
   //==========================================================
   public dispose() {
      var context = this.graphicContext;
      // 释放对象
      var handle = this.handle;
      if (handle) {
         context._handle.deleteProgram(handle);
         this.handle = null;
      }
      // 父处理
      super.dispose();
   }
}
