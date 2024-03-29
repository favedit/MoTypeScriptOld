package org.mo.com.xml;

import org.mo.com.lang.FString;
import org.mo.com.lang.ICopyable;
import org.mo.com.lang.RObject;
import org.mo.com.lang.generic.MObjects;

//============================================================
// <T>节点列表。</T>
//
// @history 051014 MAOCY 创建
//============================================================
public class FXmlNodes
      extends MObjects<FXmlNode>
      implements
         ICopyable
{
   // 父节点
   protected FXmlNode _parent;

   //============================================================
   // <T>构造节点列表。</T>
   //============================================================
   public FXmlNodes(){
      super(FXmlNode.class);
   }

   //============================================================
   // <T>构造节点列表。</T>
   //
   // @param parent 父节点
   //============================================================
   public FXmlNodes(FXmlNode parent){
      super(FXmlNode.class);
      _parent = parent;
   }

   //============================================================
   // <T>判断是否含有指定节点。</T>
   //
   // @param name 节点名称
   // @return 是否含有
   //============================================================
   public boolean containsNode(String name){
      return (null != findNode(name));
   }

   //============================================================
   // <T>判断是否含有指定节点。</T>
   //
   // @param name 节点名称
   // @param attributes 属性集合
   // @return 是否含有
   //============================================================
   public boolean containsNode(String name,
                               String... attributes){
      return (null != findNode(name, attributes));
   }

   //============================================================
   // <T>在当前列表下查找一个指定信息的节点。</T>
   //
   // @param name 节点名称
   // @return XML节点
   //============================================================
   public FXmlNode findNode(String name){
      for(int i = 0; i < _count; i++){
         if(name.equalsIgnoreCase(_items[i].name())){
            return _items[i];
         }
      }
      return null;
   }

   //============================================================
   // <T>在当前列表下查找一个指定信息的节点。</T>
   //
   // @param name 节点名称
   // @param attributes 属性集合
   // @return XML节点
   //============================================================
   public FXmlNode findNode(String name,
                            String... attributes){
      for(int i = 0; i < _count; i++){
         if(_items[i].equals(name, attributes)){
            return _items[i];
         }
      }
      return null;
   }

   //============================================================
   // <T>在当前列表下查找最后一个指定信息的节点。</T>
   //
   // @param name 节点名称
   // @return XML节点
   //============================================================
   public FXmlNode findLastNode(String name){
      for(int i = _count - 1; i >= 0; i--){
         if(name.equalsIgnoreCase(_items[i].name())){
            return _items[i];
         }
      }
      return null;
   }

   //============================================================
   // <T>在当前列表下查找最后一个指定信息的节点。</T>
   //
   // @param name 节点名称
   // @param attributes 属性集合
   // @return XML节点
   //============================================================
   public FXmlNode findLastNode(String name,
                                String... attributes){
      for(int i = _count - 1; i >= 0; i--){
         if(_items[i].equals(name, attributes)){
            return _items[i];
         }
      }
      return null;
   }

   //============================================================
   // <T>在当前列表下新建一个XML节点。</T>
   //
   // @return XML节点
   //============================================================
   public FXmlNode create(){
      return create(RXml.DEFAULT_NODE_NAME);
   }

   //============================================================
   // <T>在当前列表下新建一个XML节点。</T>
   //
   // @param name 名称
   // @return XML节点
   //============================================================
   public FXmlNode create(String name){
      FXmlNode node = null;
      if((_parent != null) && (_parent._document != null)){
         node = _parent._document.createNode(name);
      }else{
         node = new FXmlNode(name);
      }
      push(node);
      return node;
   }

   //============================================================
   // <T>在当前列表下新建一个XML节点。</T>
   //
   // @param name 名称
   // @return XML节点
   //============================================================
   @Override
   public void push(FXmlNode node){
      if(_parent != null){
         node._document = _parent._document;
         node._parent = _parent;
      }
      super.push(node);
   }

   //============================================================
   // <T>在当前列表下按照某个属性名称进行排序。</T>
   //
   // @param attrNames 属性名称集合
   //============================================================
   public void sortByAttribute(String... attrNames){
      RObject.sort(_items, 0, _count, true, (Object[])attrNames);
   }

   //============================================================
   // <T>在当前列表下按照某个属性名称进行排序。</T>
   //
   // @param asc 升序
   // @param attrNames 属性名称集合
   //============================================================
   public void sortByAttribute(boolean asc,
                               String... attrNames){
      RObject.sort(_items, 0, _count, asc, (Object[])attrNames);
   }

   //============================================================
   // <T>移除指定信息的节点。</T>
   //
   // @param name 节点名称
   // @param attributes 属性集合
   //============================================================
   public FXmlNode remove(String name,
                          String... attributes){
      FXmlNode node = findNode(name, attributes);
      if(null != node){
         super.remove(node);
      }
      return node;
   }

   //============================================================
   // <T>获得XML字符串。</T>
   //
   // @return XML字符串
   //============================================================
   public String xml(){
      FString xml = new FString();
      for(int n = 0; n < _count; n++){
         FXmlNode node = _items[n];
         if(node != null){
            xml.append(node.xml());
         }
      }
      return xml.toString();
   }

   //============================================================
   // <T>复制当前对象为一个新对象。</T>
   //
   // @return 新对象
   //============================================================
   @Override
   @SuppressWarnings("unchecked")
   public FXmlNodes copy(){
      FXmlNodes nodes = new FXmlNodes();
      nodes._clazz = _clazz;
      nodes._parent = _parent;
      for(int n = 0; n < _count; n++){
         FXmlNode node = _items[n];
         if(node != null){
            nodes.push(node.copy());
         }
      }
      return nodes;
   }
}
