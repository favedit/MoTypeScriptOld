import Euler from './Euler';
import Matrix3 from './Matrix3';
import Matrix4 from './Matrix4';
import Vector3 from './Vector3';
export default class Quaternion{
  private _x:number;
  private _y:number;
  private _z:number;
  private _w:number;
  constructor(x?:number,y?:number,z?:number,w?:number){
    this._x = x || 0;
    this._y = y || 0;
    this._z = z || 0;
    this._w = (w!==undefined) ? w :1;
  }

  get x(){
    return this._x;
  }

  set x(value:number){
    this._x = value;
    this.onChangeCallback();
  }

  get y(){
    return this._y;
  }

  set y(value:number){
    this._y = value;
    this.onChangeCallback();
  }

  get z(){
    return this._z;
  }

  set z(value:number){
    this._z = value;
    this.onChangeCallback();
  }

  get w(){
    return this._w;
  }

  set w(value:number){
    this._w = value;
    this.onChangeCallback();
  }

  set(x:number,y:number,z:number,w:number){
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
    this.onChangeCallback();
    return this;
  }

  clone(){
    return new Quaternion(this._x,this._y,this._z,this._w);
  }

  copy(quaternion:Quaternion){
    this._x = quaternion.x;
    this._y = quaternion.y;
    this._z = quaternion.z;
    this._w = quaternion.w;
    this.onChangeCallback();
    return this;
  }

  setFromEuler(euler:Euler,update:boolean){
    var c1 = Math.cos(euler.x / 2);
    var c2 = Math.cos(euler.y / 2);
    var c3 = Math.cos(euler.z / 2);
    var s1 = Math.sin(euler.x / 2);
    var s2 = Math.sin(euler.y / 2);
    var s3 = Math.sin(euler.z / 2);

    var order = euler.order;

    if ( order === 'XYZ' ) {

			this._x = s1 * c2 * c3 + c1 * s2 * s3;
			this._y = c1 * s2 * c3 - s1 * c2 * s3;
			this._z = c1 * c2 * s3 + s1 * s2 * c3;
			this._w = c1 * c2 * c3 - s1 * s2 * s3;

		} else if ( order === 'YXZ' ) {

			this._x = s1 * c2 * c3 + c1 * s2 * s3;
			this._y = c1 * s2 * c3 - s1 * c2 * s3;
			this._z = c1 * c2 * s3 - s1 * s2 * c3;
			this._w = c1 * c2 * c3 + s1 * s2 * s3;

		} else if ( order === 'ZXY' ) {

			this._x = s1 * c2 * c3 - c1 * s2 * s3;
			this._y = c1 * s2 * c3 + s1 * c2 * s3;
			this._z = c1 * c2 * s3 + s1 * s2 * c3;
			this._w = c1 * c2 * c3 - s1 * s2 * s3;

		} else if ( order === 'ZYX' ) {

			this._x = s1 * c2 * c3 - c1 * s2 * s3;
			this._y = c1 * s2 * c3 + s1 * c2 * s3;
			this._z = c1 * c2 * s3 - s1 * s2 * c3;
			this._w = c1 * c2 * c3 + s1 * s2 * s3;

		} else if ( order === 'YZX' ) {

			this._x = s1 * c2 * c3 + c1 * s2 * s3;
			this._y = c1 * s2 * c3 + s1 * c2 * s3;
			this._z = c1 * c2 * s3 - s1 * s2 * c3;
			this._w = c1 * c2 * c3 - s1 * s2 * s3;

		} else if ( order === 'XZY' ) {

			this._x = s1 * c2 * c3 - c1 * s2 * s3;
			this._y = c1 * s2 * c3 - s1 * c2 * s3;
			this._z = c1 * c2 * s3 + s1 * s2 * c3;
			this._w = c1 * c2 * c3 + s1 * s2 * s3;

		}

    if ( update !== false ) this.onChangeCallback();
    return this;
  }

  setFromAxisAngle(axis,angle){
    var halfAngle = angle / 2, s= Math.sin(halfAngle);
    this._x = axis.x * s;
    this._y = axis.y * s;
    this._z = axis.z * s;
    this._w = Math.cos(halfAngle);

    this.onChangeCallback();
    return this;
  }

  setFromRotationMatrix(m:Matrix4){
    var te = m.elements,

			m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
			m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
			m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ],

			trace = m11 + m22 + m33,
			s;

		if ( trace > 0 ) {

			s = 0.5 / Math.sqrt( trace + 1.0 );

			this._w = 0.25 / s;
			this._x = ( m32 - m23 ) * s;
			this._y = ( m13 - m31 ) * s;
			this._z = ( m21 - m12 ) * s;

		} else if ( m11 > m22 && m11 > m33 ) {

			s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );

			this._w = ( m32 - m23 ) / s;
			this._x = 0.25 * s;
			this._y = ( m12 + m21 ) / s;
			this._z = ( m13 + m31 ) / s;

		} else if ( m22 > m33 ) {

			s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );

			this._w = ( m13 - m31 ) / s;
			this._x = ( m12 + m21 ) / s;
			this._y = 0.25 * s;
			this._z = ( m23 + m32 ) / s;

		} else {

			s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );

			this._w = ( m21 - m12 ) / s;
			this._x = ( m13 + m31 ) / s;
			this._y = ( m23 + m32 ) / s;
			this._z = 0.25 * s;

		}

		this.onChangeCallback();

		return this;
  }

  setFromUnitVectors(vFrom,vTo){
    var EPS = 0.000001;
    var v1 = new Vector3();
    var r = vFrom.dot(vTo) + 1;
    r = vFrom.dot( vTo ) + 1;

			if ( r < EPS ) {

				r = 0;

				if ( Math.abs( vFrom.x ) > Math.abs( vFrom.z ) ) {

					v1.set( - vFrom.y, vFrom.x, 0 );

				} else {

					v1.set( 0, - vFrom.z, vFrom.y );

				}

			} else {

				v1.crossVectors( vFrom, vTo );

			}

			this._x = v1.x;
			this._y = v1.y;
			this._z = v1.z;
			this._w = r;

			this.normalize();

			return this;

  }

  inverse(){
    this.conjugate().normalize();
    return this;
  }

  conjugate(){
    this._x *= -1;
    this._y *= -1;
    this._z *= -1;
    this.onChangeCallback();
    return this;
  }

  dot(v:Quaternion){
    return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;
  }

  lengthSq(){
    return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
  }

  length(){
    return Math.sqrt(this.lengthSq())
  }

  normalize(){
    var l = this.length();

    		if ( l === 0 ) {

    			this._x = 0;
    			this._y = 0;
    			this._z = 0;
    			this._w = 1;

    		} else {

    			l = 1 / l;

    			this._x = this._x * l;
    			this._y = this._y * l;
    			this._z = this._z * l;
    			this._w = this._w * l;

    		}

    		this.onChangeCallback();

    		return this;
  }

  multiply(q){
    return this.multiplyQuaternions(this,q);
  }

  multiplyQuaternions( a, b ) {

    		var qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
    		var qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;

    		this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
    		this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
    		this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
    		this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

    		this.onChangeCallback();

    		return this;

  }

  slerp( qb, t){
    if ( t === 0 ) return this;
    		if ( t === 1 ) return this.copy( qb );

    		var x = this._x, y = this._y, z = this._z, w = this._w;

    		// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

    		var cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

    		if ( cosHalfTheta < 0 ) {

    			this._w = - qb._w;
    			this._x = - qb._x;
    			this._y = - qb._y;
    			this._z = - qb._z;

    			cosHalfTheta = - cosHalfTheta;

    		} else {

    			this.copy( qb );

    		}

    		if ( cosHalfTheta >= 1.0 ) {

    			this._w = w;
    			this._x = x;
    			this._y = y;
    			this._z = z;

    			return this;

    		}

    		var halfTheta = Math.acos( cosHalfTheta );
    		var sinHalfTheta = Math.sqrt( 1.0 - cosHalfTheta * cosHalfTheta );

    		if ( Math.abs( sinHalfTheta ) < 0.001 ) {

    			this._w = 0.5 * ( w + this._w );
    			this._x = 0.5 * ( x + this._x );
    			this._y = 0.5 * ( y + this._y );
    			this._z = 0.5 * ( z + this._z );

    			return this;

    		}

    		var ratioA = Math.sin( ( 1 - t ) * halfTheta ) / sinHalfTheta,
    		ratioB = Math.sin( t * halfTheta ) / sinHalfTheta;

    		this._w = ( w * ratioA + this._w * ratioB );
    		this._x = ( x * ratioA + this._x * ratioB );
    		this._y = ( y * ratioA + this._y * ratioB );
    		this._z = ( z * ratioA + this._z * ratioB );

    		this.onChangeCallback();

    		return this;
  }

  equals(quaternion){
    return ( quaternion._x === this._x ) && ( quaternion._y === this._y ) && ( quaternion._z === this._z ) && ( quaternion._w === this._w );

  }

  fromArray(array,offset?:number){
    if ( offset === undefined ) offset = 0;

  		this._x = array[ offset ];
  		this._y = array[ offset + 1 ];
  		this._z = array[ offset + 2 ];
  		this._w = array[ offset + 3 ];

  		this.onChangeCallback();

  		return this;
  }

  toArray(array?:Array<any>,offset?:number){
    if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		array[ offset ] = this._x;
		array[ offset + 1 ] = this._y;
		array[ offset + 2 ] = this._z;
		array[ offset + 3 ] = this._w;

		return array;
  }

  onChange( callback ) {

		this.onChangeCallback = callback;

		return this;

	}


  onChangeCallback(){

  }

  static slerp = function ( qa, qb, qm, t ) {

  	return qm.copy( qa ).slerp( qb, t );

  };
}
