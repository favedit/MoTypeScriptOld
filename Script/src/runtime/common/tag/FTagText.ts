import {EResult} from '../lang/EResult';
import {RString} from '../lang/RString';
import {FTagContext} from './FTagContext';
import {FTag} from './FTag';

//==========================================================
// <T>标签类。</T>
//
// @class
// @author maocy
// @version 150114
//==========================================================
export class FTagText extends FTag {
   public text: string = null;

   //==========================================================
   // <T>开始处理。</T>
   //
   // @method
   // @param context  环境
   // @return EResult 处理结果
   //==========================================================
   public onBegin(context: FTagContext): EResult {
      var text = this.text;
      if (context.trimLeft) {
         if (RString.startsWith(text, '\r')) {
            text = text.substring(1);
         }
         if (RString.startsWith(text, '\n')) {
            text = text.substring(1);
         }
      }
      if (context.trimRight) {
         if (RString.endsWith(text, '\r')) {
            text = text.substring(0, text.length - 1);
         }
         if (RString.endsWith(text, '\n')) {
            text = text.substring(0, text.length - 1);
         }
      }
      context.write(text);
      return EResult.Skip;
   }

   //==========================================================
   //<T>获得字符串。</T>
   //
   // @method
   // @return String 字符串
   //==========================================================
   public toString(): string {
      return '{' + this.text + '}';
   }
}
