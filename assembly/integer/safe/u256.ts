import { __mul256 } from "../../globals";
import { u256 as U256 } from "../u256";
// import { i128 } from '../i128';
import { u128 } from '../u128';
class u256 extends U256 {
  @inline static get Zero(): u256 { return new u256(); }
  @inline static get One():  u256 { return new u256(1); }
  @inline static get Min():  u256 { return new u256(); }
  @inline static get Max():  u256 { return new u256(-1, -1, -1, -1); }

  // TODO: fromString

  @inline
  static fromU256(value: u256): u256 {
    return new u256(value.lo1, value.lo2, value.hi1, value.hi2);
  }

  @inline
  static fromU128(value: u128): u256 {
    return new u256(value.lo, value.hi);
  }

  @inline
  static fromU64(value: u64): u256 {
    return new u256(value);
  }

  @inline
  static fromI64(value: i64): u256 {
    var mask = value >> 63;
    return new u256(value, mask, mask, mask);
  }

  @inline
  static fromU32(value: u32): u256 {
    return new u256(value);
  }

  @inline
  static fromI32(value: i32): u256 {
    var mask: u64 = value >> 63;
    return new u256(value, mask, mask, mask);
  }

  @inline
  static fromBits(
    l0: u32, l1: u32, l2: u32, l3: u32,
    h0: u32, h1: u32, h2: u32, h3: u32,
  ): u256 {
    return new u256(
      <u64>l0 | ((<u64>l1) << 32),
      <u64>l2 | ((<u64>l3) << 32),
      <u64>h0 | ((<u64>h1) << 32),
      <u64>h2 | ((<u64>h3) << 32),
    );
  }

  @inline
  static fromBytes<T>(array: T, bigEndian: bool = false): u256 {
    // @ts-ignore
    if (array instanceof u8[]) {
      return bigEndian
        // @ts-ignore
        ? u256.fromBytesBE(<u8[]>array)
        // @ts-ignore
        : u256.fromBytesLE(<u8[]>array);
    } else if (array instanceof Uint8Array) {
      return bigEndian
        ? u256.fromUint8ArrayBE(<Uint8Array>array)
        : u256.fromUint8ArrayLE(<Uint8Array>array);
    } else {
      throw new TypeError("Unsupported generic type");
    }
  }

  @inline
  static fromBytesLE(array: u8[]): u256 {
    assert(array.length && (array.length & 31) == 0);
    // @ts-ignore
    var buffer = array.dataStart
    return new u256(
      load<u64>(buffer, 0 * sizeof<u64>()),
      load<u64>(buffer, 1 * sizeof<u64>()),
      load<u64>(buffer, 2 * sizeof<u64>()),
      load<u64>(buffer, 3 * sizeof<u64>()),
    );
  }

  @inline
  static fromBytesBE(array: u8[]): u256 {
    assert(array.length && (array.length & 31) == 0);
    var buffer = array.dataStart;
    return new u256(
      bswap<u64>(load<u64>(buffer, 3 * sizeof<u64>())),
      bswap<u64>(load<u64>(buffer, 2 * sizeof<u64>())),
      bswap<u64>(load<u64>(buffer, 1 * sizeof<u64>())),
      bswap<u64>(load<u64>(buffer, 0 * sizeof<u64>()))
    );
  }

  @inline
  static fromUint8ArrayLE(array: Uint8Array): u256 {
    assert(array.length && (array.length & 31) == 0);
    var buffer = array.dataStart;
    return new u256(
        load<u64>(buffer, 0 * sizeof<u64>()),
        load<u64>(buffer, 1 * sizeof<u64>()),
        load<u64>(buffer, 2 * sizeof<u64>()),
        load<u64>(buffer, 3 * sizeof<u64>())
    );
  }

  @inline
  static fromUint8ArrayBE(array: Uint8Array): u256 {
    assert(array.length && (array.length & 31) == 0);
    var buffer = array.dataStart;
    return new u256(
        bswap<u64>(load<u64>(buffer, 3 * sizeof<u64>())),
        bswap<u64>(load<u64>(buffer, 2 * sizeof<u64>())),
        bswap<u64>(load<u64>(buffer, 1 * sizeof<u64>())),
        bswap<u64>(load<u64>(buffer, 0 * sizeof<u64>()))
    );
  }

  // TODO need improvement
  // max safe uint for f64 actually 52-bits
  @inline
  static fromF64(value: f64): u256 {
    var mask = u64(reinterpret<i64>(value) >> 63);
    return new u256(<u64>value, mask, mask, mask);
  }

  // TODO need improvement
  // max safe int for f32 actually 23-bits
  @inline
  static fromF32(value: f32): u256 {
    var mask = u64(reinterpret<i32>(value) >> 31);
    return new u256(<u64>value, mask, mask, mask);
  }

  /**
 * Create 256-bit unsigned integer from generic type T
 * @param  value
 * @returns 256-bit unsigned integer
 */
  @inline
  static from<T>(value: T): u256 {
    if (value instanceof bool) return u256.fromU64(<u64>value);
    else if (value instanceof i8) return u256.fromI64(<i64>value);
    else if (value instanceof u8) return u256.fromU64(<u64>value);
    else if (value instanceof i16) return u256.fromI64(<i64>value);
    else if (value instanceof u16) return u256.fromU64(<u64>value);
    else if (value instanceof i32) return u256.fromI64(<i64>value);
    else if (value instanceof u32) return u256.fromU64(<u64>value);
    else if (value instanceof i64) return u256.fromI64(<i64>value);
    else if (value instanceof u64) return u256.fromU64(<u64>value);
    else if (value instanceof f32) return u256.fromF64(<f64>value);
    else if (value instanceof f64) return u256.fromF64(<f64>value);
    else if (value instanceof u128) return u256.fromU128(<u128>value);
    else if (value instanceof u256) return u256.fromU256(<u256>value);
    else if (value instanceof u8[]) return u256.fromBytes(<u8[]>value);
    else if (value instanceof Uint8Array) return u256.fromBytes(<Uint8Array>value);
    else throw new TypeError("Unsupported generic type");
  }


  @operator("+")
  static add(a: u256, b: u256): u256 {
    var lo1a = a.lo1,
        lo2a = a.lo2,
        hi1a = a.hi1,
        hi2a = a.hi2;

    var lo1b = b.lo1,
        lo2b = b.lo2,
        hi1b = b.hi1,
        hi2b = b.hi2;

    // Addition for the lowest segment
    var lo1 = lo1a + lo1b;
    var cy = u64(lo1 < lo1a); // Detect carry

    // Addition for the second lowest segment with carry
    var lo2 = lo2a + lo2b + cy;
    cy = u64(lo2 < lo2a || (cy != 0 && lo2 <= lo2b)); // Update carry

    // Addition for the second highest segment with carry
    var hi1 = hi1a + hi1b + cy;
    cy = u64(hi1 < hi1a || (cy != 0 && hi1 <= hi1b)); // Update carry

    // Addition for the highest segment with carry
    var hi2 = hi2a + hi2b + cy;

    // Overflow detection after adding carry to the highest segment
    // In a 'safe' implementation, an overflow can be detected if the final carry would exceed the bounds of u256,
    // which means an addition that causes the highest segment to overflow.
    // However, standard unsigned integer behavior would wrap around, so this step depends on the intended behavior:
    if (hi2 < hi2a || (cy != 0 && hi2 <= hi2b)) {
        throw new RangeError("Overflow during addition");
    }

    return new u256(lo1, lo2, hi1, hi2);
  }

  @operator('-')
  static sub(a: u256, b: u256): u256 {
    var
      lo1a = a.lo1,
      lo2a = a.lo2,
      hi1a = a.hi1,
      hi2a = a.hi2;

    var
      lo1b = b.lo1,
      lo2b = b.lo2,
      hi1b = b.hi1,
      hi2b = b.hi2;

    var lo1 = lo1a - lo1b;
    var cy  = u64(lo1 > lo1a);



    var lo2 = lo2a - lo2b - cy;
    // for a - b - c case we should calculate carry bit differently
    cy  = ((~lo2a & lo2b) | ((~lo2a | lo2b) & lo2)) >> 63;
    var hi1 = hi1a - hi1b - cy;
    
    cy  = ((~hi1a & hi1b) | ((~hi1a | hi1b) & hi1)) >> 63;
    
    if (cy != 0) {
      throw new RangeError("Underflow during subtraction");
    }

    var hi2 = hi2a - hi2b - cy;
    
    return new u256(lo1, lo2, hi1, hi2);
  }
  
  // mul: u256 x u256 = u256
  @inline @operator('*')
  static mul(a: u256, b: u256): u256 {    
    // check if any of the operands is zero
    if (a.isZero() || b.isZero()) return u256.Zero;
    var s = u256.clz(a) + u256.clz(b);

    if (s < 255) { // defenitely overflow
      throw new RangeError("Overflow during multiplication");
    }
    // if(s == 255) {
    //   // See Hacker's Delight, 2nd Edition. 2–13 Overflow Detection
    //   // @ts-ignore
    //   let tmp = U256.mul(changetype<U256>(a), changetype<U256>(b) >> 1);
    //   // @ts-ignore
    //   if (tmp.hi >>> 63) { // (signed)t < 0
    //     throw new RangeError("Overflow during multiplication");
    //   }
    //   // @ts-ignore
    //   let z = tmp << 1;
    //   if (b.lo & 1) {
    //     // @ts-ignore
    //     z += a;
    //     // @ts-ignore
    //     if (z < a) {
    //       throw new RangeError("Overflow during multiplication");
    //     }
    //   }
    //   return changetype<u256>(z);
    // }
    
    return changetype<u256>(__mul256(a.lo1, a.lo2, a.hi1, a.hi2, b.lo1, b.lo2, b.hi1, b.hi2))
  }
}

export { u256 as u256Safe };
