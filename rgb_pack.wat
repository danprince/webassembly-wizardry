(module
  ;; Pack the RGB components of a color into a single i32 with the format
  ;; 0xRRGGBB and return it.
  (func (export "pack") (param $r i32) (param $g i32) (param $b i32) (result i32)
    (i32.or
      (local.get $b)
      (i32.or
        (i32.shl (local.get $g) (i32.const 8))
        (i32.shl (local.get $r) (i32.const 16))
      )
    )
  )
)
