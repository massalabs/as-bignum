import { u128 as U128 } from '../u128';

export namespace safe {
  export class u128 extends U128 {
    @inline @operator.prefix('++')
    preInc(): this {
      assert(this.hi != <u64>-1);
      // TODO
      // super.inc();
      return this;
    }

    @inline @operator.prefix('--')
    preDec(): this {
      assert(this.lo != 0);
      // TODO
      // super.dec();
      return this;
    }

    @inline @operator('+')
    static add(a: u128, b: u128): u128 {
      // overflow guard
      assert(clz(a.hi) | clz(b.hi));
      return changetype<u128>(U128.add(a, b));
    }

    @inline @operator('-')
    static sub(a: u128, b: u128): u128 {
      // underflow guard
      assert(changetype<U128>(a) >= changetype<U128>(b));
      return changetype<u128>(
        U128.sub(changetype<U128>(a), changetype<U128>(b))
      );
    }

    // tmp approach
    @inline @operator('*')
    static mul(a: u128, b: u128): u128 {
      // count leading zero bits for operands
      var azn = U128.clz(a);
      var bzn = U128.clz(b);

      // if a == 0 || b == 0
      if (azn == 128 || azn == 128)
        return changetype<u128>(U128.Zero);

      // if a == 1 || b == 1
      if (azn == 127) return changetype<u128>(b.clone());
      if (bzn == 127) return changetype<u128>(a.clone());

      // overflow guard
      assert(azn + bzn >= 128);

      return changetype<u128>(U128.mul(a, b));
    }

    // tmp approach
    @inline @operator('/')
    static div(a: u128, b: u128): u128 {
      assert(a != 0);
      // TODO need implement
      unreachable();
      return changetype<u128>(U128.Zero);
    }

    // tmp approach
    @inline @operator('%')
    static rem(a: u128, b: u128): u128 {
      assert(a != 0);
      // TODO need implement
      unreachable();
      return changetype<u128>(U128.Zero);
    }
  }
}