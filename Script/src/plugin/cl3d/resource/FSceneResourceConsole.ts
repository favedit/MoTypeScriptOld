import {EDataContent} from '../../runtime/common/lang/EDataContent';
import {FDictionary} from '../../runtime/common/lang/FDictionary';
import {RObject} from '../../runtime/common/lang/RObject';
import {ALinker} from '../../runtime/common/reflect/ALinker';
import {RClass} from '../../runtime/common/reflect/RClass';
import {RMemory} from '../../runtime/common/RMemory';
import {FResourceConsole} from '../../runtime/core/resource/FResourceConsole';
import {FConsole} from '../../runtime/core/FConsole';
import {SLoadArgs} from './SLoadArgs';
import {FSceneResource} from './FSceneResource';

//==========================================================
// <T>资源模板管理器。</T>
//
// @author maocy
// @history 150108
//==========================================================
export class FSceneResourceConsole extends FConsole {
   // 场景集合
   public _scenes: FDictionary<FSceneResource>;
   // 资源控制台
   @ALinker(FResourceConsole)
   protected _resourceConsole: FResourceConsole;
   //    // @attribute
   //    o._vendorCode = 'scene';
   //    o._dataUrl    = '/cloud.content.scene.wv'

   //==========================================================
   // <T>构造处理。</T>
   //==========================================================
   public constructor() {
      super();
      // 设置变量
      this._scenes = new FDictionary<FSceneResource>();
      // this._meshs = new MO.TDictionary();
      // this._skeletons = new MO.TDictionary();
      // this._animations = new MO.TDictionary();
      // 注册资源类型
      //var rc = MO.Console.find(MO.FResourceConsole);
      //var rp = MO.Class.create(MO.FResourcePipeline);
      //var rt = MO.Class.create(MO.FResourceType);
      //rt.setCode('resource3d.model');
      //rt._pipeline = rp;
      //rc.registerType(rt);
      //rc.factory().register('resource3d.model', FE3sModel);
   }

   //==========================================================
   // <T>获得场景集合。</T>
   //
   // @return 场景集合
   //==========================================================
   public scenes(): FDictionary<FSceneResource> {
      return this._scenes;
   }

   //==========================================================
   // <T>加载指定参数的场景资源。</T>
   //
   // @param args 加载参数
   // @return 资源场景
   //==========================================================
   public load(args: SLoadArgs): FSceneResource {
      // 生成地址
      // var vendor = RConsole.find(FE3sVendorConsole).find(EE3sResource.Scene);
      // var identity = null;
      // var guid = args.guid;
      // if (!MO.Lang.String.isEmpty(guid)) {
      //    vendor.set('guid', guid);
      //    identity = guid;
      // }
      // var code = args.code;
      // if (!MO.Lang.String.isEmpty(code)) {
      //    vendor.set('code', code);
      //    identity = code;
      // }
      // MO.Assert.debugNotEmpty(identity);
      // var url = vendor.makeUrl();
      var url = args.url;
      var identity = url;
      // 查找模型
      var scenes = this._scenes;
      var scene = scenes.get(identity);
      if (scene) {
         return scene;
      }
      // 创建模型资源
      scene = RClass.create(FSceneResource);
      // scene.setGuid(identity);
      // scene.setVendor(vendor);
      // scene.setSourceUrl(url);
      // 创建加载器
      this._resourceConsole.loadContent(EDataContent.Json, scene, url);
      // 存储模型
      scenes.set(identity, scene);
      return scene;
   }

   //==========================================================
   // <T>加载唯一编码的场景资源。</T>
   //
   // @param guid 唯一编号
   // @return 场景资源
   //==========================================================
   public loadByGuid(guid): FSceneResource {
      var args = RMemory.alloc(SLoadArgs);
      args.guid = guid;
      var scene = this.load(args);
      RMemory.free(args);
      return scene;
   }

   //==========================================================
   // <T>加载指定代码的场景资源。</T>
   //
   // @param code 代码
   // @return 场景资源
   //==========================================================
   public loadByCode(code): FSceneResource {
      var args = RMemory.alloc(SLoadArgs);
      args.code = code;
      var scene = this.load(args);
      RMemory.free(args);
      return scene;
   }

   //==========================================================
   // <T>加载指定地址的场景资源。</T>
   //
   // @param url 网络地址
   // @return 场景资源
   //==========================================================
   public loadByUrl(url: string): FSceneResource {
      var args = RMemory.alloc(SLoadArgs);
      args.url = url;
      var model = this.load(args);
      RMemory.free(args);
      return model;
   }


   //==========================================================
   // <T>释放处理。</T>
   //==========================================================
   public dispose() {
      // 释放属性
      this._scenes = RObject.dispose(this._scenes, true);
      // 父处理
      super.dispose();
   }
}