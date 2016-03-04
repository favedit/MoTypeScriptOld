import {RRuntime} from '../RRuntime'
import {FObject} from './FObject'
import {FString} from './FString'

//==========================================================
// <T>数组的操作类。</T>
//
// @tool
// @author maocy
// @version 141229
//==========================================================
export class FArray extends FObject {
   //..........................................................
   // @attribute
   protected _length: number = 0;
   protected _memory: Array<any> = new Array<any>();

   //==========================================================
   // <T>判断数组是否为空。</T>
   //
   // @method
   // @return Boolean 是否为空
   //==========================================================
   public isEmpty() {
      return this._length == 0;
   }

   //==========================================================
   // <T>获得数据长度。</T>
   //
   // @method
   // @return Integer 数据长度
   //==========================================================
   public length() {
      return this._length;
   }

   //==========================================================
   // <T>设置数据长度。</T>
   //
   // @method
   // @param Integer 数据长度
   //==========================================================
   public setLength(length) {
      this._length = length;
   }

   //==========================================================
   // <T>获得数据。</T>
   //
   // @method
   // @return Array 数据
   //==========================================================
   public memory() {
      return this._memory;
   }

   //==========================================================
   // <T>判断数组是否含有指定的对象。</T>
   //
   // @method
   // @param value:Object 对象
   // @return Boolean 是否含有
   //==========================================================
   public contains(value) {
      return this.indexOf(value) != -1;
   }

   //==========================================================
   // <T>查找指定对象在数组中的索引位置，不存在则返回-1。</T>
   //
   // @method
   // @param value:Object 对象
   // @return Integer 索引位置
   //==========================================================
   public indexOf(value) {
      var count: number = this._length;
      for (var i: number = 0; i < count; i++) {
         if (this._memory[i] == value) {
            return i;
         }
      }
      return -1;
   }

   //==========================================================
   // <T>取得指定索引对应的对象。</T>
   //
   // @method
   // @param index:Integer 索引位置
   // @return 当前位置上的对象
   //==========================================================
   public get(index) {
      return ((index >= 0) && (index < this._length)) ? this._memory[index] : null;
   }

   //==========================================================
   // <T>把对象存储在指定的索引处。</T>
   //
   // @method
   // @param index:Integer 索引位置
   // @param value:Object 对象
   //==========================================================
   public set(index, value) {
      if ((index >= 0) && (index < this._length)) {
         this._memory[index] = value;
      }
   }

   //==========================================================
   // <T>把对象追加到数组的最后位置。</T>
   //
   // @method
   // @param values:Object 对象
   //==========================================================
   public push() {
      var count = arguments.length;
      for (var i = 0; i < count; i++) {
         this._memory[this._length++] = arguments[i];
      }
   }

   //==========================================================
   // <T>在数组中交换两个索引对应的对象。</T>
   //
   // @method
   // @param left:Integer 第一个对象的索引值
   // @param right:Integer 第二个对象的索引值
   //==========================================================
   public swap(left, right) {
      var count = this._length;
      if ((left >= 0) && (left < count) && (right >= 0) && (right < count) && (left != right)) {
         var memory = this._memory;
         var value = memory[left];
         memory[left] = memory[right];
         memory[right] = value;
      }
   }

   //==========================================================
   // <T>对数组内容进行排序。</T>
   //
   // @method
   //==========================================================
   public sort() {
      this._memory.sort();
   }

   //==========================================================
   // <T>移除指定索引的存储对象。</T>
   //
   // @method
   // @param index:Integer 索引位置
   // @return Object 被删除的对象
   //==========================================================
   public erase(index) {
      var value = null;
      var count = this._length;
      if ((index >= 0) && (index < count)) {
         value = this._memory[index];
         for (var i = index; i < count; i++) {
            this._memory[i] = this._memory[i + 1];
         }
         this._length--;
      }
      return value;
   }

   //==========================================================
   // <T>移除指定对象的存储对象。</T>
   //
   // @method
   // @param value:Object 指定对象
   //==========================================================
   public remove(value) {
      var index = 0;
      var memory = this._memory;
      var count = this._length;
      for (var i = 0; i < count; i++) {
         if (memory[i] != value) {
            memory[index++] = memory[i];
         }
      }
      this._length = index;
   }

   //==========================================================
   // <T>将数组内项目为空的位置全部删除。</T>
   //
   // @method
   //==========================================================
   public compress() {
      var index = 0;
      var count = this._length;
      var memory = this._memory;
      for (var i = 0; i < count; i++) {
         var value = memory[i];
         if (value != null) {
            memory[index++] = value;
         }
      }
      this._length = index;
   }

   //==========================================================
   // <T>清除数组的所有内容。</T>
   //
   // @method
   //==========================================================
   public clear() {
      this._length = 0;
   }

   //==========================================================
   // <T>释放处理。</T>
   //
   // @method
   //==========================================================
   public dispose() {
      this._length = 0;
      this._memory = null;
   }

   //==========================================================
   // <T>获得数组的内部信息。</T>
   //
   // @method
   // @return String 信息字符串
   //==========================================================
   public dump() {
      var result: FString = new FString();
      var count = this._length;
      result.append(RRuntime.className(this), ':', count);
      if (count > 0) {
         var memory = this._memory;
         for (var i = 0; i < count; i++) {
            result.append(' [', memory[i], ']');
         }
      }
      return result.flush();
   }
}
