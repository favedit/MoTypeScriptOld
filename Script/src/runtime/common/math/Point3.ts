import {Value3} from './Value3';

//==========================================================
// <T>三维坐标。</T>
//
// @struct
// @param x:Number X坐标
// @param y:Number Y坐标
// @param z:Number Z坐标
// @author maocy
// @version 141230
//==========================================================
export class Point3 extends Value3 {
   //============================================================
   // <T>获得反方向。</T>
   //
   // @method
   // @param p:value:SQuaternion 四元数
   // @return SQuaternion 四元数
   //============================================================
   public conjugate(p) {
      var o = this;
      var r = null;
      if (p) {
         r = p;
      } else {
         r = new Point3();
      }
      r.x = -o.x;
      r.y = -o.y;
      r.z = -o.z;
      return r;
   }

   //============================================================
   // <T>合并最小值。</T>
   //
   // @method
   // @param p:value:SPoint3 三维点
   //============================================================
   public mergeMin(p) {
      var o = this;
      o.x = Math.min(o.x, p.x);
      o.y = Math.min(o.y, p.y);
      o.z = Math.min(o.z, p.z);
   }

   //============================================================
   // <T>合并最小值。</T>
   //
   // @method
   // @param x:Number X坐标
   // @param y:Number Y坐标
   // @param z:Number Z坐标
   //============================================================
   public mergeMin3(x, y, z) {
      var o = this;
      o.x = Math.min(o.x, x);
      o.y = Math.min(o.y, y);
      o.z = Math.min(o.z, z);
   }

   //============================================================
   // <T>合并最大值。</T>
   //
   // @method
   // @param p:value:SPoint3 三维点
   //============================================================
   public mergeMax(p) {
      var o = this;
      o.x = Math.max(o.x, p.x);
      o.y = Math.max(o.y, p.y);
      o.z = Math.max(o.z, p.z);
   }

   //============================================================
   // <T>合并最大值。</T>
   //
   // @method
   // @param x:Number X坐标
   // @param y:Number Y坐标
   // @param z:Number Z坐标
   //============================================================
   public mergeMax3(x, y, z) {
      var o = this;
      o.x = Math.max(o.x, x);
      o.y = Math.max(o.y, y);
      o.z = Math.max(o.z, z);
   }

   //==========================================================
   // <T>修改坐标偏移。</T>
   //
   //
   // @method
   // @param x:Integer X坐标
   // @param y:Integer Y坐标
   // @param z:Integer Z坐标
   //==========================================================
   public resize(x, y, z) {
      var o = this;
      if (x != null) {
         o.x += x;
      }
      if (y != null) {
         o.y += y;
      }
      if (z != null) {
         o.z += z;
      }
   }

   //==========================================================
   // <T>根据方向移动坐标。</T>
   //
   //
   // @method
   // @param direction:SVector3 方向
   // @param length:Float 长度
   //==========================================================
   public moveTo(direction, length) {
      var o = this;
      o.x += direction.x * length;
      o.y += direction.y * length;
      o.z += direction.z * length;
   }

   //==========================================================
   // <T>计算插值。</T>
   //
   // @method
   // @param v1:value1:SPoint3 开始坐标
   // @param v2:value2:SPoint3 结束坐标
   // @param r:rate:Float 比率
   //==========================================================
   public slerp(v1, v2, r) {
      var o = this;
      o.x = (v2.x - v1.x) * r + v1.x;
      o.y = (v2.y - v1.y) * r + v1.y;
      o.z = (v2.z - v1.z) * r + v1.z;
   }
}
