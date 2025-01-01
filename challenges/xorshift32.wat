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
    ;; SOLVE
  )
)
