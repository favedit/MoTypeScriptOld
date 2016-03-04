//===========================================================
// <T>数据块工具类。</T>
//
// @reference
// @author maochunyang
// @version 150617
//===========================================================
export class RBlob {
   //===========================================================
   // <T>从字符串转换成数据块。</T>
   //
   // @method
   // @param value:String 字符串
   // @return Blob 数据块
   //===========================================================
   public fromText(value) {
      var length = value.length;
      var data = new Uint8Array(length);
      for (var i = 0; i < length; i++) {
         data[i] = value.charCodeAt(i);
      }
      var blob = new Blob([data]);
      return blob;
   }
}
