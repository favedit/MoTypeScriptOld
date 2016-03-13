package org.mo.data.nosql;

import org.mo.com.lang.FObject;

//============================================================
// <T>NoSql连接。</T>
//============================================================
public class FNosqlConnection
      extends FObject
      implements
         INosqlConnection
{
   // 主机地址
   protected String _host;

   // 端口
   protected int _port;

   //============================================================
   // <T>获得主机地址。</T>
   //
   // @return 主机地址
   //============================================================
   public String host(){
      return _host;
   }

   //============================================================
   // <T>设置主机地址。</T>
   //
   // @param host 主机地址
   //============================================================
   public void setHost(String host){
      _host = host;
   }

   //============================================================
   // <T>获得端口。</T>
   //
   // @return 端口
   //============================================================
   public int port(){
      return _port;
   }

   //============================================================
   // <T>设置端口。</T>
   //
   // @param port 端口
   //============================================================
   public void setPort(int port){
      _port = port;
   }
}