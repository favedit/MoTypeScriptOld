﻿import {ScopeEnum} from '../../../runtime/common/lang/ScopeEnum';
import {Fatal} from '../../../runtime/common/lang/Fatal';
import {Dictionary} from '../../../runtime/common/lang/Dictionary';
import {ClassUtil} from '../../../runtime/common/reflect/ClassUtil';
import {FConsole} from '../../../runtime/core/FConsole';
import {FTechnique} from './FTechnique';

//==========================================================
// <T>技术管理器。</T>
//
// @author maocy
// @history 150107
//==========================================================
export class FTechniqueConsole extends FConsole {
   // 技术集合
   protected _techniques: Dictionary<FTechnique> = null;

   //==========================================================
   // <T>构造处理。</T>
   //==========================================================
   public constructor() {
      super();
      this._scopeCd = ScopeEnum.Local;
      this._techniques = new Dictionary<FTechnique>();
   }

   //==========================================================
   // <T>根据类名称或对象获得技术器。</T>
   //
   // @method
   // @param context:FG3dContext 环境对象
   // @param clazz:Function 类对象
   // @return FG3dTechnique 效果器
   //==========================================================
   public find(context, clazz) {
      // 获得环境
      if (context.graphicContext) {
         context = context.graphicContext;
      }
      //if (!RClass.isClass(context, context.FGraphicContext)) {
      //   context = context.graphicContext;
      //}
      //if (!RClass.isClass(context, context.FGraphicContext)) {
      //   throw new FError(this, 'Unknown context.');
      //}
      // 查找技术
      var code = context.hashCode + '|' + ClassUtil.shortName(clazz);
      var techniques = this._techniques;
      var technique: FTechnique = techniques.get(code);
      if (!technique) {
         // 创建技术
         technique = ClassUtil.create(clazz);
         technique.linkGraphicContext(context);
         technique.setup();
         var techniqueCode = technique.code;
         // 设置过程集合
         var passes = technique.passes;
         var passCount = passes.count();
         for (var i: number = 0; i < passCount; i++) {
            var pass = passes.at(i);
            var passCode = pass.code;
            pass.fullCode = techniqueCode + '.' + passCode;
         }
         // 存储技术
         techniques.set(code, technique);
      }
      return technique;
   }
}
