import { u256Safe } from "../integer/safe/u256";

describe("Basic Operations", () => {
  describe("ADD", () => {
    it("Should add [1, 0, 0, 0] and [max, 0, 0, 0]", () => {
      var a = u256Safe.One;
      var b = new u256Safe(u64.MAX_VALUE, 0, 0, 0);
      var r = new u256Safe(0, 1, 0, 0);
      expect(a + b).toStrictEqual(r);
      expect(b + a).toStrictEqual(r);
    });
    it("Should add [1, 0, 0, 0] and [max, max, 0, 0]", () => {
      var a = u256Safe.One;
      var b = new u256Safe(u64.MAX_VALUE, u64.MAX_VALUE, 0, 0);
      var r = new u256Safe(0, 0, 1, 0);
      expect(a + b).toStrictEqual(r);
      expect(b + a).toStrictEqual(r);
    });
    it("Should add [1, 0, 0, 0] and [max, max, max, 0]", () => {
      var a = u256Safe.One;
      var b = new u256Safe(u64.MAX_VALUE, u64.MAX_VALUE, u64.MAX_VALUE, 0);
      var r = new u256Safe(0, 0, 0, 1);
      expect(a + b).toStrictEqual(r);
      expect(b + a).toStrictEqual(r);
    });
    it("Should add [1, 1, 1, 1] and [max - 1, max - 1, max - 1, max - 1]", () => {
      const one: u64 = 1;
      const pre = u64.MAX_VALUE - 1;
      var a = new u256Safe(one, one, one, one);
      var b = new u256Safe(pre, pre, pre, pre);
      var r = u256Safe.Max;
      expect(a + b).toStrictEqual(r);
      expect(b + a).toStrictEqual(r);
    });
    it("Should test carry and lo2 equality", () => {
      var a = new u256Safe(u64.MAX_VALUE, 1, 0, 0);
      var b = new u256Safe(1, 0, 0, 0);
      var r = new u256Safe(0, 2, 0, 0);
      expect(a + b).toStrictEqual(r);
    });
    it("Should add two numbers 1", () => {
      var a = u256Safe.from(23489);
      var b = u256Safe.from(1234);
      var r = u256Safe.from(24723);
      expect(a + b).toStrictEqual(r);
      expect(b + a).toStrictEqual(r);
    });
    it("Should add two numbers 2", () => {
      var a = u256Safe.from(43545453452452452);
      var b = u256Safe.from(1);
      var r = u256Safe.from(43545453452452453);
      expect(a + b).toStrictEqual(r);
      expect(b + a).toStrictEqual(r);
    });
    it("Should add two numbers 3", () => {
      var a = new u256Safe(
        6064648183073788001,
        18412591705276258226,
        18446744073709551615,
        9223372036854775807
      );
      var b = new u256Safe(3061651127733543934, 42442096056813094);
      var r = new u256Safe(
        9126299310807331935,
        8289727623519704,
        0,
        9223372036854775808
      );
      expect(a + b).toStrictEqual(r);
      expect(b + a).toStrictEqual(r);
    });
  });
  describe("SUB", () => {
    it("Should sub one minus one", () => {
      var a = u256Safe.One;
      var b = a;
      var r = u256Safe.Zero;
      expect(a - b).toStrictEqual(r);
    });
    it("Should sub [2, 2, 2, 2] and [1, 1, 1, 1]", () => {
      var a = new u256Safe(2, 2, 2, 2);
      var b = new u256Safe(1, 1, 1, 1);
      var r = b;
      expect(a - b).toStrictEqual(r);
    });
    it("Should sub [max, max, max, max] and [1, 2, 3, 4]", () => {
      const max = u64.MAX_VALUE;
      var a = u256Safe.Max;
      var b = new u256Safe(1, 2, 3, 4);
      var r = new u256Safe(max - 1, max - 2, max - 3, max - 4);
      expect(a - b).toStrictEqual(r);
    });
    it("Should sub [max, max, max, max] and [1, 0, 0, 0]", () => {
      const max = u64.MAX_VALUE;
      var a = u256Safe.Max;
      var b = u256Safe.One;
      var r = new u256Safe(max - 1, max, max, max);
      expect(a - b).toStrictEqual(r);
    });
    it("Should sub two numbers 1", () => {
      var a = u256Safe.from(23489);
      var b = u256Safe.from(1234);
      var r = u256Safe.from(22255);
      expect(a - b).toStrictEqual(r);
    });
    it("Should sub two numbers 2", () => {
      var a = u256Safe.from(43545453452452453);
      var b = u256Safe.from(1);
      var r = u256Safe.from(43545453452452452);
      expect(a - b).toStrictEqual(r);
    });
    it("Should sub two numbers 3", () => {
      var a = new u256Safe(
        6064648183073788001,
        18412591705276258226,
        18446744073709551615,
        9223372036854775807
      );
      var b = new u256Safe(3061651127733543934, 42442096056813094);
      var r = new u256Safe(
        3002997055340244067,
        18370149609219445132,
        18446744073709551615,
        9223372036854775807
      );
      expect(a - b).toStrictEqual(r);
    });
  });
  describe("MUL", () => {
    it("Should multiply two numbers 1", () => {
      var a = u256Safe.from(43545453452);
      var b = u256Safe.Zero;
      expect(a * b).toStrictEqual(u256Safe.Zero);
    });
    it("Should multiply two numbers 2", () => {
      var a = u256Safe.from(43545453452);
      var b = u256Safe.One;
      expect(a * b).toStrictEqual(a);
    });
    it("Should multiply two numbers 3", () => {
      var a = u256Safe.Max;
      var b = u256Safe.One;
      expect(a * b).toStrictEqual(a);
    });
    it("Should multiply two numbers 4", () => {
      var a = u256Safe.from(43545453452);
      var b = u256Safe.from(2353454354);
      expect(a * b).toStrictEqual(new u256Safe(10248516654965971928, 5));
    });
    it("Should multiply two numbers which clz(a) + clz(b) == 255 but not overflow", () => {
      var a = new u256Safe(12919400065614042453, 180, 0, 0);
      var b = new u256Safe(
        2558044588346441728,
        1801421225117016759,
        88162076311671563,
        0
      );
      var r = new u256Safe(
        5296233161787703296,
        17841151846691307288,
        5298105704908565946,
        15930919111324522770
      );
      expect(u256Safe.clz(a)).toBe(184);
      expect(u256Safe.clz(b)).toBe(71);
      expect(u256Safe.clz(a) + u256Safe.clz(b)).toBe(255);
      expect(a * b).toStrictEqual(r);
    });
  });
});

describe("Overflow Underflow Throwable", () => {
  describe("ADD", () => {
    it("Should throw when add two numbers 1", () => {
      expect(() => {
        var a = u256Safe.One;
        var b = u256Safe.Max;
        !(a + b);
      }).toThrow();
    });

    it("Should throw when add two numbers 2", () => {
      expect(() => {
        var a = u256Safe.Max;
        var b = u256Safe.One;
        !(a + b);
      }).toThrow();
    });

    it("Should throw when add two numbers 3", () => {
      expect(() => {
        var a = u256Safe.from(-2);
        var b = new u256Safe(2);
        !(a + b);
      }).toThrow();
    });
  });
  /* -------------------------------------------------------------------------- */
  /*                                SUB OVERFLOW                                */
  /* -------------------------------------------------------------------------- */
  describe("SUB", () => {
    it("Should throw when subtract two numbers 1", () => {
      expect(() => {
        var a = u256Safe.Zero;
        var b = u256Safe.Max;
        !(a - b);
      }).toThrow();
    });

    it("Should throw when subtract two numbers 2", () => {
      expect(() => {
        var a = u256Safe.from(-2);
        var b = u256Safe.Max;
        !(a - b);
      }).toThrow();
    });

    it("Should throw when subtract two numbers 3", () => {
      expect(() => {
        var a = u256Safe.Zero;
        var b = u256Safe.One;
        !(a - b);
      }).toThrow();
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                                MUL OVERFLOW                                */
  /* -------------------------------------------------------------------------- */
  describe("MUL", () => {
    it("Should throw multiply two numbers with overflow 1", () => {
      expect(() => {
        var a = new u256Safe(0, 0, 0, 1);
        !(a * a);
      }).toThrow();
    });
    it("Should throw multiply two numbers with overflow 2", () => {
      expect(() => {
        var a = new u256Safe(1, 1, 1, 1);
        !(a * a);
      }).toThrow();
    });
    it("Should throw multiply two numbers with overflow 3", () => {
      expect(() => {
        var a = u256Safe.Max;
        var b = u256Safe.from(2);
        !(a * b);
      }).toThrow();
    });
    it("Should throw multiply two numbers with overflow 4", () => {
      expect(() => {
        var a = u256Safe.Max;
        var b = u256Safe.Max;
        !(a * b);
      }).toThrow();
    });

    it("Should throw multiply two numbers which clz(a) + clz(b) == 255", () => {
      let a = new u256Safe(
        14773442851077357567,
        13236297299247328668,
        58774,
        0
      );
      let b = new u256Safe(4003012203950112767, 542101086242752, 0, 0);

      expect(u256Safe.clz(a)).toBe(112);
      expect(u256Safe.clz(b)).toBe(143);
      expect(u256Safe.clz(a) + u256Safe.clz(b)).toBe(255);

      expect(() => {
        const a = new u256Safe(
          14773442851077357567,
          13236297299247328668,
          58774,
          0
        );
        const b = new u256Safe(4003012203950112767, 542101086242752, 0, 0);
        a * b;
      }).toThrow();
    });
  });
});
