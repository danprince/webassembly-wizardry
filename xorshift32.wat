(module
  (global $state (mut i32) (i32.const 0x123456))

  ;; Reset the seed value for the PRNG below.
  (func (export "seed") (param $seed i32)
    local.get $seed
    global.set $state
  )

  ;; Returns pseudo-random numbers from an implementation of xorshift32.
  ;; See https://en.wikipedia.org/wiki/Xorshift.
  (func (export "xorshift32") (result i32)
    ;; $state ^= $state << 13;
    ;; $state ^= $state >> 17;
    ;; $state ^= $state << 5;

    (global.set $state
      (i32.xor
        (global.get $state)
        (i32.shl (global.get $state) (i32.const 13))))

    (global.set $state
      (i32.xor
        (global.get $state)
        (i32.shr_u (global.get $state) (i32.const 17))))

    (global.set $state
      (i32.xor
        (global.get $state)
        (i32.shl (global.get $state) (i32.const 5))))

    global.get $state
  )
)
