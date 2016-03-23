﻿import {FRegion} from '../base/FRegion';
import {FTechniquePass} from './FTechniquePass';

//==========================================================
// <T>通用颜色渲染过程。</T>
//
// @author maocy
// @history 150119
//==========================================================
export class FGeneralColorPass extends FTechniquePass {
   //==========================================================
   // <T>构造处理。</T>
   //==========================================================
   public constructor() {
      super();
      this.code = 'color';
   }

   //==========================================================
   // <T>绘制区域处理。</T>
   //
   // @param region 区域
   //==========================================================
   public drawRegion(region: FRegion) {
      // 设置渲染目标
      var context = this._graphicContext;
      context.setRenderTarget(null);
      // 绘制处理
      super.drawRegion(region);
   }
}