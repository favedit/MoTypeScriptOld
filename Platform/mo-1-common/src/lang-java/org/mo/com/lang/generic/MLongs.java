package org.mo.com.lang.generic;

import org.mo.com.lang.FFatalError;
import org.mo.com.lang.face.ATypes;

//============================================================
// <T>基础类型集合。</T>
//============================================================
@ATypes
public abstract class MLongs
{
   // 容量
   public static final int CAPACITY = 32;

   // 长度
   protected int _length = 0;

   // 内存
   protected long[] _memory;

   //============================================================
   // <T>构造基础类型集合。</T>
   //============================================================
   public MLongs(){
   }

   //============================================================
   // <T>构造基础类型集合。</T>
   //
   // @param capacity 初始容量
   //============================================================
   public MLongs(int capacity){
      innerResize(capacity, false, false);
   }

   //============================================================
   // <T>构造基础类型集合。</T>
   //
   // @param memory 内存
   // @param length 长度
   //============================================================
   public MLongs(long[] memory,
                 int length){
      _memory = memory;
      _length = length;
   }

   //============================================================
   // <T>内部调整内存大小。</T>
   //
   // @param length 长度
   // @param extend 可扩展长度
   // @param copy 复制数据
   //============================================================
   protected void innerResize(int length,
                              boolean extend,
                              boolean copy){
      // 获得容量
      int capacity = 0;
      if(_memory != null){
         capacity = _memory.length;
      }
      // 扩充容量
      if(length > capacity){
         // 计算总大小
         int total = 0;
         if(extend){
            if(_memory == null){
               total = Math.max(length, CAPACITY);
            }else{
               total = Math.max(length + (length >> 1), CAPACITY);
            }
         }else{
            total = length;
         }
         // 收集内存
         long[] alloc = new long[total];
         // 复制内存
         if(_memory != null){
            if(copy){
               System.arraycopy(_memory, 0, alloc, 0, _length);
            }
         }
         // 设置内存
         _memory = alloc;
      }
   }

   //============================================================
   // <T>判断是否为空。</T>
   //
   // @return 是否为空
   //============================================================
   public boolean isEmpty(){
      return _length == 0;
   }

   //============================================================
   // <T>获得数据长度。</T>
   //
   // @return 数据长度
   //============================================================
   public int length(){
      return _length;
   }

   //============================================================
   // <T>设置数据长度。</T>
   //
   // @param length 长度
   //============================================================
   public void setLength(int length){
      innerResize(length, false, true);
      _length = length;
   }

   //============================================================
   // <T>获得内存。</T>
   //
   // @return 内存
   //============================================================
   public long[] memory(){
      return _memory;
   }

   //============================================================
   // <T>判断是否含有指定数据内容。</T>
   //
   // @param value 数据内容
   // @return 是否含有
   //============================================================
   public boolean contains(long value){
      return indexOf(value) != -1;
   }

   //============================================================
   // <T>查找指定数据内容在集合中首次出现的位置。</T>
   //
   // @param value 数据内容
   // @return 是否含有
   //============================================================
   public int indexOf(long value){
      return indexOf(value, 0);
   }

   //============================================================
   // <T>查找指定数据内容在集合中首次出现的位置。</T>
   //
   // @param value 数据内容
   // @param offset 数据位置
   //============================================================
   public int indexOf(long value,
                      int offset){
      if(_memory != null){
         for(int i = 0; i < _length; i++){
            if(_memory[i] == value){
               return i;
            }
         }
      }
      return -1;
   }

   //============================================================
   // <T>查找指定数据内容在集合中最后出现的位置。</T>
   //
   // @param value 数据内容
   // @return 是否含有
   //============================================================
   public int lastIndexOf(long value){
      return lastIndexOf(value, _length);
   }

   //============================================================
   // <T>查找指定数据内容在集合中最后出现的位置。</T>
   //
   // @param value 数据内容
   // @param offset 数据位置
   //============================================================
   public int lastIndexOf(long value,
                          int last){
      if(_memory != null){
         for(int i = _length - 1; i >= 0; i--){
            if(_memory[i] == value){
               return i;
            }
         }
      }
      return -1;
   }

   //============================================================
   // <T>获得首数据。</T>
   //
   // @return 首数据
   //============================================================
   public long first(){
      if(_length == 0){
         throw new FFatalError("Get first element failure. (length={1})", _length);
      }
      return _memory[0];
   }

   //============================================================
   // <T>获得尾数据。</T>
   //
   // @return 尾数据
   //============================================================
   public long last(){
      if(_length == 0){
         throw new FFatalError("Get last element failure. (length={1})", _length);
      }
      return _memory[_length - 1];
   }

   //============================================================
   // <T>获得索引位置的数据内容。</T>
   //
   // @param index 索引位置
   // @return length 长度
   //============================================================
   public long get(int index){
      if(_memory == null){
         throw new FFatalError("Memory is null.");
      }
      if((index < 0) || (index >= _length)){
         throw new FFatalError("Get index failure. (length={1}, index={2})", _length, index);
      }
      return _memory[index];
   }

   //============================================================
   // <T>获得索引位置的数据内容。</T>
   //
   // @param index 索引位置
   // @return length 长度
   //============================================================
   public long getAt(int index){
      return _memory[index];
   }

   //============================================================
   // <T>设置索引位置的数据内容。</T>
   //
   // @param index 索引位置
   // @return length 长度
   //============================================================
   public void set(int index,
                   long value){
      if(_memory == null){
         throw new FFatalError("Memory is null.");
      }
      if((index < 0) || (index >= _length)){
         throw new FFatalError("Set index failure. (length={1}, index={2})", _length, index);
      }
      _memory[index] = value;
   }

   //============================================================
   // <T>接收基础类型集合全部内容。</T>
   //
   // @param values 基础类型集合
   //============================================================
   public void assign(MLongs values){
      if(values == null){
         clear();
      }else{
         assign(values._memory, 0, values._length);
      }
   }

   //============================================================
   // <T>接收基础类型集合全部内容。</T>
   //
   // @param values 数据内容
   // @param offset 开始位置 
   // @param length 数据长度
   //============================================================
   public void assign(long[] values,
                      int offset,
                      int length){
      // 清空数据
      clear();
      // 接收数据
      if((values != null) && (length > 0)){
         innerResize(length, false, false);
         System.arraycopy(values, offset, _memory, 0, length);
         _length = length;
      }
   }

   //============================================================
   // <T>追加基础类型数据。</T>
   //
   // @param value 数据
   //============================================================
   public void append(long value){
      innerResize(_length + 1, true, true);
      _memory[_length++] = value;
   }

   //============================================================
   // <T>追加基础类型数据集合。</T>
   //
   // @param value... 数据
   //============================================================
   public void append(long... values){
      append(values, 0, values.length);
   }

   //============================================================
   // <T>追加指定基础类型集合全部内容。</T>
   //
   // @param values 基础类型集合
   //============================================================
   public void append(MLongs values){
      if(values != null){
         append(values._memory, 0, values._length);
      }
   }

   //============================================================
   // <T>追加指定基础类型集合全部内容。</T>
   //
   // @param values 数据内容
   // @param offset 开始位置 
   // @param length 数据长度
   //============================================================
   public void append(long[] values,
                      int offset,
                      int length){
      if((values != null) && (length > 0)){
         innerResize(_length + length, true, true);
         System.arraycopy(values, offset, _memory, _length, length);
         _length += length;
      }
   }

   //============================================================
   // <T>弹出尾部数据内容。</T>
   //
   // @return 数据内容
   //============================================================
   public long pop(){
      if(_length == 0){
         throw new FFatalError("Pop last element failure. (length={1})", _length);
      }
      long value = _memory[--_length];
      return value;
   }

   //============================================================
   // <T>插入指定基础类型数据到指定位置。</T>
   //
   // @param value 数据内容
   //============================================================
   public void insert(long value){
      insert(value, 0);
   }

   //============================================================
   // <T>插入指定基础类型数据到指定位置。</T>
   //
   // @param value 数据内容
   // @param index 开始位置 
   //============================================================
   public void insert(long value,
                      int index){
      // 检查范围
      if((index < 0) || (index > _length)){
         throw new FFatalError("Index range is invalid. (length={1}, index={2})", _length, index);
      }
      // 调整大小
      innerResize(_length + 1, true, true);
      // 复制数据
      int copy = _length - index;
      if(copy > 0){
         System.arraycopy(_memory, index, _memory, index + 1, copy);
      }
      _memory[index] = value;
      _length++;
   }

   //============================================================
   // <T>移除指定索引位置的数据。</T>
   //
   // @param index 索引位置 
   //============================================================
   public long remove(int index){
      // 检查范围
      if((index < 0) || (index >= _length)){
         throw new FFatalError("Index range is invalid. (length={1}, index={2})", _length, index);
      }
      long value = _memory[index];
      int copy = _length - index - 1;
      if(copy > 0){
         System.arraycopy(_memory, index + 1, _memory, index, copy);
      }
      _length--;
      return value;
   }

   //============================================================
   // <T>移除指定索引位置的定长数据。</T>
   //
   // @param index 索引位置 
   // @param length 长度
   //============================================================
   public void remove(int index,
                      int length){
      // 检查范围
      if((index < 0) || (index >= _length)){
         throw new FFatalError("Index range is invalid. (length={1}, index={2})", _length, index);
      }
      if(length <= 0){
         throw new FFatalError("Length is out range.");
      }
      if(index + length > _length){
         throw new FFatalError("Length is out range.");
      }
      // 复制数据
      int moved = _length - index - length;
      System.arraycopy(_memory, index + length, _memory, index, moved);
      _length -= length;
   }

   //============================================================
   // <T>交换两个指定索引位置的数据内容。</T>
   //
   // @param from 开始索引 
   // @param to 结束索引 
   //============================================================
   public void swap(int from,
                    int to){
      // 检查范围
      if((from < 0) || (from > _length)){
         throw new FFatalError("From range is invalid. (length={1}, index={2})", _length, from);
      }
      if((to < 0) || (to > _length)){
         throw new FFatalError("To range is invalid. (length={1}, index={2})", _length, to);
      }
      // 移动内容
      if(from != to){
         long swap = _memory[from];
         _memory[from] = _memory[to];
         _memory[to] = swap;
      }
   }

   //============================================================
   // <T>强制基础类型集合有指定大小的容量。</T>
   //
   // @param length 长度
   //============================================================
   public void forceSize(int length){
      innerResize(length, false, false);
   }

   //============================================================
   // <T>确保基础类型集合有指定大小的容量。</T>
   //
   // @param length 长度
   //============================================================
   public void ensureSize(int length){
      innerResize(length, true, true);
   }

   //============================================================
   // <T>获得数组内容。</T>
   //
   // @return 数组内容 
   //============================================================
   public long[] toArray(){
      long[] alloc = new long[_length];
      if(_memory != null){
         System.arraycopy(_memory, 0, alloc, 0, _length);
      }
      return alloc;
   }

   //============================================================
   // <T>复制数据内容到指定内存位置。</T>
   //
   // @param memory 内存数据
   // @param offset 索引位置
   // @param length 数据长度
   //============================================================
   public void copy(long[] memory,
                    int offset,
                    int length){
      if(_memory != null){
         System.arraycopy(_memory, 0, memory, offset, length);
      }
   }

   //============================================================
   // <T>清空处理。</T>
   //============================================================
   public void clear(){
      _length = 0;
   }

   //============================================================
   // <T>释放处理。</T>
   //============================================================
   public void dispose(){
      _length = 0;
      _memory = null;
   }
}
