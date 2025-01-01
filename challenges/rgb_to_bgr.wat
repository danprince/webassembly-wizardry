(module
  ;; Swizzle the components of an RGB color encoded as 0xRRGGBB into 0xBBGGRR
  ;; and return the swizzled value.
  (func (export "rgb2bgr") (param $rgb i32) (result i32)
    (local $r i32)
    (local $g i32)
    (local $b i32)

    ;; Mask to isolate the individual components (not their values)
    (local.set $r (i32.and (local.get $rgb) (i32.const 0xFF0000)))
    (local.set $g (i32.and (local.get $rgb) (i32.const 0x00FF00)))
    (local.set $b (i32.and (local.get $rgb) (i32.const 0x0000FF)))

    (i32.or
      ;; Shift R to the right side
      (i32.shr_u (local.get $r) (i32.const 16))
      (i32.or
        ;; G is already in place
        (local.get $g)
        ;; Shift B to the left side
        (i32.shl (local.get $b) (i32.const 16))
      )
    )
  )
)
