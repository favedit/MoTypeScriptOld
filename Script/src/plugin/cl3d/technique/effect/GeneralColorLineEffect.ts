﻿import {DataTypeEnum} from '../../../../runtime/common/lang/DataTypeEnum';
import {TypeArrayUtil} from '../../../../runtime/common/lang/TypeArrayUtil';
import {ClassUtil} from '../../../../runtime/common/reflect/ClassUtil';
import {FFloatStream} from '../../base/util/FFloatStream';
import {RegionParameterEnum} from '../../base/RegionParameterEnum';
import {Material} from '../../../../runtime/graphic/material/Material';
import {LineMaterial} from '../../../../runtime/graphic/material/LineMaterial';
import {AutomaticEffect} from './AutomaticEffect';

//==========================================================
// <T>通用自动渲染器。</T>
//
// @author maocy
// @history 150119
//==========================================================
export class GeneralColorLineEffect extends AutomaticEffect {
   //==========================================================
   // <T>构造处理。</T>
   //==========================================================
   public constructor() {
      super();
      this.code = 'general.color.automatic';
   }

   //==========================================================
   // <T>建立材质数据。</T>
   //
   // @method
   // @param effectInfo:FG3dEffectInfo 渲染对象
   // @param renderable:FG3dRenderable 渲染对象
   //==========================================================
   public buildMaterial(effectInfo, renderable) {
      var material: Material = renderable.material;
      // 建立容器
      var data = effectInfo.material;
      if (!data) {
         data = effectInfo.material = ClassUtil.create(FFloatStream);
         data.setLength(40);
         material.dirty = true;
      }
      // 建立数据
      if (material.dirty) {
         data.reset();
         var lineMaterial = <LineMaterial>material;
         // 颜色透明（索引0）
         // if (material.optionAlpha) {
         //    data.writeFloat4(lineMaterial.alphaBase, lineMaterial.alphaRate, 0, 0);
         // } else {
         //    data.writeFloat4(lineMaterial.alphaBase, 1, 0, 0);
         // }
         data.writeFloat4(0, 1, 0, 0);
         // 颜色设置（索引1）
         //data.writeFloat4(phongMaterial.colorMin, phongMaterial.colorMax, phongMaterial.colorBalance, phongMaterial.colorRate);
         data.writeFloat4(0, 1, 0.5, 2);
         // 顶点颜色（索引2）
         //data.writeColor4(phongMaterial.vertexColor);
         data.writeFloat4(1, 1, 1, 1);
         // 环境颜色（索引3）
         data.writeColor4(lineMaterial.lineColor);
         // 散射颜色（索引4）
         //data.writeColor4(lineMaterial.diffuseColor);
         data.writeFloat4(0, 0, 0, 0);
         // 高光颜色（索引5）
         //data.writeColor4(phongMaterial.specularColor);
         data.writeFloat4(1, 1, 1, 1);
         // 高光参数（索引6）
         // data.writeFloat4(phongMaterial.specularBase, phongMaterial.specularLevel, phongMaterial.specularAverage, phongMaterial.specularShadow);
         data.writeFloat4(0, 0, 0, 0);
         // 反射颜色（索引7）
         //data.writeColor4(phongMaterial.reflectColor);
         data.writeFloat4(1, 1, 1, 1);
         // 反射参数（索引8）
         //data.writeFloat4(0, 0, 1 - phongMaterial.reflectMerge, phongMaterial.reflectMerge);
         data.writeFloat4(1, 1, 1, 1);
         // 发光颜色（索引9）
         //data.writeColor4(phongMaterial.emissiveColor);
         data.writeFloat4(1, 1, 1, 1);
         material.dirty = false;
      }
   }

   //==========================================================
   // <T>绘制渲染对象。</T>
   //
   // @param region 渲染区域
   // @param renderable 渲染对象
   //==========================================================
   public drawRenderable(region, renderable) {
      var program = this.program;
      // 获得参数
      var cameraPosition = region.calculate(RegionParameterEnum.CameraPosition);
      var lightDirection = region.calculate(RegionParameterEnum.LightDirection);
      var vpMatrix = region.calculate(RegionParameterEnum.CameraViewProjectionMatrix)
      // 绑定材质
      var material = renderable.material;
      this.bindMaterial(material);
      // 设置骨头集合
      var matrix = renderable.currentMatrix;
      program.setParameter('vc_model_matrix', matrix);
      program.setParameter('vc_vp_matrix', vpMatrix);
      program.setParameter('vc_camera_position', cameraPosition);
      program.setParameter('vc_light_direction', lightDirection);
      program.setParameter('fc_camera_position', cameraPosition);
      program.setParameter('fc_light_direction', lightDirection);
      // 设置材质
      var info = renderable.activeInfo;
      this.buildMaterial(info, renderable);
      program.setParameter('fc_materials', info.material.memory);
      // 绘制处理
      super.drawRenderable(region, renderable);
   }
}