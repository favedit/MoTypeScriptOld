import {ObjectIdUtil} from './ObjectIdUtil';
import {ClassUtil} from '../reflect/ClassUtil';

//==========================================================
// <T>所有可继承对象的基类。</T>
// <P>支持类的判断、获取内部运行信息的功能。</P>
//
// @class
// @author maocy
// @version 141230
//==========================================================
export class ObjectBase {
   // 类对象
   protected __class: any;
   // 哈希值
   protected __hashCode: number;
   // 释放标志
   protected __dispose: boolean;

   //==========================================================
   // <T>构建当前对象的实例。</T>
   //
   // @method
   //==========================================================
   public constructor() {
      this.__hashCode = 0;
      this.__dispose = false;
   }

   //==========================================================
   // <T>获取哈希值。</T>
   //
   // @method
   // @return Integer 哈希值
   //==========================================================
   public get hashCode(): number {
      var hashCode: number = this.__hashCode;
      if (hashCode == 0) {
         hashCode = this.__hashCode = ObjectIdUtil.nextHash();
      }
      return hashCode;
   }

   //==========================================================
   // <T>获取当前实例的信息。</T>
   //
   // @method
   // @return String 信息字符串
   //==========================================================
   //public getClass(): FClass {
   // return this.__class;
   //}

   //==========================================================
   // <T>获取当前实例的信息。</T>
   //
   // @method
   // @return String 信息字符串
   //==========================================================
   //public toString(): string {
   //return RClass.dump(this);
   //}

   //==========================================================
   // <T>释放当前实例。</T>
   //
   // @method
   //==========================================================
   public dispose(flag: boolean = false): void {
      //sk.common.lang.RObject.free(o);
      this.__dispose = true;
   }
}