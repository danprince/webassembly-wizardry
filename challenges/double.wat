(module
  ;; Double the parameter and return the value.
  (func (export "double") (param $x i32) (result i32)
    (i32.mul (local.get $x) (i32.const 2))
  )
)
