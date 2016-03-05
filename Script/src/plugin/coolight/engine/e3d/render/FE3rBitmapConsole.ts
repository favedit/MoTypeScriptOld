//==========================================================
// <T>纹理控制台。</T>
//
// @console
// @author maocy
// @version 150106
//==========================================================
export class FE3rBitmapConsole{
//    o = MO.Class.inherits(this, o, MO.FConsole);
//    //..........................................................
//    // @attribute
//    o._scopeCd  = MO.EScope.Local;
//    o._bitmaps  = MO.Class.register(o, new MO.AGetter('_bitmaps'));
//    o._dataUrl  = '/cloud.resource.material.wv'
//    //..........................................................
//    // @method
//    o.construct = MO.FE3rBitmapConsole_construct;
//    // @method
//    o.load      = MO.FE3rBitmapConsole_load;
//    o.loadUrl   = MO.FE3rBitmapConsole_loadUrl;
//    return o;
// }

// //==========================================================
// // <T>构造处理。</T>
// //
// // @method
// //==========================================================
// MO.FE3rBitmapConsole_construct = function FE3rBitmapConsole_construct(){
//    var o = this;
//    o.__base.FConsole.construct.call(o);
//    // 设置属性
//    o._bitmaps = new MO.TDictionary();
// }

// //==========================================================
// // <T>加载一个渲染位图。</T>
// //
// // @method
// // @param context:FGraphicContext 渲染环境
// // @param guid:String 材质唯一编号
// // @param code:String 位图代码
// // @return FE3rBitmap 渲染位图
// //==========================================================
// MO.FE3rBitmapConsole_load = function FE3rBitmapConsole_load(context, guid, code){
//    var o = this;
//    // 查找模型
//    var flag = guid + '|' + code;
//    var bitmap = o._bitmaps.get(flag);
//    if(bitmap){
//       return bitmap;
//    }
//    // 生成地址
//    var url = MO.Window.Browser.hostPath(o._dataUrl + '?guid=' + guid + '&code=' + code);
//    MO.Logger.info(o, 'Load bitmap. (url={1})', url);
//    // 加载模型
//    var graphic = context.graphicContext();
//    if(code == 'environment'){
//       bitmap = graphic.createObject(MO.FE3rBitmapCubePack);
//    }else{
//       bitmap = graphic.createObject(MO.FE3rBitmapFlatPack);
//    }
//    bitmap.loadUrl(url);
//    o._bitmaps.set(flag, bitmap);
//    return bitmap;
// }

// //==========================================================
// // <T>加载一个模型。</T>
// //
// // @method
// // @param context:FRenderContext 渲染上下文
// // @param url:String 网络地址
// // @return FE3rBitmap 渲染位图
// //==========================================================
// MO.FE3rBitmapConsole_loadUrl = function FE3rBitmapConsole_loadUrl(context, url){
//    var o = this;
//    // 查找图片
//    var bitmap = o._bitmaps.get(url);
//    if(bitmap){
//       return bitmap;
//    }
//    // 生成地址
//    var loadUrl = MO.Window.Browser.contentPath(url);
//    MO.Logger.info(o, 'Load bitmap from url. (url={1})', loadUrl);
//    // 创建渲染位图
//    var bitmap = context.createObject(MO.FE3rBitmap);
//    bitmap.loadUrl(url);
//    o._bitmaps.set(url, bitmap);
//    return bitmap;
// }
}