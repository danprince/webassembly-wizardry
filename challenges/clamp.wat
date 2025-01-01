(module
  ;; Clamp the value to the range $min..$max and return the clamped value.
  (func (export "clamp") (param $min i32) (param $max i32) (param $val i32) (result i32)
    (if
      (i32.lt_s (local.get $val) (local.get $min))
      (then (return (local.get $min)))
    )

    (if
      (i32.gt_s (local.get $val) (local.get $max))
      (then (return (local.get $max)))
    )

    local.get $val
  )
)
