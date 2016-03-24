import {SingletonObject} from './lang/SingletonObject';
import {ProcessEnum} from './ProcessEnum';
import {PlatformEnum} from './PlatformEnum';

//==========================================================
// <T>运行库。</T>
//
// @reference
// @author maocy
// @version 141226
//==========================================================
export class RRuntime extends SingletonObject {
   //..........................................................
   // 版本
   public static version: string = '1.0.0';
   // 模式
   public static processCd: ProcessEnum = ProcessEnum.Release;
   // 平台
   public static platformCd: PlatformEnum = PlatformEnum.Pc;

   //==========================================================
   // <T>测试是否调试模式。</T>
   //
   // @method
   // @return 是否调试模式
   //==========================================================
   public static isDebug() {
      return this.processCd == ProcessEnum.Debug;
   }

   //==========================================================
   // <T>测试是否运行模式。</T>
   //
   // @method
   // @return 是否运行模式
   //==========================================================
   public static isRelease() {
      return this.processCd == ProcessEnum.Release;
   }

   //==========================================================
   // <T>测试是否PC平台模式。</T>
   //
   // @method
   // @return 是否PC平台模式
   //==========================================================
   public static isPlatformPc() {
      return this.platformCd == PlatformEnum.Pc;
   }

   //==========================================================
   // <T>测试是否移动平台模式。</T>
   //
   // @method
   // @return 是否移动平台模式
   //==========================================================
   public static isPlatformMobile() {
      return this.platformCd == PlatformEnum.Mobile;
   }

   //==========================================================
   // <T>空函数调用。</T>
   //
   // @method
   //==========================================================
   public static empty() {
   }

   //==========================================================
   // <T>获得非空对象。</T>
   //
   // @param value 对象
   // @param defaultValue 默认对象
   // @return 非空对象
   //==========================================================
   public static nvl(value, defaultValue) {
      return (value != null) ? value : defaultValue;
   }

   //==========================================================
   // <T>从字符串中截取开始字符串到结束字符串中间的部分字符串。</T>
   // <P>开始字符串不存在的话，从字符串开始位置截取。</P>
   // <P>结束字符串不存在的话，截取到字符串的最终位置。</P>
   //
   // @method
   // @param value 字符传对象
   // @param begin 起始字符串
   // @param end 结束字符串
   // @return 截取后的部分字符串
   //==========================================================
   public static subString(value: string, begin: string, end: string) {
      // 检查变量
      if (value == null) {
         return value;
      }
      // 计算左侧位置
      var left: number = 0;
      if (begin != null) {
         var find = value.indexOf(begin);
         if (find != -1) {
            left = find + begin.length;
         }
      }
      // 计算右侧位置
      var right: number = value.length;
      if (end != null) {
         var find = value.indexOf(end, length);
         if (find != -1) {
            right = find;
         }
      }
      // 截取字符串
      if (left >= right) {
         return '';
      }
      return value.substring(left, right);
   }

   //==========================================================
   // <T>获得对象实例的类名称。</T>
   //
   // @method
   // @param value:Object 函数对象
   // @return String 类名称
   //==========================================================
   public static className(value): string {
      if (value) {
         // 如果对象是函数的情况
         if (typeof value == 'function') {
            return this.subString(value.toString(), 'function ', '(');
         }
         // 如果对象是普通对象的情况
         var clazz = value.constructor;
         if (clazz) {
            return this.subString(clazz.toString(), 'function ', '(');
         }
      }
      return null;
   }

   //==========================================================
   // <T>正序排列比较器。</T>
   //
   // @method
   // @param source 来源对象
   // @param target 目标对象
   // @param parameters 参数对象
   //==========================================================
   private static sortComparerAsc(source: any, target: any, parameters: any): number {
      if (source > target) {
         return 1;
      } else if (source < target) {
         return -1;
      } else {
         return 0;
      }
   }

   //==========================================================
   // <T>倒序排列比较器。</T>
   //
   // @param source 来源对象
   // @param target 目标对象
   // @param parameters 参数对象
   //==========================================================
   private static sortComparerDesc(source: any, target: any, parameters: any): number {
      if (source > target) {
         return -1;
      } else if (source < target) {
         return 1;
      } else {
         return 0;
      }
   }

   //==========================================================
   // <T>对值对快速排序。</T>
   //
   // @param names 名称数组
   // @param values 内容数组
   // @param begin 开始位置
   // @param end 结束位置
   // @param comparer 比较器
   // @param parameters 参数
   //==========================================================
   private static pairSortMid(names: Array<any>, values: Array<any>, begin: number, end: number, comparer: Function, parameters: any): number {
      var name: any = names[begin];
      var value = null;
      if (values) {
         value = values[begin];
      }
      while (begin < end) {
         while ((begin < end) && (comparer(names[end], name, parameters) >= 0)) {
            end--;
         }
         names[begin] = names[end];
         if (values) {
            values[begin] = values[end];
         }
         while ((begin < end) && (comparer(names[begin], name, parameters) <= 0)) {
            begin++;
         }
         names[end] = names[begin];
         if (values) {
            values[end] = values[begin];
         }
      }
      names[begin] = name;
      if (values) {
         values[begin] = value;
      }
      return begin;
   }

   //==========================================================
   // <T>对值对快速排序。</T>
   //
   // @param names 名称数组
   // @param values 内容数组
   // @param begin 开始位置
   // @param end 结束位置
   // @param comparer 比较器
   // @param parameters 参数
   //==========================================================
   private static pairSortSub(names: Array<any>, values: Array<any>, begin: number, end: number, comparer: Function, parameters: any): void {
      if (begin < end) {
         var mid: number = this.pairSortMid(names, values, begin, end, comparer, parameters);
         this.pairSortSub(names, values, begin, mid - 1, comparer, parameters);
         this.pairSortSub(names, values, mid + 1, end, comparer, parameters);
      }
   }

   //==========================================================
   // <T>对值对快速排序。</T>
   //
   // @method
   // @param names:Array 名称数组
   // @param values:Array 内容数组
   // @param offset:Integer 位置
   // @param count:Integer 总数
   // @param comparer:Function 比较器
   // @param parameters:Object 参数
   //==========================================================
   public static pairSort(names: Array<any>, values: Array<any>, offset: number, count: number, comparer: Function, parameters: any): void {
      var begin = offset;
      var end = offset + count - 1;
      this.pairSortSub(names, values, begin, end, this.nvl(comparer, this.sortComparerAsc), parameters);
   }

   //==========================================================
   // <T>释放一个对象。</T>
   //
   // @method
   // @param item:Object 对象
   // @param flag:Boolean 标志
   //==========================================================
   public static namespace(item: any, space: string): void {
      for (var name in item) {
         // 检查名称
         if (name.indexOf('_') == 0) {
            continue;
         }
         // 获得内容 
         var value: any = item[name];
         if (value != null) {
            // 检查是否已经设置过
            if (value.__space != null) {
               continue;
            }
            // 设置类型名称
            var typeName: string = typeof value;
            if ((typeName == 'object') || (typeName == 'function')) {
               var spaceName: string = space + '.' + name;
               value.__space = spaceName;
               this.namespace(value, spaceName);
               // 执行处理
               if (value.staticConstructor) {
                  value.staticConstructor();
               }
            }
         }
      }
      return null;
   }

   //==========================================================
   // <T>释放一个对象。</T>
   //
   // @param item 对象
   // @param flag 标志
   //==========================================================
   public static dispose(item: any, flag: boolean = false): void {
      if (item) {
         if (!item.__dispose) {
            item.dispose(flag);
            item.__dispose = true;
         } else {
            throw new Error('Object has disposed.');
         }
      }
      return null;
   }
}
