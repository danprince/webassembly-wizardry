(module
  ;; Increment the parameter by 1 and return the value.
  (func (export "increment") (param $x i32) (result i32)
    (i32.add (local.get $x) (i32.const 1))
  )
)
