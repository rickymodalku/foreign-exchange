import { 
    Injectable 
  } from '@angular/core';
  
  @Injectable()
  export class SecurityService {
      private _b64Table: string;
  
      constructor() {
          this._b64Table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      }
  
      encode(key, data) {
          data = this._xorEncrypt(key, data);
          return this._b64Encode(data);
      }
  
      decode(key, data) {
          data = this._b64Decode(data);
          return this._xorDecrypt(key, data);
      }
  
      private _b64Encode(data) {
          var o1, o2, o3, h1, h2, h3, h4, bits, r, i = 0, enc = "";
          if(!data) { return data; }
          do {
              o1 = data[i++];
              o2 = data[i++];
              o3 = data[i++];
              bits = o1 << 16 | o2 << 8 | o3;
              h1 = bits >> 18 & 0x3f;
              h2 = bits >> 12 & 0x3f;
              h3 = bits >> 6 & 0x3f;
              h4 = bits & 0x3f;
              enc += this._b64Table.charAt(h1) + this._b64Table.charAt(h2) + this._b64Table.charAt(h3) + this._b64Table.charAt(h4);
          } while (i < data.length);
          r = data.length % 3;
          return (r ? enc.slice(0, r - 3) : enc) + "===".slice(r || 3);
      }
  
      private _b64Decode(data) {
          var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, result = [];
          if(!data) { return data; }
          data += "";
          do {
              h1 = this._b64Table.indexOf(data.charAt(i++));
              h2 = this._b64Table.indexOf(data.charAt(i++));
              h3 = this._b64Table.indexOf(data.charAt(i++));
              h4 = this._b64Table.indexOf(data.charAt(i++));
              bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
              o1 = bits >> 16 & 0xff;
              o2 = bits >> 8 & 0xff;
              o3 = bits & 0xff;
              result.push(o1);
              if(h3 !== 64) {
                  result.push(o2);
                  if(h4 !== 64) {
                      result.push(o3);
                  }
              }
          } while (i < data.length);
          return result;
      }
  
      private _keyCharAt(key, i) {
          return key.charCodeAt(Math.floor(i % key.length));
      }
  
      private _xorEncrypt(key, data) {
          return data.toString().split('').map((c, i) => {
              return c.charCodeAt(0) ^ this._keyCharAt(key, i);
          });
      }
  
      private _xorDecrypt(key, data) {
        return data.map((c, i) => {
              return String.fromCharCode(c ^ this._keyCharAt(key, i));
          }).join("");
      }    
  }