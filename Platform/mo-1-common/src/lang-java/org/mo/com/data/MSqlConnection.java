package org.mo.com.data;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.Reader;
import java.sql.Blob;
import java.sql.CallableStatement;
import java.sql.Clob;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Types;
import org.mo.com.collections.FDataset;
import org.mo.com.collections.FObjectDictionary;
import org.mo.com.collections.FRow;
import org.mo.com.collections.SDataField;
import org.mo.com.encoding.RBase64;
import org.mo.com.lang.FError;
import org.mo.com.lang.FFatalError;
import org.mo.com.lang.FString;
import org.mo.com.lang.RBoolean;
import org.mo.com.lang.RDateTime;
import org.mo.com.lang.RDouble;
import org.mo.com.lang.RInteger;
import org.mo.com.lang.RLong;
import org.mo.com.lang.RString;
import org.mo.com.lang.generic.TDumpInfo;
import org.mo.com.logging.ILogger;
import org.mo.com.logging.RLogger;
import org.mo.com.message.FMessages;

//============================================================
// <T>数据库链接基类。</T>
//============================================================ 
public abstract class MSqlConnection
      implements
         ISqlConnection
{
   // 日志输出接口
   private static ILogger _logger = RLogger.find(MSqlConnection.class);

   // 数据库类型
   protected String _databaseType;

   // 事务配置
   protected boolean _optionTransactions;

   // 属性集合
   protected FObjectDictionary _attributes;

   // 数据库链接信息
   protected ISqlConnectionMeta _meta;

   // 数据库链接
   protected Connection _sqlConnection;

   // 最大获取限制
   protected boolean _fetchMaxLimite = false;

   // 最大获取总数
   protected int _fetchMaxCount = RSql.FETCH_MAX_COUNT;

   // 消息列表
   protected FMessages _messages;

   // 数据集合读取器
   protected FSqlDatasetReaders _readers = new FSqlDatasetReaders();

   // 自动给返回内容编码
   protected Object _encodingProvider;

   //============================================================
   // <T>构造数据库链接基类。</T>
   //============================================================ 
   public MSqlConnection(){
   }

   //============================================================
   // <T>构造数据库链接基类。</T>
   //
   // @param sqlConnection 数据库链接
   //============================================================ 
   public MSqlConnection(Connection sqlConnection){
      _sqlConnection = sqlConnection;
   }

   //============================================================
   // <T>获得数据库类型。</T>
   //
   // @return 数据库类型
   //============================================================ 
   @Override
   public String databaseType(){
      return _databaseType;
   }

   //============================================================
   // <T>生成访问地址。</T>
   //
   // @param url 访问地址
   // @return 访问地址
   //============================================================ 
   public String makeUrl(String url){
      return url;
   }

   //============================================================
   // <T>获得默认数据库链接。</T>
   //
   // @return 数据库链接
   //============================================================ 
   @Override
   public ISqlConnection activeConnection(){
      return this;
   }

   //============================================================
   // <T>获得指定名称的数据库链接。</T>
   //
   // @param name 名称
   // @return 数据库链接
   //============================================================ 
   @Override
   public ISqlConnection activeConnection(String name){
      return this;
   }

   //============================================================
   // <T>获得属性集合。</T>
   //
   // @return 属性集合
   //============================================================ 
   @Override
   public FObjectDictionary attributes(){
      if(_attributes == null){
         _attributes = new FObjectDictionary();
      }
      return _attributes;
   }

   //============================================================
   // <T>获得本地链接。</T>
   //
   // @return 本地链接
   //============================================================ 
   @Override
   public Connection sqlConnection(){
      return _sqlConnection;
   }

   //============================================================
   // <T>设置本地链接。</T>
   //
   // @param sqlConnection SQL链接
   //============================================================ 
   public void setSqlConnection(Connection sqlConnection){
      if(sqlConnection == null){
         throw new FFatalError("Sql connection is null.");
      }
      _sqlConnection = sqlConnection;
   }

   //============================================================
   // <T>创建数据库描述对象。</T>
   //
   // @return 描述对象
   //============================================================ 
   protected abstract ISqlConnectionMeta createMeta();

   //============================================================
   // <T>获得数据库链接的描述对象。</T>
   //
   // @return 描述对象
   //============================================================ 
   @Override
   public ISqlConnectionMeta meta(){
      if(_meta == null){
         _meta = createMeta();
      }
      return _meta;
   }

   //============================================================
   // <T>获得数据库链接的消息集合。</T>
   //
   // @return 消息集合
   //============================================================ 
   public FMessages messages(){
      if(_messages == null){
         _messages = new FMessages();
      }
      return _messages;
   }

   //============================================================
   // <T>设置最大获取限制。</T>
   //
   // @param flag 限制
   //============================================================ 
   @Override
   public void setMaxLimit(boolean flag){
      _fetchMaxLimite = flag;
   }

   //============================================================
   // <T>设置最大获取数据条数。</T>
   //
   // @param count 总数
   //============================================================ 
   @Override
   public void setMaxFetch(int count){
      _fetchMaxCount = count;
   }

   //============================================================
   // <T>选择存储。</T>
   //
   // @param name 名称
   //============================================================ 
   @Override
   public void selectStorage(String name){
      throw new FFatalError("Unsupport.");
   }

   //============================================================
   // <T>开始事务。</T>
   //
   // @return 处理结果
   //============================================================ 
   @Override
   public boolean beginTransaction(){
      // 检查事务配置
      if(!_optionTransactions){
         return false;
      }
      // 开始事务
      try{
         if(_sqlConnection.getMetaData().supportsTransactions()){
            if(_sqlConnection.getAutoCommit()){
               _sqlConnection.setAutoCommit(false);
            }
            if(_logger.debugAble()){
               _logger.debug(this, "beginTransaction", "Begin transaction sql connection. (sql={1})", _sqlConnection);
            }
         }
      }catch(Exception e){
         throw new FFatalError(e);
      }
      return true;
   }

   //============================================================
   // <T>提交事务。</T>
   //
   // @return 处理结果
   //============================================================ 
   @Override
   public boolean commit(){
      // 关闭所有数据读取器
      closeReaders();
      // 检查事务配置
      if(!_optionTransactions){
         return false;
      }
      // 提交事务
      try{
         // 提交数据库链接
         if(!_sqlConnection.getAutoCommit()){
            _sqlConnection.setAutoCommit(true);
            _sqlConnection.commit();
            if(_logger.debugAble()){
               _logger.debug(this, "commit", "Commit sql connection. (sql={1})", _sqlConnection);
            }
         }
      }catch(Exception e){
         throw new FFatalError(e, "Commit failure. (connection={1})", _sqlConnection);
      }
      return true;
   }

   //============================================================
   // <T>回滚事务。</T>
   //
   // @return 处理结果
   //============================================================ 
   @Override
   public boolean rollback(){
      // 关闭所有数据读取器
      closeReaders();
      // 检查事务配置
      if(!_optionTransactions){
         return false;
      }
      // 回滚事务
      try{
         // 回滚数据库链接
         _sqlConnection.rollback();
         if(_logger.debugAble()){
            _logger.debug(this, "rollback", "Rollback sql connection. (sql={1})", _sqlConnection);
         }
      }catch(Exception e){
         throw new FFatalError(e, "Rollback failure. (connection={1})", _sqlConnection);
      }
      return true;
   }

   //============================================================
   // <T>填充数据库描述。</T>
   //
   // @param meta 数据库描述
   // @param metaData 数据库描述
   //============================================================ 
   protected boolean fillDatabaseMeta(FSqlDatasetMeta meta,
                                      ResultSetMetaData metaData) throws Exception{
      FSqlField field = null;
      FSqlFields fields = meta.fields();
      fields.clear();
      int nCount = metaData.getColumnCount();
      for(int n = 1; n <= nCount; n++){
         field = new FSqlField(metaData.getColumnName(n));
         switch(metaData.getColumnType(n)){
            case Types.BIT:
               field.setType(ESqlDataType.Boolean);
               break;
            case Types.DATE:
            case Types.TIME:
            case Types.TIMESTAMP:
               field.setType(ESqlDataType.DateTime);
               break;
            case Types.BIGINT:
            case Types.INTEGER:
            case Types.SMALLINT:
            case Types.TINYINT:
               field.setType(ESqlDataType.Integer);
               break;
            case Types.DECIMAL:
            case Types.DOUBLE:
            case Types.FLOAT:
            case Types.NUMERIC:
            case Types.REAL:
               field.setType(ESqlDataType.Float);
               break;
            case Types.CHAR:
            case Types.VARCHAR:
               field.setType(ESqlDataType.String);
               break;
            case Types.LONGVARCHAR:
               field.setType(ESqlDataType.Memo);
               break;
            case Types.BLOB:
            case Types.CLOB:
            case Types.BINARY:
            case Types.VARBINARY:
            case Types.LONGVARBINARY:
               field.setType(ESqlDataType.Binary);
               break;
            case Types.NULL:
            case Types.ARRAY:
            case Types.DISTINCT:
            case Types.OTHER:
            case Types.REF:
            case Types.STRUCT:
               field.setType(ESqlDataType.Unknown);
               break;
            default:
               field.setType(ESqlDataType.Unknown);
               break;
         }
         field.setIsNull(metaData.isNullable(n) == ResultSetMetaData.columnNullable);
         field.setSize(metaData.getColumnDisplaySize(n));
         fields.push(field);
      }
      return true;
   }

   //============================================================
   // <T>填充数据单元。</T>
   //
   // @param unit 数据单元
   // @param columnCount 列数
   // @param names 名称
   // @param types 类型
   // @param resultSet 结果集合
   //============================================================ 
   protected void fillUnit(FRow row,
                           ResultSet resultSet,
                           SDataField[] fields) throws Exception{
      int fieldCount = fields.length;
      for(int n = 0; n < fieldCount; n++){
         // 获得列信息
         SDataField field = fields[n];
         String name = field.name;
         int typeCd = field.typeCd;
         int fieldIndex = n + 1;
         // 根据类型转换
         switch(typeCd){
            case Types.BOOLEAN:
            case Types.BIT:{
               // 布尔类型
               boolean booleanValue = resultSet.getBoolean(fieldIndex);
               row.set(name, RBoolean.toString(booleanValue));
               break;
            }
            case Types.TINYINT:
            case Types.SMALLINT:
            case Types.INTEGER:
            case Types.BIGINT:{
               // 整数类型
               String value = resultSet.getString(fieldIndex);
               if(!resultSet.wasNull()){
                  row.set(name, value);
               }
               break;
            }
            case Types.FLOAT:{
               // 单精度浮点数类型
               float floatValue = resultSet.getFloat(fieldIndex);
               if(!resultSet.wasNull()){
                  if(floatValue % 1 == 0){
                     row.set(name, Integer.toString((int)floatValue));
                  }else{
                     row.set(name, Float.toString(floatValue));
                  }
               }
               break;
            }
            case Types.REAL:
            case Types.DECIMAL:
            case Types.DOUBLE:{
               // 双精度浮点数类型
               double doubleValue = resultSet.getDouble(fieldIndex);
               if(!resultSet.wasNull()){
                  if(doubleValue % 1 == 0){
                     row.set(name, Integer.toString((int)doubleValue));
                  }else{
                     row.set(name, Double.toString(doubleValue));
                  }
               }
               break;
            }
            case Types.TIME:{
               // 时间类型
               String stringValue = RDateTime.format(resultSet.getTime(fieldIndex), "HH24MISS");
               row.set(name, stringValue);
               break;
            }
            case Types.DATE:
            case Types.TIMESTAMP:{
               // 日期类型
               String stringValue = null;
               try{
                  stringValue = RDateTime.format(resultSet.getTimestamp(fieldIndex), "YYYYMMDDHH24MISS");
               }catch(Exception e){
                  _logger.error(this, "fillUnit", e);
                  // 重新设置时间
                  stringValue = RDateTime.format(0, "YYYYMMDDHH24MISS");
               }
               row.set(name, stringValue);
               break;
            }
            case Types.CHAR:{
               // 字符类型
               String stringValue = null;
               Object objectValue = resultSet.getObject(fieldIndex);
               if(objectValue != null){
                  stringValue = objectValue.toString();
                  stringValue = RSql.formatDisplay(stringValue);
                  stringValue = RString.trimRight(stringValue);
               }else{
                  stringValue = RString.EMPTY;
               }
               row.set(name, stringValue);
               break;
            }
            case Types.VARCHAR:{
               // 变长字符类型
               String stringValue = resultSet.getString(fieldIndex);
               if(!resultSet.wasNull()){
                  if(stringValue != null){
                     stringValue = RSql.formatDisplay(stringValue);
                  }else{
                     stringValue = RString.EMPTY;
                  }
                  row.set(name, stringValue);
               }
               break;
            }
            case Types.LONGVARCHAR:{
               // 变长字符串类型
               if(_encodingProvider != null){
                  byte[] arBytes = resultSet.getBytes(fieldIndex);
                  row.set(name, (arBytes != null) ? RBase64.encode(arBytes).toString().replaceAll("\n", "") : "");
               }else{
                  String stringValue = resultSet.getString(fieldIndex);
                  if(!resultSet.wasNull()){
                     if(stringValue != null){
                        stringValue = RSql.formatDisplay(stringValue);
                     }else{
                        stringValue = RString.EMPTY;
                     }
                     row.set(name, stringValue);
                  }
               }
               break;
            }
            case Types.BLOB:{
               // 内容类型
               String stringValue = RString.EMPTY;
               Blob blob = resultSet.getBlob(fieldIndex);
               if(blob != null){
                  byte[] bytes = blob.getBytes(0, (int)blob.length());
                  if(bytes != null){
                     stringValue = RBase64.encode(bytes);
                     stringValue = stringValue.replaceAll("\n", "");
                  }
               }
               row.set(name, stringValue);
               break;
            }
            case Types.CLOB:{
               // 内容类型
               Clob clob = resultSet.getClob(fieldIndex);
               FString stringValue = new FString();
               if(clob != null){
                  Reader reader = clob.getCharacterStream();
                  BufferedReader br = new BufferedReader(reader);
                  String line = "";
                  while((line = br.readLine()) != null){
                     stringValue.appendLine(line);
                  }
               }
               row.set(name, stringValue.toString());
               break;
            }
            case Types.BINARY:
            case Types.LONGVARBINARY:{
               // 变长内容类型
               String stringValue = RString.EMPTY;
               byte[] bytes = resultSet.getBytes(fieldIndex);
               if(bytes != null){
                  stringValue = RBase64.encode(bytes);
                  stringValue = stringValue.replaceAll("\n", "");
               }
               row.set(name, stringValue);
               break;
            }
            case Types.OTHER:{
               // 其余类型
               byte[] bytes = resultSet.getBytes(fieldIndex);
               String stringValue = (bytes != null) ? new String(bytes) : RString.EMPTY;
               row.set(name, stringValue);
               break;
            }
            default:
               throw new FFatalError("Unknown field data type. (name={1}, type={2})", name, typeCd);
         }
      }
   }

   //============================================================
   // <T>填充数据单元。</T>
   //
   // @param unit 数据单元
   // @param columnCount 列数
   // @param names 名称
   // @param types 类型
   // @param resultSet 结果集合
   //============================================================ 
   protected void fillDataset(FDataset dataset,
                              ResultSet resultSet) throws Exception{
      try{
         // 填充字段集合
         SDataField[] fields = RSqlConnection.fillFields(resultSet);
         dataset.setFields(fields);
         // 填充数据集合
         while(resultSet.next()){
            FRow row = new FRow();
            fillUnit(row, resultSet, fields);
            dataset.push(row);
         }
      }catch(Exception exception){
         throw new FFatalError(exception);
      }
   }

   //============================================================
   // <T>根据一条SQL命令执行结果，获得数据描述资源。</T>
   //
   // @param sql SQL命令
   // @return 数据描述资源
   //============================================================ 
   @Override
   public FSqlDatasetMeta fetchMeta(CharSequence sql){
      Statement statement = null;
      ResultSet result = null;
      Exception exception = null;
      try{
         // 执行SQL命令
         statement = sqlConnection().createStatement();
         if(statement.execute(sql.toString())){
            result = statement.getResultSet();
            // 填充数据描述资源
            FSqlDatasetMeta meta = new FSqlDatasetMeta();
            fillDatabaseMeta(meta, result.getMetaData());
            if(_logger.debugAble()){
               _logger.debug(this, "fetchMeta", "Fetch meta. (sql={1})", sql);
            }
            return meta;
         }
      }catch(Exception e){
         exception = e;
      }finally{
         try{
            if(result != null){
               result.close();
            }
            if(statement != null){
               statement.close();
            }
         }catch(Exception e){
            exception = e;
         }
         if(exception != null){
            throw new FFatalError(exception, "Fetch meta failure. (sql={1})", sql);
         }
      }
      return null;
   }

   //============================================================
   // <T>获得一个表的数据描述资源。</T>
   //
   // @param table 表名称
   // @return 数据描述资源
   //============================================================ 
   @Override
   public FSqlDatasetMeta fetchTableMeta(String table){
      return fetchMeta("SELECT * FROM " + table + " WHERE 1=0");
   }

   //============================================================
   // <T>执行一条SQL命令，返回新建的记录编号。</T>
   // <P>执行中不解析字符。(如{}中的内容)。</P>
   //
   // @param sql 命令
   // @return 记录编号
   //============================================================ 
   @Override
   public long executeInsertSql(CharSequence sql){
      long recordId = 0;
      long beginTick = System.nanoTime();
      Statement statement = null;
      FError exception = null;
      try{
         statement = sqlConnection().createStatement();
         statement.setEscapeProcessing(false);
         // 执行处理
         statement.executeUpdate(sql.toString(), Statement.RETURN_GENERATED_KEYS);
         // 获得编号
         ResultSet rs = statement.getGeneratedKeys();
         if(rs.next()){
            recordId = rs.getLong(1);
         }
         rs.close();
         if(_logger.debugAble()){
            long endTick = System.nanoTime();
            _logger.debug(this, "executeSql", endTick - beginTick, "Execute insert sql. (record_id={1}, sql={2})", recordId, sql);
         }
      }catch(Exception e){
         exception = new FFatalError(e, "Execute sql. (sql={1})", sql);
      }finally{
         try{
            if(statement != null){
               statement.close();
            }
         }catch(Exception e){
            exception = new FFatalError(e, "Execute sql. (sql={1})", sql);
         }
         if(exception != null){
            throw exception;
         }
      }
      return recordId;
   }

   //============================================================
   // <T>执行一条SQL命令，返回执行结果。</T>
   // <P>执行中不解析字符。(如{}中的内容)。</P>
   //
   // @param sql 命令
   // @return 处理结果
   //============================================================ 
   @Override
   public boolean executeSql(CharSequence sql){
      long beginTick = System.nanoTime();
      Statement statement = null;
      FError exception = null;
      try{
         statement = sqlConnection().createStatement();
         statement.setEscapeProcessing(false);
         statement.execute(sql.toString());
         if(_logger.debugAble()){
            long endTick = System.nanoTime();
            _logger.debug(this, "executeSql", endTick - beginTick, "Execute sql. (sql={1})", sql);
         }
      }catch(Exception e){
         exception = new FFatalError(e, "Execute sql. (sql={1})", sql);
      }finally{
         try{
            if(statement != null){
               statement.close();
            }
         }catch(Exception e){
            exception = new FFatalError(e, "Execute sql. (sql={1})", sql);
         }
         if(exception != null){
            throw exception;
         }
      }
      return true;
   }

   //============================================================
   // <T>执行命令，查询是否有结果集。</T>
   //
   // @param sql 命令
   // @return 是否有结果集
   //============================================================ 
   @Override
   public boolean executeExist(CharSequence sql){
      return find(sql) != null;
   }

   //============================================================
   // <T>执行查询，并返回查询所返回的结果集中第一行的第一列。</T>
   // <P>忽略其他列或行。</P>
   //
   // @param sql 命令
   // @return 字符串
   //============================================================ 
   @Override
   public String executeScalar(CharSequence sql){
      FRow row = find(sql);
      return (row != null) ? row.value(0) : null;
   }

   //============================================================
   // <T>执行查询，并返回查询所返回的结果集中第一行的第一列的整数</T>
   // <P>忽略其他列或行。</P>
   //
   // @param sql 命令
   // @return 整数
   //============================================================ 
   @Override
   public int executeInteger(CharSequence sql){
      String value = executeScalar(sql);
      return (value != null) ? RInteger.parse(value) : 0;
   }

   //============================================================
   // <T>执行查询，并返回查询所返回的结果集中第一行的第一列的长整数</T>
   // <P>忽略其他列或行。</P>
   //
   // @param sql 命令
   // @return 长整数
   //============================================================ 
   @Override
   public long executeLong(CharSequence sql){
      String value = executeScalar(sql);
      return (value != null) ? RLong.parse(value) : 0;
   }

   //============================================================
   // <T>执行查询，并返回查询所返回的结果集中第一行的第一列的长整数</T>
   // <P>忽略其他列或行。</P>
   //
   // @param sql 命令
   // @return 双精度浮点数
   //============================================================ 
   @Override
   public double executeDouble(CharSequence sql){
      String value = executeScalar(sql);
      return (value != null) ? RDouble.parse(value) : 0;
   }

   //============================================================
   // <T>执行多条SQL命令，返回执行结果。</T>
   // <P>执行中不解析字符。(如{}中的内容)。</P>
   // <P>SQL命令间使用分号或回车符进行分割。</P>
   //
   // @param sql 命令
   // @return 处理结果
   //============================================================ 
   @Override
   public void executeSqls(CharSequence sql){
      Statement statement = null;
      FError exception = null;
      FSql executeSql = new FSql();
      try{
         statement = sqlConnection().createStatement();
         statement.setEscapeProcessing(false);
         String[] sqls = RString.split(sql.toString(), ';');
         for(String singleSql : sqls){
            if(!RString.isBlank(singleSql)){
               RSql.formatSql(executeSql, singleSql);
               if(!executeSql.isEmpty()){
                  statement.execute(executeSql.toString());
                  if(_logger.debugAble()){
                     _logger.debug(this, "executeSqls", "Execute sql command. (sql={1})", executeSql.toString());
                  }
               }
            }
         }
      }catch(Exception e){
         exception = new FFatalError(e, "Execute sql failure. (sql={1})", executeSql.toString());
      }finally{
         try{
            if(statement != null){
               statement.close();
            }
         }catch(Exception e){
            exception = new FFatalError(e, "Execute sql failure. (sql={1})", executeSql.toString());
         }
         if(exception != null){
            throw exception;
         }
      }
   }

   //============================================================
   // <T>执行命令，返回执行数据单元。</T>
   //
   // @param sql 命令
   // @return 数据单元
   //============================================================ 
   @Override
   public FRow find(CharSequence sql){
      Statement statement = null;
      ResultSet resultSet = null;
      Exception exception = null;
      FRow row = null;
      FSql sqlCommand = new FSql(sql.toString());
      try{
         long startTick = System.nanoTime();
         statement = sqlConnection().createStatement();
         resultSet = statement.executeQuery(sqlCommand.toString());
         if(resultSet != null){
            SDataField[] fields = RSqlConnection.fillFields(resultSet);
            while(resultSet.next()){
               row = new FRow();
               fillUnit(row, resultSet, fields);
               break;
            }
         }
         long endTick = System.nanoTime();
         if(_logger.debugAble()){
            String rowInfo = null;
            if(row != null){
               rowInfo = row.dump();
            }
            _logger.debug(this, "find", endTick - startTick, "Find row. (row={1}, sql=[{2})", rowInfo, sqlCommand);
         }
      }catch(Exception e){
         exception = e;
      }finally{
         if(resultSet != null){
            try{
               resultSet.close();
            }catch(Exception e){
               exception = e;
            }
         }
         if(statement != null){
            try{
               statement.close();
            }catch(Exception e){
               exception = e;
            }
         }
         if(exception != null){
            throw new FFatalError(exception, "Sql command=[{1}]", sqlCommand);
         }
      }
      return row;
   }

   //============================================================
   // <T>执行SQL命令，返回执行结果集。</T>
   //
   // @param sql 命令
   // @return 结果集
   //============================================================ 
   @Override
   public FDataset fetchDataset(CharSequence sql){
      Statement statement = null;
      ResultSet resultSet = null;
      Exception exception = null;
      try{
         long beginTick = System.nanoTime();
         FDataset dataset = new FDataset();
         statement = sqlConnection().createStatement();
         resultSet = statement.executeQuery(sql.toString());
         if(resultSet != null){
            fillDataset(dataset, resultSet);
            long endTick = System.nanoTime();
            if(_logger.debugAble()){
               _logger.debug(this, "fetchDataset", endTick - beginTick, "Execute sql. (count={1}, sql={2})", dataset.count(), sql);
            }
         }
         return dataset;
      }catch(Exception e){
         exception = e;
      }finally{
         if(resultSet != null){
            try{
               resultSet.close();
            }catch(Exception e){
               exception = e;
            }
         }
         if(statement != null){
            try{
               statement.close();
            }catch(Exception e){
               exception = e;
            }
         }
         if(exception != null){
            throw new FFatalError(exception, "Execute sql failure. (sql={1})", sql);
         }
      }
      return null;
   }

   //============================================================
   // <T>根据条件，获取一个表中的数据。</T>
   //
   // @param table 表名称
   // @param fields 字段集合（用“,”分隔）
   // @param search 搜索条件
   // @param orderBy 排序条件
   // @param pageSize 分页大小
   // @param page 页号
   // @return 结果集
   //============================================================ 
   @Override
   public FDataset fetchTable(String table,
                              String fields,
                              String where,
                              String orderBy,
                              int pageSize,
                              int position){
      if(RString.isEmpty(fields.toString())){
         fields = "*";
      }
      FString sql = new FString("SELECT " + fields + " FROM " + table);
      if(!RString.isEmpty(where)){
         sql.append(" WHERE (");
         sql.append(where);
         sql.append(")");
      }
      if(!RString.isEmpty(orderBy)){
         sql.append(" ORDER BY ");
         sql.append(orderBy);
      }
      return fetchDataset(sql, pageSize, position);
   }

   //============================================================
   // <T>执行SQL命令，返回执行结果的读取器。</T>
   //
   // @param sql SQL命令
   // @return 结果的读取器
   //============================================================ 
   @Override
   public ISqlDatasetReader fetchReader(CharSequence sql){
      FSqlDatasetReader reader = new FSqlDatasetReader(this);
      reader.open(this, sql.toString());
      _readers.push(reader);
      return reader;
   }

   //============================================================
   // <T>填充调用声明到用户变量中。</T>
   //
   // @param parameters 参数集合
   // @param callableStatement 调用声明
   // @param index 索引
   // @param info 信息
   //============================================================ 
   protected boolean callableStatementToParams(FSqlParameters parameters,
                                               CallableStatement callableStatement,
                                               int index,
                                               TDumpInfo info) throws SQLException{
      if(parameters == null || callableStatement == null){
         return false;
      }
      String paramValue = null;
      int paramIndex = 0;
      int count = parameters.count();
      int dumpLength = info.length();
      FSqlParameter parameter = null;
      for(int n = 0; n < count; n++){
         parameter = parameters.value(n);
         paramIndex = index + n + 1;
         if(parameter.isType(ESqlDataType.DateTime)){
            if(parameter.isDirectionOut()){
               parameter.set(callableStatement.getDate(paramIndex));
            }
            if(_logger.debugAble()){
               if(info.length() > dumpLength){
                  info.append(",");
               }
               if(RString.isEmpty(parameter.asString())){
                  info.append("NULL");
               }else{
                  int dateLength = parameter.asString().length();
                  if(dateLength == 14){
                     info.append("TO_DATE('");
                     info.append(parameter.asString());
                     info.append("', 'YYYYMMDDHH24MISS')");
                  }else if(dateLength == 8){
                     info.append("TO_DATE('");
                     info.append(parameter.asString());
                     info.append("', 'YYYYMMDD')");
                  }else if(dateLength == 6){
                     info.append("TO_DATE('");
                     info.append(parameter.asString());
                     info.append("', 'YYYYMM')");
                  }else if(dateLength == 4){
                     info.append("TO_DATE('");
                     info.append(parameter.asString());
                     info.append("', 'YYYY')");
                  }
               }
            }
         }else if(parameter.isType(ESqlDataType.Integer) || parameter.isType(ESqlDataType.Float)){
            if(parameter.isDirectionOut()){
               parameter.set(callableStatement.getString(paramIndex));
            }
            if(_logger.debugAble()){
               if(info.length() > dumpLength){
                  info.append(",");
               }
               if(RString.isEmpty(parameter.asString())){
                  info.append("NULL");
               }else{
                  info.append("TO_NUMBER(");
                  info.append(parameter.asString());
                  info.append(")");
               }
            }
         }else if(parameter.isType(ESqlDataType.String)){
            if(parameter.isDirectionOut()){
               paramValue = callableStatement.getString(paramIndex);
               if(paramValue == null){
                  paramValue = "";
               }
               parameter.set(paramValue.toString());
            }
            if(_logger.debugAble()){
               if(info.length() > dumpLength){
                  info.append(",");
               }
               if(RString.isEmpty(parameter.asString())){
                  info.append("NULL");
               }else{
                  info.append("'");
                  info.append(parameter.asString());
                  info.append("'");
               }
            }
         }else if(parameter.isType(ESqlDataType.Boolean)){
            if(parameter.isDirectionOut()){
               paramValue = callableStatement.getString(paramIndex);
               if(paramValue == null){
                  paramValue = "";
               }
               parameter.set(paramValue.toString());
            }
            if(_logger.debugAble()){
               if(info.length() > dumpLength){
                  info.append(",");
               }
               if(RString.isEmpty(parameter.asString())){
                  info.append("NULL");
               }else{
                  info.append("'");
                  info.append(parameter.asString());
                  info.append("'");
               }
            }
         }
      }
      return true;
   }

   //============================================================
   // <T>填充用户变量到调用声明中。</T>
   //
   // @param parameters 参数集合
   // @param callableStatement 调用声明
   // @param index 索引
   // @param info 信息
   //============================================================ 
   protected boolean paramsToCallableStatement(FSqlParameters parameters,
                                               CallableStatement callableStatement,
                                               int index,
                                               TDumpInfo info){
      // 检查参数
      if(parameters == null || callableStatement == null){
         return false;
      }
      // 绑定处理
      try{
         int dumpLength = info.length();
         int paramCount = parameters.count();
         for(int n = 0; n < paramCount; n++){
            FSqlParameter parameter = parameters.value(n);
            int paramIndex = index + n + 1;
            if(parameter.isType(ESqlDataType.DateTime)){
               // 数据类型为日期时间时
               if(parameter.isDirectionOut()){
                  callableStatement.registerOutParameter(paramIndex, Types.DATE);
               }
               if(_logger.debugAble()){
                  if(info.length() > dumpLength){
                     info.append(",");
                  }
                  if(RString.isEmpty(parameter.asString())){
                     info.append("NULL");
                  }else{
                     int dateLength = parameter.asString().length();
                     if(dateLength == 14){
                        info.append("TO_DATE('");
                        info.append(parameter.asString());
                        info.append("', 'YYYYMMDDHH24MISS')");
                     }else if(dateLength == 8){
                        info.append("TO_DATE('");
                        info.append(parameter.asString());
                        info.append("', 'YYYYMMDD')");
                     }else if(dateLength == 6){
                        info.append("TO_DATE('");
                        info.append(parameter.asString());
                        info.append("', 'YYYYMM')");
                     }else if(dateLength == 4){
                        info.append("TO_DATE('");
                        info.append(parameter.asString());
                        info.append("', 'YYYY')");
                     }
                  }
               }
            }else if(parameter.isType(ESqlDataType.Integer)){
               // 数据类型为整数时
               if(parameter.isEmpty()){
                  callableStatement.setNull(paramIndex, Types.INTEGER);
               }else{
                  callableStatement.setInt(paramIndex, parameter.asInt());
               }
               if(parameter.isDirectionOut()){
                  callableStatement.registerOutParameter(paramIndex, Types.INTEGER);
               }
               if(_logger.debugAble()){
                  if(info.length() > dumpLength){
                     info.append(",");
                  }
                  if(RString.isEmpty(parameter.asString())){
                     info.append("NULL");
                  }else{
                     info.append("TO_NUMBER(");
                     info.append(parameter.asString());
                     info.append(")");
                  }
               }
            }else if(parameter.isType(ESqlDataType.Float)){
               // 数据类型为浮点数时
               if(parameter.isEmpty()){
                  callableStatement.setNull(paramIndex, Types.NUMERIC);
               }else{
                  callableStatement.setFloat(paramIndex, parameter.asFloat());
               }
               if(parameter.isDirectionOut()){
                  callableStatement.registerOutParameter(paramIndex, Types.NUMERIC);
               }
               if(_logger.debugAble()){
                  if(info.length() > dumpLength){
                     info.append(",");
                  }
                  if(RString.isEmpty(parameter.asString())){
                     info.append("NULL");
                  }else{
                     info.append("TO_NUMBER(");
                     info.append(parameter.asString());
                     info.append(")");
                  }
               }
            }else if(parameter.isType(ESqlDataType.String)){
               // 数据类型为字符串时
               String paramValue = null;
               if(parameter.isEmpty()){
                  callableStatement.setString(paramIndex, null);
               }else{
                  paramValue = parameter.asString();
                  callableStatement.setString(paramIndex, paramValue);
               }
               if(parameter.isDirectionOut()){
                  callableStatement.registerOutParameter(paramIndex, Types.LONGVARCHAR);
               }
               if(_logger.debugAble()){
                  if(info.length() > dumpLength){
                     info.append(",");
                  }
                  if(RString.isEmpty(paramValue)){
                     info.append("NULL");
                  }else{
                     info.append("'");
                     info.append(paramValue);
                     info.append("'");
                  }
               }
            }else if(parameter.isType(ESqlDataType.Boolean)){
               // 数据类型为布尔值时
               if(parameter.isEmpty()){
                  callableStatement.setString(paramIndex, null);
               }else{
                  callableStatement.setString(paramIndex, parameter.asString());
               }
               if(parameter.isDirectionOut()){
                  callableStatement.registerOutParameter(paramIndex, Types.LONGVARCHAR);
               }
               if(_logger.debugAble()){
                  if(info.length() > dumpLength){
                     info.append(",");
                  }
                  if(RString.isEmpty(parameter.asString())){
                     info.append("NULL");
                  }else{
                     info.append("'");
                     info.append(parameter.asString());
                     info.append("'");
                  }
               }
            }else if(parameter.isType(ESqlDataType.Unknown)){
               // 数据类型为未知时
               if(parameter.isEmpty()){
                  callableStatement.setString(paramIndex, null);
               }else{
                  Object value = parameter.asObject();
                  if(value instanceof File){
                     File file = (File)value;
                     FileInputStream fileInputStream = null;
                     try{
                        fileInputStream = new FileInputStream(file);
                        callableStatement.setBinaryStream(paramIndex, fileInputStream, (int)file.length());
                     }finally{
                        fileInputStream.close();
                     }
                  }
                  if(parameter.isDirectionOut()){
                     callableStatement.registerOutParameter(paramIndex, Types.BINARY);
                  }
                  if(_logger.debugAble()){
                     if(info.length() > dumpLength){
                        info.append(",");
                     }
                     if(RString.isEmpty(parameter.asString())){
                        info.append("NULL");
                     }else{
                        info.append("FILE('");
                        info.append(parameter.asString());
                        info.append("')");
                     }
                  }
               }
            }
         }
      }catch(Exception e){
         throw new FFatalError(e);
      }
      return true;
   }

   //============================================================
   // <T>执行一个函数命令。</T>
   //
   // @param function 函数命令
   //============================================================ 
   @Override
   public void execute(FSqlFunction function){
      throw new NoSuchMethodError();
   }

   //============================================================
   // <T>执行一个存储过程。</T>
   //
   // @param procedure 存储过程
   //============================================================ 
   @Override
   public void execute(FSqlProcedure procedure){
      throw new NoSuchMethodError();
   }

   //============================================================
   // <T>关闭读取器集合。</T>
   //============================================================ 
   protected void closeReaders(){
      if(!_readers.isEmpty()){
         for(FSqlDatasetReader reader : _readers){
            reader.close();
         }
         _readers.clear();
      }
   }

   //============================================================
   // <T>释放处理。</T>
   //============================================================ 
   @Override
   public void free(){
   }

   //============================================================
   // <T>重置链接内容。</T>
   //============================================================ 
   @Override
   public void reset(){
      closeReaders();
   }

   //============================================================
   // <T>关闭当前链接，提交所有内容。</T>
   //============================================================ 
   @Override
   public void close(){
      try{
         // 关闭所有数据读取器
         closeReaders();
         // 关闭数据库链接
         if(_sqlConnection != null){
            if(_sqlConnection.getMetaData().supportsTransactions()){
               if(!_sqlConnection.getAutoCommit()){
                  _sqlConnection.setAutoCommit(true);
                  _sqlConnection.commit();
               }
            }
            _sqlConnection.close();
            _logger.debug(this, "close", "Close native connection={1}", _sqlConnection);
         }
         _sqlConnection = null;
      }catch(Exception e){
         throw new FFatalError(e);
      }
   }
}
