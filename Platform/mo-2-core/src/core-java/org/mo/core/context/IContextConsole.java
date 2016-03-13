package org.mo.core.context;

//============================================================
// <T>上下文控制台接口。</T>
//============================================================
public interface IContextConsole
{
   //============================================================
   // <T>绑定上下文。</T>
   //
   // @param context 上下文
   //============================================================
   void bind(IContext context);

   //============================================================
   // <T>解除上下文绑定。</T>
   //
   // @param code 代码
   // @return 上下文
   //============================================================
   <V extends IContext> V unbind(String code);

   //============================================================
   // <T>解除上下文绑定。</T>
   //
   // @param context 上下文
   //============================================================
   void unbind(IContext context);

   //============================================================
   // <T>关联上下文。</T>
   //
   // @param code 代码
   //============================================================
   <V extends IContext> V link(String code);

   //============================================================
   // <T>断开上下文绑定。</T>
   //
   // @param code 代码
   //============================================================
   void unlink(String code);
}