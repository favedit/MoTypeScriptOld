package org.mo.com.io.base;

import org.mo.com.lang.FFatalError;
import org.mo.com.lang.generic.MBytes;

//============================================================
// <T>字节数据流基类。</T>
//============================================================
public abstract class MByteStream
      extends MBytes
{
   // 数据位置
   protected int _position = 0;

   //============================================================
   // <T>构造字节数据流基类。</T>
   //============================================================
   public MByteStream(){
   }

   //============================================================
   // <T>构造字节数据流基类。</T>
   //
   // @param capacity 容量
   //============================================================
   public MByteStream(int capacity){
      super(capacity);
   }

   //============================================================
   // <T>构造字节数据流基类。</T>
   //
   // @param data 数据
   // @param length 长度
   //============================================================
   public MByteStream(byte[] data,
                      int length){
      super(data, length);
   }

   //============================================================
   // <T>判断是否存在下个数据。</T>
   //
   // @return 是否存在
   //============================================================
   public boolean hasNext(){
      return _position < _length - 1;
   }

   //============================================================
   // <T>获得位置。</T>
   //
   // @return 位置
   //============================================================
   public int position(){
      return _position;
   }

   //============================================================
   // <T>获得位置。</T>
   //
   // @return 位置
   //============================================================
   public void setPosition(int position){
      if(position < 0){
         position = 0;
      }
      if(position > _length - 1){
         position = _length - 1;
      }
      _position = position;
   }

   //============================================================
   // <T>忽略指定长度。</T>
   //
   // @param length 长度
   //============================================================
   public void skip(int length){
      _position += length;
   }

   //============================================================
   // <T>获得位置。</T>
   //
   // @return 位置
   //============================================================
   public byte read(){
      if(_position >= _length - 1){
         throw new FFatalError("Read failure. (length={1}, _osition={2})", _length, _position);
      }
      return _memory[_position++];
   }

   //============================================================
   // <T>获得位置。</T>
   //
   // @return 位置
   //============================================================
   public int read(byte[] data){
      return read(data, 0, data.length);
   }

   //============================================================
   // <T>获得位置。</T>
   //
   // @return 位置
   //============================================================
   public int read(byte[] data,
                   int offset,
                   int length){
      int copy = Math.min(length, _length - _position);
      System.arraycopy(_memory, _position, data, offset, copy);
      _position += copy;
      return copy;
   }

   //============================================================
   // <T>写入一个字节。</T>
   //
   // @param data 数据
   //============================================================
   public int write(byte data){
      if(_position < _length - 1){
         _memory[_position] = data;
      }else{
         append(data);
      }
      _position++;
      return 1;
   }

   //============================================================
   // <T>写入一个字节。</T>
   //
   // @param data 数据
   //============================================================
   public int write(byte[] data){
      return write(data, 0, data.length);
   }

   //============================================================
   // <T>写入字节集合。</T>
   //
   // @param data 数据
   //============================================================
   public int write(byte[] data,
                    int offset,
                    int length){
      // 检查参数
      if(data == null){
         return 0;
      }
      if(length == 0){
         return 0;
      }
      // 写入数据
      if(length > _length - _position){
         ensureSize(_position + length);
         System.arraycopy(data, offset, _memory, _position, length);
         _position += length;
         _length = _position;
      }else{
         System.arraycopy(data, offset, _memory, _position, length);
         _position += length;
      }
      return length;
   }
}
