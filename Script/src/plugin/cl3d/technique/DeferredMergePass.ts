import {ServiceUtil} from '../../../runtime/core/ServiceUtil';
import {Texture} from '../../../runtime/graphic/material/Texture';
import {EffectConsole} from '../graphic/EffectConsole';
import {PlaneRenderable} from '../shape/PlaneRenderable';
import {DeferredMergeAutomaticEffect} from './effect/DeferredMergeAutomaticEffect';
import {TechniquePass} from './TechniquePass';
import {Region} from '../base/Region';

//==========================================================
// <T>通用颜色渲染过程。</T>
//
// @author maocy
// @history 150119
//==========================================================
export class DeferredMergePass extends TechniquePass {
   // 渲染对象
   protected _renderable: PlaneRenderable;
   // 渲染效果
   protected _renderableEffect: DeferredMergeAutomaticEffect;
   // 深度纹理
   public textureDepth: Texture;
   // 法线纹理
   public textureNormal: Texture;
   // 颜色纹理
   public textureColor: Texture;

   //==========================================================
   // <T>构造处理。</T>
   //==========================================================
   public constructor() {
      super();
      // 设置属性
      this.code = 'merge';
   }

   //==========================================================
   // <T>配置处理。</T>
   //==========================================================
   public setup() {
      super.setup();
      // 创建平面对象
      var renderable = this._renderable = new PlaneRenderable();
      renderable.linkGraphicContext(this._graphicContext);
      renderable.setup();
   }

   //==========================================================
   // <T>首次绘制处理。</T>
   //
   // @param region 区域
   //==========================================================
   public drawFirst(region: Region) {
      var context = this._graphicContext;
      var renderable = this._renderable;
      // 获得渲染器
      var effectConsole: EffectConsole = ServiceUtil.find(EffectConsole);
      var effect = this._renderableEffect = <DeferredMergeAutomaticEffect>effectConsole.find(context, region, renderable);
      renderable.effectSet(effect.code, effect);
      // 设置材质
      var material = renderable.material;
      material.setTexture('depth', this.textureDepth);
      material.setTexture('normal', this.textureNormal);
      material.setTexture('color', this.textureColor);
   }

   //==========================================================
   // <T>开始绘制处理。</T>
   //
   // @param region 区域
   //==========================================================
   public drawBegin(region: Region): boolean {
      super.drawBegin(region);
      // 设置渲染目标
      var context = this._graphicContext;
      context.setRenderTarget(null);
      context.clearColorDepth(region.backgroundColor);
      // 绘制处理
      var effect = this._renderableEffect;
      context.setProgram(effect.program);
      effect.drawRenderable(region, this._renderable);
      return false;
   }
}