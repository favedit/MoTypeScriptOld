//==========================================================
// <T>随机数管理器。</T>
//
// @reference
// @author maocy
// @version 150523
//==========================================================
export class RRandom {
   //..........................................................
   private static _seed: number = (new Date()).getTime();

   //===========================================================
   // <T>获得一个随机数。</T>
   //
   // @method
   // @return 随机数
   //===========================================================
   public static get() {
      this._seed = (this._seed * 9301 + 49297) % 233280;
      return this._seed / (233280.0);
   }

   //===========================================================
   // <T>根据种子获得一个随机数。</T>
   //
   // @method
   // @param seed:Number 种子
   // @return 随机数
   //===========================================================
   public static rand(seed) {
      var o = this;
      var value = o.get() * seed;
      return Math.ceil(value);
   }
}
